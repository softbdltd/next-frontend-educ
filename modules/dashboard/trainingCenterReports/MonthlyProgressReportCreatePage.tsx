import React, {useEffect, useMemo} from 'react';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';

import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import {SubmitHandler, useForm} from 'react-hook-form';
import {Button, Grid} from '@mui/material';
import {useIntl} from 'react-intl';
import {yupResolver} from '@hookform/resolvers/yup';
import IconTrainingCenter from '../../../@core/icons/IconTrainingCenter';
import IntlMessages from '../../../@core/utility/IntlMessages';
import PageBlock from '../../../@core/utilities/PageBlock';
import {ArrowBack} from '@mui/icons-material';
import {useRouter} from 'next/router';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {trainingCenterProgressReportCreate} from '../../../services/instituteManagement/TrainingCenterReportService';
import CustomNumberInputReportForm from './CustomNumberInputReportForm';
import CustomDatePicker from '../../../@core/elements/input/CustomDatePicker';
import monthlyProgressReportValidationSchema from './MonthlyProgressReportValidationSchema';

const initialValues = {
  reporting_month: '',
  trade_name: '',
  number_of_trainers: 0,
  number_of_labs_or_training_rooms: 0,
  number_of_computers_or_training_equipments: 0,
  admitted_trainee_men: 0,
  admitted_trainee_women: 0,
  admitted_trainee_disabled: 0,
  admitted_trainee_qawmi: 0,
  admitted_trainee_transgender: 0,
  admitted_trainee_others: 0,
  admitted_trainee_total: 0,
  technical_board_registered_trainee_men: 0,
  technical_board_registered_trainee_women: 0,
  technical_board_registered_trainee_disabled: 0,
  technical_board_registered_trainee_qawmi: 0,
  technical_board_registered_trainee_transgender: 0,
  technical_board_registered_trainee_others: 0,
  technical_board_registered_trainee_total: 0,
  latest_test_attended_trainee_men: 0,
  latest_test_attended_trainee_women: 0,
  latest_test_attended_trainee_disabled: 0,
  latest_test_attended_trainee_qawmi: 0,
  latest_test_attended_trainee_transgender: 0,
  latest_test_attended_trainee_others: 0,
  latest_test_attended_trainee_total: 0,
  latest_test_passed_trainee_men: 0,
  latest_test_passed_trainee_women: 0,
  latest_test_passed_trainee_disabled: 0,
  latest_test_passed_trainee_qawmi: 0,
  latest_test_passed_trainee_transgender: 0,
  latest_test_passed_trainee_others: 0,
  latest_test_passed_trainee_total: 0,
};

