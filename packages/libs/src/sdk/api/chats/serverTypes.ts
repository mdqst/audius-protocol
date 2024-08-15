// NOTE: No imports allowed - quicktype is not yet able to track imports!

export type ValidateCanChatRPC = {
  method: 'user.validate_can_chat'
  params: {
    receiver_user_ids: string[]
  }
}

export type ChatBlastRPC = {
  method: 'chat.blast'
  params: {
    blast_id: string
    audience_track_id?: string // if targeting customers / remixers of a specific track
    audience: ChatBlastAudience
    message: string
  }
}

export type ChatCreateRPC = {
  method: 'chat.create'
  params: {
    chat_id: string
    invites: Array<{
      user_id: string
      invite_code: string
    }>
  }
}

export type ChatDeleteRPC = {
  method: 'chat.delete'
  params: {
    chat_id: string
  }
}

export type ChatInviteRPC = {
  method: 'chat.invite'
  params: {
    chat_id: string
    invites: Array<{
      user_id: string
      invite_code: string
    }>
  }
}

export type ChatMessageRPC = {
  method: 'chat.message'
  params: {
    chat_id: string
    message_id: string
    message: string
    parent_message_id?: string
  }
}

export type ChatReactRPC = {
  method: 'chat.react'
  params: {
    chat_id: string
    message_id: string
    reaction: string | null
  }
}

export type ChatReadRPC = {
  method: 'chat.read'
  params: {
    chat_id: string
  }
}

export type ChatBlockRPC = {
  method: 'chat.block'
  params: {
    user_id: string
  }
}

export type ChatUnblockRPC = {
  method: 'chat.unblock'
  params: {
    user_id: string
  }
}

export type ChatPermitRPC = {
  method: 'chat.permit'
  params: {
    permit: ChatPermission
  }
}

export type RPCPayloadRequest =
  | ChatBlastRPC
  | ChatCreateRPC
  | ChatDeleteRPC
  | ChatInviteRPC
  | ChatMessageRPC
  | ChatReactRPC
  | ChatReadRPC
  | ChatBlockRPC
  | ChatUnblockRPC
  | ChatPermitRPC
  | ChatBlastRPC
  | ValidateCanChatRPC

export type RPCPayload = RPCPayloadRequest & {
  current_user_id: string
  timestamp: number
}

export type RPCMethod = RPCPayload['method']

export type UserChat = {
  // User agnostic
  chat_id: string
  last_message: string
  last_message_at: string
  last_message_is_plaintext: boolean
  chat_members: Array<{ user_id: string }>
  recheck_permissions: boolean

  // User specific
  invite_code: string
  unread_message_count: number
  last_read_at: string
  cleared_history_at: string

  // User chats are not blasts
  is_blast: false
}

export type ChatBlast = {
  chat_id: string
  audience: ChatBlastAudience
  content_id?: string
  content_type?: 'track' | 'album'
  is_blast: true
  last_message_at: string
}

export type ChatMessageReaction = {
  user_id: string
  created_at: string
  reaction: string
}

export type ChatMessageNullableReaction =
  | ChatMessageReaction
  | {
      user_id: string
      created_at: string
      reaction: null
    }

export type ChatMessage = {
  message_id: string
  sender_user_id: string
  created_at: string
  message: string
  is_plaintext: boolean
  reactions: ChatMessageReaction[]
}

export type ChatInvite = {
  user_id: string
  invite_code: string
}

export type ValidatedChatPermissions = {
  user_id: string
  permits: ChatPermission
  current_user_has_permission: boolean
}

/**
 * Defines who the user allows to message them
 */
export enum ChatPermission {
  /**
   * Messages are allowed for everyone
   */
  ALL = 'all',
  /**
   * Messages are only allowed for users that have tipped me
   */
  TIPPERS = 'tippers',
  /**
   * Messages are only allowed for users I follow
   */
  FOLLOWEES = 'followees',
  /**
   * Messages are not allowed
   */
  NONE = 'none'
}

export enum ChatBlastAudience {
  FOLLOWERS = 'follower_audience',
  TIPPERS = 'tipper_audience',
  REMIXERS = 'remixer_audience',
  CUSTOMERS = 'customer_audience'
}

export type CommsResponse = {
  health: {
    is_healthy: boolean
  }
  summary?: {
    prev_cursor: string
    prev_count: number
    next_cursor: string
    next_count: number
    total_count: number
  }
  // Overridden in client types but left as any for the server.
  // quicktype/golang doesn't do well with union types
  data: any
}

export type ChatWebsocketEventData = {
  rpc: RPCPayload
  metadata: {
    senderUserId: string
    receiverUserId: string
    timestamp: string
  }
}
