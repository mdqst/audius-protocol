import { Component } from 'react'

import {
  imageBlank as placeholderArt,
  imageProfilePicEmpty as profilePicEmpty
} from '@audius/common/assets'
import { Kind, Name, SquareSizes } from '@audius/common/models'
import { FeatureFlags } from '@audius/common/services'
import { getTierForUser, searchActions } from '@audius/common/store'
import { push as pushRoute } from 'connected-react-router'
import { has } from 'lodash'
import { connect } from 'react-redux'
import { matchPath } from 'react-router'
import { withRouter } from 'react-router-dom'

import { HistoryContext } from 'app/HistoryProvider'
import { make } from 'common/store/analytics/actions'
import {
  fetchSearch,
  cancelFetchSearch,
  clearSearch
} from 'common/store/search-bar/actions'
import { getSearch } from 'common/store/search-bar/selectors'
import SearchBar from 'components/search/SearchBar'
import SearchBarV2 from 'components/search/SearchBarV2'
import { getFeatureEnabled } from 'services/remote-config/featureFlagHelpers'
import { collectionPage, profilePage, getPathname } from 'utils/route'

import styles from './ConnectedSearchBar.module.css'

const { addItem: addRecentSearch } = searchActions

class ConnectedSearchBar extends Component {
  static contextType = HistoryContext
  state = {
    value: ''
  }

  componentDidMount() {
    const { history } = this.props

    // Clear search when navigating away from the search results page.
    history.listen((location, action) => {
      const match = matchPath(getPathname(this.context.history.location), {
        path: '/search/:query'
      })
      if (!match) {
        this.onSearchChange('')
      }
    })

    // Set the initial search bar value if we loaded into a search page.
    const match = matchPath(getPathname(this.context.history.location), {
      path: '/search/:query'
    })
    if (has(match, 'params.query')) {
      this.onSearchChange(match.params.query)
    }
  }

  isTagSearch = () => this.state.value[0] === '#'

  onSearchChange = (value, fetch) => {
    if (value.trim().length === 0) {
      // If the user erases the entire search content, clear the search store
      // so that on the next search a new dataSource triggers animation of the dropdown.
      this.props.clearSearch()
      this.setState({ value: '' })
      return
    }

    // decodeURIComponent can fail with searches that include
    // a % sign (malformed URI), so wrap this in a try catch
    let decodedValue = value
    try {
      decodedValue = decodeURIComponent(value)
    } catch {}

    if (!this.isTagSearch() && fetch) {
      this.props.fetchSearch(decodedValue)
    }
    this.setState({ value: decodedValue })
  }

  onSubmit = (value) => {
    // Encode everything besides tag searches
    const pathname = '/search'
    if (value.startsWith('#')) {
      // perform tag search
      this.props.history.push({
        hash: value.split('#')[1],
        pathname,
        state: {}
      })
    } else {
      value = encodeURIComponent(value)
      this.props.history.push({
        pathname: pathname + '/' + value,
        state: {}
      })
    }
  }

  onSelect = (value) => {
    const { id, kind } = (() => {
      const selectedUser = this.props.search.users.find(
        (u) => value === profilePage(u.handle)
      )
      if (selectedUser) return { kind: 'profile', id: selectedUser.user_id }
      const selectedTrack = this.props.search.tracks.find(
        (t) => value === (t.user ? t.permalink : '')
      )
      if (selectedTrack) return { kind: 'track', id: selectedTrack.track_id }
      const selectedPlaylist = this.props.search.playlists.find(
        (p) =>
          value ===
          (p.user
            ? collectionPage(
                p.user.handle,
                p.playlist_name,
                p.playlist_id,
                p.permalink,
                p.is_album
              )
            : '')
      )
      if (selectedPlaylist)
        return { kind: 'playlist', id: selectedPlaylist.playlist_id }
      const selectedAlbum = this.props.search.albums.find(
        (a) =>
          value ===
          (a.user
            ? collectionPage(
                a.user.handle,
                a.playlist_name,
                a.playlist_id,
                a.permalink,
                true
              )
            : '')
      )
      if (selectedAlbum) return { kind: 'album', id: selectedAlbum.playlist_id }
      return {}
    })()
    this.props.recordSearchResultClick({
      term: this.props.search.searchText,
      kind,
      id,
      source: 'autocomplete'
    })
  }

