import { useCallback } from 'react'

import {
  cacheCollectionsActions,
  cacheCollectionsSelectors,
  duplicateAddConfirmationModalUISelectors,
  fillString
} from '@audius/common'
import { capitalize } from 'lodash'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { Text, Button } from 'app/components/core'
import { useToast } from 'app/hooks/useToast'
import { makeStyles } from 'app/styles'

import { useDrawerState } from '../drawer'
import Drawer from '../drawer/Drawer'
const { getPlaylistId, getTrackId } = duplicateAddConfirmationModalUISelectors
const { addTrackToPlaylist } = cacheCollectionsActions
const { getCollection } = cacheCollectionsSelectors

const getMessages = (collectionType: 'album' | 'playlist') => ({
  drawerTitle: 'Already Added',
  drawerBody: `This is already in your%0 ${collectionType}.`,
  buttonAddText: 'Add Anyway',
  buttonCancelText: "Don't Add",
  addedToast: `Added To ${capitalize(collectionType)}!`
})

const useStyles = makeStyles(({ palette, spacing }) => ({
  title: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing(2),
    alignItems: 'center',
    paddingVertical: spacing(6),
    borderBottomColor: palette.neutralLight8,
    borderBottomWidth: 1
  },
  titleText: {
    textTransform: 'uppercase'
  },
  container: {
    marginHorizontal: spacing(4)
  },
  body: {
    margin: spacing(4),
    lineHeight: spacing(6),
    textAlign: 'center'
  },
  buttonContainer: {
    gap: spacing(2),
    marginBottom: spacing(8)
  }
}))

export const DuplicateAddConfirmationDrawer = () => {
  const playlistId = useSelector(getPlaylistId)
  const trackId = useSelector(getTrackId)
  const playlist = useSelector((state) =>
    getCollection(state, { id: playlistId })
  )
  const dispatch = useDispatch()
  const styles = useStyles()
  const { toast } = useToast()
  const { isOpen, onClose } = useDrawerState('DuplicateAddConfirmation')

  const messages = getMessages(playlist?.is_album ? 'album' : 'playlist')

  const handleAdd = useCallback(() => {
    if (playlistId && trackId) {
      toast({ content: messages.addedToast })
      dispatch(addTrackToPlaylist(trackId, playlistId))
    }
    onClose()
  }, [playlistId, trackId, onClose, toast, messages.addedToast, dispatch])

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <View style={styles.container}>
        <View style={styles.title}>
          <Text
            weight='heavy'
            color='neutral'
            fontSize='xl'
            style={styles.titleText}
          >
            {messages.drawerTitle}
          </Text>
        </View>
        <Text style={styles.body} fontSize='large' weight='medium'>
          {fillString(
            messages.drawerBody,
            playlist ? ` "${playlist.playlist_name}"` : ''
          )}
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            title={messages.buttonCancelText}
            variant='primary'
            size='large'
            fullWidth
            onPress={onClose}
          />
          <Button
            title={messages.buttonAddText}
            variant='common'
            size='large'
            fullWidth
            onPress={handleAdd}
          />
        </View>
      </View>
    </Drawer>
  )
}
