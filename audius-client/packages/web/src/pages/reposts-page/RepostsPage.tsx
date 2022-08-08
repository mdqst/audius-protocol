import { useContext, useEffect } from 'react'

import { getUserList } from 'common/store/user-list/reposts/selectors'
import { USER_LIST_TAG } from 'common/store/user-list/reposts/types'
import MobilePageContainer from 'components/mobile-page-container/MobilePageContainer'
import NavContext, { LeftPreset } from 'components/nav/store/context'
import UserList from 'components/user-list/UserList'

const messages = {
  title: 'Reposts'
}

const RepostsPage = () => {
  const { setLeft, setCenter, setRight } = useContext(NavContext)!

  useEffect(() => {
    setLeft(LeftPreset.BACK)
    setCenter(messages.title)
    setRight(null)
  }, [setLeft, setCenter, setRight])

  return (
    <MobilePageContainer fullHeight>
      <UserList stateSelector={getUserList} tag={USER_LIST_TAG} />
    </MobilePageContainer>
  )
}

export default RepostsPage
