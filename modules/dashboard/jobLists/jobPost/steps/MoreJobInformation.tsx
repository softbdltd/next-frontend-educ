import React, {useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import yup from '../../../../../@core/libs/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {Box, Button, Grid, Typography} from '@mui/material';
import CustomTextInput from '../../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {processServerSideErrors} from '../../../../../@core/utilities/validationErrorHandler';
import useNotiStack from '../../../../../@core/hooks/useNotifyStack';
import {Body1, Body2} from '../../../../../@core/elements/common';
import CustomCheckbox from '../../../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import CustomSelectAutoComplete from '../../../../learner/registration/CustomSelectAutoComplete';
import {HorizontalRule} from '@mui/icons-material';
import FormRadioButtons from '../../../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import CustomFormToggleButtonGroup from '../../../../../@core/elements/input/CustomFormToggleButtonGroup';
import {
  JobLevel,
  JobPlaceTypes,
  OtherBenefit,
  SalaryShowOption,
  SalaryTypes,
  WorkPlaceTypes,
} from '../enums/JobPostEnums';
import CustomFilterableFormSelect from '../../../../../@core/elements/input/CustomFilterableFormSelect';
import {
  useFetchJobAdditionalInformation,
  useFetchJobLocations,
} from '../../../../../services/IndustryManagement/hooks';
import {saveAdditionalJobInformation} from '../../../../../services/IndustryManagement/JobService';
import usePageLoadToTop from './usePageLoadToTop';
import {useFetchCountries} from '../../../../../services/locationManagement/hooks';
import _ from 'lodash';

interface Props {
  jobId: string;
  onBack: () => void;
  onContinue: () => void;
  setLatestStep: (step: number) => void;
}

const initialValue = {
  job_levels: [],
  job_context: '',
  job_context_en: '',
  job_responsibilities: '',
  job_responsibilities_en: '',
  work_places: [],
  job_place_type: JobPlaceTypes.INSIDE_BANGLADESH,
  is_other_benefits: OtherBenefit.NO,
  salary_min: '',
  salary_max: '',
  is_salary_info_show: SalaryShowOption.YES,
  //salary_review: '',
  festival_bonus: '',
  other_benefits: [],
  //lunch_facilities: '',
  others: '',
};

const MoreJobInformation = ({
  jobId,
  onBack,
  onContinue,
  setLatestStep,
}: Props) => {
  const {messages, formatNumber} = useIntl();
  const {successStack, errorStack} = useNotiStack();

  const [isWorkAtOffice, setIsWorkAtOffice] = useState<boolean>(false);
  const [isWorkFromHome, setIsWorkFromHome] = useState<boolean>(false);
  const [hasOtherBenefits, setHasOtherBenefits] = useState<boolean>(false);
  const {data: additionalInfo, isLoading: isLoadingData} =
    useFetchJobAdditionalInformation(jobId);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isInitialSubmit, setIsInitialSubmit] = useState<boolean>(true);
  const [jobPlaceType, setJobPlaceType] = useState<number>(
    JobPlaceTypes.INSIDE_BANGLADESH,
  );

  const id = 'top';
  usePageLoadToTop({id, dependency: isReady});

  const {data: jobLocations, isLoading: isLoadingJobLocations} =
    useFetchJobLocations();

  const [countryParams] = useState<any>({});
  const {data: countries, isLoading: isLoadingCountries} =
    useFetchCountries(countryParams);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      job_levels: yup
        .array()
        .of(yup.number())
        .min(1, messages['common.must_select_one'] as string)
        .label(messages['label.job_level'] as string),
      job_responsibilities: yup
        .string()
        .required()
        .label(messages['common.job_responsibility'] as string),
      job_place_type: yup.string().required().label('Job place type'),
      job_locations: yup
        .array()
        .of(yup.object().shape({}))
        .label(messages['common.job_location'] as string),
      country_id: yup
        .mixed()
        .label(messages['common.country'] as string)
        .when('job_place_type', {
          is: (value: any) => Number(value) == JobPlaceTypes.OUTSIDE_BANGLADESH,
          then: yup.mixed().required(),
        }),
      is_other_benefits: yup
        .string()
        .required()
        .label(messages['common.compensation_other_benefits'] as string),
      other_benefits: yup
        .array()
        .of(yup.object().shape({}))
        .label(messages['common.facilities'] as string),
      is_salary_info_show: yup
        .number()
        .required()
        .label(messages['label.salary_details_option'] as string),
      salary_min: yup
        .string()
        .trim()
        .required()
        .label(messages['label.min_salary'] as string),
      salary_max: yup
        .string()
        .trim()
        .required()
        .label(messages['label.max_salary'] as string)
        .when('salary_min', (salaryMin: any, schema: any) => {
          return schema.test({
            test: (salary_max: any) => {
              if (!salary_max) return true;
              return Number(salary_max) > Number(salaryMin);
            },
            message: messages['job_posting.salary_min_max_error'] as string,
          });
        }),
      work_places: yup
        .array()
        .of(yup.boolean())
        .min(1)
        .label(messages['common.workplace'] as string),
    });
  }, [messages]);

  const {
    register,
    setError,
    setValue,
    control,
    reset,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  const numberOfFestivalBonus = useMemo(() => {
    let bonus: Array<any> = [];
    for (let i = 1; i <= 6; i++) bonus.push({id: i, title: formatNumber(i)});
    return bonus;
  }, [messages]);

  const facilities = useMemo(
    () => [
      {
        id: 1,
        title: messages['job.facility_ta'],
      },
      {
        id: 2,
        title: messages['job.facility_mobile'],
      },
      {
        id: 3,
        title: messages['job.facility_pension'],
      },
      {
        id: 4,
        title: messages['job.facility_tour'],
      },
      {
        id: 5,
        title: messages['job.facility_credit'],
      },
      {
        id: 6,
        title: messages['job.facility_medical'],
      },
      {
        id: 7,
        title: messages['job.facility_performance'],
      },
      {
        id: 8,
        title: messages['job.facility_profit'],
      },
      {
        id: 9,
        title: messages['job.facility_provident'],
      },
      {
        id: 10,
        title: messages['job.facility_holidays'],
      },
      {
        id: 11,
        title: messages['job.facility_insurance'],
      },
      {
        id: 12,
        title: messages['job.facility_gratuity'],
      },
      {
        id: 13,
        title: messages['job.facility_over_time'],
      },
    ],
    [messages],
  );

  useEffect(() => {
    if (additionalInfo && additionalInfo?.latest_step) {
      const latestStep = additionalInfo.latest_step;
      delete additionalInfo?.latest_step;

      if (latestStep >= 2) {
        let data: any = {
          job_levels: getJobLevelIds(additionalInfo?.job_levels),
          job_context: additionalInfo?.job_context,
          job_context_en: additionalInfo?.job_context_en,
          job_responsibilities: additionalInfo?.job_responsibilities,
          job_responsibilities_en: additionalInfo?.job_responsibilities_en,
          job_locations: [],
          country_id: additionalInfo?.country_id,
          job_place_type:
            additionalInfo?.job_place_type ?? JobPlaceTypes.INSIDE_BANGLADESH,
          is_other_benefits: additionalInfo?.is_other_benefits,
          salary_min: additionalInfo?.salary_min,
          salary_max: additionalInfo?.salary_max,
          is_salary_info_show: additionalInfo?.is_salary_info_show,
          festival_bonus: additionalInfo?.festival_bonus,
          //salary_review: additionalInfo?.salary_review,
          //lunch_facilities: additionalInfo?.lunch_facilities,
          other_benefits: additionalInfo?.other_benefits,
          others: additionalInfo?.others,
          others_en: additionalInfo?.others_en,
          work_places: [false, false],
        };
        (additionalInfo?.work_places || []).map((workPlace: any) => {
          if (workPlace.work_place_id == WorkPlaceTypes.HOME) {
            data.work_places[0] = true;
            setIsWorkFromHome(true);
          } else if (workPlace.work_place_id == WorkPlaceTypes.OFFICE) {
            data.work_places[1] = true;
            setIsWorkAtOffice(true);
          }
        });

        setIsReady(true);

        setHasOtherBenefits(
          additionalInfo?.is_other_benefits == OtherBenefit.YES,
        );
        setJobPlaceType(
          Number(
            additionalInfo?.job_place_type ?? JobPlaceTypes.INSIDE_BANGLADESH,
          ),
        );
        reset(data);
      }
      setLatestStep(latestStep);
    } else {
      reset(initialValue);
    }
  }, [additionalInfo]);

  useEffect(() => {
    if (additionalInfo?.job_locations && jobLocations) {
      let locations = getJobLocations(additionalInfo?.job_locations);
      setValue('job_locations', locations);
    }
  }, [additionalInfo, jobLocations]);

  const getJobLevelIds = (job_levels: any) => {
    let ids: any = [];
    (job_levels || []).map((level: any) => {
      ids.push(level.job_level_id);
    });
    return ids;
  };

  const getJobLocations = (locations: any) => {
    let ids: any = (locations || []).map(
      (location: any) => location.location_id,
    );

    return (jobLocations || []).filter((location: any) =>
      ids?.includes(location.location_id),
    );
  };

  console.log('form errors', errors);
  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      let formData = _.cloneDeep(data);
      formData.job_id = jobId;
      setIsInitialSubmit(false);

      if (!(isWorkAtOffice || isWorkFromHome)) return;

      let workPlace = [...formData.work_places];
      formData.work_places = [];
      if (workPlace[0]) {
        formData.work_places.push(WorkPlaceTypes.HOME);
      }
      if (workPlace[1]) {
        formData.work_places.push(WorkPlaceTypes.OFFICE);
      }

      formData.is_other_benefits = Number(formData.is_other_benefits);

      if (formData.is_other_benefits == 1) {
        const benefits: any = [];
        (formData.other_benefits || []).map((benefit: any) => {
          benefits.push(benefit.id);
        });
        if (benefits && benefits.length > 0) {
          formData.other_benefits = benefits;
        } else {
          delete formData.other_benefits;
        }
      } else {
        delete formData.other_benefits;
        //delete formData.salary_review;
        delete formData.festival_bonus;
        //delete formData.lunch_facilities;
        delete formData.others;
        delete formData.others_en;
      }

      const locationIds: any = [];
      (formData.job_locations || []).map((location: any) => {
        locationIds.push(location.location_id);
      });
      formData.job_locations = locationIds;
      if (Number(formData.job_place_type) == JobPlaceTypes.INSIDE_BANGLADESH) {
        delete formData.country_id;
      }

      await saveAdditionalJobInformation(formData);

      successStack(messages['common.data_saved']);
      onContinue();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <Box mt={3} mb={3} id={id}>
      <Typography
        mb={2}
        variant={'h5'}
        fontWeight={'bold'}
        textAlign={'center'}>
        {messages['job_posting.more_job_info']}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomFormToggleButtonGroup
              required
              id={'job_levels'}
              label={messages['label.job_level']}
              buttons={[
                {
                  value: JobLevel.ENTRY,
                  label: messages['label.job_level_entry'],
                },
                {
                  value: JobLevel.MID,
                  label: messages['label.job_level_mid'],
                },
                {
                  value: JobLevel.TOP,
                  label: messages['label.job_level_top'],
                },
              ]}
              control={control}
              errorInstance={errors}
              multiSelect={true}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextInput
              id='job_context'
              label={messages['common.job_context']}
              control={control}
              errorInstance={errors}
              isLoading={isLoadingData}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextInput
              id='job_context_en'
              label={messages['common.job_context_en']}
              control={control}
              errorInstance={errors}
              isLoading={isLoadingData}
              multiline={true}
              rows={3}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextInput
              required
              id='job_responsibilities'
              label={messages['common.job_responsibility']}
              control={control}
              errorInstance={errors}
              isLoading={isLoadingData}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextInput
              id='job_responsibilities_en'
              label={messages['common.job_responsibility_en']}
              control={control}
              errorInstance={errors}
              isLoading={isLoadingData}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Body1>
              {messages['common.workplace']}{' '}
              <span style={{color: '#c00606'}}> *</span>
            </Body1>
            <Grid container spacing={5}>
              <Grid item xs={12} md={6}>
                <CustomCheckbox
                  id='work_places[0]'
                  label={messages['common.work_from_home']}
                  register={register}
                  errorInstance={errors}
                  checked={isWorkFromHome}
                  onChange={() => {
                    setIsWorkFromHome((prev) => !prev);
                  }}
                  isLoading={isLoadingData}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomCheckbox
                  id='work_places[1]'
                  label={messages['common.work_at_office']}
                  register={register}
                  errorInstance={errors}
                  checked={isWorkAtOffice}
                  onChange={() => {
                    setIsWorkAtOffice((prev) => !prev);
                  }}
                  isLoading={isLoadingData}
                />
              </Grid>
            </Grid>
            <Body2>
              <span style={{color: '#c00606'}}>
                {!isInitialSubmit &&
                  !(isWorkAtOffice || isWorkFromHome) &&
                  `${messages['common.workplace']} ${
                    messages['common.validation_required_error'] as string
                  }`}
              </span>
            </Body2>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'flex-end'}>
            <FormRadioButtons
              required
              id='job_place_type'
              label={''}
              radios={[
                {
                  key: JobPlaceTypes.INSIDE_BANGLADESH,
                  label: messages['job.location_anywhere_in_bd'],
                },
                {
                  key: JobPlaceTypes.OUTSIDE_BANGLADESH,
                  label: messages['job.location_outside_bd'],
                },
              ]}
              control={control}
              defaultValue={String(JobPlaceTypes.INSIDE_BANGLADESH)}
              isLoading={isLoadingData}
              onChange={(value: number) => {
                setJobPlaceType(Number(value));
              }}
            />
            <Box sx={{display: 'flex'}}>
              {jobPlaceType == JobPlaceTypes.INSIDE_BANGLADESH && (
                <CustomSelectAutoComplete
                  id='job_locations'
                  label={messages['common.job_location']}
                  isLoading={isLoadingJobLocations}
                  control={control}
                  options={jobLocations || []}
                  optionTitleProp={['title']}
                  optionValueProp={'location_id'}
                  errorInstance={errors}
                />
              )}
              {jobPlaceType == JobPlaceTypes.OUTSIDE_BANGLADESH && (
                <CustomFilterableFormSelect
                  required
                  id='country_id'
                  label={messages['common.country']}
                  isLoading={isLoadingCountries}
                  control={control}
                  options={countries || []}
                  optionTitleProp={['title']}
                  optionValueProp={'id'}
                  errorInstance={errors}
                />
              )}
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'flex-end'}>
            <FormRadioButtons
              id='salary_type'
              label={'job.salary_type'}
              radios={[
                {
                  key: SalaryTypes.DAILY,
                  label: messages['job.salary_type_daily'],
                },
                {
                  key: SalaryTypes.WEEKLY,
                  label: messages['job.salary_type_weekly'],
                },
                {
                  key: SalaryTypes.MONTHLY,
                  label: messages['job.salary_type_monthly'],
                },
                {
                  key: SalaryTypes.ANNUAL,
                  label: messages['job.salary_type_annual'],
                },
              ]}
              control={control}
              defaultValue={SalaryTypes.MONTHLY}
              isLoading={isLoadingData}
            />
            <Box sx={{display: 'flex'}} justifyContent={'space-between'}>
              <CustomTextInput
                required
                id='salary_min'
                type={'number'}
                label={messages['label.min_salary']}
                control={control}
                errorInstance={errors}
                isLoading={isLoadingData}
                InputProps={{inputProps: {min: 0}}}
              />
              <HorizontalRule fontSize={'small'} sx={{margin: 'auto'}} />
              <CustomTextInput
                required
                id='salary_max'
                type={'number'}
                label={messages['label.max_salary']}
                control={control}
                errorInstance={errors}
                isLoading={isLoadingData}
                InputProps={{inputProps: {min: 0}}}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormRadioButtons
              id='is_salary_info_show'
              label={'label.salary_details_option'}
              radios={[
                {
                  key: SalaryShowOption.YES,
                  label: messages['common.yes'],
                },
                {
                  key: SalaryShowOption.NEGOTIABLE,
                  label: messages['common.no'],
                },
              ]}
              control={control}
              defaultValue={SalaryShowOption.YES}
              isLoading={isLoadingData}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomFormToggleButtonGroup
              id={'is_other_benefits'}
              label={messages['common.compensation_other_benefits']}
              buttons={[
                {
                  value: OtherBenefit.NO,
                  label: messages['common.no'],
                },
                {
                  value: OtherBenefit.YES,
                  label: messages['common.yes'],
                },
              ]}
              control={control}
              errorInstance={errors}
              multiSelect={false}
              defaultValue={
                hasOtherBenefits ? OtherBenefit.YES : OtherBenefit.NO
              }
              onChange={(value: number) => {
                setHasOtherBenefits(value == OtherBenefit.YES);
              }}
            />
          </Grid>

          {hasOtherBenefits && (
            <React.Fragment>
              <Grid item xs={12}>
                <CustomSelectAutoComplete
                  id='other_benefits'
                  label={messages['common.facilities']}
                  control={control}
                  options={facilities}
                  optionTitleProp={['title']}
                  optionValueProp={'id'}
                  errorInstance={errors}
                />
              </Grid>
              {/*<Grid item xs={12} md={6}>
                <CustomFormToggleButtonGroup
                  id={'salary_review'}
                  label={messages['common.salary_review']}
                  buttons={[
                    {
                      value: SalaryReviewType.HALF_YEARLY,
                      label: messages['common.half_yearly'],
                    },
                    {
                      value: SalaryReviewType.YEARLY,
                      label: messages['common.yearly'],
                    },
                  ]}
                  control={control}
                  errorInstance={errors}
                  multiSelect={false}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomFormToggleButtonGroup
                  id={'lunch_facilities'}
                  label={messages['common.lunch_facilities']}
                  buttons={[
                    {
                      value: LunchFacilityType.PARTIALLY_SUBSIDIZE,
                      label: messages['common.partially_subsidize'],
                    },
                    {
                      value: LunchFacilityType.FULL_SUBSIDIZE,
                      label: messages['common.full_subsidize'],
                    },
                  ]}
                  control={control}
                  errorInstance={errors}
                  multiSelect={false}
                />
              </Grid>*/}

              <Grid item xs={12}>
                <CustomFilterableFormSelect
                  isLoading={isLoadingData}
                  id='festival_bonus'
                  label={messages['common.festival_bonus']}
                  options={numberOfFestivalBonus}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  control={control}
                  errorInstance={errors}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextInput
                  id='others'
                  label={messages['common.others']}
                  control={control}
                  errorInstance={errors}
                  multiline={true}
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextInput
                  id='others_en'
                  label={messages['common.others_en']}
                  control={control}
                  errorInstance={errors}
                  multiline={true}
                  rows={3}
                />
              </Grid>
            </React.Fragment>
          )}
        </Grid>
        <Box display={'flex'} justifyContent={'space-between'} mt={3}>
          <Button onClick={onBack} variant={'outlined'} color={'primary'}>
            {messages['common.previous']}
          </Button>
          <Button
            disabled={isSubmitting || !isReady}
            type={'submit'}
            variant={'contained'}
            color={'primary'}>
            {messages['common.save_and_continue']}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default MoreJobInformation;
