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
 * @interface SupporterDethronedNotificationActionData
 */
export interface SupporterDethronedNotificationActionData {
    /**
     * 
     * @type {string}
     * @memberof SupporterDethronedNotificationActionData
     */
    dethronedUserId: string;
    /**
     * 
     * @type {string}
     * @memberof SupporterDethronedNotificationActionData
     */
    senderUserId: string;
    /**
     * 
     * @type {string}
     * @memberof SupporterDethronedNotificationActionData
     */
    receiverUserId: string;
}

/**
 * Check if a given object implements the SupporterDethronedNotificationActionData interface.
 */
export function instanceOfSupporterDethronedNotificationActionData(value: object): value is SupporterDethronedNotificationActionData {
    let isInstance = true;
    isInstance = isInstance && "dethronedUserId" in value && value["dethronedUserId"] !== undefined;
    isInstance = isInstance && "senderUserId" in value && value["senderUserId"] !== undefined;
    isInstance = isInstance && "receiverUserId" in value && value["receiverUserId"] !== undefined;

    return isInstance;
}

export function SupporterDethronedNotificationActionDataFromJSON(json: any): SupporterDethronedNotificationActionData {
    return SupporterDethronedNotificationActionDataFromJSONTyped(json, false);
}

export function SupporterDethronedNotificationActionDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): SupporterDethronedNotificationActionData {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'dethronedUserId': json['dethroned_user_id'],
        'senderUserId': json['sender_user_id'],
        'receiverUserId': json['receiver_user_id'],
    };
}

export function SupporterDethronedNotificationActionDataToJSON(value?: SupporterDethronedNotificationActionData | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'dethroned_user_id': value.dethronedUserId,
        'sender_user_id': value.senderUserId,
        'receiver_user_id': value.receiverUserId,
    };
}

