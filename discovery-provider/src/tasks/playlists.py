import logging
from datetime import datetime
from typing import Any, Dict, List, Set, Tuple

from sqlalchemy.orm.session import Session, make_transient
from src.challenges.challenge_event import ChallengeEvent
from src.database_task import DatabaseTask
from src.models.playlists.playlist import Playlist
from src.models.playlists.playlist_route import PlaylistRoute
from src.queries.skipped_transactions import add_node_level_skipped_transaction
from src.tasks.entity_manager.utils import PLAYLIST_ID_OFFSET
from src.tasks.task_helpers import generate_slug_and_collision_id
from src.utils import helpers
from src.utils.indexing_errors import EntityMissingRequiredFieldError, IndexingError
from src.utils.model_nullable_validator import all_required_fields_present
from src.utils.playlist_event_constants import (
    playlist_event_types_arr,
    playlist_event_types_lookup,
)

logger = logging.getLogger(__name__)


def playlist_state_update(
    self,
    update_task: DatabaseTask,
    session: Session,
    playlist_factory_txs,
    block_number,
    block_timestamp,
    block_hash,
    _metadata,  # prefix unused args with underscore to prevent pylint
) -> Tuple[int, Set]:
    """Return Tuple containing int representing number of Playlist model state changes found in transaction and set of processed playlist IDs."""
    blockhash = update_task.web3.toHex(block_hash)
    num_total_changes = 0
    skipped_tx_count = 0
    # This stores the playlist_ids created or updated in the set of transactions
    playlist_ids: Set[int] = set()

    challenge_bus = update_task.challenge_event_bus

    if not playlist_factory_txs:
        return num_total_changes, playlist_ids

    pending_playlist_routes: List[PlaylistRoute] = []
    playlist_events_lookup: Dict[int, Dict[str, Any]] = {}
    for tx_receipt in playlist_factory_txs:
        txhash = update_task.web3.toHex(tx_receipt.transactionHash)
        for event_type in playlist_event_types_arr:
            playlist_events_tx = get_playlist_events_tx(
                update_task, event_type, tx_receipt
            )
            processedEntries = 0  # if record does not get added, do not count towards num_total_changes
            for entry in playlist_events_tx:
                existing_playlist_record = None
                playlist_id = helpers.get_tx_arg(entry, "_playlistId")
                try:
                    # look up or populate existing record
                    if playlist_id in playlist_events_lookup:
                        existing_playlist_record = playlist_events_lookup[playlist_id][
                            "playlist"
                        ]
                    else:
                        existing_playlist_record = lookup_playlist_record(
                            update_task, session, entry, block_number, txhash
                        )

                    # parse playlist event to add metadata to record
                    playlist_record: Playlist = parse_playlist_event(
                        self,
                        update_task,
                        entry,
                        event_type,
                        existing_playlist_record,
                        block_timestamp,
                        session,
                        pending_playlist_routes,
                    )
                    if playlist_record.playlist_id >= PLAYLIST_ID_OFFSET:
                        logger.info(
                            f"index.py | playlists.py | Playlist {playlist_record.playlist_id} is above the playlist ID offset {PLAYLIST_ID_OFFSET}. Skipping transaction."
                        )
                        continue

                    # process playlist record
                    if playlist_record is not None:
                        if playlist_id not in playlist_events_lookup:
                            playlist_events_lookup[playlist_id] = {
                                "playlist": playlist_record,
                                "events": [],
                            }
                        else:
                            playlist_events_lookup[playlist_id][
                                "playlist"
                            ] = playlist_record
                        playlist_events_lookup[playlist_id]["events"].append(event_type)
                        playlist_ids.add(playlist_id)
                        processedEntries += 1
                except EntityMissingRequiredFieldError as e:
                    logger.warning(f"Skipping tx {txhash} with error {e}")
                    skipped_tx_count += 1
                    add_node_level_skipped_transaction(
                        session, block_number, blockhash, txhash
                    )
                    pass
                except Exception as e:
                    logger.info("Error in parse playlist transaction")
                    raise IndexingError(
                        "playlist", block_number, blockhash, txhash, str(e)
                    ) from e
            num_total_changes += processedEntries

    logger.info(
        f"index.py | playlists.py | There are {num_total_changes} events processed and {skipped_tx_count} skipped transactions."
    )

    for playlist_id, value_obj in playlist_events_lookup.items():
        logger.info(f"index.py | playlists.py | Adding {value_obj['playlist']})")
        if value_obj["events"]:
            invalidate_old_playlist(session, playlist_id)
            session.add(value_obj["playlist"])
            if (
                playlist_event_types_lookup["playlist_track_added"]
                in value_obj["events"]
            ):
                challenge_bus.dispatch(
                    ChallengeEvent.first_playlist,
                    value_obj["playlist"].blocknumber,
                    value_obj["playlist"].playlist_owner_id,
                )

    return num_total_changes, playlist_ids


