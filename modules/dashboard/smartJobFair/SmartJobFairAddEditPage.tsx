import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Box, Button, ButtonGroup, Grid, Paper, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useIntl} from 'react-intl';
import {
  useFetchLocalizedDistricts,
  useFetchLocalizedDivisions,
} from '../../../services/locationManagement/hooks';
import {useRouter} from 'next/router';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import CustomDatePicker from '../../../@core/elements/input/CustomDatePicker';
import CustomChipTextInput from '../../../@core/elements/input/CustomTextInput/CustomChipTextInput';
import RowStatus from '../../../@core/utilities/RowStatus';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import {filterDistrictsByDivisionId} from '../../../services/locationManagement/locationUtils';
import {AddCircleOutline, RemoveCircleOutline} from '@mui/icons-material';
import yup from '../../../@core/libs/yup';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {
  createSmartJobFair,
  updateSmartJobFair,
} from '../../../services/learnerManagement/SmartJobFair';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {useFetchConstituencies} from '../../../services/cmsManagement/hooks';
import {useFetchSmartCareerFair} from '../../../services/instituteManagement/hooks';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import _ from 'lodash';

const PREFIX = 'SmartCareerFair';

const classes = {
  rootContainer: `${PREFIX}-rootContainer`,
  PaperBox: `${PREFIX}-PaperBox`,
  signInStyle: `${PREFIX}-signInStyle`,
  FormBox: `${PREFIX}-FormBox`,
  JobFair: `${PREFIX}-JobFair`,
  MenuTypography: `${PREFIX}-MenuTypography`,
  BlueBoxTypo: `${PREFIX}-BlueBoxTypo`,
  BlueBoxNum: `${PREFIX}-BlueBoxNum`,
};

const StyledBox = styled(Box)(({theme}) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '15px',
  [`& .${classes.PaperBox}`]: {
    width: 'calc(100% - 34px)',
  },

  [`& .${classes.FormBox}`]: {
    backgroundColor: '#0080ff',
    padding: 6,
    margin: '0px 24px',
  },

  [`& .${classes.MenuTypography}`]: {
    fontSize: '1.125rem',
    color: 'rgba(0,0,0,0.6)',
  },

  [`& .${classes.BlueBoxTypo}`]: {
    paddingLeft: '22px',
    fontSize: '1.125rem',
    color: 'white',
    fontWeight: 'bold',
    position: 'relative',
  },

  [`& .${classes.BlueBoxNum}`]: {
    backgroundColor: 'white',
    borderRadius: '20px',
  },

  [`& .${classes.JobFair}`]: {
    marginBottom: '20px',
    color: 'red',
    fontSize: '25px',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  [`& .MuiChip-root`]: {
    height: '43px',
  },
}));

const initialValues = {
  loc_division_id: '',
  loc_district_id: '',
  loc_constituency_id: '',
  fair_date: '',
  governmental_institutions: 0,
  entrepreneurship_institutions: 0,
  e_learning_institutions: 0,
  e_commerce_institutions: 0,
  job_providing_institutions: 0,
  total_participating_institutions: 0,
  /* here  */
  online_jobs_demand: 0,
  on_spot_jobs_demand: 0,
  total_jobs_demand: 0,
  job_provider_info: [
    {
      job_providing_institution_name: '',
      institution_wise_jobs_demand_males: 0,
      institution_wise_jobs_demand_females: 0,
      institution_wise_jobs_demand_learners: 0,
      institution_wise_cv_submitted_male: 0,
      institution_wise_cv_submitted_female: 0,
      institution_wise_cv_submitted_learners: 0,
      institution_wise_total_job: 0,
      institution_wise_on_spot_job_provider: 0,
      institution_wise_on_spot_job_post: '',
    },
  ],
  offline_registered_males: 0,
  offline_registered_females: 0,
  total_offline_registered_learners: 0,
  online_registered_males: 0,
  online_registered_females: 0,
  total_online_registered_learners: 0,
  total_fair_registered_learners: 0,
  cv_submitted_jobs: 0,
  on_spot_jobs: 0,
  total_jobs_provided: 0,
};

