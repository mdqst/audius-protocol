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
import type { ReplyComment } from './ReplyComment';
import {
    ReplyCommentFromJSON,
    ReplyCommentFromJSONTyped,
    ReplyCommentToJSON,
} from './ReplyComment';

/**
 * 
 * @export
 * @interface Comment
 */
export interface Comment {
    /**
     * 
     * @type {string}
     * @memberof Comment
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Comment
     */
    userId: string;
    /**
     * 
     * @type {string}
     * @memberof Comment
     */
    message: string;
    /**
     * 
     * @type {number}
     * @memberof Comment
     */
    trackTimestampS?: number;
    /**
     * 
     * @type {number}
     * @memberof Comment
     */
    reactCount: number;
    /**
     * 
     * @type {number}
     * @memberof Comment
     */
    replyCount: number;
    /**
     * 
     * @type {boolean}
     * @memberof Comment
     */
    isPinned: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Comment
     */
    isEdited: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Comment
     */
    isCurrentUserReacted?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Comment
     */
    isArtistReacted?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Comment
     */
    isTombstone?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Comment
     */
    isMuted?: boolean;
    /**
     * 
     * @type {string}
     * @memberof Comment
     */
    createdAt: string;
    /**
     * 
     * @type {string}
     * @memberof Comment
     */
    updatedAt?: string;
    /**
     * 
     * @type {Array<ReplyComment>}
     * @memberof Comment
     */
    replies?: Array<ReplyComment>;
}

/**
 * Check if a given object implements the Comment interface.
 */
export function instanceOfComment(value: object): value is Comment {
    let isInstance = true;
    isInstance = isInstance && "id" in value && value["id"] !== undefined;
    isInstance = isInstance && "userId" in value && value["userId"] !== undefined;
    isInstance = isInstance && "message" in value && value["message"] !== undefined;
    isInstance = isInstance && "reactCount" in value && value["reactCount"] !== undefined;
    isInstance = isInstance && "replyCount" in value && value["replyCount"] !== undefined;
    isInstance = isInstance && "isPinned" in value && value["isPinned"] !== undefined;
    isInstance = isInstance && "isEdited" in value && value["isEdited"] !== undefined;
    isInstance = isInstance && "createdAt" in value && value["createdAt"] !== undefined;

    return isInstance;
}

export function CommentFromJSON(json: any): Comment {
    return CommentFromJSONTyped(json, false);
}

export function CommentFromJSONTyped(json: any, ignoreDiscriminator: boolean): Comment {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'userId': json['user_id'],
        'message': json['message'],
        'trackTimestampS': !exists(json, 'track_timestamp_s') ? undefined : json['track_timestamp_s'],
        'reactCount': json['react_count'],
        'replyCount': json['reply_count'],
        'isPinned': json['is_pinned'],
        'isEdited': json['is_edited'],
        'isCurrentUserReacted': !exists(json, 'is_current_user_reacted') ? undefined : json['is_current_user_reacted'],
        'isArtistReacted': !exists(json, 'is_artist_reacted') ? undefined : json['is_artist_reacted'],
        'isTombstone': !exists(json, 'is_tombstone') ? undefined : json['is_tombstone'],
        'isMuted': !exists(json, 'is_muted') ? undefined : json['is_muted'],
        'createdAt': json['created_at'],
        'updatedAt': !exists(json, 'updated_at') ? undefined : json['updated_at'],
        'replies': !exists(json, 'replies') ? undefined : ((json['replies'] as Array<any>).map(ReplyCommentFromJSON)),
    };
}

export function CommentToJSON(value?: Comment | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'user_id': value.userId,
        'message': value.message,
        'track_timestamp_s': value.trackTimestampS,
        'react_count': value.reactCount,
        'reply_count': value.replyCount,
        'is_pinned': value.isPinned,
        'is_edited': value.isEdited,
        'is_current_user_reacted': value.isCurrentUserReacted,
        'is_artist_reacted': value.isArtistReacted,
        'is_tombstone': value.isTombstone,
        'is_muted': value.isMuted,
        'created_at': value.createdAt,
        'updated_at': value.updatedAt,
        'replies': value.replies === undefined ? undefined : ((value.replies as Array<any>).map(ReplyCommentToJSON)),
    };
}

