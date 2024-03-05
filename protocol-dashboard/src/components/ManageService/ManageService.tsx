import BN from 'bn.js'
import DisplayAudio from 'components/DisplayAudio'
import MinimumDelegationAmountModal from 'components/MinimumDelegationAmountModal'
import OperatorCutModal from 'components/OperatorCutModal'
import UpdateStakeModal from 'components/UpdateStakeModal'
import { PropsWithChildren, useCallback } from 'react'
import AudiusClient from 'services/Audius/AudiusClient'
import { useAccountUser, usePendingTransactions } from 'store/account/hooks'
import { usePendingClaim } from 'store/cache/claims/hooks'
import { Address, Operator, Status } from 'types'
import { useModalControls } from 'utils/hooks'
import styles from './ManageService.module.css'

import {
  Box,
  Divider,
  Flex,
  HarmonyTheme,
  Text,
  useTheme
} from '@audius/harmony'
import Button, { ButtonType } from 'components/Button'
import { Card } from 'components/Card/Card'
import ConfirmTransactionModal, {
  Delegating,
  StandaloneBox,
  ToOperator
} from 'components/ConfirmTransactionModal'
import DelegateStakeModal from 'components/DelegateStakeModal'
import DelegatorsModal from 'components/DelegatorsModal'
import MyEstimatedRewards from 'components/MyEstimatedRewards'
import { PlainLink } from 'components/PlainLink/PlainLink'
import Tooltip, { Position } from 'components/Tooltip'
import { TransactionStatusContent } from 'components/TransactionStatus/TransactionStatus'
import { ManageDelegation } from 'components/UpdateDelegationModal/UpdateDelegationModal'
import { useSelector } from 'react-redux'
import { useMakeClaim } from 'store/actions/makeClaim'
import useUndelegateStake from 'store/actions/undelegateStake'
import { getDelegatorInfo } from 'store/cache/protocol/hooks'
import { useUser, useUserDelegates } from 'store/cache/user/hooks'
import getActiveStake, { getTotalActiveDelegatedStake } from 'utils/activeStake'
import { TICKER } from 'utils/consts'
import { formatShortWallet } from 'utils/format'
import { RegisterNewServiceBtn } from './RegisterNewServiceBtn'

const messages = {
  ownerTitle: 'Your Nodes',
  nonOwnertitle: 'Operator’s Nodes',
  increase: 'Increase Stake',
  decrease: 'Decrease Stake',
  deployerCut: 'Deployer Cut',
  activeServices: 'Active Services',
  minimunDelegationAmount: 'Minimum Delegation Amount',
  aggregateContribution: 'Aggregate Contribution',
  contentNodes: 'Content Nodes',
  contentNodesSingular: 'Content Node',
  discoveryNodes: 'Discovery Nodes',
  discoveryNodesSingular: 'Discovery Node',
  delegators: 'Delegators',
  delegatorsSingular: 'Delegator',
  change: 'Change',
  manage: 'Manage',
  view: 'View',
  claim: 'Make Claim',
  claimForOperator: 'Claim For Operator',
  rewardsPool: `Estimated ${TICKER} Rewards Pool`,
  weekly: 'Weekly',
  annual: 'Annual',
  operatorStake: `Operator Stake (${TICKER})`,
  operatorServiceFee: 'Operator Service Fee',
  minimumAmount: 'Minimum Delegation Amount',
  unclaimed: 'Unclaimed',
  rewardDistribution: 'Reward Distribution',
  registerNode: 'Register Node',
  delegatedAudio: `Your Delegated ${TICKER}`,
  delegatorLimitReached: 'This operator has reached its delegator limit.',
  delegate: 'Delegate',
  undelegate: 'Undelegate',
  operatorName: 'Operator Name',
  operatorImage: 'Operator Profile Image',
  undelegateAudio: `Undelegate ${TICKER}`,
  cantUndelegatePendingClaim:
    'Cannot undelegate while the operator has an unclaimed reward distribution',
  cantDelegatePendingClaim:
    'Cannot delegate while the operator has an unclaimed reward distribution',
  cantDelegateTotalStakeOutOfBounds:
    "Cannot delegate because the operator's total stake is out of bounds",
  delegatorCantClaimTotalStakeOutOfBounds:
    "Cannot claim because the operator's total stake is out of bounds",
  operatorCantClaimTotalStakeOufOfBounds:
    'Cannot claim because your total stake is out of bounds.',
  open: 'Open'
}

