import {yupResolver} from '@hookform/resolvers/yup';
import {Box, Container, Grid, Input, Link, Typography} from '@mui/material';
import {useRouter} from 'next/router';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useIntl} from 'react-intl';
import IntlMessages from '../../@core/utility/IntlMessages';
import {
  LINK_FORGOT_PASSWORD,
  LINK_RESET_PASSWORD,
} from '../../@core/common/appLinks';
import {
  educDomain,
  RESEND_CODE_RETRY_TIME_IN_MILLIS,
  SECONDARY_APP_HEADER_HEIGHT,
} from '../../@core/common/constants';
import SubmitButton from '../../@core/elements/button/SubmitButton/SubmitButton';
import UncontrolledTextInput from '../../@core/elements/input/UncontrolledTextInput';
import useNotiStack from '../../@core/hooks/useNotifyStack';
import cookieInstance, {
  getBrowserCookie,
  setBrowserCookie,
} from '../../@core/libs/cookieInstance';
import yup from '../../@core/libs/yup';
import {processServerSideErrors} from '../../@core/utilities/validationErrorHandler';
import {
  sendForgotPasswordOTP,
  verifyForgotPasswordOtp,
} from '../../services/userManagement/UserService';
import {
  COOKIE_KEY_FORGOT_PASSWORD_USERNAME,
  COOKIE_KEY_FORGOT_PASSWORD_VERIFY_OTP,
  COOKIE_KEY_SEND_TIME,
} from '../../shared/constants/AppConst';
import {classes, StyledPaper} from './index.style';

