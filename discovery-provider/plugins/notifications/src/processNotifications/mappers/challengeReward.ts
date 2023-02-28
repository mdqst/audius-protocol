import { Knex } from 'knex'
import { NotificationRow, UserRow } from '../../types/dn'
import { ChallengeRewardNotification } from '../../types/notifications'
import { BaseNotification, Device } from './base'
import { sendPushNotification } from '../../sns'
import { ResourceIds, Resources } from '../../email/notifications/renderEmail'
import { ChallengeId } from '../../email/notifications/types'

type ChallengeRewardRow = Omit<NotificationRow, 'data'> & { data: ChallengeRewardNotification }
export class ChallengeReward extends BaseNotification<ChallengeRewardRow> {


  receiverUserId: number
  amount: number
  specifier: string
  challengeId: ChallengeId

  challengeInfoMap = {
    'profile-completion': {
      title: '✅️ Complete your Profile',
      amount: 1
    },
    'listen-streak': {
      title: '🎧 Listening Streak: 7 Days',
      amount: 1
    },
    'track-upload': {
      title: '🎶 Upload 5 Tracks',
      amount: 1
    },
    referrals: {
      title: '📨 Invite your Friends',
      amount: 1
    },
    referred: {
      title: '📨 Invite your Friends',
      amount: 1
    },
    'ref-v': {
      title: '📨 Invite your Fans',
      amount: 1
    },
    'connect-verified': {
      title: '✅️ Link Verified Accounts',
      amount: 5
    },
    'mobile-install': {
      title: '📲 Get the App',
      amount: 1
    },
    'send-first-tip': {
      title: '🤑 Send Your First Tip',
      amount: 2
    },
    'first-playlist': {
      title: '🎼 Create a Playlist',
      amount: 2
    }
  }

  constructor(dnDB: Knex, identityDB: Knex, notification: ChallengeRewardRow) {
    super(dnDB, identityDB, notification)
    const userIds: number[] = this.notification.user_ids!
    this.receiverUserId = userIds[0]
    this.amount = this.notification.data.amount
    this.specifier = this.notification.data.specifier
    this.challengeId = this.notification.data.challenge_id
  }

  getPushBodyText() {
    if (this.challengeId === 'referred') {
      return `You’ve received ${this.challengeInfoMap[this.challengeId].amount
        } $AUDIO for being referred! Invite your friends to join to earn more!`
    }
    return `You’ve earned ${this.challengeInfoMap[this.challengeId].amount
      } $AUDIO for completing this challenge!`

  }

  async pushNotification() {

    const res: Array<{ user_id: number, name: string, is_deactivated: boolean }> = await this.dnDB.select('user_id', 'name', 'is_deactivated')
      .from<UserRow>('users')
      .where('is_current', true)
      .whereIn('user_id', [this.receiverUserId])
    const users = res.reduce((acc, user) => {
      acc[user.user_id] = { name: user.name, isDeactivated: user.is_deactivated }
      return acc
    }, {} as Record<number, { name: string, isDeactivated: boolean }>)


    if (users?.[this.receiverUserId]?.isDeactivated) {
      return
    }

    // Get the user's notification setting from identity service
    const userNotifications = await super.getShouldSendNotification(this.receiverUserId)

    // If the user has devices to the notification to, proceed
    if ((userNotifications.mobile?.[this.receiverUserId]?.devices ?? []).length > 0) {
      const devices: Device[] = userNotifications.mobile?.[this.receiverUserId].devices
      await Promise.all(devices.map(device => {
        return sendPushNotification({
          type: device.type,
          badgeCount: userNotifications.mobile[this.receiverUserId].badgeCount,
          targetARN: device.awsARN
        }, {
          title: this.challengeInfoMap[this.challengeId].title,
          body: this.getPushBodyText(),
          data: {}
        })
      }))
      // TODO: increment badge count

    }
    // 

    if (userNotifications.browser) {
      // TODO: Send out browser

    }
    if (userNotifications.email) {
      // TODO: Send out email
    }

  }

  getResourcesForEmail(): ResourceIds {
    return {
      users: new Set([this.receiverUserId]),
    }
  }

  formatEmailProps(resources: Resources) {
    const receiverUserId = resources.users[this.receiverUserId]
    return {
      type: this.notification.type,
      receiverUserId: { name: receiverUserId.name },
      amount: this.amount
    }
  }

}