interface ManageServiceProps {
  className?: string
  showViewActiveServices?: boolean
  showPendingTransactions?: boolean
  wallet: string
  onClickDiscoveryTable?: () => void
  onClickContentTable?: () => void
}

const Delegators = ({
  wallet,
  numberDelegators
}: {
  wallet: Address
  numberDelegators: number
}) => {
  const { isOpen, onClick, onClose } = useModalControls()
  return (
    <>
      <ServiceBigStat
        onClick={onClick}
        data={numberDelegators}
        label={
          numberDelegators === 1
            ? messages.delegatorsSingular
            : messages.delegators
        }
      />
      <DelegatorsModal wallet={wallet} isOpen={isOpen} onClose={onClose} />
    </>
  )
}

type UndelegateSectionProps = {
  name?: string
  wallet: string
  delegates: BN
  cantUndelegateReason: string
}

const UndelegateSection = ({
  name,
  wallet,
  delegates,
  cantUndelegateReason
}: UndelegateSectionProps) => {
  const {
    isOpen: isUndelegateOpen,
    onClick: onClickUndelegate,
    onClose: onCloseUndelegate
  } = useModalControls()

  const {
    status: undelegateStatus,
    error: undelegateError,
    undelegateStake
  } = useUndelegateStake()

  const onConfirmUndelegate = useCallback(() => {
    undelegateStake(wallet, delegates)
  }, [undelegateStake, delegates, wallet])

  const bottomBox = (
    <ToOperator
      name={name || formatShortWallet(wallet ?? '')}
      wallet={wallet}
      isFrom
    />
  )
  const undelegateBox = <Delegating isUndelegating amount={delegates} />

  return (
    <>
      <Tooltip
        position={Position.TOP}
        text={cantUndelegateReason}
        isDisabled={!Boolean(cantUndelegateReason)}
      >
        <Button
          className={styles.undelegateButton}
          text={messages.undelegate}
          type={ButtonType.PRIMARY}
          isDisabled={Boolean(cantUndelegateReason)}
          onClick={onClickUndelegate}
        />
      </Tooltip>
      <ConfirmTransactionModal
        topBox={undelegateBox}
        bottomBox={bottomBox}
        onConfirm={onConfirmUndelegate}
        onClose={onCloseUndelegate}
        isOpen={isUndelegateOpen}
        error={undelegateError}
        status={undelegateStatus}
        withArrow={false}
      />
    </>
  )
}

type ActionPlainLinkProps = PropsWithChildren<{
  onClick?: () => void
  disabled?: boolean
  tooltipText?: string
  tooltipDisabled?: boolean
}>

const ActionPlainLink = ({
  children,
  onClick,
  tooltipText,
  disabled,
  tooltipDisabled
}: ActionPlainLinkProps) => {
  return (
    <Tooltip
      position={Position.TOP}
      text={tooltipText}
      isDisabled={tooltipDisabled || !tooltipText}
    >
      <PlainLink onClick={onClick} disabled={disabled}>
        {children}
      </PlainLink>
    </Tooltip>
  )
}

type ServiceBigStatProps = {
  data: number | string
  label: string
  onClick?: () => void
}

