import { CSSProperties, ChangeEvent, useCallback, useState } from 'react'

import {
  BNUSDC,
  FeatureFlags,
  Nullable,
  PurchaseMethod,
  PurchaseVendor,
  formatCurrencyBalance,
  formatUSDCWeiToFloorCentsNumber,
  useFeatureFlag,
  usePayExtraPresets,
  StringKeys,
  PayExtraPreset
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
import { PayExtraFormSection } from 'components/premium-content-purchase-modal/components/PayExtraFormSection'
import { SummaryTable, SummaryTableItem } from 'components/summary-table'
import { Text } from 'components/typography'
import { isMobile } from 'utils/clientUtil'
import zIndex from 'utils/zIndex'

const messages = {
  paymentMethod: 'Payment Method',
  withExistingBalance: 'Existing balance',
  withCard: 'Pay with card',
  withCrypto: 'Add via crypto transfer',
  amountPickerTitle: 'Select desired amount'
}

type PaymentMethodProps = {
  selectedMethod: Nullable<PurchaseMethod>
  setSelectedMethod: (method: PurchaseMethod) => void
  selectedVendor?: Nullable<PurchaseVendor>
  setSelectedVendor: (vendor: PurchaseVendor) => void
  preset?: PayExtraPreset
  setPreset?: (preset: PayExtraPreset, shouldValidate?: boolean) => void
  customAmount: number
  setCustomAmount?: (value: number, shouldValidate?: boolean) => void
  balance?: Nullable<BNUSDC>
  isExistingBalanceDisabled?: boolean
  showExistingBalance?: boolean
  showCoinflowAmounts?: boolean
}

export const PaymentMethod = ({
  selectedMethod,
  setSelectedMethod,
  selectedVendor,
  setSelectedVendor,
  preset = PayExtraPreset.NONE,
  setPreset,
  customAmount,
  setCustomAmount,
  balance,
  isExistingBalanceDisabled,
  showExistingBalance,
  showCoinflowAmounts
}: PaymentMethodProps) => {
  const { isEnabled: isCoinflowEnabled } = useFeatureFlag(
    FeatureFlags.BUY_WITH_COINFLOW
  )
  const mobile = isMobile()
  const balanceCents = formatUSDCWeiToFloorCentsNumber(
    (balance ?? new BN(0)) as BNUSDC
  )
  const balanceFormatted = formatCurrencyBalance(balanceCents / 100)
  const vendorOptions = [
    ...(isCoinflowEnabled ? [{ label: PurchaseVendor.COINFLOW }] : []),
    { label: PurchaseVendor.STRIPE }
  ]
  const amountPresets = usePayExtraPresets(
    StringKeys.COINFLOW_ADD_FUNDS_PRESET_CENT_AMOUNTS
  )

  const shouldShowCoinflowAmountPicker =
    showCoinflowAmounts &&
    setPreset !== undefined &&
    setCustomAmount !== undefined &&
    selectedVendor === PurchaseVendor.COINFLOW

  const handleSelectVendor = useCallback(
    (label: string) => {
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
            <MobileFilterButton
              onSelect={handleSelectVendor}
              initialSelectionIndex={0}
              options={vendorOptions}
              zIndex={zIndex.ADD_FUNDS_VENDOR_SELECTION_DRAWER}
            />
          ) : (
            <FilterButton
              onSelect={handleSelectVendor}
              initialSelectionIndex={0}
              variant={FilterButtonType.REPLACE_LABEL}
              options={vendorOptions}
              popupZIndex={zIndex.USDC_ADD_FUNDS_FILTER_BUTTON_POPUP}
            />
          )
        ) : null,
      extraContent: shouldShowCoinflowAmountPicker ? (
        <Flex w='100%'>
          <PayExtraFormSection
            title={messages.amountPickerTitle}
            amountPresets={amountPresets}
            preset={preset}
            setPreset={setPreset}
            customAmount={customAmount}
            setCustomAmount={setCustomAmount}
          />
        </Flex>
      ) : null
    },
    {
      id: PurchaseMethod.CRYPTO,
      label: messages.withCrypto,
      icon: IconTransaction
    }
  ].filter(Boolean) as SummaryTableItem[]

  const handleRadioChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSelectedMethod(e.target.value as PurchaseMethod)
    },
    [setSelectedMethod]
  )

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
        onChange={handleRadioChange}
        style={{ width: '100%' }}
      >
        {options.map(
          ({ id, label, icon: Icon, value, disabled, extraContent }) => (
            <Flex
              key={id}
              pv='m'
              ph='xl'
              css={{ opacity: disabled ? 0.5 : 1 }}
              borderTop='default'
              {...getFlexProps(id as PurchaseMethod)}
              direction='column'
              gap='l'
            >
              <Flex {...getFlexProps(id as PurchaseMethod)} w='100%'>
                <Flex
                  onClick={() => setSelectedMethod(id as PurchaseMethod)}
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
                    width:
                      mobile && id === PurchaseMethod.CARD ? '100%' : 'auto'
                  }}
                >
                  {value}
                </Text>
              </Flex>
              {extraContent}
            </Flex>
          )
        )}
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
