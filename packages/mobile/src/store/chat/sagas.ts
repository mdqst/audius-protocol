import { chatActions } from '@audius/common'
import { takeLatest } from 'redux-saga/effects'

import { navigationRef } from 'app/components/navigation-container/NavigationContainer'

const { goToChat } = chatActions

function* watchGoToChat() {
  yield takeLatest(goToChat, function* (action: ReturnType<typeof goToChat>) {
    const {
      payload: { chatId, presetMessage }
    } = action
    if (navigationRef.isReady()) {
      if (!chatId) {
        // @ts-ignore navigationRef is not parametrized correctly (PAY-1141)
        navigationRef.navigate('ChatList')
      } else {
        // @ts-ignore navigationRef is not parametrized correctly (PAY-1141)
        navigationRef.navigate('Chat', { chatId, presetMessage })
      }
    }
  })
}

export default function sagas() {
  return [watchGoToChat]
}
