import { useCallback } from 'react'

import {
  emailSchema,
  createEmailPageMessages as messages
} from '@audius/common'
import {
  Box,
  Button,
  ButtonType,
  Divider,
  Flex,
  Hint,
  IconArrowRight,
  IconAudiusLogoHorizontalColor,
  IconError,
  Text,
  TextLink
} from '@audius/harmony'
import { ErrorMessage, Form, Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { audiusQueryContext } from 'app/AudiusQueryProvider'
import audiusLogoColored from 'assets/img/audiusLogoColored.png'
import {
  setLinkedSocialOnFirstPage,
  setValueField
} from 'common/store/pages/signon/actions'
import { getEmailField } from 'common/store/pages/signon/selectors'
import { HarmonyTextField } from 'components/form-fields/HarmonyTextField'
import PreloadImage from 'components/preload-image/PreloadImage'
import { useMedia } from 'hooks/useMedia'
import { useNavigateToPage } from 'hooks/useNavigateToPage'
import { SocialMediaLoginOptions } from 'pages/sign-up-page/components/SocialMediaLoginOptions'
import {
  SIGN_IN_PAGE,
  SIGN_UP_CREATE_LOGIN_DETAILS,
  SIGN_UP_PASSWORD_PAGE,
  SIGN_UP_REVIEW_HANDLE_PAGE
} from 'utils/route'

import { SignUpWithMetaMaskButton } from '../components/SignUpWithMetaMaskButton'
import { Heading, Page } from '../components/layout'

const EmailSchema = toFormikValidationSchema(emailSchema(audiusQueryContext))

export type SignUpEmailValues = {
  email: string
}

export const CreateEmailPage = () => {
  const { isMobile } = useMedia()
  const dispatch = useDispatch()
  const navigate = useNavigateToPage()
  const existingEmailValue = useSelector(getEmailField)

  const initialValues = {
    email: existingEmailValue.value ?? ''
  }

  const handleCompleteSocialMediaLogin = useCallback(
    (result: { requiresReview: boolean; handle: string }) => {
      const { handle, requiresReview } = result
      dispatch(setLinkedSocialOnFirstPage(true))
      dispatch(setValueField('handle', handle))
      navigate(
        requiresReview
          ? SIGN_UP_REVIEW_HANDLE_PAGE
          : SIGN_UP_CREATE_LOGIN_DETAILS
      )
    },
    [dispatch, navigate]
  )

  const handleSubmit = useCallback(
    async (values: SignUpEmailValues) => {
      const { email } = values
      dispatch(setValueField('email', email))
      navigate(SIGN_UP_PASSWORD_PAGE)
    },
    [dispatch, navigate]
  )

  const signInLink = (
    <TextLink variant='visible' asChild>
      <Link to={SIGN_IN_PAGE}>{messages.signIn}</Link>
    </TextLink>
  )

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={EmailSchema}
      validateOnChange={false}
    >
      {({ isSubmitting }) => (
        <Page as={Form}>
          <Box alignSelf='center'>
            {isMobile ? (
              <IconAudiusLogoHorizontalColor />
            ) : (
              <PreloadImage
                src={audiusLogoColored}
                alt='Audius Colored Logo'
                css={{
                  height: 160,
                  width: 160,
                  objectFit: 'contain'
                }}
              />
            )}
          </Box>
          <Heading
            heading={messages.title}
            description={
              <>
                {messages.subHeader.line1}
                <br /> {messages.subHeader.line2}
              </>
            }
            tag='h1'
            centered={isMobile}
          />
          <Flex direction='column' gap='l'>
            <HarmonyTextField
              name='email'
              autoComplete='email'
              label={messages.emailLabel}
              debouncedValidationMs={500}
              autoFocus
              helperText={null}
            />
            <ErrorMessage name='email'>
              {(errorMessage) => (
                <Hint icon={IconError}>
                  {errorMessage} {signInLink}
                </Hint>
              )}
            </ErrorMessage>
            <Divider>
              <Text variant='body' size={isMobile ? 's' : 'm'} color='subdued'>
                {messages.socialsDividerText}
              </Text>
            </Divider>
            <SocialMediaLoginOptions
              onCompleteSocialMediaLogin={handleCompleteSocialMediaLogin}
            />
          </Flex>
          <Flex direction='column' gap='l'>
            <Button
              variant={ButtonType.PRIMARY}
              type='submit'
              fullWidth
              iconRight={IconArrowRight}
              isLoading={isSubmitting}
            >
              {messages.signUp}
            </Button>

            <Text
              variant='body'
              size={isMobile ? 'm' : 'l'}
              textAlign={isMobile ? 'center' : undefined}
            >
              {messages.haveAccount} {signInLink}
            </Text>
          </Flex>
          {!isMobile ? (
            <Flex direction='column' gap='s'>
              <SignUpWithMetaMaskButton />
              <Text size='s' variant='body'>
                {messages.metaMaskNotRecommended}{' '}
                <TextLink variant='visible'>{messages.learnMore}</TextLink>
              </Text>
            </Flex>
          ) : null}
        </Page>
      )}
    </Formik>
  )
}
