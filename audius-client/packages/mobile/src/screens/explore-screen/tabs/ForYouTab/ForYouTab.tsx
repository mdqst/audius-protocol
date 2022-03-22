import { useRef } from 'react'

import { ScrollView, StyleSheet, View } from 'react-native'

import { useScrollToTop } from 'app/hooks/useScrollToTop'
import { useThemedStyles } from 'app/hooks/useThemedStyles'
import { ThemeColors } from 'app/utils/theme'

import {
  LET_THEM_DJ,
  TRENDING_PLAYLISTS,
  TRENDING_UNDERGROUND,
  TOP_ALBUMS
} from '../../collections'
import { ColorTile } from '../../components/ColorTile'
import { TabInfo } from '../../components/TabInfo'
import {
  HEAVY_ROTATION,
  BEST_NEW_RELEASES,
  UNDER_THE_RADAR,
  MOST_LOVED,
  REMIXABLES,
  FEELING_LUCKY
} from '../../smartCollections'

const messages = {
  infoHeader: 'Just For You',
  infoText:
    'Content curated for you based on your likes, reposts, and follows. Refreshes often so if you like a track, favorite it.'
}

const createStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    tabContainer: {
      flex: 1
    },
    contentContainer: {
      padding: 12,
      paddingVertical: 24
    },
    tile: {
      marginBottom: 8
    }
  })

const tiles = [
  TRENDING_PLAYLISTS,
  TRENDING_UNDERGROUND,
  HEAVY_ROTATION,
  LET_THEM_DJ,
  BEST_NEW_RELEASES,
  UNDER_THE_RADAR,
  TOP_ALBUMS,
  REMIXABLES,
  MOST_LOVED,
  FEELING_LUCKY
]

export const ForYouTab = () => {
  const styles = useThemedStyles(createStyles)

  const ref = useRef<ScrollView>(null)
  useScrollToTop(() => {
    ref.current?.scrollTo({
      y: 0,
      animated: true
    })
  })

  return (
    <ScrollView style={styles.tabContainer} ref={ref}>
      <TabInfo header={messages.infoHeader} text={messages.infoText} />
      <View style={styles.contentContainer}>
        {tiles.map(tile => (
          <ColorTile style={styles.tile} key={tile.title} {...tile} />
        ))}
      </View>
    </ScrollView>
  )
}
