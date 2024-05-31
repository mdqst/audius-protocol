export const TrackTile = (props: LineupItemProps) => {
  const { uid } = props

  const track = useSelector((state) => getTrack(state, { uid }))

  const user = useSelector((state) => getUserFromTrack(state, { uid }))

  if (!track || !user) {
    console.warn('Track or user missing for TrackTile, preventing render')
    return null
  }

  if (track.is_delete || user?.is_deactivated) {
    return null
  }

  return <TrackTileComponent {...props} track={track} user={user} />
}

type TrackTileProps = LineupItemProps & {
  track: Track
  user: User
  TileProps?: Partial<TileProps>
}

export const TrackTileComponent = ({
  onPress,
  togglePlay,
  track,
  user,
  variant,
  ...lineupTileProps
}: TrackTileProps) => {
  const { isEnabled: isNewPodcastControlsEnabled } = useFeatureFlag(
    FeatureFlags.PODCAST_CONTROL_UPDATES_ENABLED,
    FeatureFlags.PODCAST_CONTROL_UPDATES_ENABLED_FALLBACK
  )
  const isUSDCEnabled = useIsUSDCEnabled()
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const isOnArtistsTracksTab = useNavigationState((state) => {
    // @ts-expect-error -- history returning unknown[]
    const currentScreen = state.history?.[0].key
    return currentScreen?.includes('Tracks')
  })
  const isPlayingUid = useSelector(
    (state: CommonState) => getUid(state) === lineupTileProps.uid
  )

  const currentUserId = useSelector(getUserId)
  const isOwner = currentUserId === track.owner_id

  const {
    duration,
    field_visibility,
    is_unlisted,
    has_current_user_reposted,
    has_current_user_saved,
    play_count,
    title,
    track_id,
    genre,
    stream_conditions: streamConditions,
    preview_cid,
    ddex_app: ddexApp
  } = track

  const hasPreview =
    isUSDCEnabled &&
    isContentUSDCPurchaseGated(streamConditions) &&
    !!preview_cid
  const isPlaylistAddable = useIsGatedContentPlaylistAddable(track)

  const renderImage = useCallback(
    (props: ImageProps) => (
      <TrackImage track={track} size={SquareSizes.SIZE_150_BY_150} {...props} />
    ),
    [track]
  )

  const { data: albumInfo } = trpc.tracks.getAlbumBacklink.useQuery(
    { trackId: track_id },
    { enabled: !!track_id }
  )

  const handlePress = useCallback(() => {
    togglePlay({
      uid: lineupTileProps.uid,
      id: track_id,
      source: PlaybackSource.TRACK_TILE
    })
    onPress?.(track_id)
  }, [togglePlay, lineupTileProps.uid, track_id, onPress])

  const handlePressTitle = useCallback(() => {
    navigation.push('Track', { id: track_id })
    onPress?.(track_id)
  }, [navigation, onPress, track_id])

  const playbackPositionInfo = useSelector((state) =>
    getTrackPosition(state, { trackId: track_id, userId: currentUserId })
  )
  const handlePressOverflow = useCallback(() => {
    if (track_id === undefined) {
      return
    }
    const isLongFormContent =
      genre === Genre.PODCASTS || genre === Genre.AUDIOBOOKS

    const overflowActions = [
      isOwner && !ddexApp ? OverflowAction.ADD_TO_ALBUM : null,
      isPlaylistAddable ? OverflowAction.ADD_TO_PLAYLIST : null,
      isNewPodcastControlsEnabled && isLongFormContent
        ? OverflowAction.VIEW_EPISODE_PAGE
        : OverflowAction.VIEW_TRACK_PAGE,
      albumInfo ? OverflowAction.VIEW_ALBUM_PAGE : null,
      isNewPodcastControlsEnabled && isLongFormContent
        ? playbackPositionInfo?.status === 'COMPLETED'
          ? OverflowAction.MARK_AS_UNPLAYED
          : OverflowAction.MARK_AS_PLAYED
        : null,
      isOnArtistsTracksTab ? null : OverflowAction.VIEW_ARTIST_PAGE,
      isOwner && !ddexApp ? OverflowAction.EDIT_TRACK : null,
      isOwner && track?.is_scheduled_release && track?.is_unlisted
        ? OverflowAction.RELEASE_NOW
        : null,
      isOwner && !ddexApp ? OverflowAction.DELETE_TRACK : null
    ].filter(removeNullable)

    dispatch(
      openOverflowMenu({
        source: OverflowSource.TRACKS,
        id: track_id,
        overflowActions
      })
    )
  }, [
    track_id,
    genre,
    isOwner,
    ddexApp,
    isPlaylistAddable,
    isNewPodcastControlsEnabled,
    albumInfo,
    playbackPositionInfo?.status,
    isOnArtistsTracksTab,
    track?.is_scheduled_release,
    track?.is_unlisted,
    dispatch
  ])

  const handlePressShare = useCallback(() => {
    if (track_id === undefined) {
      return
    }
    dispatch(
      requestOpenShareModal({
        type: 'track',
        trackId: track_id,
        source: ShareSource.TILE
      })
    )
  }, [dispatch, track_id])

  const handlePressSave = useCallback(() => {
    if (track_id === undefined) {
      return
    }
    if (has_current_user_saved) {
      dispatch(unsaveTrack(track_id, FavoriteSource.TILE))
    } else {
      dispatch(saveTrack(track_id, FavoriteSource.TILE))
    }
  }, [track_id, dispatch, has_current_user_saved])

  const handlePressRepost = useCallback(() => {
    if (track_id === undefined) {
      return
    }
    if (has_current_user_reposted) {
      dispatch(undoRepostTrack(track_id, RepostSource.TILE))
    } else {
      dispatch(repostTrack(track_id, RepostSource.TILE))
    }
  }, [track_id, dispatch, has_current_user_reposted])

  const hideShare = !isOwner && field_visibility?.share === false
  const hidePlays = !isOwner && field_visibility?.play_count === false

  return (
    <LineupTile
      {...lineupTileProps}
      duration={duration}
      isPlayingUid={isPlayingUid}
      favoriteType={FavoriteType.TRACK}
      repostType={RepostType.TRACK}
      hasPreview={hasPreview}
      hideShare={hideShare}
      hidePlays={hidePlays}
      id={track_id}
      renderImage={renderImage}
      isUnlisted={is_unlisted}
      onPress={handlePress}
      onPressOverflow={handlePressOverflow}
      onPressRepost={handlePressRepost}
      onPressSave={handlePressSave}
      onPressShare={handlePressShare}
      onPressTitle={handlePressTitle}
      playCount={play_count}
      title={title}
      item={track}
      user={user}
      variant={variant}
    />
  )
}
