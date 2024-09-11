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
import type { TrackFull } from './TrackFull';
import {
    TrackFullFromJSON,
    TrackFullFromJSONTyped,
    TrackFullToJSON,
} from './TrackFull';

/**
 * 
 * @export
 * @interface RemixesResponse
 */
export interface RemixesResponse {
    /**
     * 
     * @type {number}
     * @memberof RemixesResponse
     */
    count: number;
    /**
     * 
     * @type {Array<TrackFull>}
     * @memberof RemixesResponse
     */
    tracks?: Array<TrackFull>;
}

/**
 * Check if a given object implements the RemixesResponse interface.
 */
export function instanceOfRemixesResponse(value: object): value is RemixesResponse {
    let isInstance = true;
    isInstance = isInstance && "count" in value && value["count"] !== undefined;

    return isInstance;
}

export function RemixesResponseFromJSON(json: any): RemixesResponse {
    return RemixesResponseFromJSONTyped(json, false);
}

export function RemixesResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): RemixesResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'count': json['count'],
        'tracks': !exists(json, 'tracks') ? undefined : ((json['tracks'] as Array<any>).map(TrackFullFromJSON)),
    };
}

export function RemixesResponseToJSON(value?: RemixesResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'count': value.count,
        'tracks': value.tracks === undefined ? undefined : ((value.tracks as Array<any>).map(TrackFullToJSON)),
    };
}

