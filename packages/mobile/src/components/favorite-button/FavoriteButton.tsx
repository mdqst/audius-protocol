import React from 'react'

import { StyleSheet } from 'react-native'

import IconFavoriteOffDark from 'app/assets/animations/iconFavoriteTrackTileOffDark.json'
import IconFavoriteOffLight from 'app/assets/animations/iconFavoriteTrackTileOffLight.json'
import IconFavoriteOnDark from 'app/assets/animations/iconFavoriteTrackTileOnDark.json'
import IconFavoriteOnLight from 'app/assets/animations/iconFavoriteTrackTileOnLight.json'
import AnimatedButtonProvider, {
  AnimatedButtonProviderProps
} from 'app/components/animated-button/AnimatedButtonProvider'
import { Theme, useThemeVariant } from 'app/utils/theme'

const styles = StyleSheet.create({
  icon: {
    height: 22,
    width: 22
  }
})

type FavoriteButtonProps = Omit<
  AnimatedButtonProviderProps,
  'iconLightJSON' | 'iconDarkJSON' | 'isDarkMode'
>

const FavoriteButton = (props: FavoriteButtonProps) => {
  const themeVariant = useThemeVariant()
  const isDarkMode = themeVariant === Theme.DARK

  return (
    <AnimatedButtonProvider
      {...props}
      isDarkMode={isDarkMode}
      iconLightJSON={[IconFavoriteOnLight, IconFavoriteOffLight]}
      iconDarkJSON={[IconFavoriteOnDark, IconFavoriteOffDark]}
      wrapperStyle={[styles.icon, props.wrapperStyle]}
    />
  )
}

export default FavoriteButton
