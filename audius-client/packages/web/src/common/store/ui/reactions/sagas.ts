import { call, takeEvery, all, put, select } from 'typed-redux-saga/macro'

import { removeNullable } from 'common/utils/typeUtils'
import apiClient from 'services/audius-api-client/AudiusAPIClient'

import {
  fetchReactionValues,
  getReactionFromRawValue,
  makeGetReactionForSignature,
  setLocalReactionValues,
  writeReactionValue
} from './slice'

function* fetchReactionValuesAsync({
  payload
}: ReturnType<typeof fetchReactionValues>) {
  // Fetch reactions
  // TODO: [PAY-305] This endpoint should be fixed to properly allow multiple reaction fetches
  const reactions = yield* all(
    payload.entityIds.map(id =>
      call([apiClient, apiClient.getReaction], {
        reactedToIds: [id]
      })
    )
  )

  // Add them to the store
  // Many of these reactions may be null (i.e. entity not reacted to), ignore them
  const toUpdate = reactions
    .filter(removeNullable)
    .map(({ reactedTo, reactionValue }) => ({
      reaction: getReactionFromRawValue(reactionValue) || 'heart', // this shouldn't happen, default to heart
      entityId: reactedTo
    }))

  yield put(setLocalReactionValues({ reactions: toUpdate }))
}

function* writeReactionValueAsync({
  payload
}: ReturnType<typeof writeReactionValue>) {
  const { entityId, reaction } = payload
  // If we're toggling a reaction, set it to null
  const existingReaction = yield* select(makeGetReactionForSignature(entityId))
  const newReactionValue = existingReaction === reaction ? null : reaction

  // TODO: integrate this with libs to write out reaction to identity
  yield put(
    setLocalReactionValues({
      reactions: [{ reaction: newReactionValue, entityId }]
    })
  )
}

function* watchFetchReactionValues() {
  yield* takeEvery(fetchReactionValues.type, fetchReactionValuesAsync)
}

function* watchWriteReactionValues() {
  yield* takeEvery(writeReactionValue.type, writeReactionValueAsync)
}

const sagas = () => {
  return [watchFetchReactionValues, watchWriteReactionValues]
}

export default sagas
