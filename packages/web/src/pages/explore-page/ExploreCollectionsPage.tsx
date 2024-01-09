import { ExploreCollectionsVariant } from '@audius/common'

import { useIsMobile } from 'utils/clientUtil'

import ExploreCollectionsPageProvider from './ExploreCollectionsPageProvider'
import DesktopCollectionsPage from './components/desktop/CollectionsPage'
import MobileCollectionsPage from './components/mobile/CollectionsPage'

type ExploreCollectionsPageContentProps = {
  variant: ExploreCollectionsVariant
}
const ExploreCollectionsPage = ({
  variant
}: ExploreCollectionsPageContentProps) => {
  const isMobile = useIsMobile()
  const content = isMobile ? MobileCollectionsPage : DesktopCollectionsPage

  return (
    <ExploreCollectionsPageProvider isMobile={isMobile} variant={variant}>
      {content}
    </ExploreCollectionsPageProvider>
  )
}

export default ExploreCollectionsPage
