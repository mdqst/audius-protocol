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
import type { PlaylistFull } from './PlaylistFull';
import {
    PlaylistFullFromJSON,
    PlaylistFullFromJSONTyped,
    PlaylistFullToJSON,
} from './PlaylistFull';
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
 * @interface SearchModel
 */
export interface SearchModel {
    /**
     * 
     * @type {Array<UserFull>}
     * @memberof SearchModel
     */
    users: Array<UserFull>;
    /**
     * 
     * @type {Array<UserFull>}
     * @memberof SearchModel
     */
    followedUsers?: Array<UserFull>;
    /**
     * 
     * @type {Array<TrackFull>}
     * @memberof SearchModel
     */
    tracks: Array<TrackFull>;
    /**
     * 
     * @type {Array<TrackFull>}
     * @memberof SearchModel
     */
    savedTracks?: Array<TrackFull>;
    /**
     * 
     * @type {Array<PlaylistFull>}
     * @memberof SearchModel
     */
    playlists: Array<PlaylistFull>;
    /**
     * 
     * @type {Array<PlaylistFull>}
     * @memberof SearchModel
     */
    savedPlaylists?: Array<PlaylistFull>;
    /**
     * 
     * @type {Array<PlaylistFull>}
     * @memberof SearchModel
     */
    albums: Array<PlaylistFull>;
    /**
     * 
     * @type {Array<PlaylistFull>}
     * @memberof SearchModel
     */
    savedAlbums?: Array<PlaylistFull>;
}

/**
 * Check if a given object implements the SearchModel interface.
 */
export function instanceOfSearchModel(value: object): value is SearchModel {
    let isInstance = true;
    isInstance = isInstance && "users" in value && value["users"] !== undefined;
    isInstance = isInstance && "tracks" in value && value["tracks"] !== undefined;
    isInstance = isInstance && "playlists" in value && value["playlists"] !== undefined;
    isInstance = isInstance && "albums" in value && value["albums"] !== undefined;

    return isInstance;
}

export function SearchModelFromJSON(json: any): SearchModel {
    return SearchModelFromJSONTyped(json, false);
}

export function SearchModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): SearchModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'users': ((json['users'] as Array<any>).map(UserFullFromJSON)),
        'followedUsers': !exists(json, 'followed_users') ? undefined : ((json['followed_users'] as Array<any>).map(UserFullFromJSON)),
        'tracks': ((json['tracks'] as Array<any>).map(TrackFullFromJSON)),
        'savedTracks': !exists(json, 'saved_tracks') ? undefined : ((json['saved_tracks'] as Array<any>).map(TrackFullFromJSON)),
        'playlists': ((json['playlists'] as Array<any>).map(PlaylistFullFromJSON)),
        'savedPlaylists': !exists(json, 'saved_playlists') ? undefined : ((json['saved_playlists'] as Array<any>).map(PlaylistFullFromJSON)),
        'albums': ((json['albums'] as Array<any>).map(PlaylistFullFromJSON)),
        'savedAlbums': !exists(json, 'saved_albums') ? undefined : ((json['saved_albums'] as Array<any>).map(PlaylistFullFromJSON)),
    };
}

export function SearchModelToJSON(value?: SearchModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'users': ((value.users as Array<any>).map(UserFullToJSON)),
        'followed_users': value.followedUsers === undefined ? undefined : ((value.followedUsers as Array<any>).map(UserFullToJSON)),
        'tracks': ((value.tracks as Array<any>).map(TrackFullToJSON)),
        'saved_tracks': value.savedTracks === undefined ? undefined : ((value.savedTracks as Array<any>).map(TrackFullToJSON)),
        'playlists': ((value.playlists as Array<any>).map(PlaylistFullToJSON)),
        'saved_playlists': value.savedPlaylists === undefined ? undefined : ((value.savedPlaylists as Array<any>).map(PlaylistFullToJSON)),
        'albums': ((value.albums as Array<any>).map(PlaylistFullToJSON)),
        'saved_albums': value.savedAlbums === undefined ? undefined : ((value.savedAlbums as Array<any>).map(PlaylistFullToJSON)),
    };
}

