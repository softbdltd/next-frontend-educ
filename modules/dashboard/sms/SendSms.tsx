import React, {FC, useMemo} from 'react';
import {Grid} from '@mui/material';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import yup from '../../../@core/libs/yup';
import {useIntl} from 'react-intl';
import SendIcon from '@mui/icons-material/Send';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import IntlMessages from '../../../@core/utility/IntlMessages';

interface SendSmsProps {
  disabledMessage: boolean;
  onFilterReset: () => void;
  onMessageSend: (data: any) => void;
}

const SendSms: FC<SendSmsProps> = ({
  disabledMessage = false,
  onFilterReset,
  onMessageSend,
}) => {
  const {messages} = useIntl();
  const {errorStack, successStack} = useNotiStack();

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      message: yup
        .string()
        .required()
        .label(messages['common.message'] as string),
    });
  }, [messages]);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: any = async (data: any) => {
    try {
      await onMessageSend(data);
      successStack(
        <IntlMessages
          id='common.subject_sent_successfully'
          values={{subject: <IntlMessages id='common.message' />}}
        />,
      );
      onFilterReset();
      reset({message: ''});
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <>
      <Grid item xs={12} sm={6} md={6}>
        <CustomTextInput
          id='message'
          required={true}
          multiline={true}
          control={control}
          errorInstance={errors}
          rows={4}
          label={messages['common.message']}
          disabled={disabledMessage}
        />
      </Grid>
      <Box
        pt={1}
        display='flex'
        justifyContent='flex-start'
        alignItems='flex-start'>
        <Button
          variant='contained'
          onClick={handleSubmit(onSubmit)}
          color='primary'
          endIcon={<SendIcon />}
          sx={{height: 40}}
          disabled={disabledMessage || isSubmitting}>
          {messages['common.send']}
        </Button>
      </Box>
    </>
  );
};

export default SendSms;
