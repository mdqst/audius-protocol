import { useCallback, useEffect, useState } from 'react'

import { User } from '~/models/User'
import { Nullable } from '~/utils/typeUtils'

type ShareStatus = 'idle' | 'loading' | 'success'

// Note: if we ever expand this fn to more than 2 users, it should just be made to work with an array
export const useTwitterButtonStatus = (
  user: Nullable<User>,
  additionalUser?: Nullable<User>
) => {
  const [shareTwitterStatus, setShareTwitterStatus] =
    useState<ShareStatus>('idle')

  const userName = user?.name
  const twitterHandle = user?.twitter_handle

  const additionalUserName = additionalUser?.name
  const additionalTwitterHandle = additionalUser?.twitter_handle ?? null

  useEffect(() => {
    if (shareTwitterStatus === 'loading') {
      setShareTwitterStatus('success')
    }
  }, [setShareTwitterStatus, shareTwitterStatus])

  const setLoading = useCallback(() => setShareTwitterStatus('loading'), [])
  const setIdle = useCallback(() => setShareTwitterStatus('idle'), [])
  return {
    userName,
    additionalUserName,
    shareTwitterStatus,
    twitterHandle,
    additionalTwitterHandle,
    setLoading,
    setIdle
  }
}