const inputProps = {
  maxLength: 1,
  style: {
    textAlign: 'center',
  },
};
const OTPVerificationPage = () => {
  const {messages} = useIntl();
  const {errorStack, successStack} = useNotiStack();
  const [resendTime, setResendTime] = useState<string | null>(null);
  const [resendCode, setResendCode] = useState<boolean>(false);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const router = useRouter();
  const validationSchema = useMemo(() => {
    return yup.object().shape({
      codes: yup
        .string()
        .required()
        .length(6)
        .label(messages['common.verification_code'] as string),
    });
  }, [messages]);

  const {
    handleSubmit,
    register,
    setError,
    setValue,
    setFocus,
    watch,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<any>({resolver: yupResolver(validationSchema)});

  const watchAllFields: any = watch([
    'code1',
    'code2',
    'code3',
    'code4',
    'code5',
    'code6',
  ]);
  useEffect(() => {
    const username = getBrowserCookie(COOKIE_KEY_FORGOT_PASSWORD_USERNAME);
    if (!username) {
      router.push(educDomain()).then((r) => {});
    }
  }, []);
  useEffect(() => {
    focusFiled();
    setValue('codes', watchAllFields.join(''));
  }, [watchAllFields]);

  useEffect(() => {
    let resendDate = cookieInstance.get(COOKIE_KEY_SEND_TIME);
    if (resendCode || resendDate) {
      resendDate = resendDate ? Number(resendDate) : null;
      const currentDate = new Date();

      if (
        resendDate &&
        currentDate.getTime() - resendDate < RESEND_CODE_RETRY_TIME_IN_MILLIS
      ) {
        const expireTime = resendDate + RESEND_CODE_RETRY_TIME_IN_MILLIS;
        const timeout = expireTime - currentDate.getTime();

        if (timeout > 0) {
          reset({
            code1: '',
            code2: '',
            code3: '',
            code4: '',
            code5: '',
            code6: '',
          });
          const interval = setInterval(() => {
            const time = new Date();
            let remainingSec = Math.ceil((expireTime - time.getTime()) / 1000);
            let remainingMin = Math.floor(remainingSec / 60);
            remainingSec = remainingSec % 60;
            setResendTime(
              '0' +
                remainingMin +
                ':' +
                (remainingSec < 10 ? '0' + remainingSec : remainingSec),
            );

            if (remainingSec < 0) {
              clearInterval(interval);
              setResendTime(null);
              setResendCode(false);
            }
          }, 1000);
        }
      } else {
        setResendTime(null);
      }
    }
  }, [resendCode]);

  const focusFiled = () => {
    const index = watchAllFields.indexOf('');
    if (watchAllFields[0] == undefined) {
      setFocus('code1');
    } else if (index >= 0 && index < 6) {
      setFocus('code' + (index + 1));
    }
  };
  const resendVerificationCode = useCallback(
    () => async () => {
      try {
        const username = getBrowserCookie(COOKIE_KEY_FORGOT_PASSWORD_USERNAME);
        if (username) {
          await sendForgotPasswordOTP({username: username});
          successStack(
            <IntlMessages id={'common.resend_validation_code_success'} />,
          );

          const current = new Date();
          let expireDate = new Date();
          const expireTime =
            expireDate.getTime() + RESEND_CODE_RETRY_TIME_IN_MILLIS;
          expireDate.setTime(expireTime);

          cookieInstance.set(COOKIE_KEY_SEND_TIME, current.getTime(), {
            expires: expireDate,
          });
          setResendTime('03:00');
          setResendCode(true);
        } else {
          router.push(LINK_FORGOT_PASSWORD).then(() => {});
        }
      } catch (error: any) {
        console.log('error', error);
        errorStack(<IntlMessages id={'message.somethingWentWrong'} />);
      }
    },
    [],
  );

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      let formData: any = {};
      formData.otp_code =
        data.code1 +
        data.code2 +
        data.code3 +
        data.code4 +
        data.code5 +
        data.code6;
      formData.username = getBrowserCookie(COOKIE_KEY_FORGOT_PASSWORD_USERNAME);

      await verifyForgotPasswordOtp(formData);
      setIsSubmitted(true);
      successStack(<IntlMessages id='forgot_password.otp_verification' />);
      let expireDate = new Date();
      expireDate.setTime(expireDate.getTime() + 10 * 60 * 1000);
      await setBrowserCookie(COOKIE_KEY_FORGOT_PASSWORD_VERIFY_OTP, 1, {
        expires: expireDate,
      });

      router.push(LINK_RESET_PASSWORD).then((r) => {});
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };
  return (
    <Container
      sx={{
        display: 'flex',
        height: `calc(100vh - ${SECONDARY_APP_HEADER_HEIGHT * 2}px)`,
      }}>
      <StyledPaper>
        <Typography
          variant={'h5'}
          style={{marginBottom: '10px', fontWeight: 'bold'}}>
          {messages['common.enter_verification_code']}
        </Typography>
        <Typography style={{marginBottom: '10px'}}>
          <IntlMessages id='common.validation_code_mobile' />
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <UncontrolledTextInput
                id='code1'
                register={register}
                errorInstance={errors}
                isLoading={false}
                inputProps={inputProps}
              />
            </Grid>
            <Grid item xs={2}>
              <UncontrolledTextInput
                id='code2'
                register={register}
                errorInstance={errors}
                isLoading={false}
                inputProps={inputProps}
              />
            </Grid>
            <Grid item xs={2}>
              <UncontrolledTextInput
                id='code3'
                register={register}
                errorInstance={errors}
                isLoading={false}
                inputProps={inputProps}
              />
            </Grid>
            <Grid item xs={2}>
              <UncontrolledTextInput
                id='code4'
                register={register}
                errorInstance={errors}
                isLoading={false}
                inputProps={inputProps}
              />
            </Grid>
            <Grid item xs={2}>
              <UncontrolledTextInput
                id='code5'
                register={register}
                errorInstance={errors}
                isLoading={false}
                inputProps={inputProps}
              />
            </Grid>
            <Grid item xs={2}>
              <UncontrolledTextInput
                id='code6'
                register={register}
                errorInstance={errors}
                isLoading={false}
                inputProps={inputProps}
              />
              <Input type={'hidden'} id={'codes'} {...register('codes')} />
            </Grid>
          </Grid>
          <Box className={classes.errorMessage}>
            {errors?.['codes'] && Boolean(errors?.['codes']) && (
              <IntlMessages
                id={errors?.['codes'].message.key}
                values={errors?.['codes'].message?.values || {}}
              />
            )}
          </Box>
          <Box className={classes.sendCode}>
            {resendTime ? (
              <Typography variant={'caption'}>
                <IntlMessages
                  id={'common.send_code_again'}
                  values={{
                    subject: String(resendTime),
                  }}
                />
              </Typography>
            ) : (
              <Link
                sx={{
                  '&:hover': {
                    cursor: 'pointer',
                  },
                }}
                onClick={resendVerificationCode()}>
                {messages['common.send_code_text']}
              </Link>
            )}
          </Box>

          <Grid item xs={12} display={'flex'} justifyContent={'start'} mt={2}>
            <SubmitButton
              isSubmitting={isSubmitting}
              isLoading={false}
              label={messages['common.verify'] as string}
              sx={{marginTop: '10px'}}
              isDisable={isSubmitting || isSubmitted}
            />
          </Grid>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default OTPVerificationPage;