const ServiceBigStat = ({ data, label, onClick }: ServiceBigStatProps) => {
  const { color } = useTheme() as HarmonyTheme

  return (
    <Card
      ph="l"
      h="100%"
      aria-role={onClick ? 'button' : undefined}
      aria-label={onClick ? `${messages.open} ${label}` : undefined}
      onClick={onClick}
      css={{
        cursor: onClick ? 'pointer' : 'default',
        backgroundColor: color.background.surface1,
        '&:hover': {
          backgroundColor: onClick
            ? color.background.surface2
            : color.background.surface1
        }
      }}
    >
      <Flex gap="s" alignItems="center" h="100%">
        <Text variant="heading" size="s">
          {data}
        </Text>
        <Text variant="body" size="l" strength="strong" color="subdued">
          {label}
        </Text>
      </Flex>
    </Card>
  )
}

type ServiceSmallStatProps = {
  data: BN | number | string
  isAudioAmount?: boolean
  label: string
}
const ServiceSmallStat = ({
  data,
  isAudioAmount,
  label
}: ServiceSmallStatProps) => {
  return (
    <Flex gap="s">
      <Text variant="heading" size="s">
        {isAudioAmount ? (
          <DisplayAudio amount={data as BN} />
        ) : (
          (data as number | string)
        )}
      </Text>
      <Text variant="body" size="l" strength="strong" color="subdued">
        {label}
      </Text>
    </Flex>
  )
}

type OperatorServiceFeeProps = {
  deployerCut: number
  enableChange?: boolean
}

const OperatorServiceFee = ({
  deployerCut,
  enableChange
}: OperatorServiceFeeProps) => {
  const { isOpen, onClick, onClose } = useModalControls()

  return (
    <Flex gap="l" alignItems="baseline">
      <ServiceSmallStat
        data={`${deployerCut}%`}
        label={messages.operatorServiceFee}
      />
      {enableChange ? (
        <ActionPlainLink onClick={onClick}>{messages.change}</ActionPlainLink>
      ) : null}
      {enableChange ? (
        <OperatorCutModal cut={deployerCut} isOpen={isOpen} onClose={onClose} />
      ) : null}
    </Flex>
  )
}

type MinimumDelegationAmountProps = {
  minimumDelegationAmount: BN
  enableChange?: boolean
}

const MinimumDelegationAmount = ({
  minimumDelegationAmount,
  enableChange
}: MinimumDelegationAmountProps) => {
  const { isOpen, onClick, onClose } = useModalControls()
  return (
    <Flex gap="l" alignItems="baseline">
      <ServiceSmallStat
        data={minimumDelegationAmount}
        isAudioAmount
        label={messages.minimunDelegationAmount}
      />
      {enableChange ? (
        <ActionPlainLink onClick={onClick}>{messages.change}</ActionPlainLink>
      ) : null}
      {enableChange ? (
        <MinimumDelegationAmountModal
          minimumDelegationAmount={minimumDelegationAmount}
          isOpen={isOpen}
          onClose={onClose}
        />
      ) : null}
    </Flex>
  )
}

type StakeProps = {
  stake: BN
  enableChange?: boolean
  disabledReason?: string
}

const Stake = ({ stake, enableChange, disabledReason }: StakeProps) => {
  const { isOpen, onClick, onClose } = useModalControls()

  return (
    <Flex gap="l" alignItems="baseline">
      <ServiceSmallStat
        data={stake}
        label={messages.operatorStake}
        isAudioAmount
      />
      {enableChange ? (
        <ActionPlainLink onClick={onClick}>{messages.change}</ActionPlainLink>
      ) : null}
      <UpdateStakeModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  )
}

