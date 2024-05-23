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
import type { User } from './User';
import {
    UserFromJSON,
    UserFromJSONTyped,
    UserToJSON,
} from './User';

/**
 * 
 * @export
 * @interface Supporter
 */
export interface Supporter {
    /**
     * 
     * @type {number}
     * @memberof Supporter
     */
    rank: number;
    /**
     * 
     * @type {string}
     * @memberof Supporter
     */
    amount: string;
    /**
     * 
     * @type {User}
     * @memberof Supporter
     */
    sender: User;
}

/**
 * Check if a given object implements the Supporter interface.
 */
export function instanceOfSupporter(value: object): value is Supporter {
    let isInstance = true;
    isInstance = isInstance && "rank" in value && value["rank"] !== undefined;
    isInstance = isInstance && "amount" in value && value["amount"] !== undefined;
    isInstance = isInstance && "sender" in value && value["sender"] !== undefined;

    return isInstance;
}

export function SupporterFromJSON(json: any): Supporter {
    return SupporterFromJSONTyped(json, false);
}

export function SupporterFromJSONTyped(json: any, ignoreDiscriminator: boolean): Supporter {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'rank': json['rank'],
        'amount': json['amount'],
        'sender': UserFromJSON(json['sender']),
    };
}

export function SupporterToJSON(value?: Supporter | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'rank': value.rank,
        'amount': value.amount,
        'sender': UserToJSON(value.sender),
    };
}

