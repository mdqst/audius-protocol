import { MouseEventHandler, useCallback, useMemo } from 'react'

import {
  useGetPlaylistById,
  useGetTrackById,
  useGetUserById
} from '@audius/common/api'
import { recentSearchMessages as messages } from '@audius/common/messages'
import { Kind, SquareSizes, Status } from '@audius/common/models'
import {
  SearchItem,
  isSearchItem,
  searchActions,
  searchSelectors
} from '@audius/common/store'
import { route } from '@audius/common/utils'
import {
  Artwork,
  Button,
  Flex,
  IconButton,
  IconCloseAlt,
  Paper,
  Skeleton,
  Text,
  useTheme
} from '@audius/harmony'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useRouteMatch } from 'react-router-dom'

import { Avatar } from 'components/avatar'
import { UserLink } from 'components/link'
import { MountPlacement } from 'components/types'
import { useCollectionCoverArt3 } from 'hooks/useCollectionCoverArt'
import { useIsMobile } from 'hooks/useIsMobile'
import { useTrackCoverArt } from 'hooks/useTrackCoverArt'

import { CategoryView } from './types'

const MAX_RECENT_SEARCHES = 12

const { SEARCH_PAGE, profilePage } = route
const { removeItem, clearHistory } = searchActions
const { getSearchHistory } = searchSelectors

const RecentSearchSkeleton = () => (
  <Flex w='100%' pv='s' ph='xl' justifyContent='space-between'>
    <Flex gap='m'>
      <Skeleton w='40px' h='40px' />

      <Flex direction='column' gap='s'>
        <Skeleton w='120px' h='12px' />
        <Skeleton w='100px' h='12px' />
      </Flex>
    </Flex>
  </Flex>
)

type RecentSearchProps = {
  children: React.ReactNode
  linkTo: string
  searchItem: SearchItem
  title: string
}

const RecentSearch = (props: RecentSearchProps) => {
  const { children, linkTo, searchItem, title } = props
  const { color } = useTheme()
  const dispatch = useDispatch()

  const handleClickRemove = useCallback<MouseEventHandler>(
    (e) => {
      e.stopPropagation()
      e.preventDefault()
      dispatch(removeItem({ searchItem }))
    },
    [dispatch, searchItem]
  )

  return (
    <Link to={linkTo}>
      <Flex
        w='100%'
        pv='s'
        ph='xl'
        gap='m'
        justifyContent='space-between'
        alignItems='center'
        css={{
          cursor: 'pointer',
          ':hover': {
            backgroundColor: color.background.surface2
          }
        }}
        role='button'
        aria-label={`${messages.goTo} ${title}`}
      >
        {children}
        <IconButton
          aria-label={messages.remove}
          icon={IconCloseAlt}
          color='subdued'
          size='s'
          onClick={handleClickRemove}
        />
      </Flex>
    </Link>
  )
}

const RecentSearchTrack = (props: { searchItem: SearchItem }) => {
  const { searchItem } = props
  const { id } = searchItem
  const { data: track, status } = useGetTrackById({ id })

  const image = useTrackCoverArt({
    trackId: track?.track_id,
    size: SquareSizes.SIZE_150_BY_150
  })

  if (status === Status.LOADING) return <RecentSearchSkeleton />

  if (!track) return null
  const { permalink, title, user } = track

  if (!user) return null

  return (
    <RecentSearch searchItem={searchItem} title={title} linkTo={permalink}>
      <Artwork src={image} w='40px' borderRadius='xs' flex='0 0 auto' />
      <Flex
        direction='column'
        alignItems='flex-start'
        w='100%'
        css={{ overflow: 'hidden' }}
      >
        <Text
          variant='body'
          size='s'
          css={{
            width: '100%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            textAlign: 'left'
          }}
        >
          {title}
        </Text>
        <Flex alignItems='baseline'>
          <Text variant='body' size='xs' color='subdued'>
            {messages.track}
            {' |'}
            &nbsp;
            <UserLink userId={user.user_id} variant='subdued' badgeSize='2xs' />
          </Text>
        </Flex>
      </Flex>
    </RecentSearch>
  )
}

