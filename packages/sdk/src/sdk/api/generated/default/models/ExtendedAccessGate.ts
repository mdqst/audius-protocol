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

import {
    ExtendedPurchaseGate,
    instanceOfExtendedPurchaseGate,
    ExtendedPurchaseGateFromJSON,
    ExtendedPurchaseGateFromJSONTyped,
    ExtendedPurchaseGateToJSON,
} from './ExtendedPurchaseGate';
import {
    FollowGate,
    instanceOfFollowGate,
    FollowGateFromJSON,
    FollowGateFromJSONTyped,
    FollowGateToJSON,
} from './FollowGate';
import {
    NftGate,
    instanceOfNftGate,
    NftGateFromJSON,
    NftGateFromJSONTyped,
    NftGateToJSON,
} from './NftGate';
import {
    TipGate,
    instanceOfTipGate,
    TipGateFromJSON,
    TipGateFromJSONTyped,
    TipGateToJSON,
} from './TipGate';

/**
 * @type ExtendedAccessGate
 * 
 * @export
 */
export type ExtendedAccessGate = ExtendedPurchaseGate | FollowGate | NftGate | TipGate;

export function ExtendedAccessGateFromJSON(json: any): ExtendedAccessGate {
    return ExtendedAccessGateFromJSONTyped(json, false);
}

export function ExtendedAccessGateFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExtendedAccessGate {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return { ...ExtendedPurchaseGateFromJSONTyped(json, true), ...FollowGateFromJSONTyped(json, true), ...NftGateFromJSONTyped(json, true), ...TipGateFromJSONTyped(json, true) };
}

export function ExtendedAccessGateToJSON(value?: ExtendedAccessGate | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }

    if (instanceOfExtendedPurchaseGate(value)) {
        return ExtendedPurchaseGateToJSON(value as ExtendedPurchaseGate);
    }
    if (instanceOfFollowGate(value)) {
        return FollowGateToJSON(value as FollowGate);
    }
    if (instanceOfNftGate(value)) {
        return NftGateToJSON(value as NftGate);
    }
    if (instanceOfTipGate(value)) {
        return TipGateToJSON(value as TipGate);
    }

    return {};
}

