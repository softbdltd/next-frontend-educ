import yup from '../../../@core/libs/yup';
import {FormControlLabel, Grid, Switch} from '@mui/material';
import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import CustomFormSelect from '../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import {useIntl} from 'react-intl';
import FormRowStatus from '../../../@core/elements/input/FormRowStatus/FormRowStatus';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import {
  createCourse,
  updateCourse,
} from '../../../services/instituteManagement/CourseService';
import IconCourse from '../../../@core/icons/IconCourse';
import RowStatus from '../../../@core/utilities/RowStatus';
import {
  useFetchCourse,
  useFetchLocalizedInstitutes,
  useFetchPrograms,
} from '../../../services/instituteManagement/hooks';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import CustomCheckbox from '../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import {CourseFeePaymentOptions, LANGUAGE_MEDIUM, LEVEL} from './CourseEnums';
import {useFetchLocalizedSkills} from '../../../services/learnerManagement/hooks';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import CourseConfigKeys from '../../../@core/utilities/CourseConfigKeys';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {ICourse} from '../../../shared/Interface/institute.interface';
import FileUploadComponent from '../../filepond/FileUploadComponent';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import CustomSelectAutoComplete from '../../learner/registration/CustomSelectAutoComplete';
import _ from 'lodash';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';
import {
  useFetchLocalizedPublicJobSectors,
  useFetchLocalizedPublicOccupations,
} from '../../../services/organaizationManagement/hooks';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import OccupationCreatePopup from '../jobLists/jobPost/OccupationCreatePopup';
import SkillAddPopup from '../skills/SkillAddPopup';
import {ISkill} from '../../../shared/Interface/organization.interface';
import UncontrolledTextInput from '../../../@core/elements/input/UncontrolledTextInput';
import FormRadioButtons from '../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';

interface CourseAddEditPopupProps {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  title: '',
  title_en: '',
  institute_id: '',
  industry_association_id: '',
  branch_id: '',
  program_id: '',
  job_sector_id: '',
  occupation_id: '',
  level: '',
  language_medium: '',
  // code: '',
  course_fee: '',
  admission_fee: '',
  payment_type: '',
  duration: '',
  skills: [],
  row_status: '1',
};

