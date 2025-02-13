import { useState, useMemo, useCallback, useEffect } from 'react'

import { useAppContext } from '@audius/common/context'
import type { SquareSizes, WidthSizes, CID } from '@audius/common/models'
import { interleave } from '@audius/common/utils'
import type { Nullable } from '@audius/common/utils'
import type { ImageSourcePropType, ImageURISource } from 'react-native'

export type ContentNodeImageSource = {
  source: ImageSourcePropType
  handleError: () => void
  isFallbackImage: boolean
}

export const isImageUriSource = (
  source: ImageSourcePropType
): source is ImageURISource => {
  return (source as ImageURISource)?.uri !== undefined
}

/**
 * Create an array of ImageSources for an endpoint and sizes
 */
const createImageSourcesForEndpoints = ({
  endpoints,
  createUri
}: {
  endpoints: string[]
  createUri: (endpoint: string) => string
}): ImageURISource[] =>
  endpoints.reduce((result, endpoint) => {
    const source = {
      uri: createUri(endpoint),
      // A CID is a unique identifier of a piece of content,
      // so we can always rely on a cached value
      // https://reactnative.dev/docs/images#cache-control-ios-only
      cache: 'force-cache' as const
    }

    return [...result, source]
  }, [])

/**
 * Create all the sources for an image.
 * Includes legacy endpoints and optionally lokj cal sources
 */
export const createAllImageSources = <T extends ImageSourcePropType>({
  cid,
  endpoints,
  size,
  localSource,
  cidMap = null
}: {
  cid: Nullable<CID>
  endpoints: string[]
  size: SquareSizes | WidthSizes
  localSource?: T
  cidMap?: Nullable<{ [key: string]: string }>
}) => {
  if (!cid || !endpoints) {
    if (localSource) return [localSource]
    return []
  }
  let cidForSize: Nullable<string> = null
  if (cidMap && cidMap[size]) {
    cidForSize = cidMap[size]
  }

  const newImageSources = createImageSourcesForEndpoints({
    endpoints,
    createUri: (endpoint) =>
      cidForSize
        ? `${endpoint}/content/${cidForSize}`
        : `${endpoint}/content/${cid}/${size}.jpg`
  })

  // These can be removed when all the data on Content Node has
  // been migrated to the new path
  const legacyImageSources = createImageSourcesForEndpoints({
    endpoints,
    createUri: (endpoint) => `${endpoint}${cid}`
  })

  const sourceList = [
    ...(localSource ? [localSource] : []),
    // Alternate between new and legacy paths, so the legacy path is tried for each
    // content node
    ...interleave(newImageSources, legacyImageSources)
  ]
  return sourceList
}

/**
 * Return the first image source, usually the best content node
 * or a local source. This is useful for cases where there is no error
 * callback if the image fails to load - like the MusicControls on the lockscreen
 */
export const getImageSourceOptimistic = <
  T extends ImageSourcePropType = ImageURISource
>(
  options: Parameters<typeof createAllImageSources<T>>[0]
) => {
  const allImageSources = createAllImageSources(options)
  return allImageSources[0]
}

type UseContentNodeImageOptions = {
  cid: Nullable<CID>
  // The size of the image to fetch
  size: SquareSizes | WidthSizes
  fallbackImageSource: ImageSourcePropType
  localSource?: ImageSourcePropType
  cidMap?: Nullable<{ [key: string]: string }>
}

/**
 * Load an image from best content node
 *
 * If the image fails to load, try the next best node
 *
 * Returns props for the DynamicImage component
 * @returns {
 *  source: ImageSource
 *  onError: () => void
 *  isFallbackImage: boolean
 * }
 */
export const useContentNodeImage = (
  options: UseContentNodeImageOptions
): ContentNodeImageSource => {
  const { cid, size, fallbackImageSource, localSource, cidMap } = options
  const [imageSourceIndex, setImageSourceIndex] = useState(0)
  const [failedToLoad, setFailedToLoad] = useState(false)
  const { storageNodeSelector } = useAppContext()

  const endpoints = useMemo(() => {
    if (!cid || !storageNodeSelector) return []
    return storageNodeSelector.getNodes(cid)
  }, [cid, storageNodeSelector])

  // Create an array of ImageSources
  // based on the content node endpoints
  const imageSources = useMemo(() => {
    return createAllImageSources({
      cid,
      endpoints,
      localSource,
      size,
      cidMap
    })
  }, [cid, endpoints, localSource, size, cidMap])

  const handleError = useCallback(() => {
    if (imageSourceIndex < imageSources.length - 1) {
      // Image failed to load from the current node
      setImageSourceIndex(imageSourceIndex + 1)
    } else {
      // Image failed to load from any node in replica set
      setFailedToLoad(true)
    }
  }, [imageSourceIndex, imageSources])

  useEffect(() => {
    // Any time a new image loads reset our failure states
    if (failedToLoad) {
      setFailedToLoad(false)
      setImageSourceIndex(0)
    }
  }, [cid, failedToLoad])

  // when localSource is a number, it's a placeholder image, so we should show fallback image
  const showFallbackImage =
    (!cid && (!localSource || typeof localSource === 'number')) || failedToLoad

  const source = useMemo(() => {
    if (showFallbackImage) {
      return fallbackImageSource
    }

    return imageSources[imageSourceIndex]
  }, [showFallbackImage, imageSources, imageSourceIndex, fallbackImageSource])

  const result = useMemo(
    () => ({
      source,
      handleError,
      isFallbackImage: showFallbackImage
    }),
    [source, handleError, showFallbackImage]
  )

  return result
}
