import { expect, jest, test } from '@jest/globals'
import { Processor } from '../../main'
import * as sns from '../../sns'
import * as sendEmail from '../../email/notifications/sendEmail'

import {
  createUsers,
  insertFollows,
  insertMobileDevices,
  insertMobileSettings,
  createTestDB,
  dropTestDB,
  replaceDBName
} from '../../utils/populateDB'

import { AppEmailNotification } from '../../types/notifications'
import { renderEmail } from '../../email/notifications/renderEmail'

describe('Follow Notification', () => {
  let processor: Processor

  const sendNotificationEmailSpy = jest.spyOn(sendEmail, 'sendNotificationEmail')
    .mockImplementation(() => Promise.resolve(true))
  const sendPushNotificationSpy = jest.spyOn(sns, 'sendPushNotification')
    .mockImplementation(() => Promise.resolve())

  beforeEach(async () => {
    jest.setTimeout(30 * 1000)
    const testName = expect.getState().currentTestName.replace(/\s/g, '_').toLocaleLowerCase()
    await Promise.all([
      createTestDB(process.env.DN_DB_URL, testName),
      createTestDB(process.env.IDENTITY_DB_URL, testName)
    ])
    processor = new Processor()
    await processor.init({
      identityDBUrl: replaceDBName(process.env.IDENTITY_DB_URL, testName),
      discoveryDBUrl: replaceDBName(process.env.DN_DB_URL, testName),
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await processor?.close()
    const testName = expect.getState().currentTestName.replace(/\s/g, '_').toLocaleLowerCase()
    await Promise.all([
      dropTestDB(process.env.DN_DB_URL, testName),
      dropTestDB(process.env.IDENTITY_DB_URL, testName),
    ])
  })

  test("Process follow push notification", async () => {
    await createUsers(processor.discoveryDB, [{ user_id: 1 }, { user_id: 2 }])
    await insertFollows(processor.discoveryDB, [{ follower_user_id: 1, followee_user_id: 2 }])
    await insertMobileSettings(processor.identityDB, [{ userId: 2 }])
    await insertMobileDevices(processor.identityDB, [{ userId: 2 }])
    await new Promise(resolve => setTimeout(resolve, 10))
    const pending = processor.listener.takePending()

    expect(pending?.appNotifications).toHaveLength(1)
    // Assert single pending
    await processor.appNotificationsProcessor.process(pending.appNotifications)

    expect(sendPushNotificationSpy).toHaveBeenCalledWith({
      type: 'ios',
      targetARN: 'arn:2',
      badgeCount: 0
    }, {
      title: 'Follow',
      body: 'user_1 followed you',
      data: {}
    })
  })

  test("Render a single Follow email", async () => {
    await createUsers(processor.discoveryDB, [{ user_id: 1 }, { user_id: 2 }])

    await insertFollows(processor.discoveryDB, [
      { follower_user_id: 2, followee_user_id: 1 }
    ])

    await new Promise(resolve => setTimeout(resolve, 10))

    const notifications: AppEmailNotification[] = [
      {
        type: 'follow',
        timestamp: new Date(),
        specifier: '2',
        group_id: 'follow:2',
        data: {
          follower_user_id: 2,
          followee_user_id: 1
        },
        user_ids: [1],
        receiver_user_id: 1
      }
    ]
    const notifHtml = await renderEmail({
      userId: 1,
      email: 'joey@audius.co',
      frequency: 'daily',
      notifications,
      dnDb: processor.discoveryDB,
      identityDb: processor.identityDB
    })
    expect(notifHtml).toMatchSnapshot()
  })


})
