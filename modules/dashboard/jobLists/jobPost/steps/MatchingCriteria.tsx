import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Box,
  Button,
  Grid,
  LinearProgress,
  linearProgressClasses,
  Typography,
} from '@mui/material';
import {useIntl} from 'react-intl';
import useNotiStack from '../../../../../@core/hooks/useNotifyStack';
import yup from '../../../../../@core/libs/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {processServerSideErrors} from '../../../../../@core/utilities/validationErrorHandler';
import {styled} from '@mui/material/styles';
import {S2} from '../../../../../@core/elements/common';
import MatchingCriteriaFormItem from './components/MatchingCriteriaFormItem';
import {Gender} from '../enums/JobPostEnums';
import {useFetchJobMatchingCriteria} from '../../../../../services/IndustryManagement/hooks';
import {saveMatchingCriteria} from '../../../../../services/IndustryManagement/JobService';
import IntlMessages from '../../../../../@core/utility/IntlMessages';
import usePageLoadToTop from './usePageLoadToTop';

interface Props {
  jobId: string;
  onBack: () => void;
  onContinue: () => void;
  gotoStep: (step: number) => void;
  setLatestStep: (step: number) => void;
}

const BorderLinearProgress = styled(LinearProgress)(({theme}) => ({
  height: 10,
  borderRadius: 5,
  width: '100%',
  marginRight: '10px',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

const initialValue = {
  is_age_enabled: false,
  is_gender_enabled: false,
  is_total_year_of_experience_enabled: false,
  /*is_area_of_experience_enabled: false,
  is_area_of_business_enabled: false,
  is_job_level_enabled: false,
  is_job_location_enabled: false,
  is_salary_enabled: false,
  is_skills_enabled: false,*/
};

const MatchingCriteria = ({
  jobId,
  onBack,
  onContinue,
  gotoStep,
  setLatestStep,
}: Props) => {
  const {messages, formatNumber} = useIntl();
  const {errorStack, successStack} = useNotiStack();

  const [criteriaValue, setCriteriaValue] = useState<any>({
    ageValue: null,
    jobLocation: null,
    totalExperience: null,
    salary: null,
    gender: null,
    businessAreaValue: null,
    experienceAreaValue: null,
    jobLevelValue: null,
    skillValue: null,
  });
  const [progress, setProgress] = useState<number>(0);
  const totalField = useRef<number>(3);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const {data: matchingCriteria, isLoading} =
    useFetchJobMatchingCriteria(jobId);
  const [isReady, setIsReady] = useState<boolean>(false);

  const id = 'top';
  usePageLoadToTop({id, dependency: isReady});

  const validationSchema = useMemo(() => {
    return yup.object().shape({});
  }, [messages]);

  const {
    register,
    setError,
    reset,
    handleSubmit,
    formState: {isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (matchingCriteria && matchingCriteria?.latest_step) {
      const latestStep = matchingCriteria.latest_step;
      delete matchingCriteria.latest_step;

      if (latestStep >= 4) {
        setIsReady(true);
        const data: any = {
          is_age_enabled: matchingCriteria?.is_age_enabled,
          is_gender_enabled: matchingCriteria?.is_gender_enabled,
          is_total_year_of_experience_enabled:
            matchingCriteria?.is_total_year_of_experience_enabled,
          /*is_area_of_business_enabled:
            matchingCriteria?.is_area_of_business_enabled,
          is_area_of_experience_enabled:
            matchingCriteria?.is_area_of_experience_enabled,
          is_job_level_enabled: matchingCriteria?.is_job_level_enabled,
          is_job_location_enabled: matchingCriteria?.is_job_location_enabled,
          is_salary_enabled: matchingCriteria?.is_salary_enabled,
          is_skills_enabled: matchingCriteria?.is_skills_enabled,*/
        };

        reset(data);

        let count = 0;
        Object.keys(data).map((key: string) => {
          if (data[key] == 1) {
            count++;
          }
        });
        setSelectedCount(count);
      }
      setLatestStep(latestStep);
    } else {
      reset(initialValue);
    }
  }, [matchingCriteria]);

  useEffect(() => {
    if (matchingCriteria) {
      let criteria = {
        ageValue: getAge(),
        gender: getGender(),
        totalExperience: getExperienceText(),
        /*jobLocation: getLocation(),
        salary: getSalary(),
        businessAreaValue: getBusinessArea(),
        experienceAreaValue: getExperienceArea(),
        jobLevelValue: getJobLevel(),
        skillValue: getSkills(),*/
      };
      setCriteriaValue(criteria);
    }
  }, [matchingCriteria, messages]);

  useEffect(() => {
    setProgress(Math.floor((selectedCount * 100) / totalField.current));
  }, [selectedCount]);

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      Object.keys(data).map((key: string) => {
        data[key] = data[key] ? 1 : 0;
      });

      data.job_id = jobId;

      // console.log('data', data);
      await saveMatchingCriteria(data);

      successStack(messages['common.data_saved']);
      onContinue();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  const getAge = () => {
    let ageText: any = '';

    if (
      matchingCriteria?.candidate_requirement?.age_minimum &&
      matchingCriteria?.candidate_requirement?.age_maximum
    ) {
      ageText = (
        <IntlMessages
          id={'job_preview.age_from_to'}
          values={{
            from: formatNumber(
              matchingCriteria?.candidate_requirement?.age_minimum,
            ),
            to: formatNumber(
              matchingCriteria?.candidate_requirement?.age_maximum,
            ),
          }}
        />
      );
    } else if (matchingCriteria?.candidate_requirement?.age_minimum) {
      ageText = (
        <IntlMessages
          id={'job_preview.age_at_least'}
          values={{
            from: formatNumber(
              matchingCriteria?.candidate_requirement?.age_minimum,
            ),
          }}
        />
      );
    } else if (matchingCriteria?.candidate_requirement?.age_maximum) {
      ageText = (
        <IntlMessages
          id={'job_preview.age_at_most'}
          values={{
            from: formatNumber(
              matchingCriteria?.candidate_requirement?.age_maximum,
            ),
          }}
        />
      );
    }

    return ageText;
  };

  /* const getSalaryType = (type: number) => {
     switch (Number(type)) {
       case SalaryTypes.DAILY:
         return messages['job.salary_type_daily'];
       case SalaryTypes.WEEKLY:
         return messages['job.salary_type_weekly'];
       case SalaryTypes.MONTHLY:
         return messages['job.salary_type_monthly'];
       case SalaryTypes.ANNUAL:
         return messages['job.salary_type_annual'];
       default:
         return messages['job.salary_type_monthly'];
     }
   };

   const getSalary = () => {
     let salaryText: any = '';

     if (
       matchingCriteria?.additional_job_information?.salary_min != null &&
       matchingCriteria?.additional_job_information?.salary_max != null
     ) {
       salaryText =
         '৳ ' +
         formatNumber(matchingCriteria?.additional_job_information?.salary_min) +
         ' - ' +
         formatNumber(matchingCriteria?.additional_job_information?.salary_max) +
         ` (${getSalaryType(
           matchingCriteria?.additional_job_information?.salary_type,
         )})`;
     } else {
       salaryText = messages['common.negotiable'];
     }

     return salaryText;
   };*/

  const getGender = () => {
    let genderTextArr: Array<any> = [];
    (matchingCriteria?.genders || []).map((gender: any) => {
      switch (gender.gender_id) {
        case Gender.MALE:
          genderTextArr.push(messages['common.male']);
          break;
        case Gender.FEMALE:
          genderTextArr.push(messages['common.female']);
          break;
        case Gender.OTHERS:
          genderTextArr.push(messages['common.others']);
          break;
      }
    });

    return genderTextArr.join(', ');
  };

  /*  const getLocation = () => {
      let locationTextArr: Array<any> = [];
      if (matchingCriteria?.additional_job_information?.job_place_type == 1) {
        locationTextArr.push(messages['job.location_anywhere_in_bd']);
      }

      (matchingCriteria?.job_locations || []).map((location: any) => {
        locationTextArr.push(location.title);
      });

      if (
        locationTextArr.length == 0 &&
        matchingCriteria?.additional_job_information?.job_place_type == 1
      ) {
        locationTextArr.push(messages['job.location_anywhere_in_bd']);
      }

      return locationTextArr.join(', ');
    };*/

  const getExperienceText = () => {
    let experienceText: any = '';
    if (
      matchingCriteria?.candidate_requirement?.minimum_year_of_experience &&
      matchingCriteria?.candidate_requirement?.maximum_year_of_experience
    ) {
      experienceText = (
        <IntlMessages
          id={'job_preview.experience_from_to'}
          values={{
            from: formatNumber(
              matchingCriteria?.candidate_requirement
                ?.minimum_year_of_experience,
            ),
            to: formatNumber(
              matchingCriteria?.candidate_requirement
                ?.maximum_year_of_experience,
            ),
          }}
        />
      );
    } else if (
      matchingCriteria?.candidate_requirement?.minimum_year_of_experience
    ) {
      experienceText = (
        <IntlMessages
          id={'job_preview.experience_at_least'}
          values={{
            from: formatNumber(
              matchingCriteria?.candidate_requirement
                ?.minimum_year_of_experience,
            ),
          }}
        />
      );
    } else if (
      matchingCriteria?.candidate_requirement?.maximum_year_of_experience
    ) {
      experienceText = (
        <IntlMessages
          id={'job_preview.experience_at_most'}
          values={{
            from: formatNumber(
              matchingCriteria?.candidate_requirement
                ?.maximum_year_of_experience,
            ),
          }}
        />
      );
    } else {
      return messages['common.n_a'];
    }
    return experienceText;
  };

  /*const getBusinessArea = () => {
    let businessAreaTextArr: Array<any> = [];
    (matchingCriteria?.area_of_business || []).map((area: any) => {
      businessAreaTextArr.push(area?.title);
    });

    return businessAreaTextArr.join(', ');
  };

  const getExperienceArea = () => {
    let experienceAreaTextArr: Array<any> = [];
    (matchingCriteria?.area_of_experiences || []).map((area: any) => {
      experienceAreaTextArr.push(area?.title);
    });

    return experienceAreaTextArr.join(', ');
  };

  const getJobLevel = () => {
    let jobLevelTextArr: Array<any> = [];
    (matchingCriteria?.job_levels || []).map((level: any) => {
      switch (level.job_level_id) {
        case JobLevel.ENTRY:
          jobLevelTextArr.push(messages['label.job_level_entry']);
          break;
        case JobLevel.MID:
          jobLevelTextArr.push(messages['label.job_level_mid']);
          break;
        case JobLevel.TOP:
          jobLevelTextArr.push(messages['label.job_level_top']);
          break;
      }
    });

    return jobLevelTextArr.join(', ');
  };
  const getSkills = () => {
    let skillsTextArr: Array<any> = [];
    (matchingCriteria?.skills || []).map((skill: any) => {
      skillsTextArr.push(skill.title);
    });

    return skillsTextArr.join(', ');
  };*/

  return (
    <Box mt={2} id={id}>
      <Typography
        mb={3}
        variant={'h5'}
        fontWeight={'bold'}
        textAlign={'center'}>
        {messages['job_posting.matching_criteria']}
      </Typography>

      <Box
        sx={{
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #d1d1d1',
        }}>
        <S2 fontWeight={'bold'}>{messages['job_posting.matching_criteria']}</S2>
        <Typography
          color={'grey.600'}
          sx={{
            fontSize: '14px !important',
          }}>
          {messages['job_posting.matching_criteria_suggestion']}
        </Typography>
        <Box display={'flex'} alignItems={'center'}>
          <BorderLinearProgress variant='determinate' value={progress} />
          <Typography fontWeight={'bold'} color={'primary.main'}>
            {progress}%
          </Typography>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography fontWeight={'bold'} color={'grey.600'}>
            Low
          </Typography>
          <Typography fontWeight={'bold'} color={'grey.600'}>
            High
          </Typography>
        </Box>
      </Box>

      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete='off'
        style={{marginTop: '20px'}}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <MatchingCriteriaFormItem
              id={'is_age_enabled'}
              label={messages['job_preview_summary.age'] as string}
              tooltipText={
                'Select "Age" as matching criteria for more authentic/accurate matching.'
              }
              register={register}
              additionalValue={criteriaValue.ageValue}
              isLoading={isLoading}
              isDisabled={
                !(
                  matchingCriteria?.candidate_requirement?.age_minimum ||
                  matchingCriteria?.candidate_requirement?.age_maximum
                )
              }
              defaultChecked={matchingCriteria?.is_age_enabled == 1}
              gotoStep={() => gotoStep(3)}
              onChange={(value: boolean) => {
                setSelectedCount((prev) => {
                  return value ? prev + 1 : prev - 1;
                });
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MatchingCriteriaFormItem
              id={'is_gender_enabled'}
              label={messages['industry.gender'] as string}
              tooltipText={
                'Select "Gender" for more authentic/accurate matching.'
              }
              register={register}
              additionalValue={criteriaValue.gender}
              isLoading={isLoading}
              defaultChecked={matchingCriteria?.is_gender_enabled == 1}
              gotoStep={() => gotoStep(3)}
              isDisabled={matchingCriteria?.genders?.length === 0}
              onChange={(value: boolean) => {
                setSelectedCount((prev) => {
                  return value ? prev + 1 : prev - 1;
                });
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MatchingCriteriaFormItem
              id={'is_total_year_of_experience_enabled'}
              label={messages['common.year_of_experience'] as string}
              tooltipText={
                'If you select "Total year of experience", it will match with applicant'
              }
              register={register}
              additionalValue={criteriaValue.totalExperience}
              isLoading={isLoading}
              defaultChecked={
                matchingCriteria?.is_total_year_of_experience_enabled == 1
              }
              gotoStep={() => gotoStep(3)}
              isDisabled={
                !(
                  matchingCriteria?.candidate_requirement
                    ?.minimum_year_of_experience ||
                  matchingCriteria?.candidate_requirement
                    ?.maximum_year_of_experience
                )
              }
              onChange={(value: boolean) => {
                setSelectedCount((prev) => {
                  return value ? prev + 1 : prev - 1;
                });
              }}
            />
          </Grid>
          {/*<Grid item xs={12} md={6}>
            <MatchingCriteriaFormItem
              id={'is_skills_enabled'}
              label={messages['common.skills'] as string}
              tooltipText={
                'Select "Skills" for more authentic/accurate matching.'
              }
              register={register}
              additionalValue={criteriaValue.skillValue}
              linkAdd={LINK_JOB_CREATE_OR_UPDATE + 'step3?jobId=' + jobId}
              linkEdit={LINK_JOB_CREATE_OR_UPDATE + 'step3?jobId=' + jobId}
              isLoading={false}
              defaultChecked={Boolean(matchingCriteria?.is_skills_enabled)}
              isDisabled={matchingCriteria?.skills?.length === 0}
              onChange={(value: boolean) => {
                setSelectedCount((prev) => {
                  return value ? prev + 1 : prev - 1;
                });
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MatchingCriteriaFormItem
              id={'is_job_location_enabled'}
              label={messages['common.job_location'] as string}
              tooltipText={
                'Select "Job Location(Current/ Permanent)" for more authentic/accurate matching.'
              }
              register={register}
              additionalValue={criteriaValue.jobLocation}
              linkAdd={LINK_JOB_CREATE_OR_UPDATE + 'step2?jobId=' + jobId}
              linkEdit={LINK_JOB_CREATE_OR_UPDATE + 'step2?jobId=' + jobId}
              isLoading={false}
              defaultChecked={Boolean(
                matchingCriteria?.is_job_location_enabled,
              )}
              isDisabled={!matchingCriteria?.job_locations}
              onChange={(value: boolean) => {
                setSelectedCount((prev) => {
                  return value ? prev + 1 : prev - 1;
                });
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MatchingCriteriaFormItem
              id={'is_salary_enabled'}
              label={messages['industry.salary'] as string}
              tooltipText={
                'Select "Salary" as matching criteria for more authentic/accurate matching.'
              }
              register={register}
              additionalValue={criteriaValue.salary}
              linkAdd={LINK_JOB_CREATE_OR_UPDATE + 'step2?jobId=' + jobId}
              linkEdit={LINK_JOB_CREATE_OR_UPDATE + 'step2?jobId=' + jobId}
              isLoading={false}
              defaultChecked={Boolean(matchingCriteria?.is_salary_enabled)}
              isDisabled={
                !(
                  matchingCriteria?.additional_job_information?.salary_min !=
                    null ||
                  matchingCriteria?.additional_job_information?.salary_max !=
                    null
                )
              }
              onChange={(value: boolean) => {
                setSelectedCount((prev) => {
                  return value ? prev + 1 : prev - 1;
                });
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <MatchingCriteriaFormItem
              id={'is_area_of_business_enabled'}
              label={messages['common.area_of_business'] as string}
              tooltipText={
                'Your selected business area will match with candidate`s current working "business area" or their preferable business area.'
              }
              register={register}
              additionalValue={criteriaValue.businessAreaValue}
              linkAdd={LINK_JOB_CREATE_OR_UPDATE + 'step3?jobId=' + jobId}
              linkEdit={LINK_JOB_CREATE_OR_UPDATE + 'step3?jobId=' + jobId}
              isLoading={false}
              defaultChecked={Boolean(
                matchingCriteria?.is_area_of_business_enabled,
              )}
              isDisabled={matchingCriteria?.area_of_business?.length === 0}
              onChange={(value: boolean) => {
                setSelectedCount((prev) => {
                  return value ? prev + 1 : prev - 1;
                });
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MatchingCriteriaFormItem
              id={'is_area_of_experience_enabled'}
              label={messages['common.area_of_experience'] as string}
              tooltipText={
                'Select "Work area" for more authentic/accurate matching.'
              }
              register={register}
              additionalValue={criteriaValue.experienceAreaValue}
              linkAdd={LINK_JOB_CREATE_OR_UPDATE + 'step3?jobId=' + jobId}
              linkEdit={LINK_JOB_CREATE_OR_UPDATE + 'step3?jobId=' + jobId}
              isLoading={false}
              defaultChecked={Boolean(
                matchingCriteria?.is_area_of_experience_enabled,
              )}
              isDisabled={matchingCriteria?.area_of_experiences?.length === 0}
              onChange={(value: boolean) => {
                setSelectedCount((prev) => {
                  return value ? prev + 1 : prev - 1;
                });
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <MatchingCriteriaFormItem
              id={'is_job_level_enabled'}
              label={messages['label.job_level'] as string}
              tooltipText={
                'Select "Job level" as matching criteria for more authentic/accurate matching.'
              }
              register={register}
              additionalValue={criteriaValue.jobLevelValue}
              linkAdd={LINK_JOB_CREATE_OR_UPDATE + 'step2?jobId=' + jobId}
              linkEdit={LINK_JOB_CREATE_OR_UPDATE + 'step2?jobId=' + jobId}
              isLoading={false}
              defaultChecked={Boolean(matchingCriteria?.is_job_level_enabled)}
              isDisabled={matchingCriteria?.job_levels?.length === 0}
              onChange={(value: boolean) => {
                setSelectedCount((prev) => {
                  return value ? prev + 1 : prev - 1;
                });
              }}
            />
          </Grid>*/}
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

export default MatchingCriteria;