const RecentSearchCollection = (props: { searchItem: SearchItem }) => {
  const { searchItem } = props
  const { id } = searchItem
  const { data: playlist, status } = useGetPlaylistById({
    playlistId: id
  })

  const image = useCollectionCoverArt3({
    collectionId: playlist?.playlist_id,
    size: SquareSizes.SIZE_150_BY_150
  })

  if (status === Status.LOADING) return <RecentSearchSkeleton />

  if (!playlist) return null
  const { is_album, playlist_name, permalink, user } = playlist

  if (!user) return null

  return (
    <RecentSearch
      searchItem={searchItem}
      title={playlist_name}
      linkTo={permalink}
    >
      <Artwork src={image} w={40} borderRadius='xs' flex='0 0 auto' />
      <Flex
        direction='column'
        alignItems='flex-start'
        w='100%'
        css={{ overflow: 'hidden' }}
      >
        <Text
          variant='body'
          size='s'
          css={{
            width: '100%',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            textAlign: 'left'
          }}
        >
          {playlist_name}
        </Text>
        <Flex alignItems='baseline'>
          <Text variant='body' size='xs' color='subdued'>
            {is_album ? messages.album : messages.playlist}
            {' |'}
            &nbsp;
            <UserLink userId={user.user_id} variant='subdued' badgeSize='2xs' />
          </Text>
        </Flex>
      </Flex>
    </RecentSearch>
  )
}

const RecentSearchUser = (props: { searchItem: SearchItem }) => {
  const { searchItem } = props
  const { id } = searchItem
  const { data: user, status } = useGetUserById({ id })

  if (status === Status.LOADING) return <RecentSearchSkeleton />

  if (!user) return null
  const { handle, name } = user

  return (
    <RecentSearch
      searchItem={searchItem}
      title={name}
      linkTo={profilePage(handle)}
    >
      <Avatar userId={id} w={40} borderWidth='thin' />
      <Flex direction='column' alignItems='flex-start' w='100%'>
        <UserLink
          popover
          popoverMount={MountPlacement.PAGE}
          userId={user.user_id}
          size='s'
          badgeSize='xs'
        />
        <Text variant='body' size='xs' color='subdued'>
          Profile
        </Text>
      </Flex>
    </RecentSearch>
  )
}

const itemComponentByKind = {
  [Kind.TRACKS]: RecentSearchTrack,
  [Kind.USERS]: RecentSearchUser,
  [Kind.COLLECTIONS]: RecentSearchCollection
}

const itemKindByCategory = {
  [CategoryView.ALL]: null,
  [CategoryView.PROFILES]: Kind.USERS,
  [CategoryView.TRACKS]: Kind.TRACKS,
  [CategoryView.PLAYLISTS]: Kind.COLLECTIONS,
  [CategoryView.ALBUMS]: Kind.COLLECTIONS
}

export const RecentSearches = () => {
  const searchItems = useSelector(getSearchHistory)
  const dispatch = useDispatch()
  const isMobile = useIsMobile()
  const routeMatch = useRouteMatch<{ category: string }>(SEARCH_PAGE)
  const category = routeMatch?.params.category

  const categoryKind: Kind | null = category
    ? itemKindByCategory[category as CategoryView]
    : null

  const filteredSearchItems = useMemo(() => {
    return categoryKind
      ? searchItems.filter(
          (item) =>
            // @ts-ignore
            item.kind === categoryKind
        )
      : searchItems
  }, [categoryKind, searchItems])

  const truncatedSearchItems = useMemo(
    () => filteredSearchItems.slice(0, MAX_RECENT_SEARCHES),
    [filteredSearchItems]
  )

  const handleClickClear = useCallback(() => {
    dispatch(clearHistory())
  }, [dispatch])

  const content = (
    <>
      <Flex mh='xl'>
        <Text variant='heading' size='s' css={{ alignSelf: 'flex-start' }}>
          {messages.title}
        </Text>
      </Flex>
      <Flex direction='column'>
        {(truncatedSearchItems || []).map((searchItem) => {
          if (isSearchItem(searchItem)) {
            const { kind, id } = searchItem
            const ItemComponent =
              itemComponentByKind[kind as keyof typeof itemComponentByKind]
            return <ItemComponent searchItem={searchItem} key={id} />
          }
          return null
        })}
      </Flex>
      <Button
        variant='secondary'
        size='small'
        css={{ alignSelf: 'center' }}
        onClick={handleClickClear}
      >
        {messages.clear}
      </Button>
    </>
  )

  if (!truncatedSearchItems.length) return null

  return isMobile ? (
    <Flex w='100%' direction='column' gap='l'>
      {content}
    </Flex>
  ) : (
    <Paper
      pv='xl'
      w='100%'
      css={{ maxWidth: '688px' }}
      backgroundColor='white'
      border='default'
      direction='column'
      gap='l'
    >
      {content}
    </Paper>
  )
}
