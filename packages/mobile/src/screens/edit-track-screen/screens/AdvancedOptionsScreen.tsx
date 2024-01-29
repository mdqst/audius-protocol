import { FeatureFlags } from '@audius/common'
import { View } from 'react-native'

import IconIndent from 'app/assets/images/iconIndent.svg'
import { useFeatureFlag } from 'app/hooks/useRemoteConfig'

import { FormScreen } from '../components'
import {
  IsrcField,
  LicenseTypeField,
  SubmenuList,
  ReleaseDateFieldLegacy
} from '../fields'

const messages = {
  screenTitle: 'Advanced'
}

export const AdvancedOptionsScreen = () => {
  const { isEnabled: isScheduledReleasesEnabled } = useFeatureFlag(
    FeatureFlags.SCHEDULED_RELEASES
  )

  return (
    <FormScreen
      title={messages.screenTitle}
      icon={IconIndent}
      bottomSection={null}
      variant='white'
    >
      <View>
        {isScheduledReleasesEnabled ? null : <ReleaseDateFieldLegacy />}
        <SubmenuList>
          <IsrcField />
          <LicenseTypeField />
        </SubmenuList>
      </View>
    </FormScreen>
  )
}
