import { useCallback } from 'react'

import type { AudiusSdk } from '@audius/sdk'
import { useDispatch, useSelector } from 'react-redux'

import { useAppContext } from '~/context/appContext'
import { Name } from '~/models/Analytics'
import { accountSelectors } from '~/store/account'
import {
  chatActions,
  chatSelectors,
  InboxSettingsFormValues
} from '~/store/pages'
import { transformMapToPermitList } from '~/utils/chatUtils'

const { fetchPermissions } = chatActions
const { getChatPermissionsStatus, getUserChatPermissions } = chatSelectors
const { getUserId } = accountSelectors

type useSetInboxPermissionsProps = {
  audiusSdk: () => Promise<AudiusSdk>
}

export const useSetInboxPermissions = ({
  audiusSdk
}: useSetInboxPermissionsProps) => {
  const dispatch = useDispatch()
  const permissions = useSelector(getUserChatPermissions)
  const {
    analytics: { track, make }
  } = useAppContext()
  const permissionsStatus = useSelector(getChatPermissionsStatus)
  const userId = useSelector(getUserId)

  const doFetchPermissions = useCallback(() => {
    if (userId) {
      dispatch(fetchPermissions({ userIds: [userId] }))
    }
  }, [dispatch, userId])

  const savePermissions = useCallback(
    async (permitMap: InboxSettingsFormValues) => {
      let permitList
      try {
        const sdk = await audiusSdk()
        permitList = transformMapToPermitList(permitMap)
        await sdk.chats.permit({ permitList, allow: true })
        doFetchPermissions()
        track(
          make({
            eventName: Name.CHANGE_INBOX_SETTINGS_SUCCESS,
            permitList
          })
        )
      } catch (e) {
        console.error('Error saving chat permissions:', e)
        track(
          make({
            eventName: Name.CHANGE_INBOX_SETTINGS_FAILURE,
            permitList
          })
        )
      }
    },
    [audiusSdk, track, make, doFetchPermissions]
  )

  return {
    /**
     * The current user's permissions.
     */
    permissions,
    /**
     * The current permissions status.
     */
    permissionsStatus,
    /**
     * Fetches the current user's permissions from the backend.
     */
    doFetchPermissions,
    /**
     * Saves the current user's permissions to the backend.
     */
    savePermissions
  }
}
