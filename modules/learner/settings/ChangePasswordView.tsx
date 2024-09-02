import React, {FC, useMemo} from 'react';
import {styled} from '@mui/material/styles';
import {useIntl} from 'react-intl';
import {SubmitHandler, useForm} from 'react-hook-form';
import {Button, Card, CardContent, CardHeader, Grid} from '@mui/material';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {ChevronLeft} from '@mui/icons-material';
import {yupResolver} from '@hookform/resolvers/yup';
import yup from '../../../@core/libs/yup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {changePassword} from '../../../services/learnerManagement/SettingsService';
import useNotiStack from '../../../@core/hooks/useNotifyStack';

const PREFIX = 'ChangePasswordView';

const classes = {
  button: `${PREFIX}-button`,
};

const StyledCard = styled(Card)(({theme}) => ({
  [`& .${classes.button}`]: {
    margin: theme.spacing(1),
    width: '100px',
    marginLeft: '10px',
  },
}));

interface ChangePasswordViewprops {
  onBack: () => void;
}

const ChangePasswordView: FC<ChangePasswordViewprops> = ({onBack}) => {
  const {messages} = useIntl();

  const {errorStack, successStack} = useNotiStack();

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      old_password: yup
        .string()
        .trim()
        .required()
        .label(messages['common.oldPassword'] as string),
      new_password: yup
        .string()
        .trim()
        .required()
        .label(messages['common.newPassword'] as string),
      confirm_new_password: yup
        .string()
        .trim()
        .required()
        .oneOf([yup.ref('new_password')])
        .label(messages['common.retype_password'] as string),
    });
  }, [messages]);
  const {
    // register,
    control,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting},
  } = useForm<any>({ mode: 'onChange',resolver: yupResolver(validationSchema)});

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      await changePassword(data);
      successStack(<IntlMessages id='learner_registration.success' />);
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };
  return (
    <StyledCard>
      <CardHeader
        title={messages['common.change_password']}
        fontWeight={'bold'}
      />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomTextInput
                id='old_password'
                label={messages['common.oldPassword']}
                control={control}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextInput
                id='new_password'
                label={messages['common.newPassword']}
                control={control}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextInput
                id='confirm_new_password'
                label={messages['common.retype_password']}
                control={control}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant={'outlined'} color={'primary'} onClick={onBack}>
                <ChevronLeft />
                {messages['common.back']}
              </Button>
              <Button
                variant={'contained'}
                color={'primary'}
                className={classes.button}
                type='submit'
                disabled={isSubmitting}>
                {messages['common.save']}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </StyledCard>
  );
};

export default ChangePasswordView;
