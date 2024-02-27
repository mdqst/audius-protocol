export type Maybe<T> = T | undefined
export type Nullable<T> = T | null

export interface Logger {
  /**
   * Write a 'info' level log.
   */
  info: (message: any, ...optionalParams: any[]) => any

  /**
   * Write an 'error' level log.
   */
  error: (message: any, ...optionalParams: any[]) => any

  /**
   * Write a 'warn' level log.
   */
  warn: (message: any, ...optionalParams: any[]) => any

  /**
   * Write a 'debug' level log.
   */
  debug?: (message: any, ...optionalParams: any[]) => any
}

type CID = string
type ID = number
type UID = string

export type UserMetadata = {
  user_id: number
  album_count: number
  artist_pick_track_id: Nullable<number>
  bio: string | null
  cover_photo: Nullable<CID>
  creator_node_endpoint: string
  current_user_followee_follow_count: number
  does_current_user_follow: boolean
  does_current_user_subscribe: boolean
  followee_count: number
  follower_count: number
  supporter_count: number
  supporting_count: number
  handle: string
  handle_lc: string
  is_deactivated: boolean
  is_verified: boolean
  is_storage_v2: boolean
  location: Nullable<string>
  // this should be removed
  is_creator: boolean
  name: string
  playlist_count: number
  profile_picture: Nullable<CID>
  repost_count: number
  track_count: number
  cover_photo_sizes: Nullable<CID>
  profile_picture_sizes: Nullable<CID>
  metadata_multihash: Nullable<CID>
  has_collectibles: boolean
  collectiblesOrderUnset?: boolean
  primary_id: number
  secondary_ids: number[]

  // Only present on the "current" account
  track_save_count?: number
  twitter_handle?: string
  instagram_handle?: string
  tiktok_handle?: string
  website?: string
  wallet?: string
  donation?: string
  twitterVerified?: boolean
  instagramVerified?: boolean
  tikTokVerified?: boolean
}

export type User = UserMetadata

export interface TrackSegment {
  duration: string
  multihash: CID
}
export interface Download {
  is_downloadable: Nullable<boolean>
  requires_follow: Nullable<boolean>
  cid: Nullable<string>
}

export type TokenStandard = 'ERC721' | 'ERC1155'

export type EthCollectibleGatedConditions = {
  chain: 'eth'
  standard: TokenStandard
  address: string
  name: string
  slug: string
  imageUrl: Nullable<string>
  externalLink: Nullable<string>
}

export type SolCollectibleGatedConditions = {
  chain: 'sol'
  address: string
  name: string
  imageUrl: Nullable<string>
  externalLink: Nullable<string>
}

type USDCPurchaseConditions = {
  usdc_purchase?: {
    price: number
    splits: Record<ID, number>
  }
}

export type GatedConditions = {
  nft_collection?: EthCollectibleGatedConditions | SolCollectibleGatedConditions
  follow_user_id?: number
  tip_user_id?: number
} & USDCPurchaseConditions

export type TrackMetadata = {
  blocknumber: number
  activity_timestamp?: string
  is_delete: boolean
  track_id: number
  track_cid: string
  preview_cid: Nullable<CID>
  orig_file_cid: CID
  orig_filename: string
  is_downloadable: boolean
  is_original_available: boolean
  created_at: string
  isrc: Nullable<string>
  iswc: Nullable<string>
  credits_splits: Nullable<string>
  description: Nullable<string>
  download: Nullable<Download>
  genre: string
  has_current_user_reposted: boolean
  has_current_user_saved: boolean
  license: Nullable<string>
  mood: Nullable<string>
  play_count: number
  owner_id: ID
  release_date: Nullable<string>
  repost_count: number
  save_count: number
  tags: Nullable<string>
  title: string
  track_segments: TrackSegment[]
  cover_art: Nullable<CID>
  cover_art_sizes: Nullable<CID>
  is_unlisted: boolean
  is_available: boolean
  is_stream_gated: boolean
  stream_conditions: Nullable<GatedConditions>
  is_download_gated: boolean
  download_conditions: Nullable<GatedConditions>
  listenCount?: number
  permalink: string
  audio_upload_id: Nullable<string>
  preview_start_seconds: Nullable<number>
  placement_hosts: Nullable<string>

  // Optional Fields
  is_invalid?: boolean
  stem_of?: {
    parent_track_id: ID
  }

  // Added fields
  dateListened?: string
  duration: number

  is_playlist_upload?: boolean
  ai_attribution_user_id?: ID
}

export type CollectionMetadata = {
  blocknumber: number
  description: Nullable<string>
  has_current_user_reposted: boolean
  has_current_user_saved: boolean
  is_album: boolean
  is_delete: boolean
  is_private: boolean
  playlist_contents: {
    track_ids: Array<{
      metadata_time: number
      time: number
      track: ID
      uid?: UID
    }>
  }
  tracks?: TrackMetadata[]
  track_count: number
  playlist_id: ID
  cover_art: CID | null
  cover_art_sizes: Nullable<CID>
  playlist_name: string
  playlist_owner_id: ID
  repost_count: number
  save_count: number
  upc?: string | null
  updated_at: string
  activity_timestamp?: string
  is_image_autogenerated?: boolean
}
