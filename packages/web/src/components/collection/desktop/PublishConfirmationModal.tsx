import { useCallback } from 'react'

import {
  Collection,
  CommonState,
  cacheCollectionsActions,
  collectionPageSelectors
} from '@audius/common'
import {
  Button,
  ButtonType,
  IconRocket,
  Modal,
  ModalContent,
  ModalContentText,
  ModalFooter,
  ModalHeader,
  ModalProps,
  ModalTitle
} from '@audius/stems'
import { useDispatch, useSelector } from 'react-redux'

import styles from './PublishConfirmationModal.module.css'
const { getCollection } = collectionPageSelectors

const { publishPlaylist } = cacheCollectionsActions

const messages = {
  title: 'Make Public',
  description: (collectionType: 'album' | 'playlist') =>
    `Are you sure you want to make this ${collectionType} public? It will be shared to your feed and your subscribed followers will be notified.`,
  cancel: 'Cancel',
  publish: 'Make Public'
}

type PublishConfirmationModalProps = Omit<ModalProps, 'children'> & {
  collectionId: number
}

export const PublishConfirmationModal = (
  props: PublishConfirmationModalProps
) => {
  const { collectionId, ...other } = props
  const { onClose } = other
  const dispatch = useDispatch()

  const { is_album } = useSelector((state: CommonState) =>
    getCollection(state, { id: collectionId })
  ) as Collection

  const handlePublish = useCallback(() => {
    dispatch(publishPlaylist(collectionId))
    onClose()
  }, [dispatch, collectionId, onClose])

  return (
    <Modal {...other} size='small'>
      <ModalHeader>
        <ModalTitle title={messages.title} icon={<IconRocket />} />
      </ModalHeader>
      <ModalContent>
        <ModalContentText>
          {messages.description(is_album ? 'album' : 'playlist')}
        </ModalContentText>
      </ModalContent>
      <ModalFooter className={styles.footer}>
        <Button
          fullWidth
          text={messages.cancel}
          type={ButtonType.COMMON}
          onClick={onClose}
        />
        <Button
          fullWidth
          text={messages.publish}
          leftIcon={<IconRocket />}
          type={ButtonType.PRIMARY}
          onClick={handlePublish}
        />
      </ModalFooter>
    </Modal>
  )
}
