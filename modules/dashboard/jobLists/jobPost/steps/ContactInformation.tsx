import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Box, Button, Card, CardContent, Grid, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import useNotiStack from '../../../../../@core/hooks/useNotifyStack';
import yup from '../../../../../@core/libs/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {processServerSideErrors} from '../../../../../@core/utilities/validationErrorHandler';
import {InfoOutlined} from '@mui/icons-material';
import CustomFormSelect from '../../../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import {S1} from '../../../../../@core/elements/common';
import {useFetchJobContactInformation} from '../../../../../services/IndustryManagement/hooks';
import {useFetchLocalizedUsers} from '../../../../../services/userManagement/hooks';
import RowStatus from '../../../../../@core/utilities/RowStatus';
import {saveContactInformation} from '../../../../../services/IndustryManagement/JobService';
import usePageLoadToTop from './usePageLoadToTop';

interface Props {
  jobId: string;
  onBack: () => void;
  onContinue: () => void;
  setLatestStep: (step: number) => void;
}

const ContactInformation = ({
  jobId,
  onBack,
  onContinue,
  setLatestStep,
}: Props) => {
  const {messages} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const {data: contactInformation} = useFetchJobContactInformation(jobId);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userFilters] = useState<any>({row_status: RowStatus.ACTIVE});
  const {data: users, isLoading: isLoadingUsers} =
    useFetchLocalizedUsers(userFilters);

  const id = 'top';
  usePageLoadToTop({id, dependency: isReady});

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      contact_person_id: yup
        .string()
        .required()
        .label(messages['job_posting.contact_person_job'] as string),
    });
  }, [messages]);

  const {
    control,
    setError,
    reset,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (contactInformation && contactInformation?.latest_step) {
      const latestStep = contactInformation.latest_step;
      delete contactInformation?.latest_step;

      if (latestStep >= 6) {
        setIsReady(true);
        reset({contact_person_id: contactInformation?.contact_person_id});
      }
      setLatestStep(latestStep);
    } else {
      reset({contact_person_id: ''});
    }
  }, [contactInformation]);

  useEffect(() => {
    if (users && contactInformation) {
      const user = users?.find(
        (user: any) => user.id == contactInformation?.contact_person_id,
      );
      setSelectedUser(user ? user : null);
    }
  }, [contactInformation, users]);

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      data.job_id = jobId;

      //console.log('data', data);
      await saveContactInformation(data);

      successStack(messages['common.data_saved']);
      onContinue();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  const onChangeUser = useCallback(
    (user_id: any) => {
      const user = users?.find((user: any) => user.id == user_id);
      setSelectedUser(user ? user : null);
    },
    [users],
  );

  return isReady ? (
    <Box mt={2} id={id}>
      <Typography mb={3} variant={'h5'} fontWeight={'bold'}>
        {messages['job_posting.contract_info']}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        {/** Contact information section */}
        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} md={3}>
            <Typography variant='body1'>
              {messages['job_posting.contract_info']}
            </Typography>
          </Grid>
          <Grid item xs={12} md={9}>
            <Box sx={{color: 'warning.light'}} display={'flex'}>
              <InfoOutlined sx={{paddingRight: '5px'}} />
              <Typography variant='body1'>
                {messages['job_posting.contact_info_suggestion']}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={'15px'}>
          <Grid item xs={12} md={7}>
            <CustomFormSelect
              required
              id='contact_person_id'
              label={messages['job_posting.contact_person_job']}
              isLoading={isLoadingUsers}
              control={control}
              options={users || []}
              optionValueProp={'id'}
              optionTitleProp={['name']}
              errorInstance={errors}
              onChange={onChangeUser}
            />
          </Grid>
        </Grid>

        {selectedUser && (
          <Grid container spacing={3} mt={'15px'}>
            <Grid item xs={12} md={7}>
              <Card
                sx={{
                  backgroundColor: 'grey.300',
                  border: '1px solid #c5c5c5',
                }}>
                <CardContent>
                  <S1>{selectedUser?.name}</S1>
                  {/*<Typography color='text.secondary'>
                    Asst. Executive (HR & Admin)
                  </Typography>*/}
                  <Typography color='text.secondary'>
                    {selectedUser?.mobile}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        <Box display={'flex'} justifyContent={'space-between'} mt={3}>
          <Button onClick={onBack} variant={'outlined'} color={'primary'}>
            {messages['common.previous']}
          </Button>
          <Button
            disabled={isSubmitting}
            type={'submit'}
            variant={'contained'}
            color={'primary'}>
            {messages['common.save_and_continue']}
          </Button>
        </Box>
      </form>
    </Box>
  ) : (
    <></>
  );
};

export default ContactInformation;
