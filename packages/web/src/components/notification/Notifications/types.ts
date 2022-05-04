import { Collection } from 'common/models/Collection'
import { Track } from 'common/models/Track'
import { User } from 'common/models/User'

export type TrackEntity = Track & { user: User }
type CollectionEntity = Collection & { user: User }

export type EntityType = TrackEntity | CollectionEntity
