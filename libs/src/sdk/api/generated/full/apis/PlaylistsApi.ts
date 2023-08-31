/* tslint:disable */
// @ts-nocheck
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


import * as runtime from '../runtime';
import type {
  FollowingResponse,
  FullPlaylistResponse,
  FullPlaylistTracksResponse,
  FullTrendingPlaylistsResponse,
} from '../models';
import {
    FollowingResponseFromJSON,
    FollowingResponseToJSON,
    FullPlaylistResponseFromJSON,
    FullPlaylistResponseToJSON,
    FullPlaylistTracksResponseFromJSON,
    FullPlaylistTracksResponseToJSON,
    FullTrendingPlaylistsResponseFromJSON,
    FullTrendingPlaylistsResponseToJSON,
} from '../models';

export interface GetPlaylistRequest {
    playlistId: string;
    userId?: string;
}

export interface GetPlaylistByHandleAndSlugRequest {
    handle: string;
    slug: string;
    userId?: string;
}

export interface GetPlaylistTracksRequest {
    playlistId: string;
}

export interface GetTrendingPlaylistsRequest {
    offset?: number;
    limit?: number;
    userId?: string;
    time?: GetTrendingPlaylistsTimeEnum;
}

export interface GetTrendingPlaylistsWithVersionRequest {
    version: string;
    offset?: number;
    limit?: number;
    userId?: string;
    time?: GetTrendingPlaylistsWithVersionTimeEnum;
}

export interface GetUsersFromPlaylistFavoritesRequest {
    playlistId: string;
    offset?: number;
    limit?: number;
    userId?: string;
}

export interface GetUsersFromPlaylistRepostsRequest {
    playlistId: string;
    offset?: number;
    limit?: number;
    userId?: string;
}

/**
 * 
 */
export class PlaylistsApi extends runtime.BaseAPI {

