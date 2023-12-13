import { useCallback } from 'react'

import {
  finishProfileSchema,
  finishProfilePageMessages as messages
} from '@audius/common'
import type { Image } from '@audius/common'
import { css } from '@emotion/native'
import {
  getHandleField,
  getIsVerified
} from 'audius-client/src/common/store/pages/signon/selectors'
import { setField, setValueField } from 'common/store/pages/signon/actions'
import { Formik, useField } from 'formik'
import type { ImageURISource } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { Paper, useTheme } from '@audius/harmony-native'
import { TextField } from 'app/components/fields'
import { useNavigation } from 'app/hooks/useNavigation'
import { launchSelectImageActionSheet } from 'app/utils/launchSelectImageActionSheet'

import { AccountHeader } from '../components/AccountHeader'
import { Heading, Page, PageFooter } from '../components/layout'
import type { SignUpScreenParamList } from '../types'

const finishProfileFormikSchema = toFormikValidationSchema(finishProfileSchema)

const initialValues = {
  profileImage: null,
  coverPhoto: null,
  displayName: ''
}

type FinishProfileValues = {
  displayName: string
  profileImage: ImageURISource | null
  coverPhoto?: ImageURISource | null
}

export const FinishProfileScreen = () => {
  const navigation = useNavigation<SignUpScreenParamList>()
  const dispatch = useDispatch()
  const { spacing } = useTheme()

  const handleSubmit = useCallback(
    (values: FinishProfileValues) => {
      const { displayName, profileImage, coverPhoto } = values
      dispatch(setValueField('name', displayName))
      dispatch(setField('profileImage', { value: profileImage }))
      if (coverPhoto) {
        dispatch(setField('coverPhoto', { value: coverPhoto }))
      }
      navigation.navigate('SelectGenre')
    },
    [dispatch, navigation]
  )

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={finishProfileFormikSchema}
    >
      {({ handleSubmit }) => (
        <Page>
          <Heading
            heading={messages.header}
            description={messages.description}
          />
          <Paper>
            <AccountHeaderField />
            <TextField
              name='displayName'
              label={messages.displayName}
              style={css({
                padding: spacing.l,
                paddingTop: spacing.unit10
              })}
            />
          </Paper>
          <PageFooter onSubmit={handleSubmit} />
        </Page>
      )}
    </Formik>
  )
}

const AccountHeaderField = () => {
  const [{ value: profileImage }, , { setValue: setProfileImage }] =
    useField<ImageURISource>('profileImage')

  const handleSelectProfilePicture = useCallback(() => {
    const handleImageSelected = (image: Image) => {
      setProfileImage(image)
    }

    launchSelectImageActionSheet(
      handleImageSelected,
      { height: 1000, width: 1000, cropperCircleOverlay: true },
      'profilePicture'
    )
  }, [setProfileImage])

  const [{ value: coverPhoto }, , { setValue: setCoverPhoto }] =
    useField<ImageURISource>('coverPhoto')

  const handleSelectCoverPhoto = useCallback(() => {
    const handleImageSelected = (image: Image) => {
      setCoverPhoto(image)
    }
    launchSelectImageActionSheet(
      handleImageSelected,
      { height: 1000, width: 2000, freeStyleCropEnabled: true },
      'coverPhoto'
    )
  }, [setCoverPhoto])

  const [{ value: displayName }] = useField('displayName')
  const { value: handle } = useSelector(getHandleField)
  const isVerified = useSelector(getIsVerified)

  return (
    <AccountHeader
      profilePicture={profileImage}
      coverPhoto={coverPhoto}
      onSelectProfilePicture={handleSelectProfilePicture}
      onSelectCoverPhoto={handleSelectCoverPhoto}
      displayName={displayName}
      handle={handle}
      isVerified={isVerified}
    />
  )
}
