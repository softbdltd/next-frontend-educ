import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Box, Button, Divider, Grid, Typography} from '@mui/material';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import yup from '../../../../../@core/libs/yup';
import {useIntl} from 'react-intl';
import CustomTextInput from '../../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {processServerSideErrors} from '../../../../../@core/utilities/validationErrorHandler';
import useNotiStack from '../../../../../@core/hooks/useNotifyStack';
import CustomCheckbox from '../../../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import CustomFilterableFormSelect from '../../../../../@core/elements/input/CustomFilterableFormSelect';
import CustomFormToggleButtonGroup from '../../../../../@core/elements/input/CustomFormToggleButtonGroup';
import CustomDatePicker from '../../../../../@core/elements/input/CustomDatePicker';
import {EmploymentStatus} from '../enums/JobPostEnums';
import CustomFormSwitch from '../../../../../@core/elements/input/CustomFormSwitch';
import {
  useFetchLocalizedPublicJobSectors,
  useFetchLocalizedPublicOccupations,
} from '../../../../../services/organaizationManagement/hooks';
import RowStatus from '../../../../../@core/utilities/RowStatus';
import {
  useFetchIndustryMembers,
  useFetchJobPrimaryInformation,
} from '../../../../../services/IndustryManagement/hooks';
import {savePrimaryJobInformation} from '../../../../../services/IndustryManagement/JobService';
import {useAuthUser} from '../../../../../@core/utility/AppHooks';
import {
  EMAIL_REGEX,
  MOBILE_NUMBER_REGEX,
} from '../../../../../@core/common/patternRegex';
import OccupationCreatePopup from '../OccupationCreatePopup';
import UncontrolledTextInput from '../../../../../@core/elements/input/UncontrolledTextInput';
import {Body1, Body2} from '../../../../../@core/elements/common';
import _ from 'lodash';

interface Props {
  jobId: string;
  onContinue: () => void;
  setLatestStep: (step: number) => void;
}

const initialValue = {
  job_posting_source: '',
  job_posting_source_en: '',
  job_title: '',
  job_title_en: '',
  employment_types: [],
  no_of_vacancies: '',
  is_number_of_vacancy_na: false,
  job_sector_id: '',
  occupation_id: '',
  application_deadline: '',
  special_instruction_for_job_seekers: '',
  special_instruction_for_job_seekers_en: '',
  is_photograph_enclose_with_resume: false,
  is_job_post_for_other: false,
  other_name: '',
  other_email: '',
  other_address: '',
  other_mobile: '',
  is_apply_online: false,
  resume_receiving_option: false,
};

