// @ts-nocheck
// TODO(nkang) - convert to TS

import { SsrPageProps } from 'models/SsrPageProps'
import { asLineup } from 'store/lineup/reducer'
import tracksReducer, {
  initialState as initialLineupState
} from 'store/pages/track/lineup/reducer'
import { decodeHashId } from 'utils/hashIds'

import {
  SET_TRACK_ID,
  SET_TRACK_PERMALINK,
  RESET,
  SET_TRACK_RANK,
  SET_TRACK_TRENDING_RANKS
} from './actions'
import { PREFIX as tracksPrefix } from './lineup/actions'

const initialState = {
  trackId: null,
  rank: {
    week: null,
    month: null,
    year: null
  },
  trendingTrackRanks: {
    week: null,
    month: null,
    year: null
  },
  tracks: initialLineupState
}

const actionsMap = {
  [SET_TRACK_ID](state, action) {
    return {
      ...state,
      trackId: action.trackId
    }
  },
  [SET_TRACK_PERMALINK](state, action) {
    return {
      ...state,
      trackPermalink: action.permalink
    }
  },
  [SET_TRACK_RANK](state, action) {
    return {
      ...state,
      rank: {
        ...state.rank,
        [action.duration]: action.rank
      }
    }
  },
  [SET_TRACK_TRENDING_RANKS](state, action) {
    return {
      ...state,
      trendingTrackRanks: {
        ...state.trendingTrackRanks,
        ...action.trendingTrackRanks
      }
    }
  },
  [RESET](state, action) {
    return {
      ...state,
      ...initialState,
      tracks: tracksLineupReducer(undefined, action)
    }
  }
}

const tracksLineupReducer = asLineup(tracksPrefix, tracksReducer)

const buildInitialState = (ssrPageProps?: SsrPageProps) => {
  // If we have preloaded data from the server, populate the initial
  // cache state with it
  if (ssrPageProps?.track) {
    return {
      ...initialState,
      trackId: decodeHashId(ssrPageProps.track.id)
    }
  }
  return initialState
}

const reducer = (ssrPageProps?: SsrPageProps) => (state, action) => {
  if (!state) {
    state = buildInitialState(ssrPageProps)
  }

  const tracks = tracksLineupReducer(state.tracks, action)
  if (tracks !== state.tracks) return { ...state, tracks }

  const matchingReduceFunction = actionsMap[action.type]
  if (!matchingReduceFunction) return state
  return matchingReduceFunction(state, action)
}

export default reducer
