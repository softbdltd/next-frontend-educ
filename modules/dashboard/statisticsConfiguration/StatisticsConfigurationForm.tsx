import {yupResolver} from '@hookform/resolvers/yup';
import {Card, Container, Grid} from '@mui/material';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useIntl} from 'react-intl';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import {H1} from '../../../@core/elements/common';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import yup from '../../../@core/libs/yup';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {useFetchStatisticConfiguration} from '../../../services/instituteManagement/hooks';
import {createStatisticsConfig} from '../../../services/instituteManagement/InstituteService';
import StatisticConfigDetails from './StatisticsConfiguratioDetails';

const initialValues = {
  dashboard_officer_involved: 0,
  dashboard_job_opportunity: 0,
  dashboard_career_service_received: 0,
  dashboard_4IR_skill_received: 0,
};

const StatisticConfigForm: FC<any> = () => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const {updateSuccessMessage} = useSuccessMessage();

  const {
    data: itemData,
    isLoading,
    mutate: mutateData,
  } = useFetchStatisticConfiguration();

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      dashboard_officer_involved: yup
        .string()
        .trim()
        .matches(/^[+]?\d+$/)
        .required()
        .label(messages['dashboard.officer_sensitized'] as string),
      dashboard_job_opportunity: yup
        .string()
        .trim()
        .matches(/^[+]?\d+$/)
        .required()
        .label(messages['dashboard.job_opportunities_created'] as string),
      // dashboard_4ir_skill_received: yup
      //   .string()
      //   .trim()
      //   .matches(/^[+]?\d+$/)
      //   .required()
      //   .label(messages['dashboard.learner_4ir_skill_received'] as string),
      // dashboard_career_service_received: yup
      //   .string()
      //   .trim()
      //   .matches(/^[+]?\d+$/)
      //   .required()
      //   .label(messages['dashboard.learner_career_service_received'] as string),
    });
  }, [messages]);
  const {
    control,
    setError,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });
  useEffect(() => {
    if (itemData) {
      reset({
        dashboard_officer_involved: itemData?.dashboard_officer_involved || 0,
        dashboard_job_opportunity: itemData?.dashboard_job_opportunity || 0,
        dashboard_career_service_received:
          itemData?.dashboard_career_service_received || 0,
        dashboard_4IR_skill_received:
          itemData?.dashboard_4IR_skill_received || 0,
      });
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      // console.log('statistic update', data);
      await createStatisticsConfig(data);
      mutateData();
      setIsEdit(false);
      updateSuccessMessage('common.state_configuration');
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <Container maxWidth={'md'}>
      <H1 centered sx={{p: 3}}>
        {messages['common.state_configuration']}
      </H1>
      {isEdit ? (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Card sx={{p: 3}}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <CustomTextInput
                  id='dashboard_officer_involved'
                  label={messages['dashboard.officer_sensitized']}
                  control={control}
                  errorInstance={errors}
                  isLoading={isLoading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextInput
                  id='dashboard_job_opportunity'
                  label={messages['dashboard.job_opportunities_created']}
                  control={control}
                  errorInstance={errors}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextInput
                  id='dashboard_career_service_received'
                  label={messages['dashboard.learner_carrier_service']}
                  control={control}
                  errorInstance={errors}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextInput
                  id='dashboard_4IR_skill_received'
                  label={messages['dashboard.learner_4ir_skill_received']}
                  control={control}
                  errorInstance={errors}
                  isLoading={isLoading}
                />
              </Grid>

              <Grid item sx={{gap: '20px', display: 'flex'}}>
                <SubmitButton
                  isSubmitting={isSubmitting}
                  isLoading={isLoading}
                  label={messages['common.submit']}
                />
                <CancelButton
                  onClick={() => setIsEdit(false)}
                  isLoading={isLoading}
                />
              </Grid>
            </Grid>
          </Card>
        </form>
      ) : (
        <StatisticConfigDetails
          itemData={itemData}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          setIsEdit={setIsEdit}
        />
      )}
    </Container>
  );
};
export default StatisticConfigForm;
