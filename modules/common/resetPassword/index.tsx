import {yupResolver} from '@hookform/resolvers/yup';
import {Grid, Paper} from '@mui/material';
import {useRouter} from 'next/router';
import React, {useEffect, useMemo, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useIntl} from 'react-intl';
import IntlMessages from '../../@core/utility/IntlMessages';
import {
  educDomain,
  RESEND_CODE_RETRY_TIME_IN_MILLIS,
  SECONDARY_APP_HEADER_HEIGHT,
} from '../../@core/common/constants';
import {TEXT_REGEX_PASSWORD} from '../../@core/common/patternRegex';
import {getSSOLoginUrl} from '../../@core/common/SSOConfig';
import SubmitButton from '../../@core/elements/button/SubmitButton/SubmitButton';
import {H6} from '../../@core/elements/common';
import CustomTextInput from '../../@core/elements/input/CustomTextInput/CustomTextInput';
import useNotiStack from '../../@core/hooks/useNotifyStack';
import cookieInstance, {
  getBrowserCookie,
  removeBrowserCookie,
} from '../../@core/libs/cookieInstance';
import yup from '../../@core/libs/yup';
import {processServerSideErrors} from '../../@core/utilities/validationErrorHandler';
import {resetPassword} from '../../services/userManagement/UserService';
import {
  COOKIE_KEY_FORGOT_PASSWORD_USERNAME,
  COOKIE_KEY_SEND_TIME,
} from '../../shared/constants/AppConst';
import {classes, StyledContainer} from './index.style';

const ResetPasswordPage = () => {
  const {messages} = useIntl();
  const router = useRouter();
  const {errorStack, successStack} = useNotiStack();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    let resendDate = cookieInstance.get(COOKIE_KEY_SEND_TIME);
    const username = getBrowserCookie(COOKIE_KEY_FORGOT_PASSWORD_USERNAME);
    const currentDate = new Date();
    // const otpCode = getBrowserCookie(COOKIE_KEY_FORGOT_PASSWORD_VERIFY_OTP);
    // if (!username || !otpCode || String(otpCode) != '1') {

    if (
      !username ||
      !(
        resendDate &&
        currentDate.getTime() - resendDate < RESEND_CODE_RETRY_TIME_IN_MILLIS
      )
    ) {
      router.push(educDomain()).then((r) => {});
    }
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      new_password: yup
        .string()
        .trim()
        .min(8)
        .required()
        .matches(TEXT_REGEX_PASSWORD)
        .label(messages['common.password'] as string),
      password_confirmation: yup
        .string()
        .trim()
        .required()
        .oneOf(
          [yup.ref('new_password'), null],
          messages['common.password_must_match'] as string,
        )
        .label(messages['common.retype_password'] as string),
    });
  }, [messages]);

  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<any>({resolver: yupResolver(validationSchema)});

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      data.username = getBrowserCookie(COOKIE_KEY_FORGOT_PASSWORD_USERNAME);
      await resetPassword(data);
      setIsSubmitted(true);
      successStack(<IntlMessages id='forgot_password.reset_password' />);
      removeBrowserCookie(COOKIE_KEY_FORGOT_PASSWORD_USERNAME);
      // removeBrowserCookie(COOKIE_KEY_FORGOT_PASSWORD_VERIFY_OTP);
      router.push(getSSOLoginUrl()).then((r) => {});
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
    }
  };
  return (
    <StyledContainer
      sx={{
        display: 'flex',
        height: `calc(100vh - ${SECONDARY_APP_HEADER_HEIGHT * 2}px)`,
      }}>
      <Paper className={classes.paperBox}>
        <H6 align={'center'} mb={4} sx={{borderBottom: '1px solid #8888'}}>
          {messages['common.reset_password']}
        </H6>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomTextInput
                required
                id='new_password'
                type={'password'}
                helperText={messages['common.passwordHint']}
                label={messages['common.new_password']}
                control={control}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextInput
                required
                type={'password'}
                id='password_confirmation'
                label={messages['common.retype_password']}
                control={control}
                errorInstance={errors}
              />
            </Grid>
            <Grid
              item
              xs={12}
              display={'flex'}
              justifyContent={'center'}
              mt={2}>
              <SubmitButton
                startIcon={false}
                isSubmitting={isSubmitting}
                label={messages['common.submit'] as string}
                size='medium'
                isDisable={isSubmitting || isSubmitted}
              />
            </Grid>
          </Grid>
        </form>
      </Paper>
    </StyledContainer>
  );
};

export default ResetPasswordPage;
