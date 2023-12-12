import { useCallback } from 'react'

import type { PurchaseVendor } from '@audius/common'
import { modalsActions } from '@audius/common'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useDispatch } from 'react-redux'

import IconCaretDown from 'app/assets/images/iconCaretDown.svg'
import { Button } from 'app/components/core'
import { typography } from 'app/styles'
import { spacing } from 'app/styles/spacing'

const { setVisibility } = modalsActions

type CardSelectionButtonProps = {
  selectedVendor: PurchaseVendor
}

export const CardSelectionButton = ({
  selectedVendor
}: CardSelectionButtonProps) => {
  const dispatch = useDispatch()

  const handlePress = useCallback(() => {
    dispatch(setVisibility({ modal: 'PurchaseVendor', visible: true }))
  }, [dispatch])

  return (
    <TouchableOpacity onPress={handlePress}>
      <Button
        title={selectedVendor}
        variant='commonAlt'
        icon={IconCaretDown}
        size='small'
        IconProps={{ width: spacing(4), height: spacing(4) }}
        styles={{
          text: {
            fontWeight: '600',
            fontSize: typography.fontSize.small,
            textTransform: 'none'
          }
        }}
        fullWidth
      />
    </TouchableOpacity>
  )
}
