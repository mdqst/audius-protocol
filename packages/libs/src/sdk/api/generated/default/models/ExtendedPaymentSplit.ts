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
/**
 * 
 * @export
 * @interface ExtendedPaymentSplit
 */
export interface ExtendedPaymentSplit {
    /**
     * 
     * @type {number}
     * @memberof ExtendedPaymentSplit
     */
    userId: number;
    /**
     * 
     * @type {number}
     * @memberof ExtendedPaymentSplit
     */
    percentage: number;
    /**
     * 
     * @type {string}
     * @memberof ExtendedPaymentSplit
     */
    ethWallet: string;
    /**
     * 
     * @type {string}
     * @memberof ExtendedPaymentSplit
     */
    payoutWallet: string;
    /**
     * 
     * @type {number}
     * @memberof ExtendedPaymentSplit
     */
    amount: number;
}

/**
 * Check if a given object implements the ExtendedPaymentSplit interface.
 */
export function instanceOfExtendedPaymentSplit(value: object): value is ExtendedPaymentSplit {
    let isInstance = true;
    isInstance = isInstance && "userId" in value && value["userId"] !== undefined;
    isInstance = isInstance && "percentage" in value && value["percentage"] !== undefined;
    isInstance = isInstance && "ethWallet" in value && value["ethWallet"] !== undefined;
    isInstance = isInstance && "payoutWallet" in value && value["payoutWallet"] !== undefined;
    isInstance = isInstance && "amount" in value && value["amount"] !== undefined;

    return isInstance;
}

export function ExtendedPaymentSplitFromJSON(json: any): ExtendedPaymentSplit {
    return ExtendedPaymentSplitFromJSONTyped(json, false);
}

export function ExtendedPaymentSplitFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExtendedPaymentSplit {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'userId': json['user_id'],
        'percentage': json['percentage'],
        'ethWallet': json['eth_wallet'],
        'payoutWallet': json['payout_wallet'],
        'amount': json['amount'],
    };
}

export function ExtendedPaymentSplitToJSON(value?: ExtendedPaymentSplit | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'user_id': value.userId,
        'percentage': value.percentage,
        'eth_wallet': value.ethWallet,
        'payout_wallet': value.payoutWallet,
        'amount': value.amount,
    };
}