const SmartJobFairAddEditPage = () => {
  const {messages, formatNumber} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const router = useRouter();
  const fairId = Number(router.query.id);
  const [divisionfilters] = useState({row_status: RowStatus.ACTIVE});
  const [constituenciesFilter, setConstituenciesFilter] = useState<any>(null);
  const {data: divisions, isLoading: isLoadingDivisions}: any =
    useFetchLocalizedDivisions(divisionfilters);
  const [districtsFilter] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const {data: districts} = useFetchLocalizedDistricts(districtsFilter);

  const {data: parliamentAreas, isLoading: isParliamentAreaLoading} =
    useFetchConstituencies(constituenciesFilter);

  const [districtsList, setDistrictsList] = useState<Array<any> | []>([]);
  const [arrayFields, setArrayFields] = useState<any>([1]);

  const {data: itemData, mutate: mutateFair} = useFetchSmartCareerFair(fairId);

  const changeDivisionAction = useCallback(
    (divisionId: number) => {
      setDistrictsList(filterDistrictsByDivisionId(districts, divisionId));
    },
    [districts],
  );

  const handleDistrictChange = useCallback((districtId: any) => {
    setConstituenciesFilter(
      districtId
        ? {
            loc_district_id: districtId,
          }
        : null,
    );
  }, []);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      loc_division_id: yup
        .string()
        .trim()
        .required()
        .label(messages['divisions.label'] as string),
      loc_district_id: yup
        .string()
        .trim()
        .required()
        .label(messages['districts.label'] as string),
      loc_constituency_id: yup
        .string()
        .trim()
        .required()
        .label(messages['common.parliament_area'] as string),
      fair_date: yup
        .string()
        .required()
        .label(messages['common.date'] as string),
      job_provider_info: yup.array().of(
        yup.object().shape({
          job_providing_institution_name: yup
            .string()
            .required()
            .label(messages['common.institution_name'] as string),
        }),
      ),
    });
  }, [messages]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    setError,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  const [valuesParticipatedInstitutions, setValuesParticipatedInstitutions] =
    useState({
      total_sum: 0,
      governmental_institutions: 0,
      entrepreneurship_institutions: 0,
      e_learning_institutions: 0,
      e_commerce_institutions: 0,
      job_providing_institutions: 0,
    });

  const [valuesJobDemand, setValuesJobDemand] = useState({
    total_sum: 0,
    online_jobs_demand: 0,
    on_spot_jobs_demand: 0,
  });

  const [valuesEmploymentInfo, setValuesEmploymentInfo] = useState({
    total_sum: 0,
    cv_submitted_jobs: 0,
    on_spot_jobs: 0,
  });

  const [valuesYouthRegistration, setValuesYouthRegistration] = useState({
    total_sum: 0,
    online_registered_males: 0,
    online_registered_females: 0,
    offline_registered_males: 0,
    offline_registered_females: 0,
  });

  const [valuesInstituteWiseJobs, setValuesInstituteWiseJobs] = useState({
    total_sum: 0,
    on_spot_job: [0],
  });

  useEffect(() => {
    if (itemData) {
      let instituteWiseData: any[] = [];
      let instituteWiseOnSpotData: any[] = [];
      let fArrays: any[] = [];
      if (
        itemData.job_provider_information &&
        itemData.job_provider_information.length > 0
      ) {
        itemData.job_provider_information.map((item: any, index: number) => {
          const obj = {
            job_providing_institution_name: item.job_providing_institution_name,
            institution_wise_jobs_demand_males:
              item.institution_wise_jobs_demand_males,
            institution_wise_jobs_demand_females:
              item.institution_wise_jobs_demand_females,
            institution_wise_cv_submitted_male:
              item.institution_wise_cv_submitted_male,
            institution_wise_cv_submitted_female:
              item.institution_wise_cv_submitted_female,
            institution_wise_on_spot_job_provider:
              item.institution_wise_on_spot_job_provider,
            institution_wise_on_spot_job_post:
              item.institution_wise_on_spot_job_post,
          };
          instituteWiseOnSpotData.push(
            !isNaN(item.institution_wise_on_spot_job_provider)
              ? Number(item.institution_wise_on_spot_job_provider)
              : 0,
          );
          instituteWiseData.push(obj);
          fArrays.push(index + 1);
        });
      }

      reset({
        loc_division_id: itemData?.loc_division_id,
        loc_district_id: itemData?.loc_district_id,
        loc_constituency_id: itemData?.loc_constituency_id,
        fair_date: itemData?.fair_date,

        governmental_institutions: itemData?.governmental_institutions,
        entrepreneurship_institutions: itemData?.entrepreneurship_institutions,
        e_learning_institutions: itemData?.e_learning_institutions,
        e_commerce_institutions: itemData?.e_commerce_institutions,
        job_providing_institutions: itemData?.job_providing_institutions,

        online_jobs_demand: itemData?.online_jobs_demand,
        on_spot_jobs_demand: itemData?.on_spot_jobs_demand,
        total_jobs_demand: itemData?.total_jobs_demand,

        job_provider_info: instituteWiseData,

        offline_registered_males: itemData?.offline_registered_males,
        offline_registered_females: itemData?.offline_registered_females,
        total_offline_registered_learners:
          itemData?.total_offline_registered_learners,
        online_registered_males: itemData?.online_registered_males,
        online_registered_females: itemData?.online_registered_females,
        total_online_registered_learners:
          itemData?.total_online_registered_learners,
        total_fair_registered_learners: itemData?.total_fair_registered_learners,
        cv_submitted_jobs: itemData?.cv_submitted_jobs,
        on_spot_jobs: itemData?.on_spot_jobs,
        total_jobs_provided: itemData?.total_jobs_provided,
      });

      changeDivisionAction(itemData?.loc_division_id);
      handleDistrictChange(itemData?.loc_district_id);
      setValuesParticipatedInstitutions({
        total_sum: itemData?.total_participating_institutions,
        governmental_institutions: itemData?.governmental_institutions,
        entrepreneurship_institutions: itemData?.entrepreneurship_institutions,
        e_learning_institutions: itemData?.e_learning_institutions,
        e_commerce_institutions: itemData?.e_commerce_institutions,
        job_providing_institutions: itemData?.job_providing_institutions,
      });
      setValuesJobDemand({
        total_sum: itemData?.total_jobs_demand,
        online_jobs_demand: itemData?.online_jobs_demand,
        on_spot_jobs_demand: itemData?.on_spot_jobs_demand,
      });
      setValuesYouthRegistration({
        total_sum: itemData?.total_fair_registered_learners,
        online_registered_males: itemData?.online_registered_males,
        online_registered_females: itemData?.online_registered_females,
        offline_registered_males: itemData?.offline_registered_males,
        offline_registered_females: itemData?.offline_registered_females,
      });
      setValuesEmploymentInfo({
        total_sum: itemData?.total_jobs_provided,
        cv_submitted_jobs: itemData?.cv_submitted_jobs,
        on_spot_jobs: itemData?.on_spot_jobs,
      });

      setValuesInstituteWiseJobs({
        total_sum: instituteWiseOnSpotData.reduce(
          (sum: number, value: number) => sum + Number(value),
          0,
        ),
        on_spot_job: instituteWiseOnSpotData,
      });
      setArrayFields(fArrays);
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  const onSubmit: SubmitHandler<any> = async (formData: any) => {
    const data = _.cloneDeep(formData);

    data.total_participating_institutions =
      valuesParticipatedInstitutions.total_sum;
    data.total_jobs_demand = valuesJobDemand.total_sum;
    data.total_online_registered_learners =
      Number(data?.online_registered_males) +
      Number(data?.online_registered_females);
    data.total_online_registered_learners =
      data.total_online_registered_learners > 0
        ? data.total_online_registered_learners
        : 0;
    data.total_offline_registered_learners =
      Number(data?.offline_registered_males) +
      Number(data?.offline_registered_females);
    data.total_offline_registered_learners =
      data.total_offline_registered_learners > 0
        ? data.total_offline_registered_learners
        : 0;
    data.total_fair_registered_learners = valuesYouthRegistration.total_sum;

    if (data?.job_provider_info && data?.job_provider_info.length > 0) {
      data?.job_provider_info.map((item: any) => {
        item.institution_wise_jobs_demand_learners =
          (!isNaN(item.institution_wise_jobs_demand_males)
            ? Number(item.institution_wise_jobs_demand_males)
            : 0) +
          (!isNaN(item.institution_wise_jobs_demand_females)
            ? Number(item.institution_wise_jobs_demand_females)
            : 0);

        item.institution_wise_cv_submitted_learners =
          (!isNaN(item.institution_wise_cv_submitted_male)
            ? Number(item.institution_wise_cv_submitted_male)
            : 0) +
          (!isNaN(item.institution_wise_cv_submitted_female)
            ? Number(item.institution_wise_cv_submitted_female)
            : 0);

        item.institution_wise_total_job =
          item.institution_wise_jobs_demand_learners +
          item.institution_wise_cv_submitted_learners;
      });
    }

    data.total_jobs_provided = valuesEmploymentInfo.total_sum;

    try {
      if (fairId) {
        await updateSmartJobFair(fairId, data);
        updateSuccessMessage('common.smart_job_fair_info');
        mutateFair();
      } else {
        await createSmartJobFair(data);
        createSuccessMessage('common.smart_job_fair_info');
      }
      router.back();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  const addNewField = useCallback(() => {
    setArrayFields((prev: any) => [...prev, prev.length + 1]);
  }, []);

  const removeField = useCallback(() => {
    try {
      let jobProviderInfos = getValues('job_provider_info');

      let array = [...arrayFields];
      if (arrayFields.length > 1) {
        let len = arrayFields.length - 1;
        jobProviderInfos.splice(len, 1);
        setValue('job_provider_info', jobProviderInfos);
        array.splice(len, 1);
        setArrayFields(array);

        //state value update
        const newObj: any = {
          ...valuesInstituteWiseJobs,
        };
        newObj.on_spot_job.splice(len, 1);
        delete newObj.total_sum;
        newObj.total_sum = newObj.on_spot_job.reduce(
          (sum: number, value: number) => sum + Number(value),
          0,
        );
        setValuesInstituteWiseJobs(newObj);
      }
    } catch (error) {
      console.log('error', error);
    }
  }, [valuesInstituteWiseJobs, arrayFields]);

  const setParticipatedInstitutesOnChange = (value: any, key: string) => {
    const val = !isNaN(value) ? Number(value) : 0;
    setValuesParticipatedInstitutions((prevValues) => {
      const newObj: any = {
        ...prevValues,
        [`${key}`]: val,
      };
      delete newObj.total_sum;
      newObj.total_sum = Object.values(newObj).reduce(
        (sum: number, value) => sum + Number(value),
        0,
      );
      return newObj;
    });
  };

  const setJobDemandOnChange = (value: any, key: string) => {
    const val = !isNaN(value) ? Number(value) : 0;
    setValuesJobDemand((prevValues) => {
      const newObj: any = {
        ...prevValues,
        [`${key}`]: val,
      };
      delete newObj.total_sum;
      newObj.total_sum = Object.values(newObj).reduce(
        (sum: number, value) => sum + Number(value),
        0,
      );
      return newObj;
    });
  };

  const setYouthRegistrationTotalOnChange = (value: any, key: string) => {
    const val = !isNaN(value) ? Number(value) : 0;
    setValuesYouthRegistration((prevValues) => {
      const newObj: any = {
        ...prevValues,
        [`${key}`]: val,
      };
      delete newObj.total_sum;
      newObj.total_sum = Object.values(newObj).reduce(
        (sum: number, value) => sum + Number(value),
        0,
      );
      return newObj;
    });
  };

  const setEmploymentInfoOnChange = (value: any, key: string) => {
    const val = !isNaN(value) ? Number(value) : 0;
    setValuesEmploymentInfo((prevValues) => {
      const newObj: any = {
        ...prevValues,
        [`${key}`]: val,
      };
      delete newObj.total_sum;
      newObj.total_sum = Object.values(newObj).reduce(
        (sum: number, value) => sum + Number(value),
        0,
      );
      return newObj;
    });
  };

  const setInstituteWiseJobsOnChange = (value: any, index: number) => {
    const val = !isNaN(value) ? Number(value) : 0;
    const values: number[] = [];
    arrayFields.map((it: any, indx: number) => {
      values[indx] = valuesInstituteWiseJobs.on_spot_job[indx] ?? 0;
      if (indx == index) {
        values[indx] = val;
      }
    });

    const newObj: any = {
      ...valuesInstituteWiseJobs,
      on_spot_job: values,
    };
    delete newObj.total_sum;
    newObj.total_sum = newObj.on_spot_job.reduce(
      (sum: number, value: number) => sum + Number(value),
      0,
    );
    setValuesInstituteWiseJobs(newObj);
  };

  return (
    <StyledBox>
      <Paper className={classes.PaperBox}>
        <Typography
          tabIndex={0}
          pt={2}
          variant={'h6'}
          className={classes.JobFair}>
          {messages['common.smart_job_fair']}
        </Typography>
        <form>
          <Grid p={3} container spacing={2}>
            <Grid item xs={6}>
              <CustomFilterableFormSelect
                required
                id='loc_division_id'
                label={messages['menu.division']}
                isLoading={isLoadingDivisions}
                control={control}
                options={divisions}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
                onChange={(value: any) => {
                  changeDivisionAction(value);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomFilterableFormSelect
                required
                id='loc_district_id'
                label={messages['menu.district']}
                isLoading={isLoadingDivisions}
                control={control}
                options={districtsList}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
                onChange={handleDistrictChange}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomFilterableFormSelect
                required
                id='loc_constituency_id'
                label={messages['common.parliament_area']}
                isLoading={isParliamentAreaLoading}
                control={control}
                options={parliamentAreas}
                errorInstance={errors}
                optionValueProp={'id'}
                optionTitleProp={['constituency_name']}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CustomDatePicker
                required
                id='fair_date'
                label={messages['common.date']}
                control={control}
                errorInstance={errors}
              />
            </Grid>
          </Grid>
          <Box className={classes.FormBox}>
            <Grid container alignItems='center' spacing={2}>
              <Grid item>
                <Typography className={classes.BlueBoxTypo}>
                  {messages['common.total_participated_institutions']} :
                </Typography>
              </Grid>
              <Grid item>
                <Box component='span' p={1} className={classes.BlueBoxNum}>
                  {formatNumber(valuesParticipatedInstitutions.total_sum)}
                </Box>
              </Grid>
            </Grid>
          </Box>
          {/*  next  */}
          <Grid p={4} container spacing={2}>
            <Grid item xs={6}>
              <CustomTextInput
                id='governmental_institutions'
                type={'number'}
                label={messages['common.govt_institutions']}
                control={control}
                errorInstance={errors}
                onInput={(value: any) =>
                  setParticipatedInstitutesOnChange(
                    value,
                    'governmental_institutions',
                  )
                }
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id='entrepreneurship_institutions'
                type={'number'}
                label={messages['common.entrepreneur_institutions']}
                control={control}
                errorInstance={errors}
                onInput={(value: any) =>
                  setParticipatedInstitutesOnChange(
                    value,
                    'entrepreneurship_institutions',
                  )
                }
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id='e_learning_institutions'
                type={'number'}
                label={messages['common.e_learning_institutions']}
                control={control}
                errorInstance={errors}
                onInput={(value: any) =>
                  setParticipatedInstitutesOnChange(
                    value,
                    'e_learning_institutions',
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                id='e_commerce_institutions'
                type={'number'}
                label={messages['common.e_commerce_institutions']}
                control={control}
                errorInstance={errors}
                onInput={(value: any) =>
                  setParticipatedInstitutesOnChange(
                    value,
                    'e_commerce_institutions',
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                id='job_providing_institutions'
                type={'number'}
                label={messages['common.job_providing_institutions']}
                control={control}
                errorInstance={errors}
                onInput={(value: any) =>
                  setParticipatedInstitutesOnChange(
                    value,
                    'job_providing_institutions',
                  )
                }
              />
            </Grid>
          </Grid>
          <Box className={classes.FormBox}>
            <Grid container alignItems='center' spacing={2}>
              <Grid item>
                <Typography className={classes.BlueBoxTypo}>
                  {messages['common.job_demand']} :
                </Typography>
              </Grid>
              <Grid item>
                <Box component='span' p={1} className={classes.BlueBoxNum}>
                  {formatNumber(valuesJobDemand.total_sum)}
                </Box>
              </Grid>
            </Grid>
          </Box>
          {/*  next  */}
          <Grid p={3} container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                id='on_spot_jobs_demand'
                label={messages['common.on_spot_demand']}
                type={'number'}
                control={control}
                errorInstance={errors}
                onInput={(value: any) =>
                  setJobDemandOnChange(value, 'on_spot_jobs_demand')
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                id='online_jobs_demand'
                label={messages['common.online_job_platform']}
                type={'number'}
                control={control}
                errorInstance={errors}
                onInput={(value: any) =>
                  setJobDemandOnChange(value, 'online_jobs_demand')
                }
              />
            </Grid>
          </Grid>
          <Box className={classes.FormBox}>
            <Grid container alignItems='center' spacing={2}>
              <Grid item>
                <Typography className={classes.BlueBoxTypo}>
                  {messages['common.learner_registration_for_fair']} :
                </Typography>
              </Grid>
              <Grid item>
                <Box component='span' p={1} className={classes.BlueBoxNum}>
                  {formatNumber(valuesYouthRegistration.total_sum)}
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/*  next */}

          <Grid p={3} container spacing={2}>
            <Grid item xs={12} sm={6} md={6} sx={{}}>
              <Typography className={classes.MenuTypography}>
                {messages['common.registered_online']}
              </Typography>
              <CustomChipTextInput
                fields={[
                  {
                    id: 'online_registered_males',
                  },
                ]}
                sx={{marginRight: '10px'}}
                chipLabel={messages['common.male']}
                type={'number'}
                register={register}
                errorInstance={errors}
                isLoading={false}
                onInput={(value: any, id: string) =>
                  setYouthRegistrationTotalOnChange(value, id)
                }
              />
              <CustomChipTextInput
                fields={[
                  {
                    id: 'online_registered_females',
                  },
                ]}
                chipLabel={messages['common.female']}
                type={'number'}
                register={register}
                errorInstance={errors}
                isLoading={false}
                onInput={(value: any, id: string) =>
                  setYouthRegistrationTotalOnChange(value, id)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} sx={{}}>
              <Typography className={classes.MenuTypography}>
                {messages['common.registered_offline']}
              </Typography>
              <CustomChipTextInput
                fields={[
                  {
                    id: 'offline_registered_males',
                  },
                ]}
                sx={{marginRight: '10px'}}
                chipLabel={messages['common.male']}
                type={'number'}
                register={register}
                errorInstance={errors}
                isLoading={false}
                onInput={(value: any, id: string) =>
                  setYouthRegistrationTotalOnChange(value, id)
                }
              />
              <CustomChipTextInput
                fields={[
                  {
                    id: 'offline_registered_females',
                  },
                ]}
                chipLabel={messages['common.female']}
                type={'number'}
                register={register}
                errorInstance={errors}
                isLoading={false}
                onInput={(value: any, id: string) =>
                  setYouthRegistrationTotalOnChange(value, id)
                }
              />
            </Grid>
          </Grid>

          <Box className={classes.FormBox}>
            <Grid container alignItems='center' spacing={2}>
              <Grid item>
                <Typography className={classes.BlueBoxTypo}>
                  {messages['common.job_providing_info']} :
                </Typography>
              </Grid>
              <Grid item>
                <Box component='span' p={1} className={classes.BlueBoxNum}>
                  {formatNumber(valuesEmploymentInfo.total_sum)}
                </Box>
              </Grid>
            </Grid>
          </Box>
          {/*next*/}
          <Grid p={3} container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                id='cv_submitted_jobs'
                label={messages['common.cv_submit']}
                type={'number'}
                control={control}
                errorInstance={errors}
                onInput={(value: any) =>
                  setEmploymentInfoOnChange(value, 'cv_submitted_jobs')
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                id='on_spot_jobs'
                label={messages['common.on_spot_job_providing_info']}
                type={'number'}
                control={control}
                errorInstance={errors}
                onInput={(value: any) =>
                  setEmploymentInfoOnChange(value, 'on_spot_jobs')
                }
              />
            </Grid>
          </Grid>
          <Box className={classes.FormBox}>
            <Grid container alignItems='center' spacing={2}>
              <Grid item>
                <Typography className={classes.BlueBoxTypo}>
                  {messages['common.org_job_image']} :
                </Typography>
              </Grid>
              <Grid item>
                <Box component='span' p={1} className={classes.BlueBoxNum}>
                  {formatNumber(valuesInstituteWiseJobs.total_sum)}
                </Box>
              </Grid>
            </Grid>
          </Box>
          {/*  Hereeee */}
          {arrayFields.map((field: any, index: any) => (
            <React.Fragment key={index}>
              <Grid p={3} container spacing={2}>
                <Grid item xs={12} sm={6} md={6}>
                  <CustomTextInput
                    required
                    id={`job_provider_info.${index}.job_providing_institution_name`}
                    label={messages['common.institution_name']}
                    control={control}
                    errorInstance={errors}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}></Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Typography className={classes.MenuTypography}>
                    {messages['common.institution_job_demand']}
                  </Typography>
                  <CustomChipTextInput
                    fields={[
                      {
                        id: `job_provider_info.${index}.institution_wise_jobs_demand_males`,
                      },
                    ]}
                    sx={{marginRight: '10px'}}
                    chipLabel={messages['common.male']}
                    type={'number'}
                    register={register}
                    errorInstance={errors}
                    isLoading={false}
                  />
                  <CustomChipTextInput
                    fields={[
                      {
                        id: `job_provider_info.${index}.institution_wise_jobs_demand_females`,
                      },
                    ]}
                    chipLabel={messages['common.female']}
                    type={'number'}
                    register={register}
                    errorInstance={errors}
                    isLoading={false}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} sx={{}}>
                  <Typography className={classes.MenuTypography}>
                    {messages['common.cv_submit']}
                  </Typography>
                  <CustomChipTextInput
                    fields={[
                      {
                        id: `job_provider_info.${index}.institution_wise_cv_submitted_male`,
                      },
                    ]}
                    sx={{marginRight: '10px'}}
                    chipLabel={messages['common.male']}
                    type={'number'}
                    register={register}
                    errorInstance={errors}
                    isLoading={false}
                  />
                  <CustomChipTextInput
                    fields={[
                      {
                        id: `job_provider_info.${index}.institution_wise_cv_submitted_female`,
                      },
                    ]}
                    chipLabel={messages['common.female']}
                    type={'number'}
                    register={register}
                    errorInstance={errors}
                    isLoading={false}
                  />
                </Grid>
                <Grid mt={1} item xs={12} sm={6} md={6}>
                  <CustomTextInput
                    id={`job_provider_info.${index}.institution_wise_on_spot_job_provider`}
                    type={'number'}
                    label={messages['common.on_spot_job_providing_info']}
                    control={control}
                    errorInstance={errors}
                    onInput={(value: any) =>
                      setInstituteWiseJobsOnChange(value, index)
                    }
                  />
                </Grid>
                <Grid mt={1} item xs={12} sm={6} md={6}>
                  <CustomTextInput
                    id={`job_provider_info.${index}.institution_wise_on_spot_job_post`}
                    label={messages['common.post_name']}
                    control={control}
                    errorInstance={errors}
                  />
                </Grid>
              </Grid>
            </React.Fragment>
          ))}
          <Box sx={{marginLeft: '24px', marginBottom: '20px'}}>
            <ButtonGroup
              color='primary'
              aria-label='outlined primary button group'>
              <Button
                onClick={addNewField}
                variant={'contained'}
                sx={{
                  borderRight: '2px solid #fff !important',
                }}>
                <AddCircleOutline />
              </Button>
              <Button
                variant={'contained'}
                onClick={removeField}
                disabled={arrayFields.length < 2}>
                <RemoveCircleOutline />
              </Button>
            </ButtonGroup>
          </Box>

          <Grid container item ml={'24px'} mb={4} xs={12}>
            <Grid item alignItems={'center'}>
              <Button
                type={'submit'}
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                variant='contained'>
                {messages['common.submit']}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </StyledBox>
  );
};

export default SmartJobFairAddEditPage;
