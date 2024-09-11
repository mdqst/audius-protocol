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

import {
    CreatePlaylistNotificationActionData,
    instanceOfCreatePlaylistNotificationActionData,
    CreatePlaylistNotificationActionDataFromJSON,
    CreatePlaylistNotificationActionDataFromJSONTyped,
    CreatePlaylistNotificationActionDataToJSON,
} from './CreatePlaylistNotificationActionData';
import {
    CreateTrackNotificationActionData,
    instanceOfCreateTrackNotificationActionData,
    CreateTrackNotificationActionDataFromJSON,
    CreateTrackNotificationActionDataFromJSONTyped,
    CreateTrackNotificationActionDataToJSON,
} from './CreateTrackNotificationActionData';

/**
 * @type CreateNotificationActionData
 * 
 * @export
 */
export type CreateNotificationActionData = CreatePlaylistNotificationActionData | CreateTrackNotificationActionData;

export function CreateNotificationActionDataFromJSON(json: any): CreateNotificationActionData {
    return CreateNotificationActionDataFromJSONTyped(json, false);
}

export function CreateNotificationActionDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateNotificationActionData {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return { ...CreatePlaylistNotificationActionDataFromJSONTyped(json, true), ...CreateTrackNotificationActionDataFromJSONTyped(json, true) };
}

export function CreateNotificationActionDataToJSON(value?: CreateNotificationActionData | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }

    if (instanceOfCreatePlaylistNotificationActionData(value)) {
        return CreatePlaylistNotificationActionDataToJSON(value as CreatePlaylistNotificationActionData);
    }
    if (instanceOfCreateTrackNotificationActionData(value)) {
        return CreateTrackNotificationActionDataToJSON(value as CreateTrackNotificationActionData);
    }

    return {};
}

