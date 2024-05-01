import { useCallback } from 'react'

import {
  formatCooldownChallenges,
  useChallengeCooldownSchedule
} from '@audius/common/hooks'
import type { CommonState } from '@audius/common/store'
import {
  challengesSelectors,
  audioRewardsPageSelectors,
  audioRewardsPageActions
} from '@audius/common/store'
import { getClaimableChallengeSpecifiers } from '@audius/common/utils'
import { ScrollView, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { Flex, Text, Button, IconArrowRight } from '@audius/harmony-native'
import { makeStyles } from 'app/styles'
import { formatLabel } from 'app/utils/challenges'

import { AppDrawer, useDrawerState } from '../drawer/AppDrawer'
import { SummaryTable } from '../summary-table'

const { getChallengeRewardsModalType, getUndisbursedUserChallenges } =
  audioRewardsPageSelectors
const { claimChallengeReward, resetAndCancelClaimReward } =
  audioRewardsPageActions
const { getOptimisticUserChallenges } = challengesSelectors

const messages = {
  // Claim success toast
  claimSuccessMessage: 'Reward successfully claimed!',
  pending: (amount) => `${amount} Pending`,
  claimAudio: (amount) => `Claim ${amount} $AUDIO`,
  done: 'Done'
}

const MODAL_NAME = 'ClaimAllRewards'

const useStyles = makeStyles(({ spacing, palette, typography }) => ({
  button: {
    width: '100%' as const
  },
  stickyClaimRewardsContainer: {
    borderTopWidth: 1,
    borderTopColor: palette.borderDefault,
    paddingBottom: spacing(10),
    paddingHorizontal: spacing(4),
    paddingTop: spacing(4),
    width: '100%'
  }
}))
const config = {
  id: 'rewards',
  title: 'Rewards',
  description: 'You can check and claim all your upcoming rewards here.'
}

export const ClaimAllRewardsDrawer = () => {
  const styles = useStyles()

  const dispatch = useDispatch()
  const { onClose } = useDrawerState(MODAL_NAME)
  const modalType = useSelector(getChallengeRewardsModalType)
  const userChallenges = useSelector((state: CommonState) =>
    getOptimisticUserChallenges(state, true)
  )
  const undisbursedUserChallenges = useSelector(getUndisbursedUserChallenges)
  const { cooldownChallenges, summary } = useChallengeCooldownSchedule({
    multiple: true
  })
  const handleClose = useCallback(() => {
    dispatch(resetAndCancelClaimReward())
    onClose()
  }, [dispatch, onClose])

  const challenge = userChallenges ? userChallenges[modalType] : null

  const onClaim = useCallback(() => {
    if (!challenge) {
      return
    }
    dispatch(
      claimChallengeReward({
        claim: {
          challengeId: modalType,
          specifiers:
            challenge.challenge_type === 'aggregate'
              ? getClaimableChallengeSpecifiers(
                  challenge.undisbursedSpecifiers,
                  undisbursedUserChallenges
                )
              : [{ specifier: challenge.specifier, amount: challenge.amount }],
          amount: challenge?.claimableAmount ?? 0
        },
        retryOnFailure: true
      })
    )
  }, [dispatch, modalType, challenge, undisbursedUserChallenges])

  return (
    <AppDrawer
      modalName={MODAL_NAME}
      onClose={handleClose}
      isFullscreen
      isGestureSupported={false}
      title={config.title}
    >
      <ScrollView>
        <Flex pv='xl' ph='l' gap='xl'>
          <Text variant='body' size='m'>
            {config.description}
          </Text>
          <SummaryTable
            title={'Rewards'}
            secondaryTitle={'AUDIO'}
            summaryLabelColor='accent'
            summaryValueColor='default'
            items={formatCooldownChallenges(cooldownChallenges).map(
              formatLabel
            )}
            summaryItem={summary}
          />
        </Flex>
      </ScrollView>
      <View style={styles.stickyClaimRewardsContainer}>
        {summary && summary?.value > 0 ? (
          <Button
            variant='primary'
            onPress={onClaim}
            iconRight={IconArrowRight}
            fullWidth
          >
            {messages.claimAudio(summary?.value)}
          </Button>
        ) : (
          <Button variant='primary' onPress={handleClose} fullWidth>
            {messages.done}
          </Button>
        )}
      </View>
    </AppDrawer>
  )
}
