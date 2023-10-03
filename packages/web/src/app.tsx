import '@audius/stems/dist/stems.css'

import { useState } from 'react'

import { AudiusQueryContext, accountSelectors } from '@audius/common'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectedRouter } from 'connected-react-router'
import { Provider, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { LastLocationProvider } from 'react-router-last-location'

import { CoinbasePayButtonProvider } from 'components/coinbase-pay-button'
import App from 'pages/App'
import { AppErrorBoundary } from 'pages/AppErrorBoundary'
import AppProviders from 'pages/AppProviders'
import { MainContentContext } from 'pages/MainContentContext'
import DemoTrpcPage from 'pages/demo-trpc/DemoTrpcPage'
import { OAuthLoginPage } from 'pages/oauth-login-page/OAuthLoginPage'
import { SomethingWrong } from 'pages/something-wrong/SomethingWrong'
import { apiClient } from 'services/audius-api-client'
import { audiusBackendInstance } from 'services/audius-backend/audius-backend-instance'
import { audiusSdk } from 'services/audius-sdk/audiusSdk'
import history from 'utils/history'

import { createAudiusTRPCClient, trpc } from './services/trpc'
import { store } from './store/configureStore'
import { reportToSentry } from './store/errors/reportToSentry'

import './index.css'
import './services/webVitals'

const AudiusTrpcProvider = ({ children }: { children: React.ReactNode }) => {
  const currentUserId = useSelector(accountSelectors.getUserId)
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() => createAudiusTRPCClient(currentUserId))
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}

const AudiusApp = () => {
  return (
    <Provider store={store}>
      <AudiusTrpcProvider>
        <AudiusQueryContext.Provider
          value={{
            apiClient,
            audiusBackend: audiusBackendInstance,
            audiusSdk,
            dispatch: store.dispatch,
            reportToSentry
          }}
        >
          <ConnectedRouter history={history}>
            <LastLocationProvider>
              <AppProviders>
                <MainContentContext.Consumer>
                  {({ mainContentRef }) => (
                    <Switch>
                      <Route path='/error'>
                        <SomethingWrong />
                      </Route>
                      <Route
                        exact
                        path={'/oauth/auth'}
                        component={OAuthLoginPage}
                      />
                      <Route path='/demo/trpc'>
                        <DemoTrpcPage />
                      </Route>
                      <Route path='/'>
                        <AppErrorBoundary>
                          <CoinbasePayButtonProvider>
                            <App mainContentRef={mainContentRef} />
                          </CoinbasePayButtonProvider>
                        </AppErrorBoundary>
                      </Route>
                    </Switch>
                  )}
                </MainContentContext.Consumer>
              </AppProviders>
            </LastLocationProvider>
          </ConnectedRouter>
        </AudiusQueryContext.Provider>
      </AudiusTrpcProvider>
    </Provider>
  )
}

export default AudiusApp
