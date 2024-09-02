import React, {FC, useMemo} from 'react';
import {Box, Button, Card, CardContent, CardHeader, Grid} from '@mui/material';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {useIntl} from 'react-intl';
import {SubmitHandler, useForm} from 'react-hook-form';
import {ChevronLeft} from '@mui/icons-material';
import {yupResolver} from '@hookform/resolvers/yup';
import yup from '../../../@core/libs/yup';
import {changeUserId} from '../../../services/learnerManagement/SettingsService';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {styled} from '@mui/material/styles';

const PREFIX = 'ChangeUserIdView';

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

interface ChangeUserIdProps {
  onBack: () => void;
}

const ChangeUserIdView: FC<ChangeUserIdProps> = ({onBack}) => {
  const {messages} = useIntl();

  const {errorStack, successStack} = useNotiStack();
  const validationSchema = useMemo(() => {
    return yup.object().shape({
      old_email: yup
        .string()
        .trim()
        .required()
        .email()
        .label(messages['common.old_email'] as string),
      new_email: yup
        .string()
        .trim()
        .required()
        .email()
        .label(messages['common.new_email'] as string),
    });
  }, [messages]);
  const {
    control,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting},
  } = useForm<any>({mode: 'onChange', resolver: yupResolver(validationSchema)});

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    console.log(data);

    try {
      await changeUserId(data);
      successStack(<IntlMessages id='learner_registration.success' />);
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <StyledCard>
      <CardHeader
        title={messages['common.change_userId']}
        fontWeight={'bold'}
      />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomTextInput
                id='old_email'
                label={messages['common.old_email']}
                control={control}
                errorInstance={errors}
                placeholder='example@gamil.com'
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextInput
                id='new_email'
                label={messages['common.new_email']}
                control={control}
                errorInstance={errors}
                placeholder='example@gamil.com'
              />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Button variant={'outlined'} onClick={onBack}>
                  <ChevronLeft /> {messages['common.back']}
                </Button>
                <Button
                  variant={'contained'}
                  color={'primary'}
                  className={classes.button}
                  type='submit'
                  disabled={isSubmitting}>
                  {messages['common.save']}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </StyledCard>
  );
};
export default ChangeUserIdView;
