import { memo } from 'react'

import { SquareSizes, ID } from '@audius/common/models'
import {
  IconLock,
  IconPlaybackPlay as IconPlay,
  IconPlaybackPause as IconPause
} from '@audius/harmony'
import cn from 'classnames'

import CoSign from 'components/co-sign/CoSign'
import { Size } from 'components/co-sign/types'
import DynamicImage from 'components/dynamic-image/DynamicImage'
import LoadingSpinner from 'components/loading-spinner/LoadingSpinner'
import { useCollectionCoverArt } from 'hooks/useCollectionCoverArt'
import { useTrackCoverArt } from 'hooks/useTrackCoverArt'

import styles from './Artwork.module.css'

type TileArtworkProps = {
  id: ID
  size: any
  isBuffering: boolean
  isPlaying: boolean
  showArtworkIcon: boolean
  showSkeleton: boolean
  artworkIconClassName?: string
  coSign?: {
    has_remix_author_saved: boolean
    has_remix_author_reposted: boolean
    user: { name: string; is_verified: boolean; user_id: ID }
  }
  hasStreamAccess?: boolean
}

export const ArtworkIcon = ({
  isBuffering,
  isPlaying,
  artworkIconClassName,
  hasStreamAccess,
  isTrack
}: {
  isBuffering: boolean
  isPlaying: boolean
  artworkIconClassName?: string
  hasStreamAccess?: boolean
  isTrack?: boolean
}) => {
  let artworkIcon
  if (isTrack && !hasStreamAccess) {
    artworkIcon = <IconLock width={36} height={36} />
  } else if (isBuffering) {
    artworkIcon = <LoadingSpinner className={styles.spinner} />
  } else if (isPlaying) {
    artworkIcon = <IconPause />
  } else {
    artworkIcon = <IconPlay />
  }
  return (
    <div
      className={cn(styles.artworkIcon, {
        [artworkIconClassName!]: !!artworkIconClassName
      })}
    >
      {artworkIcon}
    </div>
  )
}

type ArtworkProps = TileArtworkProps & {
  image: any
  label?: string
  isTrack?: boolean
}

const Artwork = memo(
  ({
    size,
    showSkeleton,
    showArtworkIcon,
    artworkIconClassName,
    isBuffering,
    isPlaying,
    image,
    coSign,
    label,
    hasStreamAccess,
    isTrack
  }: ArtworkProps) => {
    const imageElement = (
      <DynamicImage
        wrapperClassName={cn(styles.artworkWrapper, {
          [styles.artworkInset]: !coSign,
          [styles.small]: size === 'small',
          [styles.large]: size === 'large'
        })}
        className={styles.artwork}
        image={showSkeleton ? '' : image}
        aria-label={label}
      >
        {showArtworkIcon && (
          <ArtworkIcon
            isBuffering={isBuffering}
            isPlaying={isPlaying}
            artworkIconClassName={artworkIconClassName}
            hasStreamAccess={hasStreamAccess}
            isTrack={isTrack}
          />
        )}
      </DynamicImage>
    )
    return coSign ? (
      <CoSign
        size={Size.MEDIUM}
        hasFavorited={coSign.has_remix_author_saved}
        hasReposted={coSign.has_remix_author_reposted}
        coSignName={coSign.user.name}
        userId={coSign.user?.user_id ?? 0}
        className={cn(styles.artworkInset, {
          [styles.small]: size === 'small',
          [styles.large]: size === 'large'
        })}
      >
        {imageElement}
      </CoSign>
    ) : (
      imageElement
    )
  }
)

export const TrackArtwork = memo((props: TileArtworkProps) => {
  const image = useTrackCoverArt({
    trackId: props.id,
    size: SquareSizes.SIZE_150_BY_150
  })

  return <Artwork {...props} image={image} isTrack />
})

export const CollectionArtwork = memo((props: TileArtworkProps) => {
  const image = useCollectionCoverArt({
    collectionId: props.id,
    size: SquareSizes.SIZE_150_BY_150
  })

  return <Artwork {...props} image={image} />
})
