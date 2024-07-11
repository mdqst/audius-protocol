import { createApi } from '~/audius-query'
import { ID, Kind } from '~/models'
import { Nullable } from '~/utils'

const collectionApi = createApi({
  reducerPath: 'collectionApi',
  endpoints: {
    getPlaylistById: {
      fetch: async (
        {
          playlistId,
          currentUserId
        }: { playlistId: Nullable<ID>; currentUserId?: Nullable<ID> },
        { apiClient }
      ) => {
        if (!playlistId) return null
        return (
          await apiClient.getPlaylist({
            playlistId,
            currentUserId: currentUserId ?? null
          })
        )[0]
      },
      fetchBatch: async (
        { ids, currentUserId }: { ids: ID[]; currentUserId?: Nullable<ID> },
        { apiClient }
      ) => {
        return await apiClient.getPlaylists({
          playlistIds: ids,
          currentUserId: currentUserId ?? null
        })
      },
      options: {
        idArgKey: 'playlistId',
        kind: Kind.COLLECTIONS,
        schemaKey: 'collection'
      }
    },
    // Note: Please do not use this endpoint yet as it depends on further changes on the DN side.
    getPlaylistByPermalink: {
      fetch: async (
        {
          permalink,
          currentUserId
        }: { permalink: string; currentUserId: Nullable<ID> },
        { apiClient }
      ) => {
        const a = (
          await apiClient.getPlaylistByPermalink({
            permalink,
            currentUserId
          })
        )[0]
        // console.log('REED in audius-query hook', { a })
        return a
      },
      options: {
        permalinkArgKey: 'permalink',
        kind: Kind.COLLECTIONS,
        schemaKey: 'collection'
      }
    }
  }
})

export const { useGetPlaylistByPermalink, useGetPlaylistById } =
  collectionApi.hooks
export const collectionApiReducer = collectionApi.reducer
