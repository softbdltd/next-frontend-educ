import React, {useCallback, useEffect, useMemo, useState} from 'react';
import { Box, Container, Grid, Input, Link, Typography } from "@mui/material";
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {classes, StyledPaper} from '../../registrationVerification/index.style';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import yup from '../../../@core/libs/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useRouter} from 'next/router';
import {
  LINK_FRONTEND_LEARNER_COURSE_ENROLL_PAYMENT,
  LINK_FRONTEND_LEARNER_COURSE_ENROLLMENT_CHOOSE_PAYMENT_METHOD,
} from '../../../@core/common/appLinks';
import {
  courseEnrollmentResendVerificationCode,
  courseEnrollmentVerification,
} from '../../../services/learnerManagement/YouthService';
import cookieInstance, {
  setBrowserCookie,
} from '../../../@core/libs/cookieInstance';
import {
  COOKIE_KEY_COURSE_ID,
  COOKIE_KEY_SEND_TIME,
} from '../../../shared/constants/AppConst';
import {
  RESEND_CODE_RETRY_TIME_IN_MILLIS,
  SECONDARY_APP_HEADER_HEIGHT,
  learnerDomain,
} from '../../../@core/common/constants';
import UncontrolledTextInput from '../../../@core/elements/input/UncontrolledTextInput';

const inputProps = {
  maxLength: 1,
  style: {
    textAlign: 'center',
  },
};

const CourseRegistrationVerification = () => {
  const {messages} = useIntl();
  const {errorStack, successStack} = useNotiStack();
  const router = useRouter();
  const {courseId, enrollment_id}: any = router.query;
  const [resendTime, setResendTime] = useState<string | null>(null);
  const [resendCode, setResendCode] = useState<boolean>(false);
  const [isSuccessSubmit, setIsSuccessSubmit] = useState<boolean>(false);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      codes: yup
        .string()
        .required()
        .length(4)
        .label(messages['common.verification_code'] as string),
    });
  }, [messages]);

  const {
    handleSubmit,
    register,
    // setError,
    setValue,
    setFocus,
    watch,
    formState: {errors, isSubmitting},
  } = useForm<any>({resolver: yupResolver(validationSchema)});
  const watchAllFields: any = watch(['code1', 'code2', 'code3', 'code4']);

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

  useEffect(() => {
    focusFiled();
    setValue('codes', watchAllFields.join(''));
  }, [watchAllFields]);

  const focusFiled = () => {
    const index = watchAllFields.indexOf('');
    if (
      watchAllFields?.[0] == 'undefined' ||
      watchAllFields?.[0] == undefined
    ) {
      setFocus('code1');
    }
    if (index >= 0 && index < 4) setFocus('code' + (index + 1));
  };

  const resendVerificationCode = useCallback(
    () => async () => {
      try {
        setValue('code1', '');
        setValue('code2', '');
        setValue('code3', '');
        setValue('code4', '');
        if (enrollment_id) {
          await courseEnrollmentResendVerificationCode(enrollment_id);
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
          errorStack(<IntlMessages id={'common.missing_enrollment_id'} />);
        }
      } catch (error: any) {
        console.log('error', error);
        errorStack(<IntlMessages id={'message.somethingWentWrong'} />);
        /*processServerSideErrors({
          error,
          setError,
          validationSchema,
          errorStack,
        });*/
      }
    },
    [],
  );

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      let requestData: any = {};
      requestData.verification_code =
        data.code1 + data.code2 + data.code3 + data.code4;

      if (enrollment_id) {
        const response = await courseEnrollmentVerification(
          enrollment_id,
          requestData,
        );
        setIsSuccessSubmit(true);
        successStack(<IntlMessages id={'common.verification_code_success'} />);

        if (response?.data?.free_course === 0) {
          router
            .push({
              pathname:
                LINK_FRONTEND_LEARNER_COURSE_ENROLLMENT_CHOOSE_PAYMENT_METHOD +
                courseId,
              query: {enrollment_id: enrollment_id},
            })
            .then((r) => {});
        } else if (response?.data?.payment_type === 1) {
          let expireDate = new Date();
          expireDate.setTime(new Date().getTime() + 1000 * 60 * 60);
          setBrowserCookie(COOKIE_KEY_COURSE_ID, courseId, {
            expires: expireDate,
          });
          router
            .push({
              pathname:
                learnerDomain() +
                LINK_FRONTEND_LEARNER_COURSE_ENROLL_PAYMENT +
                '/payment-after-batch-assign',
            })
            .then((r) => {});
        } else {
          let expireDate = new Date();
          expireDate.setTime(new Date().getTime() + 1000 * 60 * 60);
          setBrowserCookie(COOKIE_KEY_COURSE_ID, courseId, {
            expires: expireDate,
          });
          router
            .push({
              pathname:
                learnerDomain() +
                LINK_FRONTEND_LEARNER_COURSE_ENROLL_PAYMENT +
                '/success',
            })
            .then((r) => {});
        }
      } else {
        errorStack(<IntlMessages id={'common.missing_enrollment_id'} />);
      }
    } catch (error: any) {
      console.log('error', error);
      errorStack(<IntlMessages id={'common.invalid_verification'} />);
      /*processServerSideErrors({error, setError, validationSchema, errorStack});*/
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
          {messages['common.enter_validation_code']}
        </Typography>
        <Typography style={{marginBottom: '10px'}}>
          <IntlMessages id='common.validation_code_mobile' />
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <UncontrolledTextInput
                id='code1'
                register={register}
                errorInstance={errors}
                isLoading={false}
                inputProps={inputProps}
                placeholder={'code1'}
                placeholderHide={true}
              />
            </Grid>
            <Grid item xs={3}>
              <UncontrolledTextInput
                id='code2'
                register={register}
                errorInstance={errors}
                isLoading={false}
                inputProps={inputProps}
                placeholder={'code2'}
                placeholderHide={true}
              />
            </Grid>
            <Grid item xs={3}>
              <UncontrolledTextInput
                id='code3'
                register={register}
                errorInstance={errors}
                isLoading={false}
                inputProps={inputProps}
                placeholder={'code3'}
                placeholderHide={true}
              />
            </Grid>
            <Grid item xs={3}>
              <UncontrolledTextInput
                id='code4'
                register={register}
                errorInstance={errors}
                isLoading={false}
                inputProps={inputProps}
                placeholder={'code4'}
                placeholderHide={true}
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

            <SubmitButton
              isSubmitting={isSubmitting || isSuccessSubmit || !enrollment_id}
              isLoading={false}
              label={messages['common.verify'] as string}
            />
          {isSubmitting && (
            <div role={'alert'} aria-live="assertive" style={{ position: 'absolute', top: '-9999px' }}>
              {messages['common.verifying'] as string}
            </div>
          )}
        </form>
      </StyledPaper>
    </Container>
  );
};

export default CourseRegistrationVerification;
