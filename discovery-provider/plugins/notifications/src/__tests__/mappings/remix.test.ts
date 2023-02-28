import { expect, jest, test } from '@jest/globals'
import { Processor } from '../../main'
import * as sns from '../../sns'
import { getRedisConnection } from './../../utils/redisConnection'
import { config } from './../../config'

import {
  createUsers,
  insertMobileDevices,
  insertMobileSettings,
  createTestDB,
  dropTestDB,
  replaceDBName,
  createTracks,
  createBlocks,
} from '../../utils/populateDB'

describe('Remix Notification', () => {
  let processor: Processor

  const sendPushNotificationSpy = jest.spyOn(sns, 'sendPushNotification')
    .mockImplementation(() => Promise.resolve())

  beforeEach(async () => {
    const testName = expect.getState().currentTestName.replace(/\s/g, '_').toLocaleLowerCase()
    await Promise.all([
      createTestDB(process.env.DN_DB_URL, testName),
      createTestDB(process.env.IDENTITY_DB_URL, testName)
    ])
    const redis = await getRedisConnection()
    redis.del(config.lastIndexedMessageRedisKey)
    redis.del(config.lastIndexedReactionRedisKey)
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

  test("Process push notification for remix track", async () => {

    await createUsers(processor.discoveryDB, [{ user_id: 1 }, { user_id: 2 }])

    await createBlocks(processor.discoveryDB, [{ number: 1 }])

    await createTracks(processor.discoveryDB, [{ track_id: 10, owner_id: 1 }])
    await createTracks(processor.discoveryDB, [{
      track_id: 20,
      owner_id: 2,
      blocknumber: 1,
      remix_of: { 'tracks': [{ 'parent_track_id': 10 }] }
    }])

    await insertMobileSettings(processor.identityDB, [{ userId: 1 }])
    await insertMobileDevices(processor.identityDB, [{ userId: 1 }])
    await new Promise(resolve => setTimeout(resolve, 10))
    const pending = processor.listener.takePending()
    expect(pending?.appNotifications).toHaveLength(1)
    // Assert single pending
    await processor.appNotificationsProcessor.process(pending.appNotifications)

    expect(sendPushNotificationSpy).toHaveBeenCalledWith({
      type: 'ios',
      targetARN: 'arn:1',
      badgeCount: 0
    }, {
      title: 'New Remix Of Your Track ♻️',
      body: "New remix of your track track_title_10: user_2 uploaded track_title_20",
      data: {}
    })
  })

})
