import React, {useEffect, useMemo, useState} from 'react';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import {SubmitHandler, useForm} from 'react-hook-form';
import {Button, Grid} from '@mui/material';
import CustomDateTimeField from '../../../@core/elements/input/CustomDateTimeField';
import {useIntl} from 'react-intl';
import yup from '../../../@core/libs/yup';
import {yupResolver} from '@hookform/resolvers/yup';
import IconTrainingCenter from '../../../@core/icons/IconTrainingCenter';
import IntlMessages from '../../../@core/utility/IntlMessages';
import PageBlock from '../../../@core/utilities/PageBlock';
import {ArrowBack} from '@mui/icons-material';
import {useRouter} from 'next/router';
import {skillDevelopmentReportCreate} from '../../../services/instituteManagement/TrainingCenterReportService';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import useNotiStack from '../../../@core/hooks/useNotifyStack';

const initialValues = {
  reporting_month: '',
  number_of_trades_allowed: 0,
  number_of_ongoing_trades: 0,
  date_of_last_election_of_all_party_council: '',
  current_session_trainees_women: 0,
  current_session_trainees_men: 0,
  current_session_trainees_disabled_and_others: 0,
  current_session_trainees_total: 0,
  total_trainees_men: 0,
  total_trainees_women: 0,
  total_trainees_disabled_and_others: 0,
  total_trainees_total: 0,
  number_of_computers: 0,
  number_of_other_equipments: 0,
  bank_status_skill_development: '',
  bank_status_coordinating_council: '',
  amount_of_total_fdr: 0,
  comments: '',
};

