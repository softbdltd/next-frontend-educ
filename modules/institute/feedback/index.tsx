import React, {useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {Button, Card, CardContent, Container, Grid} from '@mui/material';
import {useIntl} from 'react-intl';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import yup from '../../../@core/libs/yup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {H1, H2} from '../../../@core/elements/common';
import {
  EMAIL_REGEX,
  MOBILE_NUMBER_REGEX,
} from '../../../@core/common/patternRegex';
import {createVisitorFeedback} from '../../../services/cmsManagement/VisitorFeedbackService';
import {VisitorFeedbackTypes} from '../../../services/cmsManagement/Constants';
import {ThemeMode} from '../../../shared/constants/AppEnums';

const PREFIX = 'InstituteFeedback';

const classes = {
  buttons: `${PREFIX}-buttons`,
  box: `${PREFIX}-box`,
  textStyle: `${PREFIX}-textStyle`,
};

const StyledGrid = styled(Grid)(({theme}) => {
  return {
    [`& .${classes.buttons}`]: {
      width: '100%',
    },
    [`& .${classes.box}`]: {
      background: theme.palette.primary.main,
    },
    [`& .${classes.textStyle}`]: {
      color:
        theme.palette.mode === ThemeMode.DARK
          ? theme.palette.common.white
          : theme.palette.common.black,
      fontSize: '1.375rem',
    },
  };
});

const InstituteFeedback = () => {
  const {messages} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const isLoading = false;

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      name: yup
        .string()
        .trim()
        .required()
        .label(messages['common.name'] as string),
      mobile: yup
        .string()
        .trim()
        .required()
        .label(messages['common.phone_number'] as string)
        .matches(MOBILE_NUMBER_REGEX),
      email: yup
        .mixed()
        .label(messages['common.email'] as string)
        .test(
          'email_validation',
          messages['common.validation_email_error'] as string,
          (value) => !value || Boolean(value.match(EMAIL_REGEX)),
        ),
      comment: yup
        .string()
        .trim()
        .required()
        .label(messages['advice.institute'] as string),
    });
  }, [messages]);

  const {
    control,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting},
    reset,
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    data.form_type = VisitorFeedbackTypes.FEEDBACK;

    try {
      await createVisitorFeedback(data);
      successStack(
        <IntlMessages
          id='common.subject_sent_successfully'
          values={{subject: <IntlMessages id='feedback.institution' />}}
        />,
      );
      reset();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <Container maxWidth={'lg'}>
      <StyledGrid>
        <Grid textAlign={'center'}>
          <H1 style={{fontSize: '2.25rem'}} fontWeight={'bold'} py={3}>
            {messages['feedback.institution']}
          </H1>
        </Grid>
        <Grid
          container
          sx={{maxWidth: '100%'}}
          className={classes.box}
          p={4}
          justifyContent={'center'}>
          <Grid item xs={12} maxWidth='sm'>
            <Card>
              <CardContent>
                <Grid>
                  <H2 mb={4} className={classes.textStyle}>
                    {messages['institute.feedback']}
                  </H2>
                </Grid>
                <Grid>
                  <form onSubmit={handleSubmit(onSubmit)} autoComplete={'off'}>
                    <Grid container spacing={5}>
                      <Grid item xs={12}>
                        <CustomTextInput
                          required
                          id='name'
                          label={messages['common.name']}
                          control={control}
                          errorInstance={errors}
                          isLoading={isLoading}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <CustomTextInput
                          required
                          id='mobile'
                          label={messages['common.phone_number']}
                          control={control}
                          errorInstance={errors}
                          isLoading={isLoading}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <CustomTextInput
                          id='email'
                          label={messages['common.email']}
                          control={control}
                          errorInstance={errors}
                          isLoading={isLoading}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextInput
                          id='address'
                          label={messages['common.address']}
                          control={control}
                          errorInstance={errors}
                          multiline={true}
                          rows={2}
                          isLoading={isLoading}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextInput
                          required
                          id='comment'
                          label={messages['advice.institute']}
                          control={control}
                          errorInstance={errors}
                          multiline={true}
                          rows={3}
                          isLoading={isLoading}
                        />
                      </Grid>
                      <Grid item xs={12} justifyContent={'center'} mt={3}>
                        <Button
                          type={'submit'}
                          disabled={isSubmitting}
                          className={classes.buttons}
                          variant='contained'>
                          {messages['common.send']}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </StyledGrid>
    </Container>
  );
};

export default InstituteFeedback;