const ManageService = (props: ManageServiceProps) => {
  const wallet = props.wallet

  const { status: accountUserStatus, user: accountUser } = useAccountUser()
  const { maxDelegators } = useSelector(getDelegatorInfo)
  const {
    user: serviceUser,
    status: serviceUserStatus,
    audiusProfile: serviceUserAudiusProfile
  } = useUser({ wallet })
  const { status: userDelegatesStatus, delegates } = useUserDelegates({
    wallet
  })
  const { color } = useTheme() as HarmonyTheme
  const activeStake = getActiveStake(serviceUser)
  const totalActiveDelegated = getTotalActiveDelegatedStake(serviceUser)
  const pendingTx = usePendingTransactions()
  const pendingClaim = usePendingClaim(wallet)

  const isServiceProvider =
    serviceUserStatus === Status.Success && 'serviceProvider' in serviceUser
  const aggregateContribution = activeStake.add(totalActiveDelegated)
  const hasPendingTx =
    pendingTx.status === Status.Success &&
    Array.isArray(pendingTx.transactions) &&
    pendingTx.transactions?.length !== 0
  const isTotalStakeInBounds =
    (serviceUser as Operator)?.serviceProvider?.validBounds ?? false
  const numDiscoveryNodes =
    isServiceProvider && (serviceUser as Operator).discoveryProviders.length
  const numContentNodes =
    isServiceProvider && (serviceUser as Operator).contentNodes.length
  const numDelegators = isServiceProvider
    ? (serviceUser as Operator).delegators.length
    : 0
  const deployerCut = isServiceProvider
    ? (serviceUser as Operator).serviceProvider.deployerCut
    : null
  const isOwner =
    accountUserStatus === Status.Success && wallet === accountUser?.wallet
  const minDelegationAmount =
    isServiceProvider && (serviceUser as Operator).minDelegationAmount

  const isDoneLoading =
    accountUserStatus === Status.Success &&
    pendingClaim.status === Status.Success &&
    userDelegatesStatus === Status.Success
  const showDelegate =
    isDoneLoading &&
    (numDiscoveryNodes ?? 0) + (numContentNodes ?? 0) > 0 &&
    !isOwner &&
    delegates.isZero()
  const showUndelegate = isDoneLoading && !isOwner && !delegates.isZero()
  const cantUndelegateReason = !pendingClaim.hasClaim
    ? messages.cantUndelegatePendingClaim
    : null
  const isDelegatorLimitReached =
    maxDelegators !== undefined &&
    (serviceUser as Operator)?.delegators?.length >= maxDelegators
  const cantDelegateReason = isDelegatorLimitReached
    ? messages.delegatorLimitReached
    : !pendingClaim.hasClaim
    ? messages.cantDelegatePendingClaim
    : !isTotalStakeInBounds
    ? messages.cantDelegateTotalStakeOutOfBounds
    : null

  const isClaimDisabled = !isTotalStakeInBounds

  const {
    isOpen: isClaimModalOpen,
    onClick: onClickClaimModal,
    onClose: onCloseClaimModal
  } = useModalControls()

  const {
    isOpen: isDelegateOpen,
    onClick: onClickDelegate,
    onClose: onCloseDelegate
  } = useModalControls()
  const { status: claimStatus, error, makeClaim } = useMakeClaim()

  const onConfirm = useCallback(() => {
    makeClaim(serviceUser.wallet)
  }, [serviceUser?.wallet, makeClaim])

  const makeClaimBox = <StandaloneBox> {messages.claim} </StandaloneBox>

  return (
    <Card direction="column">
      <Flex
        pv="l"
        ph="xl"
        borderBottom="default"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
      >
        <Text variant="heading" size="s">
          {isOwner ? messages.ownerTitle : messages.nonOwnertitle}
        </Text>
        <Flex gap="xl" alignItems="center">
          {isOwner ? (
            <RegisterNewServiceBtn customText={messages.registerNode} />
          ) : null}
          <Box css={{ textAlign: 'end' }}>
            <Text variant="heading" size="m" color="accent">
              {AudiusClient.displayShortAud(aggregateContribution)}
            </Text>
            <Text variant="body" size="m" strength="strong" color="subdued">
              {messages.aggregateContribution}
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Flex pv="l" ph="xl" gap="2xl" alignItems="stretch">
        <Flex direction="column" alignItems="stretch" gap="s">
          <ServiceBigStat
            data={numContentNodes}
            label={
              numContentNodes === 1
                ? messages.contentNodesSingular
                : messages.contentNodes
            }
            onClick={() => props.onClickContentTable?.()}
          />
          <ServiceBigStat
            data={numDiscoveryNodes}
            label={
              numDiscoveryNodes === 1
                ? messages.discoveryNodesSingular
                : messages.discoveryNodes
            }
            onClick={() => props.onClickDiscoveryTable?.()}
          />
          <Delegators
            wallet={serviceUser?.wallet}
            numberDelegators={numDelegators}
          />
        </Flex>
        <Flex direction="column" gap="xl" css={{ flexGrow: 1 }}>
          <Flex direction="column" gap="l">
            <Text variant="body" size="l" strength="strong" color="subdued">
              {messages.rewardsPool}
            </Text>
            <Flex direction="column" gap="m">
              <MyEstimatedRewards wallet={wallet} />
            </Flex>
          </Flex>
          <Divider css={{ borderColor: color.neutral.n100 }} />
          <Flex direction="column" gap="m">
            <Stake stake={activeStake} enableChange={isOwner} />
            <OperatorServiceFee
              deployerCut={deployerCut}
              enableChange={isOwner}
            />
            <MinimumDelegationAmount
              minimumDelegationAmount={minDelegationAmount}
              enableChange={isOwner}
            />
            {pendingClaim.status !== Status.Success ||
            !pendingClaim.hasClaim ? null : (
              <>
                <Flex gap="l" alignItems="baseline">
                  <Flex gap="s">
                    <ServiceSmallStat
                      data={messages.unclaimed}
                      label={messages.rewardDistribution}
                    />
                  </Flex>
                  <ActionPlainLink
                    tooltipDisabled={!isClaimDisabled}
                    tooltipText={
                      isOwner
                        ? messages.operatorCantClaimTotalStakeOufOfBounds
                        : messages.delegatorCantClaimTotalStakeOutOfBounds
                    }
                    onClick={onClickClaimModal}
                    disabled={isClaimDisabled}
                  >
                    {isOwner ? messages.claim : messages.claimForOperator}
                  </ActionPlainLink>
                </Flex>
                <ConfirmTransactionModal
                  isOpen={isClaimModalOpen}
                  onClose={onCloseClaimModal}
                  withArrow={false}
                  topBox={makeClaimBox}
                  onConfirm={onConfirm}
                  status={claimStatus}
                  error={error}
                />
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
      {props.showPendingTransactions && hasPendingTx && isOwner ? (
        <Box p="xl" borderTop="default">
          <TransactionStatusContent />
        </Box>
      ) : null}
      {userDelegatesStatus === Status.Success && !delegates.isZero() ? (
        <Flex
          alignItems="center"
          justifyContent="space-between"
          p="xl"
          borderTop="default"
        >
          <Flex
            gap="l"
            alignItems="center"
            css={{ flexGrow: 1, maxWidth: 226 }}
          >
            <ManageDelegation delegates={delegates} wallet={wallet} />
            {showUndelegate ? (
              <UndelegateSection
                cantUndelegateReason={cantUndelegateReason}
                wallet={serviceUser.wallet}
                name={serviceUserAudiusProfile?.name || serviceUser.name}
                delegates={delegates}
              />
            ) : null}
          </Flex>
          <Flex direction="column" alignItems="flex-end">
            <Text variant="heading" size="m" color="accent">
              {AudiusClient.displayShortAud(delegates)}
            </Text>
            <Text variant="body" size="l" color="subdued" strength="strong">
              {messages.delegatedAudio}
            </Text>
          </Flex>
        </Flex>
      ) : null}
      {showDelegate ? (
        <Flex
          alignItems="center"
          justifyContent="space-between"
          p="xl"
          borderTop="default"
        >
          <Tooltip
            position={Position.TOP}
            text={cantDelegateReason}
            isDisabled={!Boolean(cantDelegateReason)}
          >
            <Button
              text={messages.delegate}
              type={ButtonType.PRIMARY}
              isDisabled={Boolean(cantDelegateReason)}
              onClick={onClickDelegate}
            />
          </Tooltip>
          <DelegateStakeModal
            serviceOperatorWallet={wallet}
            isOpen={isDelegateOpen}
            onClose={onCloseDelegate}
          />
        </Flex>
      ) : null}
    </Card>
  )
}

export default ManageService
