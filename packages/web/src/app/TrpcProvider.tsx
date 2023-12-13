import { ReactNode, useMemo, useState } from 'react'

import { accountSelectors } from '@audius/common'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

import { createAudiusTrpcClient, trpc } from '../utils/trpcClientWeb'

type TrpcProviderProps = {
  children: ReactNode
}

export const TrpcProvider = (props: TrpcProviderProps) => {
  const { children } = props
  const currentUserId = useSelector(accountSelectors.getUserId)
  const [queryClient] = useState(() => new QueryClient())
  const trpcClient = useMemo(
    () => createAudiusTrpcClient(currentUserId),
    [currentUserId]
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
