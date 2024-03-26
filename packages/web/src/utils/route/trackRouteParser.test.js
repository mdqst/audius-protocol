import { describe, it, expect, vitest } from 'vitest'

import { parseTrackRoute } from './trackRouteParser'


import { decodeHashId as mockDecode } from '@audius/common/utils'


vitest.mock('@audius/common/utils', () => {
  return { decodeHashId: vitest.fn() }
})

describe('parseTrackRoute', () => {
  it('can parse a handle/slug route', () => {
    const route = '/tartine/morning-buns-25'
    const { slug, trackId, handle } = parseTrackRoute(route)
    expect(slug).toEqual('morning-buns-25')
    expect(trackId).toEqual(null)
    expect(handle).toEqual('tartine')
  })

  it('can decode a hashed track id route', () => {
    mockDecode.mockReturnValue(11845)

    const route = '/tracks/eP9k7'
    const { slug, trackId, handle } = parseTrackRoute(route)
    expect(slug).toEqual(null)
    expect(trackId).toEqual(11845)
    expect(handle).toEqual(null)
  })
})
