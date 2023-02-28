import { expect, jest, test } from '@jest/globals'
import { Processor } from '../../main'
import * as sns from '../../sns'


import {
  createUsers,
  insertMobileDevices,
  insertMobileSettings,
  createTestDB,
  dropTestDB,
  replaceDBName,
  createTracks,
  createPlaylists,
  createBlocks
} from '../../utils/populateDB'


describe('Add track to playlist notification', () => {
  let processor: Processor

  const sendPushNotificationSpy = jest.spyOn(sns, 'sendPushNotification')
    .mockImplementation(() => Promise.resolve())

  beforeEach(async () => {
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

  test("Process push notification for add track to playlist", async () => {
    await createUsers(processor.discoveryDB, [{ user_id: 1 }, { user_id: 2, name: 'user_2' }])
    await createTracks(processor.discoveryDB, [{ track_id: 10, owner_id: 1, title: 'title_track' }])
    const createdAt = new Date()
    const trackAddedTime = Math.floor(new Date(createdAt.getTime() + 60 * 1000).getTime() / 1000)
    await createBlocks(processor.discoveryDB, [{ number: 1 }])
    await createPlaylists(processor.discoveryDB, [{
      blocknumber: 1,
      playlist_owner_id: 2, playlist_name: 'title_of_playlist', created_at: createdAt, playlist_id: 55,
      playlist_contents: { "track_ids": [{ "time": trackAddedTime, "track": 10 }] }
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
      title: 'Your track got on a playlist! 💿',
      body: `user_2 added title_track to their playlist title_of_playlist`,
      data: {}
    })
  })
})
