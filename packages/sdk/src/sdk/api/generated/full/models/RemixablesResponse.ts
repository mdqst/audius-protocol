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
import type { VersionMetadata } from './VersionMetadata';
import {
    VersionMetadataFromJSON,
    VersionMetadataFromJSONTyped,
    VersionMetadataToJSON,
} from './VersionMetadata';

/**
 * 
 * @export
 * @interface RemixablesResponse
 */
export interface RemixablesResponse {
    /**
     * 
     * @type {number}
     * @memberof RemixablesResponse
     */
    latestChainBlock: number;
    /**
     * 
     * @type {number}
     * @memberof RemixablesResponse
     */
    latestIndexedBlock: number;
    /**
     * 
     * @type {number}
     * @memberof RemixablesResponse
     */
    latestChainSlotPlays: number;
    /**
     * 
     * @type {number}
     * @memberof RemixablesResponse
     */
    latestIndexedSlotPlays: number;
    /**
     * 
     * @type {string}
     * @memberof RemixablesResponse
     */
    signature: string;
    /**
     * 
     * @type {string}
     * @memberof RemixablesResponse
     */
    timestamp: string;
    /**
     * 
     * @type {VersionMetadata}
     * @memberof RemixablesResponse
     */
    version: VersionMetadata;
    /**
     * 
     * @type {Array<TrackFull>}
     * @memberof RemixablesResponse
     */
    data?: Array<TrackFull>;
}

/**
 * Check if a given object implements the RemixablesResponse interface.
 */
export function instanceOfRemixablesResponse(value: object): value is RemixablesResponse {
    let isInstance = true;
    isInstance = isInstance && "latestChainBlock" in value && value["latestChainBlock"] !== undefined;
    isInstance = isInstance && "latestIndexedBlock" in value && value["latestIndexedBlock"] !== undefined;
    isInstance = isInstance && "latestChainSlotPlays" in value && value["latestChainSlotPlays"] !== undefined;
    isInstance = isInstance && "latestIndexedSlotPlays" in value && value["latestIndexedSlotPlays"] !== undefined;
    isInstance = isInstance && "signature" in value && value["signature"] !== undefined;
    isInstance = isInstance && "timestamp" in value && value["timestamp"] !== undefined;
    isInstance = isInstance && "version" in value && value["version"] !== undefined;

    return isInstance;
}

export function RemixablesResponseFromJSON(json: any): RemixablesResponse {
    return RemixablesResponseFromJSONTyped(json, false);
}

export function RemixablesResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): RemixablesResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'latestChainBlock': json['latest_chain_block'],
        'latestIndexedBlock': json['latest_indexed_block'],
        'latestChainSlotPlays': json['latest_chain_slot_plays'],
        'latestIndexedSlotPlays': json['latest_indexed_slot_plays'],
        'signature': json['signature'],
        'timestamp': json['timestamp'],
        'version': VersionMetadataFromJSON(json['version']),
        'data': !exists(json, 'data') ? undefined : ((json['data'] as Array<any>).map(TrackFullFromJSON)),
    };
}

export function RemixablesResponseToJSON(value?: RemixablesResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'latest_chain_block': value.latestChainBlock,
        'latest_indexed_block': value.latestIndexedBlock,
        'latest_chain_slot_plays': value.latestChainSlotPlays,
        'latest_indexed_slot_plays': value.latestIndexedSlotPlays,
        'signature': value.signature,
        'timestamp': value.timestamp,
        'version': VersionMetadataToJSON(value.version),
        'data': value.data === undefined ? undefined : ((value.data as Array<any>).map(TrackFullToJSON)),
    };
}

