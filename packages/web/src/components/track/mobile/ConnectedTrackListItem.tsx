import { memo, useCallback } from 'react'

import {
  RepostSource,
  FavoriteSource,
  ID,
  isContentUSDCPurchaseGated,
  ModalSource
} from '@audius/common/models'
import { FeatureFlags } from '@audius/common/services'
import {
  accountSelectors,
  cacheUsersSelectors,
  tracksSocialActions,
  gatedContentActions,
  mobileOverflowMenuUIActions,
  OverflowAction,
  OverflowSource,
  PurchaseableContentType,
  gatedContentSelectors,
  usePremiumContentPurchaseModal
} from '@audius/common/store'
import { push as pushRoute } from 'connected-react-router'
import { connect, useDispatch } from 'react-redux'
import { Dispatch } from 'redux'

import { useModalState } from 'common/hooks/useModalState'
import { useAuthenticatedClickCallback } from 'hooks/useAuthenticatedCallback'
import { useFlag } from 'hooks/useRemoteConfig'
import { AppState } from 'store/types'
import { trpc } from 'utils/trpcClientWeb'

import TrackListItem, { TrackListItemProps } from './TrackListItem'
const { setLockedContentId } = gatedContentActions

const { getGatedContentStatusMap } = gatedContentSelectors

const { open } = mobileOverflowMenuUIActions
const { getUserFromTrack } = cacheUsersSelectors
const { saveTrack, unsaveTrack, repostTrack, undoRepostTrack } =
  tracksSocialActions
const getUserId = accountSelectors.getUserId

type OwnProps = Omit<TrackListItemProps, 'userId'>
type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = ReturnType<typeof mapDispatchToProps>

type ConnectedTrackListItemProps = OwnProps & StateProps & DispatchProps

const ConnectedTrackListItem = (props: ConnectedTrackListItemProps) => {
  const {
    clickOverflow,
    currentUserId,
    ddexApp,
    hasStreamAccess,
    isLocked,
    isReposted,
    isSaved,
    isStreamGated,
    streamConditions,
    trackId,
    user
  } = props
  const { isEnabled: isEditAlbumsEnabled } = useFlag(FeatureFlags.EDIT_ALBUMS)
  const { data: albumInfo } = trpc.tracks.getAlbumBacklink.useQuery(
    { trackId },
    { enabled: !!trackId }
  )
  const dispatch = useDispatch()
  const { onOpen: openPremiumContentPurchaseModal } =
    usePremiumContentPurchaseModal()
  const [, setLockedContentVisibility] = useModalState('LockedContent')
  const openLockedContentModal = useCallback(() => {
    dispatch(setLockedContentId({ id: trackId }))
    setLockedContentVisibility(true)
  }, [dispatch, trackId, setLockedContentVisibility])

  const onClickOverflow = () => {
    const overflowActions = [
      isLocked
        ? null
        : isReposted
        ? OverflowAction.UNREPOST
        : OverflowAction.REPOST,
      isLocked
        ? null
        : isSaved
        ? OverflowAction.UNFAVORITE
        : OverflowAction.FAVORITE,
      isEditAlbumsEnabled && user?.user_id === currentUserId && !ddexApp
        ? OverflowAction.ADD_TO_ALBUM
        : null,
      !isStreamGated ? OverflowAction.ADD_TO_PLAYLIST : null,
      OverflowAction.VIEW_TRACK_PAGE,
      isEditAlbumsEnabled && albumInfo ? OverflowAction.VIEW_ALBUM_PAGE : null,
      OverflowAction.VIEW_ARTIST_PAGE
    ].filter(Boolean) as OverflowAction[]
    clickOverflow(trackId, overflowActions)
  }

  const isPurchase = isContentUSDCPurchaseGated(streamConditions)
  const onClickGatedUnlockPill = useAuthenticatedClickCallback(() => {
    if (isPurchase && trackId) {
      openPremiumContentPurchaseModal(
        {
          contentId: trackId,
          contentType: PurchaseableContentType.TRACK
        },
        { source: ModalSource.TrackTile }
      )
    } else if (trackId && !hasStreamAccess) {
      openLockedContentModal()
    }
  }, [
    isPurchase,
    trackId,
    openPremiumContentPurchaseModal,
    hasStreamAccess,
    openLockedContentModal
  ])

  return (
    <TrackListItem
      {...props}
      userId={user?.user_id ?? 0}
      onClickOverflow={onClickOverflow}
      onClickGatedUnlockPill={onClickGatedUnlockPill}
    />
  )
}

function mapStateToProps(state: AppState, ownProps: OwnProps) {
  const id = ownProps.trackId
  return {
    user: getUserFromTrack(state, { id: ownProps.trackId }),
    currentUserId: getUserId(state),
    gatedContentStatus: id ? getGatedContentStatusMap(state)[id] : undefined
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    goToRoute: (route: string) => dispatch(pushRoute(route)),
    saveTrack: (trackId: ID) =>
      dispatch(saveTrack(trackId, FavoriteSource.TRACK_LIST)),
    unsaveTrack: (trackId: ID) =>
      dispatch(unsaveTrack(trackId, FavoriteSource.TRACK_LIST)),
    repostTrack: (trackId: ID) =>
      dispatch(repostTrack(trackId, RepostSource.TRACK_LIST)),
    unrepostTrack: (trackId: ID) =>
      dispatch(undoRepostTrack(trackId, RepostSource.TRACK_LIST)),
    clickOverflow: (trackId: ID, overflowActions: OverflowAction[]) =>
      dispatch(
        open({ source: OverflowSource.TRACKS, id: trackId, overflowActions })
      )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(ConnectedTrackListItem))
