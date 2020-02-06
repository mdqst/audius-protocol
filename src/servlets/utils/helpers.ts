import { USER_NODE_IPFS_GATEWAY, DEFAULT_IMAGE_URL } from './constants'
import libs from '../../libs'

export const getTrack = async (id: number): Promise<any> => {
  const t = await libs.Track.getTracks(1, 0, [id])
  if (t && t[0]) return t[0]
  throw new Error(`Failed to get track ${id}`)
}

export const getCollection = async (id: number): Promise<any> => {
  const c = await libs.Playlist.getPlaylists(1, 0, [id])
  if (c && c[0]) return c[0]
  throw new Error(`Failed to get collection ${id}`)
}

export const getUser = async (id: number): Promise<any> => {
  const u = await libs.User.getUsers(1, 0, [id])
  if (u && u[0]) return u[0]
  throw new Error(`Failed to get user ${id}`)
}

export const getUserByHandle = async (handle: string): Promise<any> => {
  const u = await libs.User.getUsers(1, 0, null, null, handle)
  if (u && u[0]) return u[0]
  throw new Error(`Failed to get user ${handle}`)
}

export const formatGateway = (creatorNodeEndpoint: string, userId: number): string =>
  creatorNodeEndpoint
    ? `${creatorNodeEndpoint.split(',')[0]}/ipfs/`
    : USER_NODE_IPFS_GATEWAY

export const getImageUrl = (cid: string, gateway: string | null): string => {
  if (!cid) return DEFAULT_IMAGE_URL
  return `${gateway}${cid}`
}

