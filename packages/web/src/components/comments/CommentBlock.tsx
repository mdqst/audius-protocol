import { useMemo, useState } from 'react'

import { useGetCommentById, useGetUserById } from '@audius/common/api'
import {
  useCommentPostStatus,
  useCurrentCommentSection,
  useDeleteComment
} from '@audius/common/context'
import { useStatusChange } from '@audius/common/hooks'
import { commentsMessages as messages } from '@audius/common/messages'
import { Status } from '@audius/common/models'
import { cacheUsersSelectors } from '@audius/common/store'
import { ArtistPick, Box, Flex, Text, Timestamp } from '@audius/harmony'
import { Comment, ReplyComment } from '@audius/sdk'
import { useSelector } from 'react-redux'

import { Avatar } from 'components/avatar'
import { UserLink } from 'components/link'
import { AppState } from 'store/types'

import { CommentActionBar } from './CommentActionBar'
import { CommentBadge } from './CommentBadge'
import { CommentForm } from './CommentForm'
import { TimestampLink } from './TimestampLink'
const { getUser } = cacheUsersSelectors

export type CommentBlockProps = {
  commentId: string
  parentCommentId?: string
  hideActions?: boolean
}

const CommentBlockInternal = (
  props: Omit<CommentBlockProps, 'commentId'> & {
    comment: Comment | ReplyComment
  }
) => {
  const { comment, parentCommentId, hideActions } = props

  const {
    id: commentId,
    message,
    trackTimestampS,
    createdAt,
    userId: commentUserIdStr,
    isEdited,
    isArtistReacted
  } = comment
  const isParentComment = 'isPinned' in comment
  const isPinned = isParentComment ? comment.isPinned : false // pins dont exist on replies
  const isTombstone = isParentComment ? !!comment.isTombstone : false
  const createdAtDate = useMemo(() => new Date(createdAt), [createdAt])

  const commentUserId = Number(commentUserIdStr)

  const userHandle = useSelector(
    (state: AppState) => getUser(state, { id: commentUserId })?.handle
  )

  const { artistId } = useCurrentCommentSection()

  const [deleteComment] = useDeleteComment()

  // This status checks specifically for this comment - no matter where the post request originated
  const commentPostStatus = useCommentPostStatus(comment)

  const isCommentLoading = commentPostStatus === Status.LOADING
  useStatusChange(commentPostStatus, {
    onSuccess: () => setShowReplyInput(false)
  })

  // triggers a fetch to get user profile info
  useGetUserById({ id: commentUserId }) // TODO: display a load state while fetching

  const [showEditInput, setShowEditInput] = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const isCommentByArtist = commentUserId === artistId

  return (
    <Flex w='100%' gap='l' css={{ opacity: isTombstone ? 0.5 : 1 }}>
      <Box css={{ flexShrink: 0, width: 44 }}>
        <Avatar
          userId={commentUserId}
          css={{
            width: 44,
            height: 44,
            cursor: isTombstone ? 'default' : 'pointer'
          }}
          // TODO: This is a hack - currently if you provide an undefined userId it will link to signin/feed
          onClick={isTombstone ? () => {} : undefined}
          popover
        />
      </Box>
      <Flex direction='column' gap='s' w='100%' alignItems='flex-start'>
        <Box css={{ position: 'absolute', top: 0, right: 0 }}>
          <CommentBadge
            isArtist={isCommentByArtist}
            commentUserId={commentUserId}
          />
        </Box>
        {isPinned || isArtistReacted ? (
          <Flex justifyContent='space-between' w='100%'>
            <ArtistPick isLiked={isArtistReacted} isPinned={isPinned} />
          </Flex>
        ) : null}
        {!isTombstone ? (
          <Flex gap='s' alignItems='center'>
            <UserLink userId={commentUserId} popover />
            <Flex gap='xs' alignItems='flex-end' h='100%'>
              <Timestamp time={createdAtDate} />
              {trackTimestampS !== undefined ? (
                <>
                  <Text color='subdued' size='xs'>
                    •
                  </Text>

                  <TimestampLink trackTimestampS={trackTimestampS} />
                </>
              ) : null}
            </Flex>
          </Flex>
        ) : null}
        {showEditInput ? (
          <CommentForm
            onSubmit={() => {
              setShowEditInput(false)
            }}
            commentId={commentId}
            initialValue={message}
            isEdit
            hideAvatar
          />
        ) : (
          <Text variant='body' size='s' lineHeight='multi' textAlign='left'>
            {message}
            {isEdited ? (
              <Text color='subdued'> ({messages.edited})</Text>
            ) : null}
          </Text>
        )}
        {hideActions ? null : (
          <CommentActionBar
            comment={comment}
            onClickReply={() => setShowReplyInput((prev) => !prev)}
            onClickEdit={() => setShowEditInput((prev) => !prev)}
            onClickDelete={() => deleteComment(commentId)}
            isDisabled={isCommentLoading || isTombstone}
            hideReactCount={isTombstone}
          />
        )}

        {showReplyInput ? (
          <CommentForm
            parentCommentId={parentCommentId ?? comment.id}
            initialValue={`@${userHandle}`}
          />
        ) : null}
      </Flex>
    </Flex>
  )
}

// This is an extra component wrapper because the comment data coming back from aquery could be undefined
// There's no way to return early in the above component due to rules of hooks ordering
export const CommentBlock = (props: CommentBlockProps) => {
  const { data: comment } = useGetCommentById({ id: props.commentId })
  if (!comment) return null
  return <CommentBlockInternal {...props} comment={comment} />
}