const MonthlyProgressReportCreatePage = () => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const router = useRouter();
  const {createSuccessMessage} = useSuccessMessage();

  const validationSchema = useMemo(
    () => monthlyProgressReportValidationSchema(messages),
    [messages],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });
  useEffect(() => {
    reset(initialValues);
  }, []);

  console.log('errors->', errors);
  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      await trainingCenterProgressReportCreate(data);
      createSuccessMessage('skill_development_monthly_progress_report.label');
      router.back();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <>
      <PageBlock
        title={
          <>
            <IconTrainingCenter />{' '}
            <IntlMessages id='skill_development_monthly_progress_report.label' />
          </>
        }
        extra={[
          <Button
            key={1}
            variant={'contained'}
            color={'primary'}
            size={'small'}
            onClick={() => router.back()}>
            <ArrowBack />
            {messages['common.back']}
          </Button>,
        ]}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Grid container marginTop={'10px'} spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <CustomDatePicker
                required
                id='reporting_month'
                label={messages['common.reporting_month']}
                control={control}
                errorInstance={errors}
                views={['month']}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='trade_name'
                label={
                  messages[
                    'skills_development_training_activities_income_expenditure_information.trade_name'
                  ]
                }
                control={control}
                errorInstance={errors}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomNumberInputReportForm
                id='number_of_trainers'
                type={'number'}
                label={messages['dashboard.total_trainers']}
                register={register}
                errorInstance={errors}
                required
                setValue={setValue}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomNumberInputReportForm
                id='number_of_labs_or_training_rooms'
                type={'number'}
                label={
                  messages[
                    'skills_development_training_activities_income_expenditure_information.number_of_labs_or_training_rooms'
                  ]
                }
                register={register}
                errorInstance={errors}
                required
                setValue={setValue}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomNumberInputReportForm
                id='number_of_computers_or_training_equipments'
                type={'number'}
                label={
                  messages[
                    'skill_development_monthly_progress_report.number_of_computers_or_training_equipments'
                  ]
                }
                register={register}
                errorInstance={errors}
                required
                setValue={setValue}
              />
            </Grid>

            <Grid item xs={12}>
              <fieldset style={{fontSize: '20px', border: '1px solid #7e7e7e'}}>
                <legend style={{color: '#0a8fdc'}}>
                  {
                    messages[
                      'skill_development_monthly_progress_report.admitted_trainee'
                    ]
                  }
                </legend>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='admitted_trainee_men'
                      type={'number'}
                      label={messages['common.male']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='admitted_trainee_women'
                      type={'number'}
                      label={messages['common.female']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='admitted_trainee_disabled'
                      type={'number'}
                      label={messages['common.disability']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='admitted_trainee_qawmi'
                      type={'number'}
                      label={messages['common.qawmi']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='admitted_trainee_transgender'
                      type={'number'}
                      label={messages['common.transgender']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='admitted_trainee_others'
                      type={'number'}
                      label={messages['common.others']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='admitted_trainee_total'
                      type={'number'}
                      label={messages['common.total']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Grid>

            <Grid item xs={12}>
              <fieldset style={{fontSize: '20px', border: '1px solid #7e7e7e'}}>
                <legend style={{color: '#0a8fdc'}}>
                  {
                    messages[
                      'skill_development_monthly_progress_report.technical_board_registered_trainee'
                    ]
                  }
                </legend>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='technical_board_registered_trainee_men'
                      type={'number'}
                      label={messages['common.male']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='technical_board_registered_trainee_women'
                      type={'number'}
                      label={messages['common.female']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='technical_board_registered_trainee_disabled'
                      type={'number'}
                      label={messages['common.disability']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='technical_board_registered_trainee_qawmi'
                      type={'number'}
                      label={messages['common.qawmi']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='technical_board_registered_trainee_transgender'
                      type={'number'}
                      label={messages['common.transgender']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='technical_board_registered_trainee_others'
                      type={'number'}
                      label={messages['common.others']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='technical_board_registered_trainee_total'
                      type={'number'}
                      label={messages['common.total']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Grid>

            <Grid item xs={12}>
              <fieldset style={{fontSize: '20px', border: '1px solid #7e7e7e'}}>
                <legend style={{color: '#0a8fdc'}}>
                  {
                    messages[
                      'skill_development_monthly_progress_report.latest_test_attended_trainee'
                    ]
                  }
                </legend>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='latest_test_attended_trainee_men'
                      type={'number'}
                      label={messages['common.male']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='latest_test_attended_trainee_women'
                      type={'number'}
                      label={messages['common.female']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='latest_test_attended_trainee_disabled'
                      type={'number'}
                      label={messages['common.disability']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='latest_test_attended_trainee_qawmi'
                      type={'number'}
                      label={messages['common.qawmi']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='latest_test_attended_trainee_transgender'
                      type={'number'}
                      label={messages['common.transgender']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='latest_test_attended_trainee_others'
                      type={'number'}
                      label={messages['common.others']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='latest_test_attended_trainee_total'
                      type={'number'}
                      label={messages['common.total']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Grid>

            <Grid item xs={12}>
              <fieldset style={{fontSize: '20px', border: '1px solid #7e7e7e'}}>
                <legend style={{color: '#0a8fdc'}}>
                  {
                    messages[
                      'skill_development_monthly_progress_report.latest_test_passed_trainee'
                    ]
                  }
                </legend>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='latest_test_passed_trainee_men'
                      type={'number'}
                      label={messages['common.male']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='latest_test_passed_trainee_women'
                      type={'number'}
                      label={messages['common.female']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='latest_test_passed_trainee_disabled'
                      type={'number'}
                      label={messages['common.disability']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='latest_test_passed_trainee_qawmi'
                      type={'number'}
                      label={messages['common.qawmi']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='latest_test_passed_trainee_transgender'
                      type={'number'}
                      label={messages['common.transgender']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='latest_test_passed_trainee_others'
                      type={'number'}
                      label={messages['common.others']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id='latest_test_passed_trainee_total'
                      type={'number'}
                      label={messages['common.total']}
                      register={register}
                      errorInstance={errors}
                      required
                      setValue={setValue}
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Grid>

            <Grid item xs={12}>
              <SubmitButton
                startIcon={false}
                isSubmitting={isSubmitting}
                label={messages['common.create_report'] as string}
                size='large'
              />
            </Grid>
          </Grid>
        </form>
      </PageBlock>
    </>
  );
};

export default MonthlyProgressReportCreatePage;
