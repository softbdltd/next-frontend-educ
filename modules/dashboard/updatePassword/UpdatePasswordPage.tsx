import {yupResolver} from '@hookform/resolvers/yup';
import yup from '../../../@core/libs/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {TEXT_REGEX_PASSWORD} from '../../../@core/common/patternRegex';
import {Paper, Typography, Button, Container, Grid} from '@mui/material';
import React, {useMemo} from 'react';
import {useIntl} from 'react-intl';
import {styled} from '@mui/material/styles';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {updatePassword} from '../../../services/userManagement/UserService';
import Router, {useRouter} from 'next/router';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PREFIX = 'UpdatePassword';
const classes = {
  paperBox: `${PREFIX}-paperBox`,
  typography: `${PREFIX}-typography`,
  btn: `${PREFIX}-btn`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  marginTop: 20,
  marginBottom: 20,
  [`& .${classes.paperBox}`]: {
    width: '80%',
    margin: 'auto',
    padding: '20px',
  },
  [`& .${classes.btn}`]: {marginRight: 20},
  [`& .${classes.typography}`]: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
}));

interface FormData {
  current_password: String;
  new_password: String;
  confirm_new_password: String;
}

const UpdatePasswordPage = () => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const authUser = useAuthUser<CommonAuthUser>();
  const router = useRouter();
  const {updateSuccessMessage} = useSuccessMessage();

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      current_password: yup
        .string()
        .required()
        .min(8)
        .matches(TEXT_REGEX_PASSWORD)
        .label(messages['common.oldPassword'] as string),
      new_password: yup
        .string()
        .required()
        .min(8)
        .matches(TEXT_REGEX_PASSWORD)
        .label(messages['common.newPassword'] as string),
      new_password_confirmation: yup
        .string()
        .required()
        .oneOf(
          [yup.ref('new_password'), null],
          messages['common.password_must_match'] as string,
        )
        .label(messages['common.retype_password'] as string),
    });
  }, [yup, messages]);

  const {
    control,
    setError,
    reset,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<any> = async (data: FormData) => {
    try {
      if (authUser?.userId) {
        const userId: number = Number(authUser?.userId);
        await updatePassword(userId, data);
        updateSuccessMessage(messages['common.change_password'] as string);
        router.back();
      }
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  const onRestClick = () => {
    reset({
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    });
  };
  return (
    <StyledContainer>
      <Paper variant='outlined' className={classes.paperBox}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant='outlined'
          onClick={() => Router.back()}
          style={{float: 'right', right: '10px', top: '10px'}}>
          {messages['common.back']}
        </Button>
        <Typography variant='h2' className={classes.typography}>
          {messages['common.change_password']}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container justifyContent={'center'} spacing={2}>
            <Grid item xs={11} md={8}>
              <CustomTextInput
                required
                id='current_password'
                type='password'
                label={messages['common.oldPassword']}
                control={control}
                helperText={messages['common.passwordHint']}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
            <Grid item xs={11} md={8}>
              <CustomTextInput
                required
                id='new_password'
                type='password'
                label={messages['common.newPassword']}
                control={control}
                helperText={messages['common.passwordHint']}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>

            <Grid item xs={11} md={8}>
              <CustomTextInput
                required
                id='new_password_confirmation'
                type='password'
                label={messages['common.retype_password']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
            <Grid item xs={11} md={8} style={{textAlign: 'center'}}>
              <Button
                className={classes.btn}
                type={'submit'}
                variant={'contained'}
                color={'primary'}
                disabled={isSubmitting}>
                {messages['common.submit']}
              </Button>
              <Button variant='outlined' color='error' onClick={onRestClick}>
                {messages['common.reset']}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </StyledContainer>
  );
};

export default UpdatePasswordPage;
