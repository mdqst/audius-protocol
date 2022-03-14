import { useEffect } from 'react'

import IconNote from 'app/assets/images/iconNote.svg'
import IconUser from 'app/assets/images/iconUser.svg'
import {
  TabNavigator,
  tabScreen
} from 'app/components/app-navigator/TopTabNavigator'
import { Screen } from 'app/components/core'
import { Header } from 'app/components/header'
import { useDispatchWeb } from 'app/hooks/useDispatchWeb'
import { useSearchRoute } from 'app/hooks/useRoute'
import { MessageType } from 'app/message'

import { ProfilesTab } from './tabs/ProfilesTab'
import { TracksTab } from './tabs/TracksTab'

const messages = {
  header: 'Tag Search'
}

/**
 * Displays tag search results. Uses the same state as normal full search,
 * but only displays matching tracks & profiles.
 */
export const TagSearchScreen = () => {
  const dispatchWeb = useDispatchWeb()
  const { params } = useSearchRoute<'TagSearch'>()
  const { query } = params

  useEffect(() => {
    dispatchWeb({
      type: MessageType.UPDATE_SEARCH_QUERY,
      query
    })
  }, [dispatchWeb, query])

  const tracksScreen = tabScreen({
    name: 'Tracks',
    Icon: IconNote,
    component: TracksTab
  })

  const profilesScreen = tabScreen({
    name: 'Profiles',
    Icon: IconUser,
    component: ProfilesTab
  })

  return (
    <Screen topbarRight={null} noPadding>
      <Header text={messages.header} />
      <TabNavigator initialScreenName='Tracks'>
        {tracksScreen}
        {profilesScreen}
      </TabNavigator>
    </Screen>
  )
}
