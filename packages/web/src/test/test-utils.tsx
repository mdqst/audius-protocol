import { ReactElement, ReactNode } from 'react'

import { DeepPartial } from '@audius/common/utils'
import { ThemeProvider } from '@audius/harmony'
import { render, RenderOptions } from '@testing-library/react'

import { ReduxProvider } from 'app/ReduxProvider'
import { RouterContextProvider } from 'components/animated-switch/RouterContextProvider'
import { ToastContextProvider } from 'components/toast/ToastContext'
import { AppState } from 'store/types'

type TestOptions = {
  reduxState?: DeepPartial<AppState>
}

type TestProvidersProps = {
  children: ReactNode
}

const TestProviders =
  (options?: TestOptions) => (props: TestProvidersProps) => {
    const { children } = props
    const { reduxState } = options ?? {}
    return (
      <ThemeProvider theme='day'>
        <ReduxProvider initialStoreState={reduxState as unknown as AppState}>
          <RouterContextProvider>
            <ToastContextProvider>{children} </ToastContextProvider>
          </RouterContextProvider>
        </ReduxProvider>
      </ThemeProvider>
    )
  }

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & TestOptions
) => render(ui, { wrapper: TestProviders(options), ...options })

export * from '@testing-library/react'
export { customRender as render }
