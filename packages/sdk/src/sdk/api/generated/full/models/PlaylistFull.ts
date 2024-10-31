/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/**
 * API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { Access } from './Access';
import {
    AccessFromJSON,
    AccessFromJSONTyped,
    AccessToJSON,
} from './Access';
import type { AccessGate } from './AccessGate';
import {
    AccessGateFromJSON,
    AccessGateFromJSONTyped,
    AccessGateToJSON,
} from './AccessGate';
import type { Favorite } from './Favorite';
import {
    FavoriteFromJSON,
    FavoriteFromJSONTyped,
    FavoriteToJSON,
} from './Favorite';
import type { PlaylistAddedTimestamp } from './PlaylistAddedTimestamp';
import {
    PlaylistAddedTimestampFromJSON,
    PlaylistAddedTimestampFromJSONTyped,
    PlaylistAddedTimestampToJSON,
} from './PlaylistAddedTimestamp';
import type { PlaylistArtwork } from './PlaylistArtwork';
import {
    PlaylistArtworkFromJSON,
    PlaylistArtworkFromJSONTyped,
    PlaylistArtworkToJSON,
} from './PlaylistArtwork';
import type { PlaylistArtworkFull } from './PlaylistArtworkFull';
import {
    PlaylistArtworkFullFromJSON,
    PlaylistArtworkFullFromJSONTyped,
    PlaylistArtworkFullToJSON,
} from './PlaylistArtworkFull';
import type { Repost } from './Repost';
import {
    RepostFromJSON,
    RepostFromJSONTyped,
    RepostToJSON,
} from './Repost';
import type { TrackFull } from './TrackFull';
import {
    TrackFullFromJSON,
    TrackFullFromJSONTyped,
    TrackFullToJSON,
} from './TrackFull';
import type { UserFull } from './UserFull';
import {
    UserFullFromJSON,
    UserFullFromJSONTyped,
    UserFullToJSON,
} from './UserFull';

/**
 * 
 * @export
 * @interface PlaylistFull
 */
export interface PlaylistFull {
    /**
     * 
     * @type {PlaylistArtworkFull}
     * @memberof PlaylistFull
     */
    artwork?: PlaylistArtworkFull;
    /**
     * 
     * @type {string}
     * @memberof PlaylistFull
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof PlaylistFull
     */
    permalink: string;
    /**
     * 
     * @type {string}
     * @memberof PlaylistFull
     */
    id: string;
    /**
     * 
     * @type {boolean}
     * @memberof PlaylistFull
     */
    isAlbum: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PlaylistFull
     */
    isImageAutogenerated: boolean;
    /**
     * 
     * @type {string}
     * @memberof PlaylistFull
     */
    playlistName: string;
    /**
     * 
     * @type {Array<PlaylistAddedTimestamp>}
     * @memberof PlaylistFull
     */
    playlistContents: Array<PlaylistAddedTimestamp>;
    /**
     * 
     * @type {number}
     * @memberof PlaylistFull
     */
    repostCount: number;
    /**
     * 
     * @type {number}
     * @memberof PlaylistFull
     */
    favoriteCount: number;
    /**
     * 
     * @type {number}
     * @memberof PlaylistFull
     */
    totalPlayCount: number;
    /**
     * 
     * @type {UserFull}
     * @memberof PlaylistFull
     */
    user: UserFull;
    /**
     * 
     * @type {string}
     * @memberof PlaylistFull
     */
    ddexApp?: string;
    /**
     * 
     * @type {Access}
     * @memberof PlaylistFull
     */
    access: Access;
    /**
     * 
     * @type {string}
     * @memberof PlaylistFull
     */
    upc?: string;
    /**
     * 
     * @type {number}
     * @memberof PlaylistFull
     */
    trackCount: number;
    /**
     * 
     * @type {number}
     * @memberof PlaylistFull
     */
    blocknumber: number;
    /**
     * 
     * @type {string}
     * @memberof PlaylistFull
     */
    createdAt: string;
    /**
     * 
     * @type {Array<Repost>}
     * @memberof PlaylistFull
     */
    followeeReposts: Array<Repost>;
    /**
     * 
     * @type {Array<Favorite>}
     * @memberof PlaylistFull
     */
    followeeFavorites: Array<Favorite>;
    /**
     * 
     * @type {boolean}
     * @memberof PlaylistFull
     */
    hasCurrentUserReposted: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PlaylistFull
     */
    hasCurrentUserSaved: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PlaylistFull
     */
    isDelete: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PlaylistFull
     */
    isPrivate: boolean;
    /**
     * 
     * @type {string}
     * @memberof PlaylistFull
     */
    updatedAt: string;
    /**
     * 
     * @type {Array<PlaylistAddedTimestamp>}
     * @memberof PlaylistFull
     */
    addedTimestamps: Array<PlaylistAddedTimestamp>;
    /**
     * 
     * @type {string}
     * @memberof PlaylistFull
     */
    userId: string;
    /**
     * 
     * @type {Array<TrackFull>}
     * @memberof PlaylistFull
     */
    tracks: Array<TrackFull>;
    /**
     * 
     * @type {string}
     * @memberof PlaylistFull
     */
    coverArt?: string;
    /**
     * 
     * @type {string}
     * @memberof PlaylistFull
     */
    coverArtSizes?: string;
    /**
     * 
     * @type {PlaylistArtwork}
     * @memberof PlaylistFull
     */
    coverArtCids?: PlaylistArtwork;
    /**
     * 
     * @type {boolean}
     * @memberof PlaylistFull
     */
    isStreamGated: boolean;
    /**
     * How to unlock stream access to the track
     * @type {AccessGate}
     * @memberof PlaylistFull
     */
    streamConditions?: AccessGate;
    /**
     * 
     * @type {boolean}
     * @memberof PlaylistFull
     */
    isScheduledRelease: boolean;
    /**
     * 
     * @type {string}
     * @memberof PlaylistFull
     */
    releaseDate?: string;
    /**
     * 
     * @type {object}
     * @memberof PlaylistFull
     */
    ddexReleaseIds?: object;
    /**
     * 
     * @type {Array<object>}
     * @memberof PlaylistFull
     */
    artists?: Array<object>;
    /**
     * 
     * @type {object}
     * @memberof PlaylistFull
     */
    copyrightLine?: object;
    /**
     * 
     * @type {object}
     * @memberof PlaylistFull
     */
    producerCopyrightLine?: object;
    /**
     * 
     * @type {string}
     * @memberof PlaylistFull
     */
    parentalWarningType?: string;
}