def update_playlist_routes_table(session, playlist_record, pending_playlist_routes):
    logger.info(
        f"index.py | playlists.py | Updating playlist routes for {playlist_record.playlist_id}"
    )
    # Get the title slug, and set the new slug to that
    # (will check for conflicts later)
    new_playlist_slug_title = helpers.sanitize_slug(
        playlist_record.playlist_name, playlist_record.playlist_id
    )
    new_playlist_slug = new_playlist_slug_title

    # Find the current route for the playlist
    # Check the pending playlist route updates first
    prev_playlist_route_record = next(
        (
            route
            for route in pending_playlist_routes
            if route.is_current and route.playlist_id == playlist_record.playlist_id
        ),
        None,
    )

    # Then query the DB if necessary
    if prev_playlist_route_record is None:
        prev_playlist_route_record = (
            session.query(PlaylistRoute)
            .filter(
                PlaylistRoute.playlist_id == playlist_record.playlist_id,
                PlaylistRoute.is_current == True,
            )  # noqa: E712
            .one_or_none()
        )

    if prev_playlist_route_record:
        if prev_playlist_route_record.title_slug == new_playlist_slug_title:
            # If the title slug hasn't changed, we have no work to do
            logger.info(f"not changing for {playlist_record.playlist_id}")
            return
        # The new route will be current
        prev_playlist_route_record.is_current = False

    new_playlist_slug, new_collision_id = generate_slug_and_collision_id(
        session,
        PlaylistRoute,
        playlist_record.playlist_id,
        playlist_record.playlist_name,
        playlist_record.playlist_owner_id,
        pending_playlist_routes,
        new_playlist_slug_title,
        new_playlist_slug,
    )

    # Add the new playlist route
    new_playlist_route = PlaylistRoute()
    new_playlist_route.slug = new_playlist_slug
    new_playlist_route.title_slug = new_playlist_slug_title
    new_playlist_route.collision_id = new_collision_id
    new_playlist_route.owner_id = playlist_record.playlist_owner_id
    new_playlist_route.playlist_id = playlist_record.playlist_id
    new_playlist_route.is_current = True
    new_playlist_route.blockhash = playlist_record.blockhash
    new_playlist_route.blocknumber = playlist_record.blocknumber
    new_playlist_route.txhash = playlist_record.txhash
    session.add(new_playlist_route)

    # Add to pending playlist routes so we don't add the same route twice
    pending_playlist_routes.append(new_playlist_route)

    logger.info(
        f"index.py | playlists.py | Updated playlist routes for {playlist_record.playlist_id} with slug {new_playlist_slug} and owner_id {new_playlist_route.owner_id}"
    )


def get_playlist_events_tx(update_task, event_type, tx_receipt):
    return getattr(update_task.playlist_contract.events, event_type)().processReceipt(
        tx_receipt
    )


