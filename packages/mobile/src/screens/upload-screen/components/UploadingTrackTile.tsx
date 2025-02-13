import { useMemo } from 'react'

import type { TrackForUpload } from '@audius/common/store'
import { View } from 'react-native'

import { IconImage } from '@audius/harmony-native'
import { DynamicImage, LinearProgress, Text, Tile } from 'app/components/core'
import { makeStyles } from 'app/styles'
import { spacing } from 'app/styles/spacing'
import { useThemeColors } from 'app/utils/theme'

const useStyles = makeStyles(({ spacing, palette }) => ({
  tile: {
    marginBottom: spacing(4)
  },
  tileContent: {
    padding: spacing(4)
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(4)
  },
  artwork: {
    height: spacing(12),
    width: spacing(12),
    marginRight: spacing(4)
  },
  image: {
    backgroundColor: palette.neutralLight6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: palette.neutralLight9,
    overflow: 'hidden'
  },
  title: {
    flex: 1,
    width: 1
  }
}))

type UploadingTrackTileProps = {
  track: TrackForUpload
  uploadProgress: number
}
export const UploadingTrackTile = (props: UploadingTrackTileProps) => {
  const { track, uploadProgress } = props
  const { title, artwork } = track.metadata
  const styles = useStyles()
  const { neutralLight8 } = useThemeColors()

  const source = useMemo(
    () => ({ uri: artwork && 'url' in artwork ? artwork?.url : undefined }),
    [artwork]
  )

  return (
    <Tile styles={{ root: styles.tile, content: styles.tileContent }}>
      <View style={styles.content}>
        <DynamicImage
          source={source}
          styles={{ root: styles.artwork, imageContainer: styles.image }}
          noSkeleton
        >
          {artwork && 'url' in artwork && artwork?.url ? null : (
            <IconImage
              fill={neutralLight8}
              height={spacing(8)}
              width={spacing(8)}
            />
          )}
        </DynamicImage>
        <Text weight='demiBold' style={styles.title}>
          {title}
        </Text>
      </View>
      <LinearProgress value={uploadProgress} />
    </Tile>
  )
}
