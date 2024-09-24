import { useCurrentCommentSection } from '@audius/common/context'
import {
  Flex,
  IconButton,
  IconKebabHorizontal,
  PopupMenu,
  PopupMenuItem,
  Text
} from '@audius/harmony'
import { useTheme } from '@emotion/react'

const messages = {
  turnOffNotifs: 'Turn off notifications'
}

type CommentHeaderProps = {
  isLoading?: boolean
}

export const CommentHeader = (props: CommentHeaderProps) => {
  const { isLoading } = props
  const { handleMuteEntityNotifications, isEntityOwner, commentCount } =
    useCurrentCommentSection()
  const { motion } = useTheme()
  const popupMenuItems: PopupMenuItem[] = [
    { onClick: handleMuteEntityNotifications, text: messages.turnOffNotifs }
  ]

  return (
    <Flex justifyContent='space-between' w='100%'>
      <Text variant='title' size='l'>
        Comments {!isLoading ? `(${commentCount})` : null}
      </Text>
      {isEntityOwner && !isLoading ? (
        <PopupMenu
          items={popupMenuItems}
          renderTrigger={(anchorRef, triggerPopup) => (
            <IconButton
              aria-label='Show comment options'
              icon={IconKebabHorizontal}
              color='subdued'
              ref={anchorRef}
              css={{
                cursor: 'pointer',
                transition: motion.hover
              }}
              onClick={() => {
                triggerPopup()
              }}
              className='kebabIcon'
            />
          )}
        />
      ) : null}
    </Flex>
  )
}