def lookup_playlist_record(update_task, session, entry, block_number, txhash):
    event_blockhash = update_task.web3.toHex(entry.blockHash)
    event_args = entry["args"]
    playlist_id = event_args._playlistId

    # Check if playlist record is in the DB
    playlist_exists = (
        session.query(Playlist).filter_by(playlist_id=event_args._playlistId).count()
        > 0
    )

    playlist_record = None
    if playlist_exists:
        playlist_record = (
            session.query(Playlist)
            .filter(Playlist.playlist_id == playlist_id, Playlist.is_current == True)
            .first()
        )

        # expunge the result from sqlalchemy so we can modify it without UPDATE statements being made
        # https://stackoverflow.com/questions/28871406/how-to-clone-a-sqlalchemy-db-object-with-new-primary-key
        session.expunge(playlist_record)
        make_transient(playlist_record)
    else:
        playlist_record = Playlist(
            playlist_id=playlist_id, is_current=True, is_delete=False
        )

    # update these fields regardless of type
    playlist_record.blocknumber = block_number
    playlist_record.blockhash = event_blockhash
    playlist_record.txhash = txhash

    return playlist_record


def invalidate_old_playlist(session, playlist_id):
    # check if playlist id is in db
    playlist_exists = (
        session.query(Playlist).filter_by(playlist_id=playlist_id).count() > 0
    )

    if playlist_exists:
        # Update existing record in db to is_current = False
        num_invalidated_playlists = (
            session.query(Playlist)
            .filter(Playlist.playlist_id == playlist_id, Playlist.is_current == True)
            .update({"is_current": False})
        )
        assert (
            num_invalidated_playlists > 0
        ), "Update operation requires a current playlist to be invalidated"