const PrimaryJobInformation = ({jobId, onContinue, setLatestStep}: Props) => {
  const {messages} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const authUser = useAuthUser();

  const [isOtherJobPost, setIsOtherJobPost] = useState<boolean>(false);
  const [isNotApplicable, setIsNotApplicable] = useState<boolean>(false);
  const [isApplyOnline, setIsApplyOnline] = useState<boolean>(false);
  const [isEmailResume, setIsEmailResume] = useState<boolean>(false);
  const [jobSectorFilters] = useState({row_status: RowStatus.ACTIVE});
  const {data: jobSectors, isLoading: isLoadingJobSector}: any =
    useFetchLocalizedPublicJobSectors(jobSectorFilters);

  const {data: primaryJobInfo, isLoading: isLoadingData} =
    useFetchJobPrimaryInformation(jobId);
  const [isReady, setIsReady] = useState<boolean>(false);

  const [latestStepValue, setLatestStepValue] = useState(1);

  const [industryAssociationMembersFilter] = useState({
    row_status: RowStatus.ACTIVE,
  });
  const [occupationFilter, setOccupationFilter] = useState<any>({});
  const [isInitialSubmit, setIsInitialSubmit] = useState<boolean>(true);

  const {
    data: occupations,
    isLoading: isLoadingOccupations,
    mutate: mutateOccupation,
  } = useFetchLocalizedPublicOccupations(occupationFilter);

  const {
    data: industryAssociationMembers,
    isLoading: isLoadingIndustryAssocMembers,
  } = useFetchIndustryMembers(industryAssociationMembersFilter);

  const [isOccupationAdd, setIsOccupationAdd] = useState<boolean>(false);
  const [occupationData, setOccupationData] = useState<any>(null);
  const [selectedJobSector, setSelectedJobSector] = useState<any>(null);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      job_posting_source: yup
        .string()
        .required()
        .label(messages['job_post.job_posting_source'] as string),
      job_posting_source_en: yup
        .string()
        .nullable()
        .label(messages['job_post.job_posting_source_en'] as string),
      job_title: yup
        .string()
        .required()
        .label(messages['job_posting.job_title'] as string),
      is_job_post_for_other: yup.boolean().label('is_job_post_for_other'),
      other_name: yup
        .mixed()
        .label(messages['common.name'] as string)
        .when('is_job_post_for_other', {
          is: (value: any) => value,
          then: yup.string().required(),
        }),
      other_email: yup
        .mixed()
        .label(messages['common.email'] as string)
        .when('is_job_post_for_other', {
          is: (value: any) => value,
          then: (schema: any) => {
            return schema.test({
              test: (emailValue: any) => {
                if (!emailValue) return true;
                return Boolean(emailValue.match(EMAIL_REGEX));
              },
              message: messages['common.invalid_email'] as string,
            });
          },
        }),
      other_address: yup
        .mixed()
        .label(messages['common.address'] as string)
        .when('is_job_post_for_other', {
          is: (value: any) => value,
          then: yup.string().required(),
        }),
      other_mobile: yup
        .mixed()
        .label(messages['common.mobile_en'] as string)
        .nullable()
        .test(
          'mobile_number_validation',
          messages['common.invalid_mobile'] as string,
          (value) => !value || Boolean(value.match(MOBILE_NUMBER_REGEX)),
        ),
      is_number_of_vacancy_na: yup
        .boolean()
        .required()
        .label(messages['job_posting.not_applicable'] as string),
      no_of_vacancies: yup
        .mixed()
        .label(messages['job_posting.no_of_vacancy'] as string)
        .when('is_number_of_vacancy_na', {
          is: (value: boolean) => {
            return !value;
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
      employment_types: yup
        .array()
        .of(yup.number())
        .min(1, messages['common.must_select_one'] as string)
        .label(messages['job_posting.employment_status'] as string),
      application_deadline: yup
        .string()
        .nullable(true)
        .trim()
        .required()
        .label(messages['job_posting.application_deadline'] as string),
      email: isEmailResume
        ? yup
            .string()
            .trim()
            .nullable()
            .required()
            .email()
            .label(messages['common.email'] as string)
        : yup.string().nullable(),
      is_photograph_enclose_with_resume: yup
        .boolean()
        .required()
        .label(messages['job_posting.enclose_photograph'] as string),
    });
  }, [isEmailResume, messages]);
  const {
    register,
    control,
    setError,
    setValue,
    setFocus,
    reset,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  const getEmploymentType = (employment_types: any) => {
    const ids: any = [];
    (employment_types || []).map((type: any) => {
      ids.push(type.id);
    });

    return ids;
  };

  useEffect(() => {
    if (primaryJobInfo && primaryJobInfo?.latest_step) {
      const latestStep = primaryJobInfo.latest_step;
      delete primaryJobInfo?.latest_step;
      setLatestStepValue(latestStep);

      if (latestStep >= 1) {
        setIsReady(true);
        reset({
          job_posting_source: primaryJobInfo?.job_posting_source,
          job_posting_source_en: primaryJobInfo?.job_posting_source_en,
          job_title: primaryJobInfo?.job_title,
          job_title_en: primaryJobInfo?.job_title_en,
          employment_types: getEmploymentType(primaryJobInfo?.employment_types),
          no_of_vacancies: primaryJobInfo?.no_of_vacancies
            ? primaryJobInfo?.no_of_vacancies
            : '',
          is_number_of_vacancy_na: !primaryJobInfo?.no_of_vacancies,
          job_sector_id: primaryJobInfo?.job_sector_id,
          occupation_id: primaryJobInfo?.occupation_id,
          application_deadline: primaryJobInfo?.application_deadline,
          special_instruction_for_job_seekers:
            primaryJobInfo?.special_instruction_for_job_seekers,
          special_instruction_for_job_seekers_en:
            primaryJobInfo?.special_instruction_for_job_seekers_en,
          is_photograph_enclose_with_resume:
            primaryJobInfo?.is_photograph_enclose_with_resume == 1,
          organization_id: primaryJobInfo?.organization_id,
          is_job_post_for_other: primaryJobInfo?.is_job_post_for_other == 1,
          other_name: primaryJobInfo?.other_name,
          other_email: primaryJobInfo?.other_email,
          other_address: primaryJobInfo?.other_address,
          other_mobile: primaryJobInfo?.other_mobile,
          email: primaryJobInfo?.email,
        });
        setIsNotApplicable(!primaryJobInfo?.no_of_vacancies);
        setIsOtherJobPost(primaryJobInfo?.is_job_post_for_other == 1);
        onJobSectorChange(primaryJobInfo?.job_sector_id);
        setIsApplyOnline(!!primaryJobInfo?.is_apply_online);
        setIsEmailResume(!!primaryJobInfo?.resume_receiving_option);
      }
      setLatestStep(latestStep);
    } else {
      reset(initialValue);
    }
  }, [primaryJobInfo]);

  console.log('errors', errors);
  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      setIsInitialSubmit(false);
      data.job_id = jobId;
      data.no_of_vacancies = !data.is_number_of_vacancy_na
        ? data.no_of_vacancies
        : '';
      data.is_number_of_vacancy_na = data.is_number_of_vacancy_na ? 1 : 0;
      data.is_photograph_enclose_with_resume =
        data.is_photograph_enclose_with_resume ? 1 : 0;

      if (!authUser?.isIndustryAssociationUser || data.is_job_post_for_other) {
        delete data.organization_id;
      }

      if (!data.is_job_post_for_other) {
        delete data.other_name;
        delete data.other_email;
        delete data.other_address;
        delete data.other_mobile;
      }

      if (!(isApplyOnline || isEmailResume)) {
        return;
      }

      if (isApplyOnline) {
        data.is_apply_online = 1;
      } else {
        data.is_apply_online = 0;
      }

      if (isEmailResume) {
        data.resume_receiving_option = 1;
      } else {
        data.resume_receiving_option = null;
        data.email = '';
      }

      data.is_job_post_for_other = data.is_job_post_for_other ? 1 : 0;

      await savePrimaryJobInformation(data);

      successStack(messages['common.data_saved']);
      onContinue();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  const onJobSectorChange = useCallback(async (jobSectorId: number | null) => {
    setSelectedJobSector(jobSectorId ? jobSectorId : null);
    if (jobSectorId) {
      try {
        setOccupationFilter({
          row_status: RowStatus.ACTIVE,
          job_sector_id: jobSectorId,
        });
      } catch (e) {}
    }
  }, []);

  const onOccupationClose = (occupationId?: number) => {
    setIsOccupationAdd(false);
    if (typeof occupationId == 'number') {
      setValue('occupation_id', occupationId);
      setFocus('special_instruction_for_job_seekers');
      mutateOccupation();
    }
  };

  return isReady ? (
    <Box mt={2}>
      <Typography
        mb={3}
        variant={'h5'}
        fontWeight={'bold'}
        textAlign={'center'}>
        {messages['job_posting.primary_job_info']}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CustomTextInput
              required
              id='job_posting_source'
              label={messages['job_post.job_posting_source']}
              control={control}
              errorInstance={errors}
              isLoading={false}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextInput
              id='job_posting_source_en'
              label={messages['job_post.job_posting_source_en']}
              control={control}
              errorInstance={errors}
              isLoading={false}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomCheckbox
              id='is_job_post_for_other'
              label={messages['job.is_other_job_post']}
              register={register}
              errorInstance={errors}
              checked={isOtherJobPost}
              onChange={() => {
                setIsOtherJobPost((prev) => !prev);
              }}
              isLoading={false}
            />
          </Grid>

          {isOtherJobPost && (
            <React.Fragment>
              <Grid item xs={12} md={6}>
                <CustomTextInput
                  required
                  id='other_name'
                  label={messages['job_post.name']}
                  control={control}
                  errorInstance={errors}
                  isLoading={false}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextInput
                  id='other_email'
                  label={messages['job_post.email']}
                  control={control}
                  errorInstance={errors}
                  isLoading={false}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextInput
                  required
                  id='other_address'
                  label={messages['job_post.address']}
                  control={control}
                  errorInstance={errors}
                  isLoading={false}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextInput
                  id='other_mobile'
                  label={messages['job_post.mobile']}
                  control={control}
                  errorInstance={errors}
                  isLoading={false}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{borderWidth: '2px'}} />
              </Grid>
            </React.Fragment>
          )}

          {authUser?.isIndustryAssociationUser && !isOtherJobPost && (
            <React.Fragment>
              <Grid item xs={12} md={6}>
                <CustomFilterableFormSelect
                  id='organization_id'
                  label={messages['common.create_job_for_member']}
                  isLoading={isLoadingIndustryAssocMembers}
                  control={control}
                  options={industryAssociationMembers}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                  isDisabled={latestStepValue > 1}
                />
              </Grid>
              <Grid item xs={0} md={6} />
            </React.Fragment>
          )}

          <Grid item xs={12} md={6}>
            <CustomTextInput
              required
              id='job_title'
              label={messages['job_posting.job_title']}
              control={control}
              errorInstance={errors}
              isLoading={false}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextInput
              id='job_title_en'
              label={messages['job_posting.job_title_en']}
              control={control}
              errorInstance={errors}
              isLoading={false}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <CustomTextInput
                  required={!isNotApplicable}
                  id='no_of_vacancies'
                  type={'number'}
                  label={messages['job_posting.no_of_vacancy']}
                  control={control}
                  errorInstance={errors}
                  isLoading={false}
                  disabled={isNotApplicable}
                />
              </Grid>
              <Grid item xs={12} md={7} alignItems={'center'} display={'flex'}>
                <CustomCheckbox
                  id='is_number_of_vacancy_na'
                  label={messages['job_posting.not_applicable']}
                  register={register}
                  errorInstance={errors}
                  checked={isNotApplicable}
                  onChange={() => {
                    setIsNotApplicable((prev) => !prev);
                  }}
                  isLoading={false}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomFilterableFormSelect
              required
              id='job_sector_id'
              label={messages['job_sectors.label']}
              isLoading={isLoadingJobSector}
              control={control}
              options={jobSectors}
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

          <Grid item xs={12}>
            <CustomFormToggleButtonGroup
              required
              id={'employment_types'}
              label={messages['job_posting.employment_status']}
              buttons={[
                {
                  value: EmploymentStatus.FULL_TIME,
                  label: messages['job_posting.employment_status_full_time'],
                },
                {
                  value: EmploymentStatus.PART_TIME,
                  label: messages['job_posting.employment_status_part_time'],
                },
                {
                  value: EmploymentStatus.APPRENTICESHIP,
                  label:
                    messages['job_posting.employment_status_apprenticeship'],
                },
                {
                  value: EmploymentStatus.CONTRACTUAL,
                  label: messages['job_posting.employment_status_contractual'],
                },
              ]}
              control={control}
              errorInstance={errors}
              multiSelect={true}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <CustomDatePicker
                  required
                  id='application_deadline'
                  label={messages['job_posting.application_deadline']}
                  isLoading={false}
                  control={control}
                  errorInstance={errors}
                  disablePast={true}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <UncontrolledTextInput
              id='special_instruction_for_job_seekers'
              label={messages['job_posting.special_instruction']}
              register={register}
              errorInstance={errors}
              isLoading={false}
              multiline={true}
              rows={3}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomTextInput
              id='special_instruction_for_job_seekers_en'
              label={messages['job_posting.special_instruction_en']}
              control={control}
              errorInstance={errors}
              isLoading={false}
              multiline={true}
              rows={3}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Body1>
              {messages['job_post.application_process']}{' '}
              <span style={{color: '#c00606'}}> *</span>
            </Body1>
            <Grid container spacing={5}>
              <Grid item xs={12} md={6}>
                <CustomCheckbox
                  id='is_apply_online'
                  label={messages['common.apply_online']}
                  register={register}
                  errorInstance={errors}
                  checked={isApplyOnline}
                  onChange={() => {
                    setIsApplyOnline((prev) => !prev);
                  }}
                  isLoading={isLoadingData}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomCheckbox
                  id='resume_receiving_option'
                  label={messages['job_post.email_resume']}
                  register={register}
                  errorInstance={errors}
                  checked={isEmailResume}
                  onChange={() => {
                    setIsEmailResume((prev) => !prev);
                  }}
                  isLoading={isLoadingData}
                />
              </Grid>
            </Grid>
            <Body2>
              <span style={{color: '#c00606'}}>
                {!isInitialSubmit &&
                  !(isApplyOnline || isEmailResume) &&
                  `${messages['job_post.application_process']} ${
                    messages['common.validation_required_error'] as string
                  }`}
              </span>
            </Body2>
          </Grid>

          {isEmailResume && (
            <Grid item xs={12} md={6}>
              <CustomTextInput
                sx={{mt: '10px'}}
                required
                id='email'
                label={messages['common.email']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
          )}

          <Grid item xs={12} md={12}>
            <CustomFormSwitch
              id={'is_photograph_enclose_with_resume'}
              label={messages['job_posting.enclose_photograph']}
              yesLabel={messages['common.yes'] as string}
              noLabel={messages['common.no'] as string}
              register={register}
              defaultChecked={
                primaryJobInfo?.is_photograph_enclose_with_resume == 1
              }
              isLoading={false}
            />
          </Grid>
        </Grid>
        <Box mt={3} display={'flex'} justifyContent={'flex-end'}>
          <Button
            disabled={isSubmitting}
            type={'submit'}
            variant={'contained'}
            color={'primary'}>
            {messages['common.save_and_continue']}
          </Button>
        </Box>
      </form>
      {isOccupationAdd && occupationData && (
        <OccupationCreatePopup
          onClose={onOccupationClose}
          occupationData={occupationData}
        />
      )}
    </Box>
  ) : (
    <></>
  );
};

export default PrimaryJobInformation;
