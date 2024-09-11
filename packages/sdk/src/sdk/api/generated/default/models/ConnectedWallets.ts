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
 * @interface ConnectedWallets
 */
export interface ConnectedWallets {
    /**
     * 
     * @type {Array<string>}
     * @memberof ConnectedWallets
     */
    ercWallets: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof ConnectedWallets
     */
    splWallets: Array<string>;
}

/**
 * Check if a given object implements the ConnectedWallets interface.
 */
export function instanceOfConnectedWallets(value: object): value is ConnectedWallets {
    let isInstance = true;
    isInstance = isInstance && "ercWallets" in value && value["ercWallets"] !== undefined;
    isInstance = isInstance && "splWallets" in value && value["splWallets"] !== undefined;

    return isInstance;
}

export function ConnectedWalletsFromJSON(json: any): ConnectedWallets {
    return ConnectedWalletsFromJSONTyped(json, false);
}

export function ConnectedWalletsFromJSONTyped(json: any, ignoreDiscriminator: boolean): ConnectedWallets {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'ercWallets': json['erc_wallets'],
        'splWallets': json['spl_wallets'],
    };
}

export function ConnectedWalletsToJSON(value?: ConnectedWallets | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'erc_wallets': value.ercWallets,
        'spl_wallets': value.splWallets,
    };
}