def parse_playlist_event(
    self,
    update_task,
    entry,
    event_type,
    playlist_record,
    block_timestamp,
    session,
    pending_playlist_routes,
):
    event_args = entry["args"]
    # Just use block_timestamp as integer
    block_datetime = datetime.utcfromtimestamp(block_timestamp)
    block_integer_time = int(block_timestamp)

    if event_type == playlist_event_types_lookup["playlist_created"]:
        logger.info(
            f"index.py | playlists.py | Creating playlist {playlist_record.playlist_id}"
        )
        playlist_record.playlist_owner_id = event_args._playlistOwnerId
        playlist_record.is_private = event_args._isPrivate
        playlist_record.is_album = event_args._isAlbum

        playlist_content_array = []
        for track_id in event_args._trackIds:
            playlist_content_array.append(
                {"track": track_id, "time": block_integer_time}
            )

        playlist_record.playlist_contents = {"track_ids": playlist_content_array}
        playlist_record.created_at = block_datetime

    if event_type == playlist_event_types_lookup["playlist_deleted"]:
        logger.info(
            f"index.py | playlists.py | Deleting playlist {playlist_record.playlist_id}"
        )
        playlist_record.is_delete = True

    if event_type == playlist_event_types_lookup["playlist_track_added"]:
        if getattr(playlist_record, "playlist_contents") is not None:
            logger.info(
                f"index.py | playlists.py | Adding track {event_args._addedTrackId} to playlist \
            {playlist_record.playlist_id}"
            )
            old_playlist_content_array = playlist_record.playlist_contents["track_ids"]
            new_playlist_content_array = old_playlist_content_array
            # Append new track object
            new_playlist_content_array.append(
                {"track": event_args._addedTrackId, "time": block_integer_time}
            )
            playlist_record.playlist_contents = {
                "track_ids": new_playlist_content_array
            }
            playlist_record.timestamp = block_datetime
            playlist_record.last_added_to = block_datetime

    if event_type == playlist_event_types_lookup["playlist_track_deleted"]:
        if getattr(playlist_record, "playlist_contents") is not None:
            logger.info(
                f"index.py | playlists.py | Removing track {event_args._deletedTrackId} from \
            playlist {playlist_record.playlist_id}"
            )
            old_playlist_content_array = playlist_record.playlist_contents["track_ids"]
            new_playlist_content_array = []
            deleted_track_id = event_args._deletedTrackId
            deleted_track_timestamp = int(event_args._deletedTrackTimestamp)
            delete_track_entry_found = False
            for track_entry in old_playlist_content_array:
                if (
                    track_entry["track"] == deleted_track_id
                    and track_entry["time"] == deleted_track_timestamp
                    and not delete_track_entry_found
                ):
                    delete_track_entry_found = True
                    continue
                new_playlist_content_array.append(track_entry)

            playlist_record.playlist_contents = {
                "track_ids": new_playlist_content_array
            }

    if event_type == playlist_event_types_lookup["playlist_tracks_ordered"]:
        if getattr(playlist_record, "playlist_contents") is not None:
            logger.info(
                f"index.py | playlists.py | Ordering playlist {playlist_record.playlist_id}"
            )
            old_playlist_content_array = playlist_record.playlist_contents["track_ids"]

            intermediate_track_time_lookup_dict = {}

            for old_playlist_entry in old_playlist_content_array:
                track_id = old_playlist_entry["track"]
                track_time = old_playlist_entry["time"]

                if track_id not in intermediate_track_time_lookup_dict:
                    intermediate_track_time_lookup_dict[track_id] = []

                intermediate_track_time_lookup_dict[track_id].append(track_time)

            playlist_content_array = []
            for track_id in event_args._orderedTrackIds:
                if track_id in intermediate_track_time_lookup_dict:
                    track_time_array_length = len(
                        intermediate_track_time_lookup_dict[track_id]
                    )
                    if track_time_array_length > 1:
                        track_time = intermediate_track_time_lookup_dict[track_id].pop(
                            0
                        )
                    elif track_time_array_length == 1:
                        track_time = intermediate_track_time_lookup_dict[track_id][0]
                    else:
                        track_time = block_integer_time
                else:
                    logger.info(
                        f"index.py | playlist.py | Track {track_id} not found, using track_time={block_integer_time}"
                    )
                    track_time = block_integer_time
                playlist_content_array.append({"track": track_id, "time": track_time})

            playlist_record.playlist_contents = {"track_ids": playlist_content_array}

    if event_type == playlist_event_types_lookup["playlist_name_updated"]:
        logger.info(
            f"index.py | playlists.py | Updating playlist {playlist_record.playlist_id} name \
        to {event_args._updatedPlaylistName}"
        )
        playlist_record.playlist_name = event_args._updatedPlaylistName
        update_playlist_routes_table(session, playlist_record, pending_playlist_routes)

    if event_type == playlist_event_types_lookup["playlist_privacy_updated"]:
        logger.info(
            f"index.py | playlists.py | Updating playlist {playlist_record.playlist_id} \
        privacy to {event_args._updatedIsPrivate}"
        )
        playlist_record.is_private = event_args._updatedIsPrivate

    if event_type == playlist_event_types_lookup["playlist_cover_photo_updated"]:
        playlist_record.playlist_image_multihash = helpers.multihash_digest_to_cid(
            event_args._playlistImageMultihashDigest
        )

        # All incoming playlist images are set to the images dir in column playlist_image_sizes_multihash
        if playlist_record.playlist_image_multihash:
            logger.info(
                f"index.py | playlists.py | Processing playlist image \
            {playlist_record.playlist_image_multihash}"
            )
            playlist_record.playlist_image_sizes_multihash = (
                playlist_record.playlist_image_multihash
            )
            playlist_record.playlist_image_multihash = None

    if event_type == playlist_event_types_lookup["playlist_description_updated"]:
        logger.info(
            f"index.py | playlists.py | Updating playlist {playlist_record.playlist_id} \
        description to {event_args._playlistDescription}"
        )
        playlist_record.description = event_args._playlistDescription

    if event_type == playlist_event_types_lookup["playlist_upc_updated"]:
        logger.info(
            f"index.py | playlists.py | Updating playlist {playlist_record.playlist_id} UPC \
        to {event_args._playlistUPC}"
        )
        playlist_record.upc = helpers.bytes32_to_str(event_args._playlistUPC)

    playlist_record.updated_at = block_datetime

    if not all_required_fields_present(Playlist, playlist_record):
        raise EntityMissingRequiredFieldError(
            "playlist",
            playlist_record,
            f"Error parsing playlist {playlist_record} with entity missing required field(s)",
        )

    return playlist_record
