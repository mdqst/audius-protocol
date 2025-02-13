import { SquareSizes, UserMetadata } from '@audius/common/models'
import { Flex, Text, useTheme } from '@audius/harmony'

import DynamicImage from 'components/dynamic-image/DynamicImage'
import UserBadges from 'components/user-badges/UserBadges'
import { useProfilePicture } from 'hooks/useUserProfilePicture'

import styles from './ArtistInfo.module.css'

export const ArtistInfo = ({ user }: { user: UserMetadata }) => {
  const profilePicture = useProfilePicture(
    user.user_id,
    SquareSizes.SIZE_150_BY_150
  )
  const { iconSizes } = useTheme()
  return (
    <Flex gap='m' alignItems='center' justifyContent='flex-start'>
      <DynamicImage
        wrapperClassName={styles.profilePictureWrapper}
        skeletonClassName={styles.profilePictureSkeleton}
        className={styles.profilePicture}
        image={profilePicture}
      />
      <Flex direction='column' gap='xs'>
        <Flex gap='xs' alignItems='center' justifyContent='flex-start'>
          <Text variant='body' size='m' strength='strong'>
            {user.name}
          </Text>
          <UserBadges userId={user.user_id} badgeSize={iconSizes.m} inline />
        </Flex>
        <Text variant='body' size='m'>{`@${user.handle}`}</Text>
      </Flex>
    </Flex>
  )
}
