import { useState } from 'react'

import type { Meta } from '@storybook/react'

import { Flex } from 'components/layout'

import { FollowButton } from './FollowButton'
import type { FollowButtonProps } from './types'

const SingleFollowButtonExample = (props: FollowButtonProps) => {
  const [following, setFollowing] = useState(false)
  return (
    <FollowButton
      isFollowing={following}
      onFollow={() => setFollowing(true)}
      onUnfollow={() => setFollowing(false)}
      {...props}
    />
  )
}

const meta: Meta<typeof FollowButton> = {
  title: 'Buttons/FollowButton [beta]',
  component: FollowButton,
  render: SingleFollowButtonExample
}

export default meta

export const Default = {}

export const Pill = {
  args: {
    variant: 'pill'
  }
}

const VariantsExample = (props: FollowButtonProps) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [following, setFollowing] = useState(false)
  return (
    <Flex gap='xl'>
      <FollowButton
        isFollowing={following}
        onFollow={() => setFollowing(true)}
        onUnfollow={() => setFollowing(false)}
        {...props}
      />
      <FollowButton
        isFollowing={following}
        onFollow={() => setFollowing(true)}
        onUnfollow={() => setFollowing(false)}
        variant='pill'
        {...props}
      />
    </Flex>
  )
}

export const Variants = {
  render: VariantsExample
}

const SizesExample = (props: FollowButtonProps) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [following, setFollowing] = useState(false)
  return (
    <Flex gap='xl'>
      <FollowButton
        isFollowing={following}
        onFollow={() => setFollowing(true)}
        onUnfollow={() => setFollowing(false)}
        {...props}
      />
      <FollowButton
        isFollowing={following}
        onFollow={() => setFollowing(true)}
        onUnfollow={() => setFollowing(false)}
        size='small'
        {...props}
      />
    </Flex>
  )
}

export const Sizes = {
  render: SizesExample
}
