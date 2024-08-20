import React from 'react'

import { useCurrentCommentSection } from '@audius/common/context'
import type { BottomSheetModal } from '@gorhom/bottom-sheet'

import {
  Divider,
  Flex,
  IconButton,
  IconCloseAlt,
  Text
} from '@audius/harmony-native'

type CommentDrawerHeaderProps = {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>
}

export const CommentDrawerHeader = (props: CommentDrawerHeaderProps) => {
  const { bottomSheetModalRef } = props

  const { comments, commentSectionLoading: isLoading } =
    useCurrentCommentSection()

  const handlePressClose = () => {
    bottomSheetModalRef.current?.dismiss()
  }

  return (
    <Flex>
      <Flex
        direction='row'
        w='100%'
        justifyContent='space-between'
        p='l'
        alignItems='center'
      >
        <Text variant='body' size='m'>
          Comments
          {!isLoading && comments?.length ? (
            <Text color='subdued'>&nbsp;({comments.length})</Text>
          ) : null}
        </Text>
        <IconButton
          icon={IconCloseAlt}
          onPress={handlePressClose}
          color='subdued'
          size='m'
        />
      </Flex>
      <Divider orientation='horizontal' />
    </Flex>
  )
}
