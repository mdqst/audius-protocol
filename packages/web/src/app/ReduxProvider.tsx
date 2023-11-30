import { ReactNode } from 'react'

import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import { configureStore } from 'store/configureStore'
import logger from 'utils/logger'

import { useSsrContext } from '../ssr/SsrContext'

let store: ReturnType<typeof configureStore>
let persistor: ReturnType<typeof persistStore>

// TODO: Figure out persist gate? Do we need to block on loading from localstorage?
export const ReduxProvider = ({ children }: { children: ReactNode }) => {
  const { isServerSide, pageProps } = useSsrContext()

  if (!store) {
    store = configureStore(pageProps)
    persistor = persistStore(store)

    // Mount store to window for easy access
    if (typeof window !== 'undefined') {
      window.store = store
    }

    // Set up logger on store
    logger(store)
  }

  return store && persistor ? (
    <Provider store={store}>{children}</Provider>
  ) : null
}
