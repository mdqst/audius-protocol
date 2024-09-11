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
/**
 * 
 * @export
 * @interface CreatePlaylistNotificationActionData
 */
export interface CreatePlaylistNotificationActionData {
    /**
     * 
     * @type {string}
     * @memberof CreatePlaylistNotificationActionData
     */
    playlistData?: string;
    /**
     * 
     * @type {boolean}
     * @memberof CreatePlaylistNotificationActionData
     */
    isAlbum: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof CreatePlaylistNotificationActionData
     */
    playlistId: Array<string>;
}

/**
 * Check if a given object implements the CreatePlaylistNotificationActionData interface.
 */
export function instanceOfCreatePlaylistNotificationActionData(value: object): value is CreatePlaylistNotificationActionData {
    let isInstance = true;
    isInstance = isInstance && "isAlbum" in value && value["isAlbum"] !== undefined;
    isInstance = isInstance && "playlistId" in value && value["playlistId"] !== undefined;

    return isInstance;
}

export function CreatePlaylistNotificationActionDataFromJSON(json: any): CreatePlaylistNotificationActionData {
    return CreatePlaylistNotificationActionDataFromJSONTyped(json, false);
}

export function CreatePlaylistNotificationActionDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreatePlaylistNotificationActionData {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'playlistData': !exists(json, 'playlist_data') ? undefined : json['playlist_data'],
        'isAlbum': json['is_album'],
        'playlistId': json['playlist_id'],
    };
}

export function CreatePlaylistNotificationActionDataToJSON(value?: CreatePlaylistNotificationActionData | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'playlist_data': value.playlistData,
        'is_album': value.isAlbum,
        'playlist_id': value.playlistId,
    };
}

