/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/**
 * API
 * Audius V1 API
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { Playlist } from './Playlist';
import {
    PlaylistFromJSON,
    PlaylistFromJSONTyped,
    PlaylistToJSON,
} from './Playlist';

/**
 * 
 * @export
 * @interface AlbumsResponse
 */
export interface AlbumsResponse {
    /**
     * 
     * @type {Array<Playlist>}
     * @memberof AlbumsResponse
     */
    data?: Array<Playlist>;
}

/**
 * Check if a given object implements the AlbumsResponse interface.
 */
export function instanceOfAlbumsResponse(value: object): value is AlbumsResponse {
    let isInstance = true;

    return isInstance;
}

export function AlbumsResponseFromJSON(json: any): AlbumsResponse {
    return AlbumsResponseFromJSONTyped(json, false);
}

export function AlbumsResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): AlbumsResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'data': !exists(json, 'data') ? undefined : ((json['data'] as Array<any>).map(PlaylistFromJSON)),
    };
}

export function AlbumsResponseToJSON(value?: AlbumsResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'data': value.data === undefined ? undefined : ((value.data as Array<any>).map(PlaylistToJSON)),
    };
}

