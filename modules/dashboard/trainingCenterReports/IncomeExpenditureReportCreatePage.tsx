import {useIntl} from 'react-intl';
import React, {useEffect, useMemo, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import PageBlock from '../../../@core/utilities/PageBlock';
import IconTrainingCenter from '../../../@core/icons/IconTrainingCenter';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {Button, Grid} from '@mui/material';
import {ArrowBack} from '@mui/icons-material';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import {yupResolver} from '@hookform/resolvers/yup';
import {trainingCenterReportIncomeExpenditureCreate} from '../../../services/instituteManagement/TrainingCenterReportService';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {useRouter} from 'next/router';
import CustomNumberInputReportForm from './CustomNumberInputReportForm';
import CustomDatePicker from '../../../@core/elements/input/CustomDatePicker';
import incomeExpenditureReportValidationSchema from './IncomeExpenditureReportValidationSchema';

const initialValues = {
  reporting_month: '',
  trade_name: '',
  number_of_labs_or_training_rooms: 0,
  number_of_allowed_seats: 0,
  number_of_trainees: 0,
  course_fee_per_trainee: 0,
  course_income_from_course_fee: 0,
  course_income_from_application_and_others: 0,
  course_income_total: 0,
  reporting_month_income: 0,
  reporting_month_training_expenses_instructor_salaries: 0,
  reporting_month_training_expenses_other: 0,
  reporting_month_training_expenses_total: 0,
  reporting_month_net_income: 0,
  bank_status_up_to_previous_month: '',
  bank_status_so_far: '',
  account_no_and_bank_branch_name: '',
  comments: '',
};

const IncomeExpenditureReportCreatePage = () => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const router = useRouter();
  const {createSuccessMessage} = useSuccessMessage();

  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const validationSchema = useMemo(
    () => incomeExpenditureReportValidationSchema(messages),
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
      await trainingCenterReportIncomeExpenditureCreate(data);
      createSuccessMessage('training_center_progress_report_combined.label');
      setIsFormSubmitted(true);
      router.back();
    } catch (error: any) {
      processServerSideErrors({
        error,
        setError,
        validationSchema,
        errorStack,
      });
    }
  };

  return (
    <>
      <PageBlock
        title={
          <>
            <IconTrainingCenter />{' '}
            <IntlMessages
              id='common.add_new'
              values={{
                subject: (
                  <IntlMessages id='skills_development_training_activities_income_expenditure_information.label' />
                ),
              }}
            />
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
            <Grid item xs={12} sm={6} md={6}>
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
            <Grid item xs={12} sm={6} md={6}>
              <CustomNumberInputReportForm
                id='number_of_labs_or_training_rooms'
                label={
                  messages[
                    'skills_development_training_activities_income_expenditure_information.number_of_labs_or_training_rooms'
                  ]
                }
                register={register}
                errorInstance={errors}
                setValue={setValue}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CustomNumberInputReportForm
                id='number_of_allowed_seats'
                label={
                  messages['training_center_report.number_of_seats_allowed']
                }
                register={register}
                errorInstance={errors}
                setValue={setValue}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CustomNumberInputReportForm
                id='number_of_trainees'
                label={messages['training_center_report.number_of_trainees']}
                register={register}
                errorInstance={errors}
                setValue={setValue}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CustomNumberInputReportForm
                id='course_fee_per_trainee'
                label={
                  messages['training_center_report.course_fee_per_trainee']
                }
                register={register}
                errorInstance={errors}
                setValue={setValue}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <fieldset>
                <legend style={{fontSize: '20px', color: '#0a8fdc'}}>
                  {messages['training_center_report.total_income_of_courses']}
                </legend>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={6}>
                    <CustomNumberInputReportForm
                      id='course_income_from_course_fee'
                      label={
                        messages['training_center_report.total_course_fee']
                      }
                      register={register}
                      errorInstance={errors}
                      setValue={setValue}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <CustomNumberInputReportForm
                      id='course_income_from_application_and_others'
                      label={
                        messages[
                          'training_center_report.application_and_others'
                        ]
                      }
                      register={register}
                      errorInstance={errors}
                      setValue={setValue}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <CustomNumberInputReportForm
                      id='course_income_total'
                      label={messages['training_center_report.total_income']}
                      register={register}
                      errorInstance={errors}
                      setValue={setValue}
                      required
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <CustomNumberInputReportForm
                id='reporting_month_income'
                label={
                  messages['training_center_report.reporting_month_income']
                }
                register={register}
                errorInstance={errors}
                setValue={setValue}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <CustomNumberInputReportForm
                id='reporting_month_net_income'
                label={messages['training_center_report.month_net_income']}
                register={register}
                errorInstance={errors}
                setValue={setValue}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <fieldset>
                <legend style={{fontSize: '20px', color: '#0a8fdc'}}>
                  {
                    messages[
                      'training_center_report.net_training_expenses_reporting_month'
                    ]
                  }
                </legend>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={6}>
                    <CustomNumberInputReportForm
                      id='reporting_month_training_expenses_instructor_salaries'
                      label={
                        messages['training_center_report.instructor_salaries']
                      }
                      register={register}
                      errorInstance={errors}
                      setValue={setValue}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <CustomNumberInputReportForm
                      id='reporting_month_training_expenses_other'
                      label={messages['training_center_report.other_expenses']}
                      register={register}
                      errorInstance={errors}
                      setValue={setValue}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <CustomNumberInputReportForm
                      id='reporting_month_training_expenses_total'
                      label={
                        messages[
                          'training_center_report.training_expenses_total'
                        ]
                      }
                      register={register}
                      errorInstance={errors}
                      setValue={setValue}
                      required
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Grid>

            <Grid item xs={12}>
              <fieldset>
                <legend style={{fontSize: '20px', color: '#0a8fdc'}}>
                  {messages['training_center_report.bank_status']}
                </legend>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={6}>
                    <CustomTextInput
                      id='bank_status_up_to_previous_month'
                      label={
                        messages[
                          'training_center_report.bank_status_up_to_previous_month'
                        ]
                      }
                      control={control}
                      errorInstance={errors}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6}>
                    <CustomTextInput
                      id='bank_status_so_far'
                      label={
                        messages['training_center_report.bank_status_so_far']
                      }
                      control={control}
                      errorInstance={errors}
                      required
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                id='account_no_and_bank_branch_name'
                label={
                  messages[
                    'training_center_report.account_no_and_bank_branch_name'
                  ]
                }
                control={control}
                errorInstance={errors}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextInput
                id='comments'
                label={messages['common.comment']}
                control={control}
                errorInstance={errors}
                multiline={true}
                rows={3}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <SubmitButton
                startIcon={false}
                isSubmitting={isSubmitting || isFormSubmitted}
                label={messages['common.submit'] as string}
                size='large'
              />
            </Grid>
          </Grid>
        </form>
      </PageBlock>
    </>
  );
};

export default IncomeExpenditureReportCreatePage;