    /** @hidden
     * Get a playlist by ID
     */
    async getPlaylistRaw(params: GetPlaylistRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FullPlaylistResponse>> {
        if (params.playlistId === null || params.playlistId === undefined) {
            throw new runtime.RequiredError('playlistId','Required parameter params.playlistId was null or undefined when calling getPlaylist.');
        }

        const queryParameters: any = {};

        if (params.userId !== undefined) {
            queryParameters['user_id'] = params.userId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/playlists/{playlist_id}`.replace(`{${"playlist_id"}}`, encodeURIComponent(String(params.playlistId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FullPlaylistResponseFromJSON(jsonValue));
    }

    /**
     * Get a playlist by ID
     */
    async getPlaylist(params: GetPlaylistRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FullPlaylistResponse> {
        const response = await this.getPlaylistRaw(params, initOverrides);
        return await response.value();
    }

    /** @hidden
     * Get a playlist by handle and slug
     */
    async getPlaylistByHandleAndSlugRaw(params: GetPlaylistByHandleAndSlugRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FullPlaylistResponse>> {
        if (params.handle === null || params.handle === undefined) {
            throw new runtime.RequiredError('handle','Required parameter params.handle was null or undefined when calling getPlaylistByHandleAndSlug.');
        }

        if (params.slug === null || params.slug === undefined) {
            throw new runtime.RequiredError('slug','Required parameter params.slug was null or undefined when calling getPlaylistByHandleAndSlug.');
        }

        const queryParameters: any = {};

        if (params.userId !== undefined) {
            queryParameters['user_id'] = params.userId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/playlists/by_permalink/{handle}/{slug}`.replace(`{${"handle"}}`, encodeURIComponent(String(params.handle))).replace(`{${"slug"}}`, encodeURIComponent(String(params.slug))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FullPlaylistResponseFromJSON(jsonValue));
    }

    /**
     * Get a playlist by handle and slug
     */
    async getPlaylistByHandleAndSlug(params: GetPlaylistByHandleAndSlugRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FullPlaylistResponse> {
        const response = await this.getPlaylistByHandleAndSlugRaw(params, initOverrides);
        return await response.value();
    }

    /** @hidden
     * Fetch tracks within a playlist.
     */
    async getPlaylistTracksRaw(params: GetPlaylistTracksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FullPlaylistTracksResponse>> {
        if (params.playlistId === null || params.playlistId === undefined) {
            throw new runtime.RequiredError('playlistId','Required parameter params.playlistId was null or undefined when calling getPlaylistTracks.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/playlists/{playlist_id}/tracks`.replace(`{${"playlist_id"}}`, encodeURIComponent(String(params.playlistId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FullPlaylistTracksResponseFromJSON(jsonValue));
    }

    /**
     * Fetch tracks within a playlist.
     */
    async getPlaylistTracks(params: GetPlaylistTracksRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FullPlaylistTracksResponse> {
        const response = await this.getPlaylistTracksRaw(params, initOverrides);
        return await response.value();
    }

    /** @hidden
     * Returns trending playlists for a time period
     */
    async getTrendingPlaylistsRaw(params: GetTrendingPlaylistsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FullTrendingPlaylistsResponse>> {
        const queryParameters: any = {};

        if (params.offset !== undefined) {
            queryParameters['offset'] = params.offset;
        }

        if (params.limit !== undefined) {
            queryParameters['limit'] = params.limit;
        }

        if (params.userId !== undefined) {
            queryParameters['user_id'] = params.userId;
        }

        if (params.time !== undefined) {
            queryParameters['time'] = params.time;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/playlists/trending`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FullTrendingPlaylistsResponseFromJSON(jsonValue));
    }

    /**
     * Returns trending playlists for a time period
     */
    async getTrendingPlaylists(params: GetTrendingPlaylistsRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FullTrendingPlaylistsResponse> {
        const response = await this.getTrendingPlaylistsRaw(params, initOverrides);
        return await response.value();
    }

    /** @hidden
     * Returns trending playlists for a time period based on the given trending version
     */
    async getTrendingPlaylistsWithVersionRaw(params: GetTrendingPlaylistsWithVersionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FullTrendingPlaylistsResponse>> {
        if (params.version === null || params.version === undefined) {
            throw new runtime.RequiredError('version','Required parameter params.version was null or undefined when calling getTrendingPlaylistsWithVersion.');
        }

        const queryParameters: any = {};

        if (params.offset !== undefined) {
            queryParameters['offset'] = params.offset;
        }

        if (params.limit !== undefined) {
            queryParameters['limit'] = params.limit;
        }

        if (params.userId !== undefined) {
            queryParameters['user_id'] = params.userId;
        }

        if (params.time !== undefined) {
            queryParameters['time'] = params.time;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/playlists/trending/{version}`.replace(`{${"version"}}`, encodeURIComponent(String(params.version))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FullTrendingPlaylistsResponseFromJSON(jsonValue));
    }

    /**
     * Returns trending playlists for a time period based on the given trending version
     */
    async getTrendingPlaylistsWithVersion(params: GetTrendingPlaylistsWithVersionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FullTrendingPlaylistsResponse> {
        const response = await this.getTrendingPlaylistsWithVersionRaw(params, initOverrides);
        return await response.value();
    }

    /** @hidden
     * Get users that favorited a playlist
     */
    async getUsersFromPlaylistFavoritesRaw(params: GetUsersFromPlaylistFavoritesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FollowingResponse>> {
        if (params.playlistId === null || params.playlistId === undefined) {
            throw new runtime.RequiredError('playlistId','Required parameter params.playlistId was null or undefined when calling getUsersFromPlaylistFavorites.');
        }

        const queryParameters: any = {};

        if (params.offset !== undefined) {
            queryParameters['offset'] = params.offset;
        }

        if (params.limit !== undefined) {
            queryParameters['limit'] = params.limit;
        }

        if (params.userId !== undefined) {
            queryParameters['user_id'] = params.userId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/playlists/{playlist_id}/favorites`.replace(`{${"playlist_id"}}`, encodeURIComponent(String(params.playlistId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FollowingResponseFromJSON(jsonValue));
    }

    /**
     * Get users that favorited a playlist
     */
    async getUsersFromPlaylistFavorites(params: GetUsersFromPlaylistFavoritesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FollowingResponse> {
        const response = await this.getUsersFromPlaylistFavoritesRaw(params, initOverrides);
        return await response.value();
    }

    /** @hidden
     * Get users that reposted a playlist
     */
    async getUsersFromPlaylistRepostsRaw(params: GetUsersFromPlaylistRepostsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<FollowingResponse>> {
        if (params.playlistId === null || params.playlistId === undefined) {
            throw new runtime.RequiredError('playlistId','Required parameter params.playlistId was null or undefined when calling getUsersFromPlaylistReposts.');
        }

        const queryParameters: any = {};

        if (params.offset !== undefined) {
            queryParameters['offset'] = params.offset;
        }

        if (params.limit !== undefined) {
            queryParameters['limit'] = params.limit;
        }

        if (params.userId !== undefined) {
            queryParameters['user_id'] = params.userId;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/playlists/{playlist_id}/reposts`.replace(`{${"playlist_id"}}`, encodeURIComponent(String(params.playlistId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => FollowingResponseFromJSON(jsonValue));
    }

    /**
     * Get users that reposted a playlist
     */
    async getUsersFromPlaylistReposts(params: GetUsersFromPlaylistRepostsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<FollowingResponse> {
        const response = await this.getUsersFromPlaylistRepostsRaw(params, initOverrides);
        return await response.value();
    }

}

/**
 * @export
 */
export const GetTrendingPlaylistsTimeEnum = {
    Week: 'week',
    Month: 'month',
    Year: 'year',
    AllTime: 'allTime'
} as const;
export type GetTrendingPlaylistsTimeEnum = typeof GetTrendingPlaylistsTimeEnum[keyof typeof GetTrendingPlaylistsTimeEnum];
/**
 * @export
 */
export const GetTrendingPlaylistsWithVersionTimeEnum = {
    Week: 'week',
    Month: 'month',
    Year: 'year',
    AllTime: 'allTime'
} as const;
export type GetTrendingPlaylistsWithVersionTimeEnum = typeof GetTrendingPlaylistsWithVersionTimeEnum[keyof typeof GetTrendingPlaylistsWithVersionTimeEnum];