const CourseAddEditPopup: FC<CourseAddEditPopupProps> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages, locale} = useIntl();
  const authUser = useAuthUser<CommonAuthUser>();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const isEdit = itemId != null;

  const [instituteFilters, setInstituteFilters] = useState<any>(null);
  const [isEntrepreneurship, setIsEntrepreneurship] = useState<any>(false);
  const {data: institutes, isLoading: isLoadingInstitutes} =
    useFetchLocalizedInstitutes(instituteFilters);

  const {
    data: itemData,
    isLoading,
    mutate: mutateCourse,
  } = useFetchCourse(itemId);

  const [programmeFilters, setProgrammeFilters] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const [jobSectorFilters, _setJobSectorFilters] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const [isOccupationAdd, setIsOccupationAdd] = useState<boolean>(false);
  const [occupationData, setOccupationData] = useState<any>(null);
  const [selectedJobSector, setSelectedJobSector] = useState<any>(null);
  const [occupationFilters, setOccupationFilters] = useState<any>(null);

  const [learnerSkillsFilter] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });

  useEffect(() => {
    if (authUser?.isSystemUser) {
      setInstituteFilters({row_status: RowStatus.ACTIVE});
    }
  }, []);

  const {data: programmes, isLoading: isLoadingProgrammes} =
    useFetchPrograms(programmeFilters);

  const {data: jobSectors, isLoading: isLoadingJobSectors} =
    useFetchLocalizedPublicJobSectors(jobSectorFilters);

  const {
    data: occupations,
    isLoading: isLoadingOccupations,
    mutate: mutateOccupation,
  } = useFetchLocalizedPublicOccupations(occupationFilters);

  const {
    data: skills,
    isLoading: isLoadingSkills,
    mutate: mutateSkills,
  } = useFetchLocalizedSkills(learnerSkillsFilter);

  const [configItemsState, setConfigItemsState] = useState<any>([]);
  const [configRequiredItems, setConfigRequiredItems] = useState<any>([]);
  const [isEducationChecked, setIsEducationChecked] = useState<boolean>(false);
  const [isSkillAdd, setIsSkillAdd] = useState<boolean>(false);
  const [skillData, setSkillData] = useState<any>(null);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      title: yup
        .string()
        .title('bn', true)
        .label(messages['common.title'] as string),
      title_en: yup
        .string()
        .title('en', false)
        .label(messages['common.title_en'] as string),

      institute_id: authUser?.isSystemUser
        ? yup
            .string()
            .trim()
            .required()
            .label(messages['institute.label'] as string)
        : yup.string().nullable(),
      course_fee: yup
        .number()
        .required()
        .label(messages['common.course_fee'] as string),
      admission_fee: yup
        .number()
        .required()
        .label(messages['course.admission_fee'] as string),
      payment_type: yup
        .mixed()
        .nullable()
        .label(messages['course.fee_payment_option'] as string)
        .when('course_fee', {
          is: (value: any) => {
            return Number(value) > 0;
          },
          then: yup.string().required(),
        }),
      job_sector_id: yup
        .string()
        .required()
        .label(messages['job_sectors.label'] as string),
      occupation_id: yup
        .string()
        .required()
        .label(messages['occupations.label'] as string),
      level: yup
        .string()
        .trim()
        .required()
        .label(messages['course.course_level'] as string),
      language_medium: yup
        .string()
        .trim()
        .required()
        .label(messages['course.language_medium'] as string),
      skills: yup
        .array()
        .of(yup.object())
        .label(messages['common.skills'] as string),
      overview_en: yup
        .string()
        .title('en', false)
        .label(messages['course.overview_en'] as string),
      objectives_en: yup
        .string()
        .title('en', false)
        .label(messages['course.objectives_en'] as string),
      target_group_en: yup
        .string()
        .title('en', false)
        .label(messages['course.target_group_en'] as string),
      training_methodology_en: yup
        .string()
        .title('en', false)
        .label(messages['course.training_methodology_en'] as string),
      evaluation_system_en: yup
        .string()
        .title('en', false)
        .label(messages['course.evaluation_system_en'] as string),
      eligibility_en: yup
        .string()
        .title('en', false)
        .label(messages['course_details.ageRange'] as string),
      prerequisite_en: yup
        .string()
        .title('en', false)
        .label(messages['course.prerequisite_en'] as string),

      // overview_en: itemData?.overview_en,
      // objectives_en: itemData?.objectives_en,
      // target_group_en: itemData?.target_group_en,
      // training_methodology_en: itemData?.training_methodology_en,
      // evaluation_system_en: itemData?.evaluation_system_en,
      // eligibility_en: itemData?.eligibility_en,
      // prerequisite_en: itemData?.prerequisite_en,
    });
  }, [messages, authUser]);

  const configItemList = useMemo(
    () => [
      {
        key: CourseConfigKeys.ETHNIC_GROUP_KEY,
        label: messages['course.ethnic_group_info'],
        isVisible: true,
      },
      {
        key: CourseConfigKeys.FREEDOM_FIGHTER_KEY,
        label: messages['course.freedom_fighter_info'],
        isVisible: true,
      },
      {
        key: CourseConfigKeys.DISABILITY_KEY,
        label: messages['course.disability_info'],
        isVisible: true,
      },
      {
        key: CourseConfigKeys.EDUCATION_KEY,
        label: messages['course.education_info'],
        isVisible: true,
      },
      {
        key: CourseConfigKeys.EDUCATION_PSC_KEY,
        label: messages['course.psc_passing_info'],
        isVisible: isEducationChecked,
      },
      {
        key: CourseConfigKeys.EDUCATION_JSC_KEY,
        label: messages['course.jsc_passing_info'],
        isVisible: isEducationChecked,
      },
      {
        key: CourseConfigKeys.EDUCATION_SSC_KEY,
        label: messages['course.ssc_passing_info'],
        isVisible: isEducationChecked,
      },
      {
        key: CourseConfigKeys.EDUCATION_HSC_KEY,
        label: messages['course.hsc_passing_info'],
        isVisible: isEducationChecked,
      },
      {
        key: CourseConfigKeys.EDUCATION_DIPLOMA_KEY,
        label: messages['course.diploma_passing_info'],
        isVisible: isEducationChecked,
      },
      {
        key: CourseConfigKeys.EDUCATION_HONOURS_KEY,
        label: messages['course.honors_passing_info'],
        isVisible: isEducationChecked,
      },
      {
        key: CourseConfigKeys.EDUCATION_MASTERS_KEY,
        label: messages['course.masters_passing_info'],
        isVisible: isEducationChecked,
      },
      {
        key: CourseConfigKeys.EDUCATION_PHD_KEY,
        label: messages['course.phd_passing_info'],
        isVisible: isEducationChecked,
      },
      {
        key: CourseConfigKeys.OCCUPATION_KEY,
        label: messages['course.occupation_info'],
        isVisible: true,
      },
      {
        key: CourseConfigKeys.GUARDIAN_KEY,
        label: messages['course.guardian_info'],
        isVisible: true,
      },
      {
        key: CourseConfigKeys.MISCELLANEOUS_KEY,
        label: messages['course.miscellaneous_info'],
        isVisible: true,
      },
    ],
    [messages, isEducationChecked],
  );

  const levels = useMemo(
    () => [
      {
        id: LEVEL.BEGINNER,
        label: messages['level.beginner'],
      },
      {
        id: LEVEL.INTERMEDIATE,
        label: messages['level.intermediate'],
      },
      {
        id: LEVEL.EXPERT,
        label: messages['level.expert'],
      },
    ],
    [messages],
  );

  const languageMedium = useMemo(
    () => [
      {
        id: LANGUAGE_MEDIUM.BN,
        label: messages['language.bn'],
      },
      {
        id: LANGUAGE_MEDIUM.EN,
        label: messages['language.en'],
      },
    ],
    [messages],
  );

  const {
    control,
    register,
    reset,
    setError,
    handleSubmit,
    getValues,
    setValue,
    setFocus,
    watch,
    formState: {errors, isSubmitting},
  } = useForm<ICourse>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemData) {
      console.log({itemData});
      reset({
        title_en: itemData?.title_en,
        title: itemData?.title,
        // code: itemData?.code,
        institute_id: itemData?.institute_id,
        industry_association_id: itemData?.industry_association_id,
        branch_id: itemData?.branch_id,
        program_id: itemData?.program_id,
        job_sector_id: itemData?.job_sector_id,
        occupation_id: itemData?.occupation_id,
        level: itemData?.level,
        language_medium: itemData?.language_medium,
        course_fee: itemData?.course_fee,
        admission_fee: itemData?.admission_fee,
        payment_type: itemData?.payment_type ?? '',
        duration: itemData?.duration,
        overview: itemData?.overview,
        overview_en: itemData?.overview_en,
        objectives: itemData?.objectives,
        objectives_en: itemData?.objectives_en,
        target_group: itemData?.target_group,
        target_group_en: itemData?.target_group_en,
        training_methodology: itemData?.training_methodology,
        training_methodology_en: itemData?.training_methodology_en,
        evaluation_system: itemData?.evaluation_system,
        evaluation_system_en: itemData?.evaluation_system_en,
        eligibility: itemData?.eligibility,
        eligibility_en: itemData?.eligibility_en,
        prerequisite: itemData?.prerequisite,
        prerequisite_en: itemData?.prerequisite_en,
        row_status: String(itemData?.row_status),
        skills: itemData?.skills ?? [],
        cover_image: itemData?.cover_image,
      });
      setIsEntrepreneurship(!!itemData?.is_entrepreneurship);
      setValuesOfConfigs(itemData?.application_form_settings);
      itemData?.job_sector_id &&
        setOccupationFilters({
          row_status: RowStatus.ACTIVE,
          job_sector_id: itemData?.job_sector_id,
        });
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  console.log(`errors`, errors);

  const setValuesOfConfigs = (config: string | undefined | null) => {
    try {
      let configJson = JSON.parse(config || '{}');
      let itemsState: any = [];
      let itemsRequiredState: any = [];
      Object.keys(configJson || {}).map((key: string) => {
        let value = configJson[key];
        if (value[0]) {
          itemsState.push(key);
          if (key == CourseConfigKeys.EDUCATION_KEY) {
            setIsEducationChecked(true);
          }
        }
        if (value[1]) {
          itemsRequiredState.push(key);
        }
      });
      setConfigItemsState(itemsState);
      setConfigRequiredItems(itemsRequiredState);
    } catch (e) {
      console.log('Failed to parse config data', e);
    }
  };

  const getConfigInfoData = (config: any) => {
    let configJson: any = {};
    Object.keys(config).map((key: any) => {
      configJson[key] = [
        configItemsState.includes(key),
        configRequiredItems.includes(key),
      ];
    });

    return JSON.stringify(configJson);
  };

  const onInstituteChange = useCallback((instituteId: number) => {
    setProgrammeFilters({
      row_status: RowStatus.ACTIVE,
      institute_id: instituteId,
    });
  }, []);

  // const onJobSectorChange = useCallback(
  //   (jobSectorId: number) => {
  //     // reset({...getValues(), occupation_id: ''})
  //     setValue('occupation_id', '')
  //     setOccupationFilters({row_status: RowStatus.ACTIVE, job_sector_id: jobSectorId});
  //
  //   },
  //   [],
  // );
  const onJobSectorChange = useCallback(
    async (jobSectorId: number | null) => {
      setSelectedJobSector(jobSectorId ? jobSectorId : null);
      if (jobSectorId) {
        try {
          setValue('occupation_id', '');
          setOccupationFilters({
            row_status: RowStatus.ACTIVE,
            job_sector_id: jobSectorId,
          });
        } catch (e) {}
      } else {
        setValue('occupation_id', '');
      }
    },
    [selectedJobSector],
  );

  const onOccupationClose = (occupationId?: number) => {
    setIsOccupationAdd(false);

    if (typeof occupationId == 'number') {
      setValue('occupation_id', occupationId);
      setFocus('overview');
      mutateOccupation();
    }
  };

  const onSkillAddClose = (skill?: ISkill) => {
    setIsSkillAdd(false);
    let currentSkillsValue = getValues('skills');

    if (typeof skill?.id == 'number') {
      setValue('skills', [...currentSkillsValue, skill]);
      setFocus('overview');
      mutateSkills();
    }
  };

  const onSubmit: SubmitHandler<ICourse> = async (data: ICourse) => {
    let formData = _.cloneDeep(data);
    // formData.occupation_id = formData.occupation_id.toString()
    // const {occupation_id} = formData;
    formData.is_entrepreneurship = Number(isEntrepreneurship);
    formData.application_form_settings = getConfigInfoData(
      data.application_form_settings,
    );

    if (!authUser?.isSystemUser) {
      delete formData?.institute_id;
      delete formData?.industry_association_id;
    }

    formData.skills = (data?.skills || []).map((skill: any) => skill.id);

    if (Number(formData.course_fee) < 1) {
      formData.payment_type = null;
    }

    try {
      if (itemId) {
        await updateCourse(itemId, formData);
        updateSuccessMessage('course.label');
        mutateCourse();
      } else {
        await createCourse(formData);
        createSuccessMessage('course.label');
      }
      props.onClose();
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <>
      <HookFormMuiModal
        open={true}
        {...props}
        title={
          <>
            <IconCourse />
            {isEdit ? (
              <IntlMessages
                id='common.edit'
                values={{subject: <IntlMessages id='course.label' />}}
              />
            ) : (
              <IntlMessages
                id='common.add_new'
                values={{subject: <IntlMessages id='course.label' />}}
              />
            )}
          </>
        }
        maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
        handleSubmit={handleSubmit(onSubmit)}
        actions={
          <>
            <CancelButton onClick={props.onClose} isLoading={isLoading} />
            <SubmitButton isSubmitting={isSubmitting} isLoading={isLoading} />
          </>
        }>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              required
              id='title'
              label={messages['common.title']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              id='title_en'
              label={messages['common.title_en']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
            />
          </Grid>
          {/*Todo: this section is hide because backend is generating code, need discussion*/}
          {/*<Grid item xs={12} sm={6} md={6}>*/}
          {/*  <CustomTextInput*/}
          {/*    required*/}
          {/*    id='code'*/}
          {/*    label={messages['common.code']}*/}
          {/*    control={control}*/}
          {/*    errorInstance={errors}*/}
          {/*    isLoading={isLoading}*/}
          {/*  />*/}
          {/*</Grid>*/}

          {authUser?.isSystemUser && (
            <Grid item xs={12} sm={6} md={6}>
              <CustomFormSelect
                required
                id='institute_id'
                label={messages['institute.label']}
                isLoading={isLoadingInstitutes}
                control={control}
                options={institutes || []}
                optionValueProp={'id'}
                optionTitleProp={
                  locale == LocaleLanguage.BN ? ['title'] : ['title_en']
                }
                errorInstance={errors}
                onChange={onInstituteChange}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={6}>
            <CustomFormSelect
              id='program_id'
              label={messages['programme.label']}
              isLoading={isLoadingProgrammes}
              control={control}
              options={programmes}
              optionValueProp='id'
              optionTitleProp={['title']}
              errorInstance={errors}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              id='admission_fee'
              label={messages['course.admission_fee']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              required={true}
              type={'number'}
              InputProps={{inputProps: {min: 0}}}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <CustomTextInput
              required
              id='course_fee'
              label={messages['common.course_fee']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              type={'number'}
              InputProps={{inputProps: {min: 0}}}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={3}>
            <CustomTextInput
              id='duration'
              label={messages['course.duration_label']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              type={'number'}
              InputProps={{inputProps: {min: 0}}}
            />
          </Grid>
          {watch('course_fee') > 0 && (
            <Grid item xs={6}>
              <FormRadioButtons
                required
                id={'payment_type'}
                radios={[
                  {
                    key: CourseFeePaymentOptions.AFTER_BATCH_ASSIGN,
                    label: messages['course.after_batch_assign'],
                  },
                  {
                    key: CourseFeePaymentOptions.WITH_ADMISSION_FEE,
                    label: messages['course.with_admission_fee'],
                  },
                ]}
                isDisabled={false}
                control={control}
                label={'course.fee_payment_option'}
                errorInstance={errors}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={6}>
            <CustomSelectAutoComplete
              id='skills'
              label={messages['common.skills']}
              control={control}
              options={skills || []}
              optionValueProp={'id'}
              optionTitleProp={['title']}
              errorInstance={errors}
              isLoading={isLoadingSkills}
              isCreatable={true}
              onCreateNew={(value) => {
                setSkillData({
                  title: value,
                });
                setIsSkillAdd(true);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomFormSelect
              required
              id='level'
              label={messages['course.course_level']}
              isLoading={false}
              control={control}
              options={levels}
              optionValueProp='id'
              optionTitleProp={['label']}
              errorInstance={errors}
            />
          </Grid>
          {/* Job sector*/}

          <Grid item xs={12} sm={6} md={6}>
            <CustomFilterableFormSelect
              required
              id={'job_sector_id'}
              isLoading={isLoadingJobSectors}
              options={jobSectors}
              control={control}
              label={messages['common.job_sectors']}
              optionValueProp={'id'}
              optionTitleProp={['title']}
              errorInstance={errors}
              onChange={onJobSectorChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomFilterableFormSelect
              required
              id='occupation_id'
              label={messages['occupations.label']}
              isLoading={isLoadingOccupations}
              control={control}
              options={occupations}
              optionValueProp={'id'}
              optionTitleProp={['title']}
              errorInstance={errors}
              isCreatable={!!selectedJobSector}
              onCreateNew={(value) => {
                setOccupationData({
                  title: value,
                  job_sector_id: selectedJobSector,
                });
                setIsOccupationAdd(true);
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomFormSelect
              required
              id='language_medium'
              label={messages['course.language_medium']}
              isLoading={false}
              control={control}
              options={languageMedium}
              optionValueProp='id'
              optionTitleProp={['label']}
              errorInstance={errors}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <UncontrolledTextInput
              id='overview'
              label={messages['course.overview']}
              register={register}
              errorInstance={errors}
              isLoading={isLoading}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              id='overview_en'
              label={messages['course.overview_en']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              id='target_group'
              label={messages['course.target_group']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              id='target_group_en'
              label={messages['course.target_group_en']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              id='objectives'
              label={messages['course.objectives']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              id='objectives_en'
              label={messages['course.objectives_en']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              id='training_methodology'
              label={messages['course.training_methodology']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              id='training_methodology_en'
              label={messages['course.training_methodology_en']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              id='evaluation_system'
              label={messages['course.evaluation_system']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              id='evaluation_system_en'
              label={messages['course.evaluation_system_en']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              id='prerequisite'
              label={messages['course.prerequisite']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              id='prerequisite_en'
              label={messages['course.prerequisite_en']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              id='eligibility'
              label={messages['course_details.ageRange']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              id='eligibility_en'
              label={messages['course_details.ageRange_en']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FileUploadComponent
              id='cover_image'
              defaultFileUrl={itemData?.cover_image}
              errorInstance={errors}
              setValue={setValue}
              register={register}
              label={messages['common.cover_image']}
              required={false}
              height={'400'}
              width={'600'}
              acceptedFileTypes={['image/*']}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormRowStatus
              id='row_status'
              control={control}
              defaultValue={initialValues.row_status}
              isLoading={isLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomCheckbox
              id='is_entrepreneurship'
              label={messages['common.entrepreneurship_skill_course']}
              register={register}
              errorInstance={errors}
              checked={isEntrepreneurship}
              onChange={() => {
                setIsEntrepreneurship((prev: boolean) => !prev);
              }}
              isLoading={false}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12}>
                <h3
                  style={{marginTop: '0', marginBottom: '5px', color: 'gray'}}>
                  {messages['course.enrollment_form_config']}
                </h3>
              </Grid>
              {configItemList.map((item: any, index: any) => {
                let states = [...configItemsState];
                return item.isVisible ? (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    style={{minHeight: 40}}
                    key={index}>
                    <Grid container>
                      <Grid item xs={8} md={7} style={{marginTop: 5}}>
                        <CustomCheckbox
                          id={`application_form_settings[${item.key}]`}
                          label={item.label}
                          checked={states.includes(item.key)}
                          isLoading={isLoading}
                          register={register}
                          errorInstance={errors}
                          onChange={() => {
                            let itemStates = [...configItemsState];
                            if (itemStates.includes(item.key)) {
                              itemStates = itemStates.filter(
                                (key: any) => key != item.key,
                              );
                              if (item.key == CourseConfigKeys.EDUCATION_KEY) {
                                setIsEducationChecked(false);
                              }
                            } else {
                              itemStates.push(item.key);
                              if (item.key == CourseConfigKeys.EDUCATION_KEY) {
                                setIsEducationChecked(true);
                              }
                            }
                            setConfigItemsState(itemStates);
                          }}
                        />
                      </Grid>

                      {states.includes(item.key) && (
                        <Grid item xs={4} md={5}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={configRequiredItems.includes(item.key)}
                                onChange={() => {
                                  let requiredStates = [...configRequiredItems];
                                  if (requiredStates.includes(item.key)) {
                                    requiredStates = requiredStates.filter(
                                      (key: any) => key != item.key,
                                    );
                                  } else {
                                    requiredStates.push(item.key);
                                  }
                                  setConfigRequiredItems(requiredStates);
                                }}
                                color='primary'
                              />
                            }
                            label={
                              configRequiredItems.includes(item.key)
                                ? (messages['common.required'] as string)
                                : (messages['common.not_required'] as string)
                            }
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                ) : (
                  <React.Fragment key={index} />
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </HookFormMuiModal>
      {isOccupationAdd && occupationData && (
        <OccupationCreatePopup
          key={1}
          onClose={onOccupationClose}
          occupationData={occupationData}
        />
      )}
      {isSkillAdd && skillData && (
        <SkillAddPopup
          key={2}
          onClose={onSkillAddClose}
          occupationData={skillData}
        />
      )}
    </>
  );
};
export default CourseAddEditPopup;
