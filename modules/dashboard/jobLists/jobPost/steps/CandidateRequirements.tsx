import React, {useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import useNotiStack from '../../../../../@core/hooks/useNotifyStack';
import yup from '../../../../../@core/libs/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {processServerSideErrors} from '../../../../../@core/utilities/validationErrorHandler';
import {Box, Button, Grid, Typography} from '@mui/material';
import CustomEducationalQualificationFieldArray from './components/CustomFieldArrayJobRequirements';
import CustomTextInput from '../../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import FormRadioButtons from '../../../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import CustomFilterableFormSelect from '../../../../../@core/elements/input/CustomFilterableFormSelect';
import CustomCheckbox from '../../../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import CustomFormToggleButtonGroup from '../../../../../@core/elements/input/CustomFormToggleButtonGroup';
import {Gender} from '../enums/JobPostEnums';
import CustomAddFilterableFormSelect from './components/CustomAddFilterableFormSelect';
import Tooltip from '@mui/material/Tooltip';
import {Help} from '@mui/icons-material';
import CustomFormSwitch from '../../../../../@core/elements/input/CustomFormSwitch';
import {
  useFetchEducationalInstitutes,
  useFetchEducationLevels,
  useFetchExperienceAreas,
  useFetchJobCandidateRequirements,
} from '../../../../../services/IndustryManagement/hooks';
import {saveCandidateRequirements} from '../../../../../services/IndustryManagement/JobService';
import RowStatus from '../../../../../@core/utilities/RowStatus';
import CustomSelectAutoComplete from '../../../../learner/registration/CustomSelectAutoComplete';
import {useFetchLocalizedSkills} from '../../../../../services/learnerManagement/hooks';
import usePageLoadToTop from './usePageLoadToTop';
import {
  EducationLevel,
  EducationLevelId,
} from '../../../../learner/profile/utilities/EducationEnums';
import SkillAddPopup from '../../../skills/SkillAddPopup';
import {ISkill} from '../../../../../shared/Interface/organization.interface';
import _ from 'lodash';

interface Props {
  jobId: string;
  onBack: () => void;
  onContinue: () => void;
  setLatestStep: (step: number) => void;
}

const initialValue = {
  degrees: [{}],
  preferred_educational_institutions: [],
  trainings: [],
  professional_certifications: [],
  is_experience_needed: 0,
  minimum_year_of_experience: '',
  maximum_year_of_experience: '',
  is_freshers_encouraged: 1,
  area_of_experiences: [],
  skills: [],
  additional_requirements: '',
  additional_requirements_en: '',
  genders: [],
  age_minimum: '',
  age_maximum: '',
  person_with_disability: 0,
};

const CandidateRequirements = ({
  jobId,
  onBack,
  onContinue,
  setLatestStep,
}: Props) => {
  const {messages, formatNumber} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const [isFresherApplicable, setIsFresherApplicable] =
    useState<boolean>(false);
  const [hasExperienced, setHasExperienced] = useState<boolean>(false);
  const {data: candidateRequirements} = useFetchJobCandidateRequirements(jobId);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [defaultEduLevelIdTrack, setDefaultEduLevelIdTrack] = useState<any>({});
  const [selectedEduLevel, setSelectedEduLevel] = useState<any>(null);
  const [isSkillAdd, setIsSkillAdd] = useState<boolean>(false);
  const [skillData, setSkillData] = useState<any>(null);

  const id = 'top';
  usePageLoadToTop({id, dependency: isReady});
  const {
    data: educationalInstitutes,
    isLoading: isLoadingEducationalInstitutes,
  } = useFetchEducationalInstitutes();
  // const {data: businessAreas, isLoading: isLoadingBusinessAreas} =
  //   useFetchBusinessAreas();
  const {data: experienceAreas, isLoading: isLoadingExperienceAreas} =
    useFetchExperienceAreas();

  const [skillFilters] = useState<any>({row_status: RowStatus.ACTIVE});
  const {
    data: skills,
    isLoading: isLoadingSkills,
    mutate: mutateSkills,
  } = useFetchLocalizedSkills(skillFilters);

  const {data: educationLevels, isLoading: isLoadingEduLevel} =
    useFetchEducationLevels();

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      degrees: yup.array().of(
        yup.object().shape({
          education_level_id: yup
            .mixed()
            .label(messages['education.education_level'] as string),
          details: yup.mixed().label(messages['common.details'] as string),
        }),
      ),
      age_minimum: yup.string().nullable(),
      age_maximum: yup
        .string()
        .nullable()
        .when('age_minimum', (ageMin: any, schema: any) => {
          return schema.test({
            test: (ageMax: any) => {
              if (!ageMax) return true;
              if (!ageMin) return true;
              return Number(ageMax) > Number(ageMin);
            },
            message: messages['job_posting.salary_min_max_error'] as string,
          });
        }),
      is_experience_needed: yup.number().nullable(),
      minimum_year_of_experience: yup
        .string()
        .nullable()
        .when('is_experience_needed', {
          is: 1,
          then: yup.string().required(),
        }),
      maximum_year_of_experience: yup
        .string()
        .nullable()
        .when(
          'minimum_year_of_experience',
          (experienceMin: any, schema: any) => {
            return schema.test({
              test: (experienceMax: any) => {
                if (!experienceMin) return true;
                else if (!experienceMax) return true;
                return Number(experienceMax) > Number(experienceMin) ?? 0;
              },
              message: messages['yup_validation_experience'] as string,
            });
          },
        )
        .label(messages['yup_validation_experience'] as string),
    });
  }, [messages]);
  const {
    register,
    setError,
    control,
    handleSubmit,
    setValue,
    setFocus,
    getValues,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (candidateRequirements && candidateRequirements?.latest_step) {
      const latestStep = candidateRequirements.latest_step;
      delete candidateRequirements?.latest_step;

      if (latestStep >= 3) {
        setIsReady(true);

        let data: any = {
          degrees: getDegrees(candidateRequirements?.degrees),
          preferred_educational_institutions:
            candidateRequirements?.preferred_educational_institutions,
          trainings: getTrainings(candidateRequirements?.trainings),
          professional_certifications: getProfessionalCertification(
            candidateRequirements?.professional_certifications,
          ),
          is_experience_needed:
            candidateRequirements?.is_experience_needed ?? 0,
          minimum_year_of_experience:
            candidateRequirements?.minimum_year_of_experience,
          maximum_year_of_experience:
            candidateRequirements?.maximum_year_of_experience,
          is_freshers_encouraged: candidateRequirements?.is_freshers_encouraged,
          area_of_experiences:
            candidateRequirements?.candidate_requirement_area_of_experiences,
          skills: candidateRequirements?.candidate_requirement_skills,
          additional_requirements:
            candidateRequirements?.additional_requirements,
          additional_requirements_en:
            candidateRequirements?.additional_requirements_en,
          genders: getGenders(candidateRequirements?.genders),
          age_minimum: candidateRequirements?.age_minimum,
          age_maximum: candidateRequirements?.age_maximum,
          person_with_disability:
            candidateRequirements?.person_with_disability == 1,
        };

        setHasExperienced(candidateRequirements?.is_experience_needed == 1);
        setIsFresherApplicable(
          candidateRequirements?.is_freshers_encouraged == 1,
        );
        reset(data);
      }
      setLatestStep(latestStep);
    } else {
      reset(initialValue);
    }
  }, [candidateRequirements]);

  const getDegrees = (degrees: any) => {
    if (!degrees || degrees.length < 1) return [];

    let eduLevelIds: any = {};
    let levelId: any = null;
    const eduDegrees = (degrees || []).map((item: any, index: number) => {
      eduLevelIds['level' + index] = item.education_level_id;
      if (
        !levelId &&
        (item.education_level_id == EducationLevelId.HONOURS ||
          item.education_level_id == EducationLevelId.MASTERS)
      ) {
        levelId = item.education_level_id;
      }

      return {
        education_level_id: item.education_level_id,
        details: item?.details ?? '',
      };
    });

    setSelectedEduLevel(levelId);
    setDefaultEduLevelIdTrack(eduLevelIds);

    return eduDegrees.length > 0 ? eduDegrees : [{}];
  };

  const getTrainings = (trainings: any) => {
    return (trainings || []).map((item: any) => item.title);
  };

  const getProfessionalCertification = (certifications: any) => {
    return (certifications || []).map((item: any) => item.title);
  };

  const getGenders = (certifications: any) => {
    return (certifications || []).map((item: any) => item.gender_id);
  };

  const onChangeIsExperienced = (value: any) => {
    setHasExperienced((prev) => !prev);
  };

  const onSkillAddClose = (skill?: ISkill) => {
    setIsSkillAdd(false);
    let currentSkillsValue = getValues('skills');

    if (typeof skill?.id == 'number') {
      setValue('skills', [...currentSkillsValue, skill]);
      setFocus('additional_requirements');
      mutateSkills();
    }
  };

  const onSubmit: SubmitHandler<any> = async (formData: any) => {
    try {
      let data: any = _.cloneDeep(formData);

      data.job_id = jobId;

      data.is_freshers_encouraged = data.is_freshers_encouraged ? 1 : 0;
      data.person_with_disability = data.person_with_disability ? 1 : 0;

      if (selectedEduLevel && data.preferred_educational_institutions) {
        data.preferred_educational_institutions =
          data.preferred_educational_institutions.map(
            (edu_ins: any) => edu_ins.id,
          );
      } else {
        delete data.preferred_educational_institutions;
      }

      if (data.is_experience_needed != 1) {
        delete data.minimum_year_of_experience;
        delete data.maximum_year_of_experience;
        delete data.is_freshers_encouraged;
        delete data.area_of_experiences;
        delete data.skills;
        delete data.additional_requirements;
        delete data.additional_requirements_en;
      }

      if (data.area_of_experiences) {
        data.area_of_experiences = data.area_of_experiences.map(
          (experience: any) => experience.id,
        );
      }

      if (data.skills) {
        data.skills = data.skills.map((skill: any) => skill.id);
      }

      await saveCandidateRequirements(data);

      successStack(messages['common.data_saved']);
      onContinue();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  const onEducationLevelChange = (levelId: any) => {
    if (levelId) {
      let level = educationLevels.find(
        (eduLevel: any) =>
          eduLevel.id == levelId &&
          (eduLevel.code == EducationLevel.HONOURS ||
            eduLevel.code == EducationLevel.MASTERS),
      );
      setSelectedEduLevel(level ? levelId : null);
    } else {
      setSelectedEduLevel(null);
    }
  };

  const experienceYears = useMemo(() => {
    let years: Array<any> = [];
    for (let i = 1; i <= 50; i++) years.push({id: i, title: formatNumber(i)});
    return years;
  }, [messages]);

  const ages = useMemo(() => {
    let allAges: Array<any> = [];
    for (let i = 14; i <= 90; i++)
      allAges.push({id: i, title: formatNumber(i)});
    return allAges;
  }, [messages]);

  return (
    <Box mt={3} id={id}>
      <Typography
        mb={2}
        variant={'h5'}
        fontWeight={'bold'}
        textAlign={'center'}>
        {messages['job_posting.candidates_requirement']}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant={'h6'}>
              {messages['common.educational_qualification']}
            </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <CustomEducationalQualificationFieldArray
              id='degrees'
              isLoading={isLoadingEduLevel}
              control={control}
              errors={errors}
              educationLevelOptions={educationLevels || []}
              defaultEduLevelIdTrack={defaultEduLevelIdTrack}
              onEducationLevelChange={onEducationLevelChange}
            />
          </Grid>
          {selectedEduLevel && (
            <Grid item xs={12}>
              <CustomSelectAutoComplete
                id='preferred_educational_institutions'
                label={messages['common.preferred_educational_institute']}
                isLoading={isLoadingEducationalInstitutes}
                control={control}
                optionValueProp={'id'}
                errorInstance={errors}
                optionTitleProp={['name']}
                options={educationalInstitutes || []}
              />
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <CustomAddFilterableFormSelect
              id='trainings'
              label={messages['common.training_courses']}
              control={control}
              options={getTrainings(candidateRequirements?.trainings)}
              defaultValue={getTrainings(candidateRequirements?.trainings)}
              errorInstance={errors}
            />
            <Box
              sx={{fontStyle: 'italic', fontWeight: 'bold', marginTop: '6px'}}>
              {messages['common.save_and_enter']}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomAddFilterableFormSelect
              id='professional_certifications'
              label={messages['common.professional_certification']}
              control={control}
              options={getProfessionalCertification(
                candidateRequirements?.professional_certifications,
              )}
              defaultValue={getProfessionalCertification(
                candidateRequirements?.professional_certifications,
              )}
              errorInstance={errors}
            />
            <Box
              sx={{fontStyle: 'italic', fontWeight: 'bold', marginTop: '6px'}}>
              {messages['common.save_and_enter']}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={'h6'}>
              {messages['common.experience_business_area']}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormRadioButtons
              id='is_experience_needed'
              label={'common.experience_required'}
              radios={[
                {
                  key: 1,
                  label: messages['common.yes'],
                },
                {
                  key: 0,
                  label: messages['common.no'],
                },
              ]}
              control={control}
              defaultValue={0}
              isLoading={false}
              onChange={onChangeIsExperienced}
            />
          </Grid>
          {hasExperienced && (
            <>
              <Grid item xs={12} md={6}>
                <CustomFilterableFormSelect
                  required
                  id={'minimum_year_of_experience'}
                  label={messages['common.min_year_of_experience']}
                  isLoading={false}
                  control={control}
                  options={experienceYears}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomFilterableFormSelect
                  id={'maximum_year_of_experience'}
                  label={messages['common.max_years_of_experience']}
                  isLoading={false}
                  control={control}
                  options={experienceYears}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomCheckbox
                  id='is_freshers_encouraged'
                  label={messages['job_post.is_fresher_applicable']}
                  register={register}
                  errorInstance={errors}
                  checked={isFresherApplicable}
                  onChange={() => {
                    setIsFresherApplicable((prev) => !prev);
                  }}
                  isLoading={false}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomSelectAutoComplete
                  id={'area_of_experiences'}
                  label={messages['common.area_of_experience']}
                  isLoading={isLoadingExperienceAreas}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  options={experienceAreas || []}
                  control={control}
                  errorInstance={errors}
                />
              </Grid>

              <Grid item xs={12}>
                <CustomSelectAutoComplete
                  id={'skills'}
                  label={messages['common.skills']}
                  isLoading={isLoadingSkills}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  options={skills || []}
                  control={control}
                  errorInstance={errors}
                  isCreatable={true}
                  onCreateNew={(value) => {
                    setSkillData({
                      title: value,
                    });
                    setIsSkillAdd(true);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextInput
                  id={'additional_requirements'}
                  label={messages['job_posts.additional_requirements']}
                  isLoading={false}
                  control={control}
                  multiline={true}
                  rows={3}
                  errorInstance={errors}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextInput
                  id={'additional_requirements_en'}
                  label={messages['job_posts.additional_requirements_en']}
                  isLoading={false}
                  control={control}
                  multiline={true}
                  rows={3}
                  errorInstance={errors}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <Typography variant={'h6'}>
              {messages['personal_info.label']}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomFormToggleButtonGroup
              id={'genders'}
              label={messages['common.gender']}
              buttons={[
                {
                  value: Gender.MALE,
                  label: messages['common.male'],
                },
                {
                  value: Gender.FEMALE,
                  label: messages['common.female'],
                },
                {
                  value: Gender.OTHERS,
                  label: messages['common.others'],
                },
              ]}
              control={control}
              errorInstance={errors}
              multiSelect={true}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomFilterableFormSelect
              id={'age_minimum'}
              label={messages['common.minimum_age']}
              isLoading={false}
              control={control}
              options={ages}
              optionValueProp={'id'}
              optionTitleProp={['title']}
              errorInstance={errors}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomFilterableFormSelect
              id={'age_maximum'}
              label={messages['common.maximum_age']}
              isLoading={false}
              control={control}
              options={ages}
              optionValueProp={'id'}
              optionTitleProp={['title']}
              errorInstance={errors}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormSwitch
              id={'person_with_disability'}
              label={messages['common.person_with_disability']}
              additionalInfo={
                <Tooltip
                  arrow
                  title={
                    messages[
                      'job_posting.company_info_business_tooltip'
                    ] as string
                  }>
                  <Help
                    sx={{
                      marginLeft: '8px',
                    }}
                  />
                </Tooltip>
              }
              yesLabel={messages['common.show'] as string}
              noLabel={messages['common.hide'] as string}
              register={register}
              defaultChecked={
                candidateRequirements?.person_with_disability == 1
              }
              isLoading={false}
            />
          </Grid>
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
      {isSkillAdd && skillData && (
        <SkillAddPopup onClose={onSkillAddClose} occupationData={skillData} />
      )}
    </Box>
  );
};

export default CandidateRequirements;