  render() {
    if (!this.props.search.tracks) {
      this.props.search.tracks = []
    }
    const dataSource = {
      sections: [
        {
          title: 'Profiles',
          children: this.props.search.users.map((user) => {
            return {
              key: profilePage(user.handle),
              primary: user.name || user.handle,
              userId: user.user_id,
              id: user.user_id,
              imageMultihash:
                user.profile_picture_sizes || user.profile_picture,
              size: user.profile_picture_sizes
                ? SquareSizes.SIZE_150_BY_150
                : null,
              creatorNodeEndpoint: user.creator_node_endpoint,
              defaultImage: profilePicEmpty,
              isVerifiedUser: user.is_verified,
              tier: getTierForUser(user),
              kind: Kind.USERS
            }
          })
        },
        {
          title: 'Tracks',
          children: this.props.search.tracks.map((track) => {
            return {
              key: track.user ? track.permalink : '',
              primary: track.title,
              secondary: track.user ? track.user.name : '',
              id: track.track_id,
              userId: track.owner_id,
              imageMultihash: track.cover_art_sizes || track.cover_art,
              size: track.cover_art_sizes ? SquareSizes.SIZE_150_BY_150 : null,
              creatorNodeEndpoint: track.user
                ? track.user.creator_node_endpoint
                : '',
              defaultImage: placeholderArt,
              isVerifiedUser: track.user.is_verified,
              tier: getTierForUser(track.user),
              kind: Kind.TRACKS
            }
          })
        },
        {
          title: 'Playlists',
          children: this.props.search.playlists.map((playlist) => {
            return {
              primary: playlist.playlist_name,
              secondary: playlist.user ? playlist.user.name : '',
              key: playlist.user
                ? collectionPage(
                    playlist.user.handle,
                    playlist.playlist_name,
                    playlist.playlist_id,
                    playlist.permalink,
                    playlist.is_album
                  )
                : '',
              id: playlist.playlist_id,
              userId: playlist.playlist_owner_id,
              imageMultihash: playlist.cover_art_sizes || playlist.cover_art,
              size: playlist.cover_art_sizes
                ? SquareSizes.SIZE_150_BY_150
                : null,
              defaultImage: placeholderArt,
              creatorNodeEndpoint: playlist.user
                ? playlist.user.creator_node_endpoint
                : '',
              isVerifiedUser: playlist.user.is_verified,
              tier: getTierForUser(playlist.user),
              kind: Kind.COLLECTIONS
            }
          })
        },
        {
          title: 'Albums',
          children: this.props.search.albums.map((album) => {
            return {
              key: album.user
                ? collectionPage(
                    album.user.handle,
                    album.playlist_name,
                    album.playlist_id,
                    album.permalink,
                    true
                  )
                : '',
              primary: album.playlist_name,
              secondary: album.user ? album.user.name : '',
              id: album.playlist_id,
              userId: album.playlist_owner_id,
              imageMultihash: album.cover_art_sizes || album.cover_art,
              size: album.cover_art_sizes ? SquareSizes.SIZE_150_BY_150 : null,
              defaultImage: placeholderArt,
              creatorNodeEndpoint: album.user
                ? album.user.creator_node_endpoint
                : '',
              isVerifiedUser: album.user.is_verified,
              tier: getTierForUser(album.user),
              kind: Kind.COLLECTIONS
            }
          })
        }
      ]
    }
    const resultsCount = dataSource.sections.reduce(
      (count, section) => count + section.children.length,
      0
    )
    const { status, searchText } = this.props.search
    const SearchBarComponent = this.props.isSearchV2Enabled
      ? SearchBarV2
      : SearchBar
    return (
      <div className={styles.search}>
        <SearchBarComponent
          value={this.state.value}
          isTagSearch={this.isTagSearch()}
          status={status}
          searchText={searchText}
          dataSource={dataSource}
          resultsCount={resultsCount}
          onSelect={this.onSelect}
          onSearch={this.onSearchChange}
          onCancel={this.props.cancelFetchSearch}
          onSubmit={this.onSubmit}
          goToRoute={this.props.goToRoute}
          addRecentSearch={this.props.addRecentSearch}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  search: getSearch(state, props),
  isSearchV2Enabled: getFeatureEnabled(FeatureFlags.SEARCH_V2)
})
const mapDispatchToProps = (dispatch) => ({
  fetchSearch: (value) => dispatch(fetchSearch(value)),
  cancelFetchSearch: () => dispatch(cancelFetchSearch()),
  clearSearch: () => dispatch(clearSearch()),
  goToRoute: (route) => dispatch(pushRoute(route)),
  recordSearchResultClick: ({ term, kind, id, source }) =>
    dispatch(make(Name.SEARCH_RESULT_SELECT, { term, kind, id, source })),
  addRecentSearch: (searchItem) => dispatch(addRecentSearch(searchItem))
})

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ConnectedSearchBar)
)