/**
 * Check if a given object implements the PlaylistFull interface.
 */
export function instanceOfPlaylistFull(value: object): value is PlaylistFull {
    let isInstance = true;
    isInstance = isInstance && "permalink" in value && value["permalink"] !== undefined;
    isInstance = isInstance && "id" in value && value["id"] !== undefined;
    isInstance = isInstance && "isAlbum" in value && value["isAlbum"] !== undefined;
    isInstance = isInstance && "isImageAutogenerated" in value && value["isImageAutogenerated"] !== undefined;
    isInstance = isInstance && "playlistName" in value && value["playlistName"] !== undefined;
    isInstance = isInstance && "playlistContents" in value && value["playlistContents"] !== undefined;
    isInstance = isInstance && "repostCount" in value && value["repostCount"] !== undefined;
    isInstance = isInstance && "favoriteCount" in value && value["favoriteCount"] !== undefined;
    isInstance = isInstance && "totalPlayCount" in value && value["totalPlayCount"] !== undefined;
    isInstance = isInstance && "user" in value && value["user"] !== undefined;
    isInstance = isInstance && "access" in value && value["access"] !== undefined;
    isInstance = isInstance && "trackCount" in value && value["trackCount"] !== undefined;
    isInstance = isInstance && "blocknumber" in value && value["blocknumber"] !== undefined;
    isInstance = isInstance && "createdAt" in value && value["createdAt"] !== undefined;
    isInstance = isInstance && "followeeReposts" in value && value["followeeReposts"] !== undefined;
    isInstance = isInstance && "followeeFavorites" in value && value["followeeFavorites"] !== undefined;
    isInstance = isInstance && "hasCurrentUserReposted" in value && value["hasCurrentUserReposted"] !== undefined;
    isInstance = isInstance && "hasCurrentUserSaved" in value && value["hasCurrentUserSaved"] !== undefined;
    isInstance = isInstance && "isDelete" in value && value["isDelete"] !== undefined;
    isInstance = isInstance && "isPrivate" in value && value["isPrivate"] !== undefined;
    isInstance = isInstance && "updatedAt" in value && value["updatedAt"] !== undefined;
    isInstance = isInstance && "addedTimestamps" in value && value["addedTimestamps"] !== undefined;
    isInstance = isInstance && "userId" in value && value["userId"] !== undefined;
    isInstance = isInstance && "tracks" in value && value["tracks"] !== undefined;
    isInstance = isInstance && "isStreamGated" in value && value["isStreamGated"] !== undefined;
    isInstance = isInstance && "isScheduledRelease" in value && value["isScheduledRelease"] !== undefined;

    return isInstance;
}

export function PlaylistFullFromJSON(json: any): PlaylistFull {
    return PlaylistFullFromJSONTyped(json, false);
}

