import { CSSProperties, ChangeEvent, useCallback } from 'react'

import {
  BNUSDC,
  FeatureFlags,
  Nullable,
  PurchaseMethod,
  PurchaseVendor,
  formatCurrencyBalance,
  formatUSDCWeiToFloorCentsNumber,
  useFeatureFlag
} from '@audius/common'
import {
  FilterButton,
  FilterButtonType,
  Flex,
  IconCreditCard,
  IconDonate,
  IconTransaction
} from '@audius/harmony'
import { RadioButton, RadioButtonGroup } from '@audius/stems'
import BN from 'bn.js'

import { MobileFilterButton } from 'components/mobile-filter-button/MobileFilterButton'
import { SummaryTable, SummaryTableItem } from 'components/summary-table'
import { Text } from 'components/typography'
import { isMobile } from 'utils/clientUtil'
import zIndex from 'utils/zIndex'

const messages = {
  paymentMethod: 'Payment Method',
  withExistingBalance: 'Existing balance',
  withCard: 'Pay with card',
  withCrypto: 'Add via crypto transfer'
}

type PaymentMethodProps = {
  selectedMethod: Nullable<PurchaseMethod>
  setSelectedMethod: (method: PurchaseMethod) => void
  selectedVendor: PurchaseVendor
  setSelectedVendor: (vendor: PurchaseVendor) => void
  balance?: Nullable<BNUSDC>
  isExistingBalanceDisabled?: boolean
  showExistingBalance?: boolean
}

export const PaymentMethod = ({
  selectedMethod,
  setSelectedMethod,
  selectedVendor,
  setSelectedVendor,
  balance,
  isExistingBalanceDisabled,
  showExistingBalance
}: PaymentMethodProps) => {
  const { isEnabled, isLoaded: isCoinflowEnabledLoaded } = useFeatureFlag(
    FeatureFlags.BUY_WITH_COINFLOW
  )
  const isCoinflowEnabled = isEnabled && isCoinflowEnabledLoaded
  const mobile = isMobile()
  const balanceCents = formatUSDCWeiToFloorCentsNumber(
    (balance ?? new BN(0)) as BNUSDC
  )
  const balanceFormatted = formatCurrencyBalance(balanceCents / 100)
  const vendorOptions = [
    ...(isCoinflowEnabled ? [{ value: PurchaseVendor.COINFLOW }] : []),
    { value: PurchaseVendor.STRIPE }
  ]
  console.log('ff', vendorOptions)

  const handleSelectVendor = useCallback(
    (label: string) => {
      console.log('selecting vendor', label)
      setSelectedVendor(label as PurchaseVendor)
    },
    [setSelectedVendor]
  )

  const options = [
    showExistingBalance
      ? {
        id: PurchaseMethod.BALANCE,
        label: messages.withExistingBalance,
        icon: IconDonate,
        disabled: isExistingBalanceDisabled,
        value: (
          <Text
            as='span' // Needed to avoid <p> inside <p> warning
            variant='title'
            color={
              selectedMethod === PurchaseMethod.BALANCE
                ? 'secondary'
                : undefined
            }
          >
            ${balanceFormatted}
          </Text>
        )
      }
      : null,
    {
      id: PurchaseMethod.CARD,
      label: messages.withCard,
      icon: IconCreditCard,
      value:
        vendorOptions.length > 1 ? (
          mobile ? (
            // <MobileFilterButton
            //   onSelect={handleSelectVendor}
            //   selectedValue={selectedVendor}
            //   options={vendorOptions}
            //   zIndex={zIndex.ADD_FUNDS_VENDOR_SELECTION_DRAWER}
            // />
            null
          ) : (
            <FilterButton
              onSelect={handleSelectVendor}
              selectedValue={selectedVendor}
              variant={FilterButtonType.REPLACE_LABEL}
              options={vendorOptions}
              popupZIndex={zIndex.USDC_ADD_FUNDS_FILTER_BUTTON_POPUP}
            />
          )
        ) : null
    },
    {
      id: PurchaseMethod.CRYPTO,
      label: messages.withCrypto,
      icon: IconTransaction
    }
  ].filter(Boolean) as SummaryTableItem[]

  const handleSelectMethod = useCallback((purchaseMethod: PurchaseMethod) => {
    setSelectedMethod(purchaseMethod)
  }, [setSelectedMethod])

  const renderBody = () => {
    const getFlexProps = (id: PurchaseMethod) => {
      if (mobile && id === PurchaseMethod.CARD) {
        return {
          direction: 'column' as CSSProperties['flexDirection'],
          justifyContent: 'center',
          justifySelf: 'stretch',
          alignItems: 'flex-start'
        }
      }
      return {
        direction: 'row' as CSSProperties['flexDirection'],
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: 'space-between'
      }
    }
    return (
      <RadioButtonGroup
        name={`summaryTable-label-${messages.paymentMethod}`}
        value={selectedMethod}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleSelectMethod(e.target.value as PurchaseMethod)}
        style={{ width: '100%' }}
      >
        {options.map(({ id, label, icon: Icon, value, disabled }) => (
          <Flex
            key={id}
            {...getFlexProps(id as PurchaseMethod)}
            pv='m'
            ph='xl'
            css={{ opacity: disabled ? 0.5 : 1 }}
            borderTop='default'
          >
            <Flex
              onClick={() => handleSelectMethod(id as PurchaseMethod)}
              css={{ cursor: 'pointer' }}
              alignItems='center'
              justifyContent='space-between'
              gap='s'
            >
              <RadioButton value={id} disabled={disabled} />
              {Icon ? (
                <Flex alignItems='center' ml='s'>
                  <Icon color='default' />
                </Flex>
              ) : null}
              <Text>{label}</Text>
            </Flex>
            <Text
              css={{
                width: mobile && id === PurchaseMethod.CARD ? '100%' : 'auto'
              }}
            >
              {value}
            </Text>
          </Flex>
        ))}
      </RadioButtonGroup>
    )
  }

  return (
    <SummaryTable
      title={messages.paymentMethod}
      items={options}
      renderBody={renderBody}
    />
  )
}
