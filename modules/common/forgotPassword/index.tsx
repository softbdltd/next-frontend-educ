import {yupResolver} from '@hookform/resolvers/yup';
import {Grid, Paper} from '@mui/material';
import {useRouter} from 'next/router';
import React, {useEffect, useMemo, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useIntl} from 'react-intl';
import IntlMessages from '../../@core/utility/IntlMessages';
import {LINK_VERIFY_OTP_FORGOT_PASSWORD} from '../../@core/common/appLinks';
import {RESEND_CODE_RETRY_TIME_IN_MILLIS} from '../../@core/common/constants';
import SubmitButton from '../../@core/elements/button/SubmitButton/SubmitButton';
import {Body2, H3, H6} from '../../@core/elements/common';
import CustomTextInput from '../../@core/elements/input/CustomTextInput/CustomTextInput';
import useNotiStack from '../../@core/hooks/useNotifyStack';
import cookieInstance, {
  setBrowserCookie,
} from '../../@core/libs/cookieInstance';
import yup from '../../@core/libs/yup';
import {getAllKeysFromErrorObj} from '../../@core/utilities/helpers';
import {processServerSideErrors} from '../../@core/utilities/validationErrorHandler';
import {sendForgotPasswordOTP} from '../../services/userManagement/UserService';
import {
  COOKIE_KEY_FORGOT_PASSWORD_USERNAME,
  COOKIE_KEY_SEND_TIME,
} from '../../shared/constants/AppConst';
import {classes, StyledContainer} from '../signup/index.style';

const ForgotPasswordPage = () => {
  const {messages} = useIntl();
  const router = useRouter();
  const {errorStack, successStack} = useNotiStack();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      username: yup
        .string()
        .required()
        .label(messages['common.user_name'] as string),
    });
  }, [messages]);

  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting, submitCount},
  } = useForm<any>({resolver: yupResolver(validationSchema)});

  useEffect(() => {
    const errorKeysArr = getAllKeysFromErrorObj(errors);
    if (submitCount && errorKeysArr.length > 0) {
      let field = document.getElementsByName(errorKeysArr?.[0]);
      if (field.length > 0) {
        field[0]?.focus();
      }
    }
  }, [errors, submitCount]);

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      await sendForgotPasswordOTP(data);
      successStack(<IntlMessages id='forgot_password.otp_send_success' />);
      let expireDatevForUsername = new Date();
      expireDatevForUsername.setTime(
        expireDatevForUsername.getTime() + 30 * 60 * 1000,
      );
      await setBrowserCookie(
        COOKIE_KEY_FORGOT_PASSWORD_USERNAME,
        data?.username,
        {
          expires: expireDatevForUsername,
        },
      );
      //
      const current = new Date();
      let expireDate = new Date();
      const expireTime =
        expireDate.getTime() + RESEND_CODE_RETRY_TIME_IN_MILLIS;
      expireDate.setTime(expireTime);

      cookieInstance.set(COOKIE_KEY_SEND_TIME, current.getTime(), {
        expires: expireDate,
      });

      setIsSubmitted(true);
      router.push(LINK_VERIFY_OTP_FORGOT_PASSWORD).then((r) => {});
      // router.push(LINK_RESET_PASSWORD).then((r) => {});
    } catch (error: any) {
      processServerSideErrors({error, errorStack});
    }
  };

  return (
    <StyledContainer sx={{display: 'flex'}}>
      <H3 tabIndex={0} className={classes.visuallyHidden}>
        {messages['common.forgotten_password_recovery']}
      </H3>
      <Paper className={classes.paperBox}>
        <H6 align={'center'} mb={4} sx={{borderBottom: '1px solid #8888'}}>
          {messages['common.find_your_account']}
        </H6>
        <Body2 mb={2}>{messages['common.enter_username']}</Body2>{' '}
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomTextInput
                required
                id='username'
                label={messages['common.user_name']}
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
                size='large'
                isDisable={isSubmitting || isSubmitted}
              />
            </Grid>
          </Grid>
        </form>
      </Paper>
    </StyledContainer>
  );
};

export default ForgotPasswordPage;
