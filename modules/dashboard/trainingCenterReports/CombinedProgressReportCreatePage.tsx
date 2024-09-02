import React, {useEffect, useMemo, useState} from 'react';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import {SubmitHandler, useForm} from 'react-hook-form';
import {Button, Grid} from '@mui/material';
import {useIntl} from 'react-intl';
import {yupResolver} from '@hookform/resolvers/yup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import PageBlock from '../../../@core/utilities/PageBlock';
import {ArrowBack} from '@mui/icons-material';
import {useRouter} from 'next/router';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import {trainingCenterCombinedProgressReportCreate} from '../../../services/instituteManagement/TrainingCenterReportService';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import CustomNumberInputReportForm from './CustomNumberInputReportForm';
import CustomDatePicker from '../../../@core/elements/input/CustomDatePicker';
import CombinedProgressReportValidationSchema from './CombinedProgressReportValidationSchema';

const ProgressReportCreatePage = () => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage} = useSuccessMessage();
  const router = useRouter();
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const initialValues = {
    reporting_month: '',
    voluntary_organizations_registered_in_current_month: 0,
    members_up_to_previous_month_general_members: 0,
    members_up_to_previous_month_life_member: 0,
    members_up_to_previous_month_patron_member: 0,
    members_up_to_previous_month_total: 0,
    member_enrollment_in_reporting_month_general_members: 0,
    member_enrollment_in_reporting_month_life_member: 0,
    member_enrollment_in_reporting_month_patron_member: 0,
    member_enrollment_in_reporting_month_total: 0,
    total_number_of_members: 0,
    subscriptions_collected_so_far: 0,
    subscriptions_collected_in_current_month_organization: 0,
    subscriptions_collected_in_current_month_member: 0,
    subscriptions_collected_in_current_month_total: 0,
    grants_received_in_current_month_source: '',
    grants_received_in_current_month_amount: 0,
    grants_received_in_current_month_total: 0,
    gross_income: 0,
    income_in_skills_development_sector_trades: 0,
    income_in_skills_development_sector_money: 0,
    expenditure_in_skill_development_training: 0,
    expenditure_in_other_sectors: 0,
    expenditure_total: 0,
    total_income_in_the_training_sector: 0,
    bank_status_and_account_number: '',
    bank_interest: 0,
    amount_of_fdr_and_bank_account_number: '',
    number_of_meetings_held_during_current_financial_year: 0,
    number_of_executive_council_meetings_in_current_month: 0,
    names_and_numbers_of_other_meetings: '',
    coordinating_council_meeting_total: 0,
    other_activities_undertaken: '',
  };

  const validationSchema = useMemo(
    () => CombinedProgressReportValidationSchema(messages),
    [messages],
  );

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    reset(initialValues);
  }, []);

  console.log('errors: ', errors);
  const onSubmit: SubmitHandler<any> = async (data: any) => {
    //console.log(data);
    try {
      await trainingCenterCombinedProgressReportCreate(data);
      createSuccessMessage('training_center_progress_report_combined.label');
      setIsFormSubmitted(true);
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
            <AssignmentTurnedInIcon />
            <IntlMessages id='training_center_progress_report_combined.label' />
          </>
        }
        extra={[
          <Button
            key={1}
            variant={'contained'}
            color={'primary'}
            size={'small'}
            onClick={() => {
              router.back();
            }}>
            <ArrowBack />
            {messages['common.back']}
          </Button>,
        ]}>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Grid container marginTop={'10px'} spacing={2}>
            <Grid item xs={12} md={6}>
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
              <CustomNumberInputReportForm
                id='voluntary_organizations_registered_in_current_month'
                setValue={setValue}
                label={
                  messages[
                    'training_center_progress_report.voluntary_organizations_registered_in_current_month'
                  ]
                }
                register={register}
                errorInstance={errors}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <fieldset style={{border: '1px solid #7e7e7e'}}>
                <legend style={{color: '#0a8fdc'}}>
                  {
                    messages[
                      'training_center_progress_report.members_up_to_previous_month'
                    ]
                  }
                </legend>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id={'members_up_to_previous_month_general_members'}
                      setValue={setValue}
                      label={
                        messages[
                          'training_center_progress_report.general_members'
                        ]
                      }
                      register={register}
                      errorInstance={errors}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id={'members_up_to_previous_month_life_member'}
                      setValue={setValue}
                      label={
                        messages[
                          'training_center_progress_report.lifetime_members'
                        ]
                      }
                      register={register}
                      errorInstance={errors}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id={'members_up_to_previous_month_patron_member'}
                      label={
                        messages[
                          'training_center_progress_report.patron_members'
                        ]
                      }
                      setValue={setValue}
                      register={register}
                      errorInstance={errors}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id={'members_up_to_previous_month_total'}
                      setValue={setValue}
                      label={
                        messages[
                          'training_center_progress_report.total_members'
                        ]
                      }
                      register={register}
                      required
                      errorInstance={errors}
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Grid>
            <Grid item xs={12}>
              <fieldset style={{border: '1px solid #7e7e7e'}}>
                <legend style={{color: '#0a8fdc'}}>
                  {
                    messages[
                      'training_center_progress_report.members_enrollment_in_reporting_month'
                    ]
                  }
                </legend>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id={
                        'member_enrollment_in_reporting_month_general_members'
                      }
                      setValue={setValue}
                      label={
                        messages[
                          'training_center_progress_report.general_members'
                        ]
                      }
                      register={register}
                      errorInstance={errors}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id={'member_enrollment_in_reporting_month_life_member'}
                      label={
                        messages[
                          'training_center_progress_report.lifetime_members'
                        ]
                      }
                      setValue={setValue}
                      register={register}
                      errorInstance={errors}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id={'member_enrollment_in_reporting_month_patron_member'}
                      label={
                        messages[
                          'training_center_progress_report.patron_members'
                        ]
                      }
                      setValue={setValue}
                      register={register}
                      errorInstance={errors}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id={'member_enrollment_in_reporting_month_total'}
                      label={
                        messages[
                          'training_center_progress_report.total_members'
                        ]
                      }
                      setValue={setValue}
                      register={register}
                      errorInstance={errors}
                      required
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Grid>

            <Grid item xs={12}>
              <CustomNumberInputReportForm
                id='total_number_of_members'
                label={
                  messages['training_center_progress_report.total_members']
                }
                setValue={setValue}
                register={register}
                errorInstance={errors}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <CustomNumberInputReportForm
                id='subscriptions_collected_so_far'
                label={
                  messages[
                    'training_center_progress_report.subscriptions_collected_so_far'
                  ]
                }
                setValue={setValue}
                register={register}
                errorInstance={errors}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <fieldset style={{border: '1px solid #7e7e7e'}}>
                <legend style={{color: '#0a8fdc'}}>
                  {
                    messages[
                      'training_center_progress_report.total_amount_of_subscription_in_current_month'
                    ]
                  }
                </legend>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id={
                        'subscriptions_collected_in_current_month_organization'
                      }
                      label={
                        messages[
                          'training_center_progress_report.subscriptions_collected_from_organization'
                        ]
                      }
                      setValue={setValue}
                      register={register}
                      required
                      errorInstance={errors}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id={'subscriptions_collected_in_current_month_member'}
                      label={
                        messages[
                          'training_center_progress_report.subscriptions_collected_from_member'
                        ]
                      }
                      setValue={setValue}
                      register={register}
                      errorInstance={errors}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomNumberInputReportForm
                      id={'subscriptions_collected_in_current_month_total'}
                      label={
                        messages[
                          'training_center_progress_report.total_subscription'
                        ]
                      }
                      setValue={setValue}
                      register={register}
                      required
                      errorInstance={errors}
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Grid>

            <Grid item xs={12}>
              <fieldset style={{border: '1px solid #7e7e7e'}}>
                <legend style={{color: '#0a8fdc'}}>
                  {
                    messages[
                      'training_center_progress_report.amount_of_grants_received_in_current_month'
                    ]
                  }
                </legend>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <CustomTextInput
                      id={'grants_received_in_current_month_source'}
                      label={messages['training_center_progress_report.source']}
                      control={control}
                      errorInstance={errors}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id={'grants_received_in_current_month_amount'}
                      label={messages['common.amount']}
                      setValue={setValue}
                      register={register}
                      required
                      errorInstance={errors}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomNumberInputReportForm
                      id={'grants_received_in_current_month_total'}
                      label={
                        messages['training_center_progress_report.total_grants']
                      }
                      setValue={setValue}
                      register={register}
                      required
                      errorInstance={errors}
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Grid>

            <Grid item xs={12}>
              <CustomNumberInputReportForm
                id='gross_income'
                label={messages['training_center_progress_report.gross_income']}
                setValue={setValue}
                register={register}
                required
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12}>
              <fieldset style={{border: '1px solid #7e7e7e'}}>
                <legend style={{color: '#0a8fdc'}}>
                  {
                    messages[
                      'training_center_progress_report.income_in_skill_development_sector_in_reported_month'
                    ]
                  }
                </legend>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id={'income_in_skills_development_sector_trades'}
                      label={
                        messages[
                          'training_center_progress_report.number_of_trades'
                        ]
                      }
                      setValue={setValue}
                      register={register}
                      required
                      errorInstance={errors}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id={'income_in_skills_development_sector_money'}
                      label={
                        messages[
                          'training_center_progress_report.amount_of_money'
                        ]
                      }
                      setValue={setValue}
                      required
                      register={register}
                      errorInstance={errors}
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Grid>
            <Grid item xs={12}>
              <fieldset style={{border: '1px solid #7e7e7e'}}>
                <legend style={{color: '#0a8fdc'}}>
                  {
                    messages[
                      'training_center_progress_report.expenditure_in_reported_month'
                    ]
                  }
                </legend>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id={'expenditure_in_skill_development_training'}
                      label={
                        messages[
                          'training_center_progress_report.expenditure_in_skill_development_training'
                        ]
                      }
                      setValue={setValue}
                      register={register}
                      required
                      errorInstance={errors}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id={'expenditure_in_other_sectors'}
                      label={
                        messages[
                          'training_center_progress_report.expenditure_in_other_sectors'
                        ]
                      }
                      setValue={setValue}
                      register={register}
                      required
                      errorInstance={errors}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomNumberInputReportForm
                      id={'expenditure_total'}
                      label={
                        messages[
                          'training_center_progress_report.expenditure_total'
                        ]
                      }
                      setValue={setValue}
                      required
                      register={register}
                      errorInstance={errors}
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomNumberInputReportForm
                id='total_income_in_the_training_sector'
                label={
                  messages[
                    'training_center_progress_report.total_income_in_the_training_sector'
                  ]
                }
                setValue={setValue}
                register={register}
                required
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='bank_status_and_account_number'
                label={
                  messages[
                    'training_center_progress_report.bank_status_and_account_number'
                  ]
                }
                control={control}
                errorInstance={errors}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomNumberInputReportForm
                id='bank_interest'
                label={
                  messages['training_center_progress_report.bank_interest']
                }
                setValue={setValue}
                register={register}
                required
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='amount_of_fdr_and_bank_account_number'
                label={
                  messages[
                    'training_center_progress_report.amount_of_fdr_and_bank_account_number'
                  ]
                }
                control={control}
                required
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12}>
              <fieldset style={{border: '1px solid #7e7e7e'}}>
                <legend style={{color: '#0a8fdc'}}>
                  {
                    messages[
                      'training_center_progress_report.information_about_coordinating_council_combined_meeting'
                    ]
                  }
                </legend>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id={
                        'number_of_meetings_held_during_current_financial_year'
                      }
                      label={
                        messages[
                          'training_center_progress_report.number_of_meetings_held_during_current_financial_year'
                        ]
                      }
                      setValue={setValue}
                      required
                      register={register}
                      errorInstance={errors}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id={
                        'number_of_executive_council_meetings_in_current_month'
                      }
                      setValue={setValue}
                      label={
                        messages[
                          'training_center_progress_report.number_of_executive_council_meetings_in_current_month'
                        ]
                      }
                      register={register}
                      errorInstance={errors}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomNumberInputReportForm
                      id={'coordinating_council_meeting_total'}
                      register={register}
                      errorInstance={errors}
                      required
                      label={
                        messages[
                          'training_center_progress_report.coordinating_council_meeting_total'
                        ]
                      }
                      setValue={setValue}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomTextInput
                      id={'names_and_numbers_of_other_meetings'}
                      label={
                        messages[
                          'training_center_progress_report.names_and_numbers_of_other_meetings'
                        ]
                      }
                      control={control}
                      errorInstance={errors}
                      required
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Grid>

            <Grid item xs={12}>
              <CustomTextInput
                id='other_activities_undertaken'
                label={
                  messages[
                    'training_center_progress_report.other_activities_undertaken'
                  ]
                }
                control={control}
                errorInstance={errors}
                required
              />
            </Grid>

            <Grid item xs={12} display={'flex'} justifyContent={'flex-end'}>
              <SubmitButton
                startIcon={false}
                isSubmitting={isSubmitting}
                label={messages['common.submit'] as string}
                size='large'
                isDisable={isSubmitting || isFormSubmitted}
              />
            </Grid>
          </Grid>
        </form>
      </PageBlock>
    </>
  );
};

export default ProgressReportCreatePage;
