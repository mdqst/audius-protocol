import { useCallback, useMemo } from 'react'

import { useAudiusQueryContext } from '@audius/common/audius-query'
import { createEmailPageMessages } from '@audius/common/messages'
import { emailSchema } from '@audius/common/schemas'
import {
  setLinkedSocialOnFirstPage,
  setValueField,
  startSignUp
} from 'common/store/pages/signon/actions'
import {
  getEmailField,
  getLinkedSocialOnFirstPage
} from 'common/store/pages/signon/selectors'
import { Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
  Button,
  Divider,
  Flex,
  IconArrowRight,
  Text,
  TextLink
} from '@audius/harmony-native'
import { useNavigation } from 'app/hooks/useNavigation'
import { resetOAuthState } from 'app/store/oauth/actions'

import { NewEmailField } from '../components/NewEmailField'
import { SocialMediaLoading } from '../components/SocialMediaLoading'
import { SocialMediaSignUpButtons } from '../components/SocialMediaSignUpButtons'
import { Heading } from '../components/layout'
import { useSocialMediaLoader } from '../components/useSocialMediaLoader'
import type { SignUpScreenParamList } from '../types'
import { useTrackScreen } from '../utils/useTrackScreen'

import type { SignOnScreenProps } from './types'

type SignUpEmailValues = {
  email: string
}

export const CreateEmailScreen = (props: SignOnScreenProps) => {
  const { onChangeScreen } = props
  const dispatch = useDispatch()
  const navigation = useNavigation<SignUpScreenParamList>()
  const existingEmailValue = useSelector(getEmailField)
  const alreadyLinkedSocial = useSelector(getLinkedSocialOnFirstPage)
  const queryContext = useAudiusQueryContext()
  const initialValues = {
    email: existingEmailValue.value ?? ''
  }
  const EmailSchema = useMemo(() => {
    return toFormikValidationSchema(emailSchema(queryContext))
  }, [queryContext])

  useTrackScreen('CreateEmail')

  const handleSubmit = useCallback(
    (values: SignUpEmailValues) => {
      const { email } = values
      dispatch(setValueField('email', email))
      dispatch(startSignUp())
      navigation.navigate('CreatePassword', { email })
    },
    [dispatch, navigation]
  )

  const {
    isWaitingForSocialLogin,
    handleStartSocialMediaLogin,
    handleErrorSocialMediaLogin,
    handleCloseSocialMediaLogin,
    handleCompleteSocialMediaLogin
  } = useSocialMediaLoader({
    resetAction: resetOAuthState,
    linkedSocialOnThisPagePreviously: alreadyLinkedSocial
  })

  const handleSocialMediaLoginSuccess = useCallback(
    (result: { requiresReview: boolean; handle: string }) => {
      const { handle, requiresReview } = result
      dispatch(startSignUp())
      handleCompleteSocialMediaLogin()
      dispatch(setLinkedSocialOnFirstPage(true))
      dispatch(setValueField('handle', handle))

      navigation.navigate(
        requiresReview ? 'ReviewHandle' : 'CreateLoginDetails'
      )
    },
    [dispatch, handleCompleteSocialMediaLogin, navigation]
  )

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={EmailSchema}
      validateOnChange={false}
    >
      {({ handleSubmit }) => (
        <>
          {isWaitingForSocialLogin ? (
            <SocialMediaLoading onClose={handleCloseSocialMediaLogin} />
          ) : null}
          <Flex style={{ zIndex: 1 }} gap='l'>
            <Heading
              heading={createEmailPageMessages.title}
              description={
                <>
                  {createEmailPageMessages.subHeader.line1}
                  {'\n'}
                  {createEmailPageMessages.subHeader.line2}
                </>
              }
              centered
            />
            <Flex direction='column' gap='l'>
              <NewEmailField
                name='email'
                label={createEmailPageMessages.emailLabel}
                onChangeScreen={onChangeScreen}
              />
              <Divider>
                <Text variant='body' size='s' color='subdued'>
                  {createEmailPageMessages.socialsDividerText}
                </Text>
              </Divider>
              <SocialMediaSignUpButtons
                onError={handleErrorSocialMediaLogin}
                onStart={handleStartSocialMediaLogin}
                onCompleteSocialMediaLogin={handleSocialMediaLoginSuccess}
                onClose={handleCloseSocialMediaLogin}
                page='create-email'
              />
            </Flex>
            <Flex direction='column' gap='l'>
              <Button
                onPress={() => handleSubmit()}
                fullWidth
                iconRight={IconArrowRight}
              >
                {createEmailPageMessages.signUp}
              </Button>
              <Text variant='body' size='m' textAlign='center'>
                {createEmailPageMessages.haveAccount}{' '}
                <TextLink
                  variant='visible'
                  onPress={() => onChangeScreen('sign-in')}
                >
                  {createEmailPageMessages.signIn}
                </TextLink>
              </Text>
            </Flex>
          </Flex>
        </>
      )}
    </Formik>
  )
}
