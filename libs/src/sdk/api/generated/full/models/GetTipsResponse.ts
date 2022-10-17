// @ts-nocheck
/* tslint:disable */
/* eslint-disable */
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

import {
    FullTip,
    FullTipFromJSON,
    FullTipFromJSONTyped,
    FullTipToJSON,
} from './FullTip';
import {
    VersionMetadata,
    VersionMetadataFromJSON,
    VersionMetadataFromJSONTyped,
    VersionMetadataToJSON,
} from './VersionMetadata';

/**
 * 
 * @export
 * @interface GetTipsResponse
 */
export interface GetTipsResponse 
    {
        /**
        * 
        * @type {number}
        * @memberof GetTipsResponse
        */
        latest_chain_block: number;
        /**
        * 
        * @type {number}
        * @memberof GetTipsResponse
        */
        latest_indexed_block: number;
        /**
        * 
        * @type {number}
        * @memberof GetTipsResponse
        */
        latest_chain_slot_plays: number;
        /**
        * 
        * @type {number}
        * @memberof GetTipsResponse
        */
        latest_indexed_slot_plays: number;
        /**
        * 
        * @type {string}
        * @memberof GetTipsResponse
        */
        signature: string;
        /**
        * 
        * @type {string}
        * @memberof GetTipsResponse
        */
        timestamp: string;
        /**
        * 
        * @type {VersionMetadata}
        * @memberof GetTipsResponse
        */
        version: VersionMetadata;
        /**
        * 
        * @type {Array<FullTip>}
        * @memberof GetTipsResponse
        */
        data?: Array<FullTip>;
    }


