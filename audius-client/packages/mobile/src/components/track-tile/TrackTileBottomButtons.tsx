import { useCallback, useContext } from 'react'

import {
  FavoriteSource,
  RepostSource,
  ShareSource
} from 'audius-client/src/common/models/Analytics'
import { ID } from 'audius-client/src/common/models/Identifiers'
import {
  repostTrack,
  saveTrack,
  undoRepostTrack,
  unsaveTrack
} from 'audius-client/src/common/store/social/tracks/actions'
import {
  OverflowAction,
  OverflowSource
} from 'audius-client/src/common/store/ui/mobile-overflow-menu/types'
import { requestOpen as requestOpenShareModal } from 'audius-client/src/common/store/ui/share-modal/slice'
import { open as openOverflowMenu } from 'common/store/ui/mobile-overflow-menu/slice'
import { ImageStyle, Pressable, StyleSheet, View } from 'react-native'
import { useDispatch } from 'react-redux'

import IconKebabHorizontal from 'app/assets/images/iconKebabHorizontal.svg'
import IconShare from 'app/assets/images/iconShare.svg'
import FavoriteButton from 'app/components/favorite-button'
import RepostButton from 'app/components/repost-button'
import {
  ToastContext,
  SHARE_TOAST_TIMEOUT
} from 'app/components/toast/ToastContext'
import { useDispatchWeb } from 'app/hooks/useDispatchWeb'
import { useThemedStyles } from 'app/hooks/useThemedStyles'
import { flexRowCentered } from 'app/styles'
import { ThemeColors, useThemeColors } from 'app/utils/theme'

type Props = {
  disabled?: boolean
  hasReposted?: boolean
  hasSaved?: boolean
  isOwner?: boolean
  isShareHidden?: boolean
  isUnlisted?: boolean
  trackId?: ID
}

const messages = {
  copiedToast: 'Copied To Clipboard'
}

const createStyles = (themeColors: ThemeColors) =>
  StyleSheet.create({
    bottomButtons: {
      ...flexRowCentered(),
      justifyContent: 'space-between',
      marginVertical: 2,
      marginHorizontal: 12,
      height: 36,
      borderTopWidth: 1,
      borderTopColor: themeColors.neutralLight8
    },
    button: {
      marginHorizontal: 16
    },
    firstButton: {
      marginLeft: 0
    },
    leftButtons: {
      ...flexRowCentered()
    },
    lastButton: {
      marginRight: 0
    }
  })

export const TrackTileBottomButtons = ({
  disabled,
  hasReposted,
  hasSaved,
  isOwner,
  isShareHidden,
  isUnlisted,
  trackId
}: Props) => {
  const { toast } = useContext(ToastContext)
  const { neutralLight4 } = useThemeColors()
  const styles = useThemedStyles(createStyles)

  const dispatch = useDispatch()
  const dispatchWeb = useDispatchWeb()

  const onPressOverflow = useCallback(() => {
    if (trackId === undefined) {
      return
    }
    const overflowActions = [
      !isOwner
        ? hasReposted
          ? OverflowAction.UNREPOST
          : OverflowAction.REPOST
        : null,
      !isOwner
        ? hasSaved
          ? OverflowAction.UNFAVORITE
          : OverflowAction.FAVORITE
        : null,
      OverflowAction.SHARE,
      OverflowAction.ADD_TO_PLAYLIST,
      OverflowAction.VIEW_TRACK_PAGE,
      OverflowAction.VIEW_ARTIST_PAGE
    ].filter(Boolean) as OverflowAction[]

    dispatchWeb(
      openOverflowMenu({
        source: OverflowSource.TRACKS,
        id: trackId,
        overflowActions
      })
    )
  }, [trackId, dispatchWeb, hasReposted, hasSaved, isOwner])

  const onPressShare = useCallback(() => {
    if (trackId === undefined) {
      return
    }
    dispatch(
      requestOpenShareModal({
        type: 'track',
        trackId,
        source: ShareSource.TILE
      })
    )
  }, [dispatch, trackId])

  const onToggleSave = useCallback(() => {
    if (trackId === undefined) {
      return
    }
    if (hasSaved) {
      dispatchWeb(unsaveTrack(trackId, FavoriteSource.TILE))
    } else {
      dispatchWeb(saveTrack(trackId, FavoriteSource.TILE))
    }
  }, [trackId, dispatchWeb, hasSaved])

  const onToggleRepost = useCallback(() => {
    if (trackId === undefined) {
      return
    }
    if (hasReposted) {
      dispatchWeb(undoRepostTrack(trackId, RepostSource.TILE))
    } else {
      dispatchWeb(repostTrack(trackId, RepostSource.TILE))
    }
  }, [trackId, dispatchWeb, hasReposted])

  const repostButton = (
    <RepostButton
      onPress={onToggleRepost ?? (() => {})}
      isActive={hasReposted}
      isDisabled={disabled || isOwner}
      style={[styles.button, styles.firstButton] as ImageStyle}
    />
  )

  const favoriteButton = (
    <FavoriteButton
      onPress={onToggleSave ?? (() => {})}
      isActive={hasSaved}
      isDisabled={disabled || isOwner}
      style={styles.button as ImageStyle}
    />
  )

  const shareButton = (
    <Pressable
      disabled={disabled}
      onPress={() => {
        if (onPressShare) {
          toast({
            content: messages.copiedToast,
            timeout: SHARE_TOAST_TIMEOUT
          })
          onPressShare()
        }
      }}
    >
      <IconShare
        height={18}
        width={18}
        fill={neutralLight4}
        style={[styles.button, disabled ? { opacity: 0.5 } : {}]}
      />
    </Pressable>
  )

  const moreButton = (
    <Pressable onPress={onPressOverflow} disabled={disabled}>
      <IconKebabHorizontal
        height={22}
        width={22}
        fill={neutralLight4}
        style={[
          styles.button,
          styles.lastButton,
          disabled ? { opacity: 0.5 } : {}
        ]}
      />
    </Pressable>
  )

  return (
    <View style={styles.bottomButtons}>
      <View style={styles.leftButtons}>
        {!isUnlisted && (
          <>
            {repostButton}
            {favoriteButton}
            {!isShareHidden && shareButton}
          </>
        )}
      </View>
      {moreButton}
    </View>
  )
}