export function PlaylistFullFromJSONTyped(json: any, ignoreDiscriminator: boolean): PlaylistFull {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'artwork': !exists(json, 'artwork') ? undefined : PlaylistArtworkFullFromJSON(json['artwork']),
        'description': !exists(json, 'description') ? undefined : json['description'],
        'permalink': json['permalink'],
        'id': json['id'],
        'isAlbum': json['is_album'],
        'isImageAutogenerated': json['is_image_autogenerated'],
        'playlistName': json['playlist_name'],
        'playlistContents': ((json['playlist_contents'] as Array<any>).map(PlaylistAddedTimestampFromJSON)),
        'repostCount': json['repost_count'],
        'favoriteCount': json['favorite_count'],
        'totalPlayCount': json['total_play_count'],
        'user': UserFullFromJSON(json['user']),
        'ddexApp': !exists(json, 'ddex_app') ? undefined : json['ddex_app'],
        'access': AccessFromJSON(json['access']),
        'upc': !exists(json, 'upc') ? undefined : json['upc'],
        'trackCount': json['track_count'],
        'blocknumber': json['blocknumber'],
        'createdAt': json['created_at'],
        'followeeReposts': ((json['followee_reposts'] as Array<any>).map(RepostFromJSON)),
        'followeeFavorites': ((json['followee_favorites'] as Array<any>).map(FavoriteFromJSON)),
        'hasCurrentUserReposted': json['has_current_user_reposted'],
        'hasCurrentUserSaved': json['has_current_user_saved'],
        'isDelete': json['is_delete'],
        'isPrivate': json['is_private'],
        'updatedAt': json['updated_at'],
        'addedTimestamps': ((json['added_timestamps'] as Array<any>).map(PlaylistAddedTimestampFromJSON)),
        'userId': json['user_id'],
        'tracks': ((json['tracks'] as Array<any>).map(TrackFullFromJSON)),
        'coverArt': !exists(json, 'cover_art') ? undefined : json['cover_art'],
        'coverArtSizes': !exists(json, 'cover_art_sizes') ? undefined : json['cover_art_sizes'],
        'coverArtCids': !exists(json, 'cover_art_cids') ? undefined : PlaylistArtworkFromJSON(json['cover_art_cids']),
        'isStreamGated': json['is_stream_gated'],
        'streamConditions': !exists(json, 'stream_conditions') ? undefined : AccessGateFromJSON(json['stream_conditions']),
        'isScheduledRelease': json['is_scheduled_release'],
        'releaseDate': !exists(json, 'release_date') ? undefined : json['release_date'],
        'ddexReleaseIds': !exists(json, 'ddex_release_ids') ? undefined : json['ddex_release_ids'],
        'artists': !exists(json, 'artists') ? undefined : json['artists'],
        'copyrightLine': !exists(json, 'copyright_line') ? undefined : json['copyright_line'],
        'producerCopyrightLine': !exists(json, 'producer_copyright_line') ? undefined : json['producer_copyright_line'],
        'parentalWarningType': !exists(json, 'parental_warning_type') ? undefined : json['parental_warning_type'],
    };
}

export function PlaylistFullToJSON(value?: PlaylistFull | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'artwork': PlaylistArtworkFullToJSON(value.artwork),
        'description': value.description,
        'permalink': value.permalink,
        'id': value.id,
        'is_album': value.isAlbum,
        'is_image_autogenerated': value.isImageAutogenerated,
        'playlist_name': value.playlistName,
        'playlist_contents': ((value.playlistContents as Array<any>).map(PlaylistAddedTimestampToJSON)),
        'repost_count': value.repostCount,
        'favorite_count': value.favoriteCount,
        'total_play_count': value.totalPlayCount,
        'user': UserFullToJSON(value.user),
        'ddex_app': value.ddexApp,
        'access': AccessToJSON(value.access),
        'upc': value.upc,
        'track_count': value.trackCount,
        'blocknumber': value.blocknumber,
        'created_at': value.createdAt,
        'followee_reposts': ((value.followeeReposts as Array<any>).map(RepostToJSON)),
        'followee_favorites': ((value.followeeFavorites as Array<any>).map(FavoriteToJSON)),
        'has_current_user_reposted': value.hasCurrentUserReposted,
        'has_current_user_saved': value.hasCurrentUserSaved,
        'is_delete': value.isDelete,
        'is_private': value.isPrivate,
        'updated_at': value.updatedAt,
        'added_timestamps': ((value.addedTimestamps as Array<any>).map(PlaylistAddedTimestampToJSON)),
        'user_id': value.userId,
        'tracks': ((value.tracks as Array<any>).map(TrackFullToJSON)),
        'cover_art': value.coverArt,
        'cover_art_sizes': value.coverArtSizes,
        'cover_art_cids': PlaylistArtworkToJSON(value.coverArtCids),
        'is_stream_gated': value.isStreamGated,
        'stream_conditions': AccessGateToJSON(value.streamConditions),
        'is_scheduled_release': value.isScheduledRelease,
        'release_date': value.releaseDate,
        'ddex_release_ids': value.ddexReleaseIds,
        'artists': value.artists,
        'copyright_line': value.copyrightLine,
        'producer_copyright_line': value.producerCopyrightLine,
        'parental_warning_type': value.parentalWarningType,
    };
}