const SkillDevelopmentReportCreatePage = () => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const router = useRouter();
  const {createSuccessMessage} = useSuccessMessage();
  const [inputValues, setInputValues] = useState({
    current_session_trainees_women: '',
    current_session_trainees_men: '',
    current_session_trainees_disabled_and_others: '',
  });
  const [inputValuesTwo, setInputValuesTwo] = useState({
    total_trainees_men: '',
    total_trainees_women: '',
    total_trainees_disabled_and_others: '',
  });

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      reporting_month: yup
        .string()
        .required()
        .label(
          messages['skill_development_report.approved_trade_number'] as string,
        ),
      number_of_trades_allowed: yup
        .number()
        .min(0)
        .label(
          messages['skill_development_report.approved_trade_number'] as string,
        ),
      number_of_ongoing_trades: yup
        .number()
        .min(0)
        .label(
          messages['skill_development_report.current_trade_number'] as string,
        ),
      current_session_trainees_women: yup
        .number()
        .min(0)
        .label(messages['skill_development_report.current_women'] as string),
      date_of_last_election_of_all_party_council: yup
        .string()
        .label(
          messages['skill_development_report.last_election_date'] as string,
        ),
      current_session_trainees_men: yup
        .number()
        .min(0)
        .label(messages['skill_development_report.current_men'] as string),
      current_session_trainees_disabled_and_others: yup
        .number()
        .min(0)
        .label(
          messages[
            'skill_development_report.current_disabled_and_others'
          ] as string,
        ),
      current_session_trainees_total: yup
        .number()
        .min(0)
        .label(messages['skill_development_report.current_total'] as string),
      total_trainees_men: yup
        .number()
        .min(0)
        .label(messages['skill_development_report.from_start_men'] as string),
      total_trainees_women: yup
        .number()
        .min(0)
        .label(messages['skill_development_report.from_start_women'] as string),
      total_trainees_disabled_and_others: yup
        .number()
        .min(0)
        .label(
          messages[
            'skill_development_report.from_start_disabled_and_others'
          ] as string,
        ),
      total_trainees_total: yup
        .number()
        .min(0)
        .label(messages['skill_development_report.from_start_total'] as string),
      number_of_computers: yup
        .number()
        .min(0)
        .label(
          messages['skill_development_report.number_of_computers'] as string,
        ),
      number_of_other_equipments: yup
        .number()
        .min(0)
        .label(
          messages['skill_development_report.number_of_machines'] as string,
        ),
      bank_status_skill_development: yup
        .string()
        .label(
          messages[
            'skill_development_report.skill_improvement_training'
          ] as string,
        ),
      bank_status_coordinating_council: yup
        .string()
        .label(
          messages['skill_development_report.coordinating_committee'] as string,
        ),
      amount_of_total_fdr: yup
        .number()
        .min(0)
        .label(messages['skill_development_report.total_fdr_amount'] as string),
      comments: yup.string().label(messages['common.comment'] as string),
    });
  }, [messages]);

  const {
    control,
    register,
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

  const handleInputChange = (name: string, value: number) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };

  const handleInputChangeTwo = (name: string, value: number) => {
    setInputValuesTwo((prevInputValues) => ({
      ...prevInputValues,
      [name]: value,
    }));
  };

  useEffect(() => {
    const newSum = Object.values(inputValues).reduce((acc, cur) => {
      const num = parseInt(cur);
      return Number.isNaN(num) ? acc : acc + num;
    }, 0);
    setValue('current_session_trainees_total', newSum);
  }, [inputValues]);

  useEffect(() => {
    const newSumTwo = Object.values(inputValuesTwo).reduce((acc, cur) => {
      const num = parseInt(cur);
      return Number.isNaN(num) ? acc : acc + num;
    }, 0);
    setValue('total_trainees_total', newSumTwo);
  }, [inputValuesTwo]);

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      await skillDevelopmentReportCreate(data);
      createSuccessMessage('skill_development_report.label');
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
            <IntlMessages
              id='common.add_new'
              values={{
                subject: <IntlMessages id='skill_development_report.label' />,
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
          <Grid container marginTop={'10px'} spacing={2} maxWidth={'md'}>
            <Grid item xs={12} sm={6} md={6}>
              <CustomDateTimeField
                id='reporting_month'
                label={messages['common.reporting_month']}
                register={register}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='number_of_trades_allowed'
                type={'number'}
                label={
                  messages['skill_development_report.approved_trade_number']
                }
                control={control}
                errorInstance={errors}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='number_of_ongoing_trades'
                type={'number'}
                label={
                  messages['skill_development_report.current_trade_number']
                }
                control={control}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12}>
              <fieldset>
                <legend style={{fontSize: '20px'}}>
                  {
                    messages[
                      'skill_development_report.current_session_trainees'
                    ]
                  }
                </legend>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <CustomTextInput
                      id='current_session_trainees_women'
                      defaultValue={inputValues.current_session_trainees_women}
                      onInput={(value: any) =>
                        handleInputChange(
                          'current_session_trainees_women',
                          value,
                        )
                      }
                      type={'number'}
                      label={messages['skill_development_report.current_women']}
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomTextInput
                      id='current_session_trainees_men'
                      defaultValue={inputValues.current_session_trainees_men}
                      onInput={(value: any) =>
                        handleInputChange('current_session_trainees_men', value)
                      }
                      type={'number'}
                      label={messages['skill_development_report.current_men']}
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomTextInput
                      id='current_session_trainees_disabled_and_others'
                      defaultValue={
                        inputValues.current_session_trainees_disabled_and_others
                      }
                      onInput={(value: any) =>
                        handleInputChange(
                          'current_session_trainees_disabled_and_others',
                          value,
                        )
                      }
                      type={'number'}
                      label={
                        messages[
                          'skill_development_report.current_disabled_and_others'
                        ]
                      }
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomTextInput
                      disabled
                      id='current_session_trainees_total'
                      type={'number'}
                      label={messages['skill_development_report.current_total']}
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Grid>
            <Grid item xs={12}>
              <fieldset>
                <legend style={{fontSize: '20px'}}>
                  {messages['skill_development_report.trainees_from_the_start']}
                </legend>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <CustomTextInput
                      id='total_trainees_women'
                      defaultValue={inputValuesTwo.total_trainees_women}
                      onInput={(value: any) =>
                        handleInputChangeTwo('total_trainees_women', value)
                      }
                      type={'number'}
                      label={
                        messages['skill_development_report.from_start_women']
                      }
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomTextInput
                      id='total_trainees_men'
                      defaultValue={inputValuesTwo.total_trainees_men}
                      onInput={(value: any) =>
                        handleInputChangeTwo('total_trainees_men', value)
                      }
                      type={'number'}
                      label={
                        messages['skill_development_report.from_start_men']
                      }
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomTextInput
                      id='total_trainees_disabled_and_others'
                      defaultValue={
                        inputValuesTwo.total_trainees_disabled_and_others
                      }
                      onInput={(value: any) =>
                        handleInputChangeTwo(
                          'total_trainees_disabled_and_others',
                          value,
                        )
                      }
                      type={'number'}
                      label={
                        messages[
                          'skill_development_report.from_start_disabled_and_others'
                        ]
                      }
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomTextInput
                      disabled
                      id='total_trainees_total'
                      type={'number'}
                      label={
                        messages['skill_development_report.from_start_total']
                      }
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='number_of_computers'
                type={'number'}
                label={messages['skill_development_report.number_of_computers']}
                control={control}
                errorInstance={errors}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='number_of_other_equipments'
                type={'number'}
                label={messages['skill_development_report.number_of_machines']}
                control={control}
                errorInstance={errors}
              />
            </Grid>

            <Grid item xs={12}>
              <fieldset>
                <legend style={{fontSize: '20px'}}>
                  {messages['skill_development_report.bank_static']}
                </legend>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <CustomTextInput
                      id='bank_status_skill_development'
                      label={
                        messages[
                          'skill_development_report.skill_improvement_training'
                        ]
                      }
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomTextInput
                      id='bank_status_coordinating_council'
                      label={
                        messages[
                          'skill_development_report.coordinating_committee'
                        ]
                      }
                      control={control}
                      errorInstance={errors}
                    />
                  </Grid>
                </Grid>
              </fieldset>
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='amount_of_total_fdr'
                type={'number'}
                label={messages['skill_development_report.total_fdr_amount']}
                control={control}
                errorInstance={errors}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <CustomDateTimeField
                id='date_of_last_election_of_all_party_council'
                label={messages['skill_development_report.last_election_date']}
                register={register}
                errorInstance={errors}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextInput
                id='comments'
                label={messages['common.comment']}
                control={control}
                errorInstance={errors}
                multiline={true}
              />
            </Grid>

            <Grid item xs={12}>
              <SubmitButton
                startIcon={false}
                isSubmitting={isSubmitting}
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

export default SkillDevelopmentReportCreatePage;
