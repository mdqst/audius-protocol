import { mapValues, omit } from 'lodash'
import objectHash from 'object-hash'

import { Kind } from '~/models/Kind'
import { CommonState } from '~/store/reducers'

import * as cacheSelectors from '../store/cache/selectors'

import { EntityMap } from './types'
export function capitalize(str: string) {
  return str.replace(str[0], str[0].toUpperCase())
}

export const getKeyFromFetchArgs = (fetchArgs: any) => {
  if (fetchArgs === undefined) return 'default'
  // usePaginatedQuery includes fetchArgs that don't belong in the key
  const fetchArgsNoPagination = omit(fetchArgs, ['limit', 'offset'])
  return objectHash(fetchArgsNoPagination)
}

export const selectCommonEntityMap = (
  state: CommonState,
  kind?: Kind,
  shallow?: boolean
): EntityMap | null => {
  if (kind && shallow) {
    return {
      [kind]: mapValues(
        cacheSelectors.getCache(state, { kind }).entries,
        'metadata'
      )
    }
  }

  const entityMap: EntityMap = {
    [Kind.USERS]: cacheSelectors.getAllEntries(state, { kind: Kind.USERS })
  }
  if (kind === Kind.USERS) return entityMap
  entityMap[Kind.TRACKS] = cacheSelectors.getAllEntries(state, {
    kind: Kind.TRACKS
  })
  if (kind === Kind.TRACKS) return entityMap
  entityMap[Kind.COLLECTIONS] = cacheSelectors.getAllEntries(state, {
    kind: Kind.COLLECTIONS
  })
  return entityMap
}
