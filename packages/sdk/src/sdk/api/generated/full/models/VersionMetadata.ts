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
 * @interface VersionMetadata
 */
export interface VersionMetadata {
    /**
     * 
     * @type {string}
     * @memberof VersionMetadata
     */
    service: string;
    /**
     * 
     * @type {string}
     * @memberof VersionMetadata
     */
    version: string;
}

/**
 * Check if a given object implements the VersionMetadata interface.
 */
export function instanceOfVersionMetadata(value: object): value is VersionMetadata {
    let isInstance = true;
    isInstance = isInstance && "service" in value && value["service"] !== undefined;
    isInstance = isInstance && "version" in value && value["version"] !== undefined;

    return isInstance;
}

export function VersionMetadataFromJSON(json: any): VersionMetadata {
    return VersionMetadataFromJSONTyped(json, false);
}

export function VersionMetadataFromJSONTyped(json: any, ignoreDiscriminator: boolean): VersionMetadata {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'service': json['service'],
        'version': json['version'],
    };
}

export function VersionMetadataToJSON(value?: VersionMetadata | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'service': value.service,
        'version': value.version,
    };
}

