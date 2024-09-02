import {Box, FormControlLabel, Grid, Switch, Zoom} from '@mui/material';
import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import CustomTextInput from '../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {
  getAllKeysFromErrorObj,
  getMomentDateFormat,
} from '../../../../@core/utilities/helpers';
import {processServerSideErrors} from '../../../../@core/utilities/validationErrorHandler';
import yup from '../../../../@core/libs/yup';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import {useIntl} from 'react-intl';
import CustomDatePicker from '../../../../@core/elements/input/CustomDatePicker';
import SubmitButton from '../../../../@core/elements/button/SubmitButton/SubmitButton';
import CancelButton from '../../../../@core/elements/button/CancelButton/CancelButton';
import {
  useFetchJobExperience,
  useFetchPublicAreaOfBusiness,
  useFetchPublicAreaOfExperience,
} from '../../../../services/learnerManagement/hooks';
import {
  createJobExperience,
  updateJobExperience,
} from '../../../../services/learnerManagement/JobExperienceService';
import {YouthJobExperience} from '../../../../services/learnerManagement/typing';
import CustomHookForm from '../component/CustomHookForm';
import useSuccessMessage from '../../../../@core/hooks/useSuccessMessage';
import CustomFilterableFormSelect from '../../../../@core/elements/input/CustomFilterableFormSelect';
import CustomSelectAutoComplete from '../../registration/CustomSelectAutoComplete';

interface JobExperienceAddEditProps {
  itemId: number | null;
  onClose: () => void;
}

const initialValues = {
  company_name: '',
  company_name_en: '',
  position: '',
  position_en: '',
  employment_type_id: '',
  location: '',
  location_en: '',
  job_responsibilities: '',
  job_responsibilities_en: '',
  start_date: '',
  end_date: '',
  is_currently_working: 1,
  area_of_experiences: [],
  area_of_businesses: [],
};

const JobExperienceAddEditPage: FC<JobExperienceAddEditProps> = ({
  itemId,
  onClose: closeJobExperienceAddEditPage,
}: JobExperienceAddEditProps) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();

  const {
    data: itemData,
    mutate: jobExperienceMutate,
    isLoading,
  } = useFetchJobExperience(itemId);
  const [currentWorkStatus, setCurrentWorkStatus] = useState<number>(1);

  const {data: areaOfBusinessData, isLoading: isLoadingAreaOfBusinessData} =
    useFetchPublicAreaOfBusiness();
  const {data: areaOfExperienceData, isLoading: isLoadingAreaOfExperienceData} =
    useFetchPublicAreaOfExperience();

  const [selectedAreaOfBusinessList, setSelectedAreaOfBusinessList] =
    useState<any>([]);
  const [selectedAreaOfExperienceList, setSelectedAreaOfExperienceList] =
    useState<any>([]);
  const employmentTypes = [
    {
      id: 1,
      title: messages['job_posting.employment_status_full_time'],
    },
    {
      id: 2,
      title: messages['job_posting.employment_status_part_time'],
    },
    {
      id: 3,
      title: messages['job_posting.employment_status_casual'],
    },
    {
      id: 4,
      title: messages['job_posting.employment_status_internship'],
    },
  ];

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      company_name: yup
        .string()
        .required()
        .label(messages['common.company_name_bn'] as string),
      company_name_en: yup
        .string()
        .title('en', false)
        .label(messages['common.company_name_en'] as string),
      position: yup
        .string()
        .required()
        .label(messages['common.post_bn'] as string),
      position_en: yup
        .string()
        .title('en', false)
        .label(messages['common.post_en'] as string),
      employment_type_id: yup
        .string()
        .required()
        .label(messages['common.job_type'] as string),
      location: yup
        .string()
        .required()
        .label(messages['common.location_bn'] as string),
      location_en: yup
        .string()
        .title('en', false)
        .label(messages['common.location_en'] as string),
      job_responsibilities_en: yup
        .string()
        .title('en', false)
        .label(messages['common.job_responsibilities_en'] as string),
      start_date: yup
        .string()
        .nullable(true)
        .trim()
        .required()
        .matches(/(19|20)\d\d-[01]\d-[0123]\d/)
        .label(messages['common.start_date'] as string),
      end_date:
        currentWorkStatus == 0
          ? yup
              .string()
              .nullable(true)
              .trim()
              .required()
              .matches(/(19|20)\d\d-[01]\d-[0123]\d/)
              .label(messages['common.end_date'] as string)
          : yup.string().nullable(),
      area_of_experiences: yup
        .array()
        .of(yup.object())
        .min(1, messages['common.must_have_one_area_of_experiences'] as string)
        .label(messages['common.area_of_experience'] as string),
      area_of_businesses: yup
        .array()
        .of(yup.object())
        .min(1, messages['common.must_have_one_area_of_businesses'] as string)
        .label(messages['common.area_of_business'] as string),
    });
  }, [messages, currentWorkStatus]);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: {errors, isSubmitting, submitCount},
  } = useForm<YouthJobExperience>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemData) {
      reset({
        company_name: itemData.company_name,
        company_name_en: itemData?.company_name_en,
        position: itemData.position,
        position_en: itemData?.position_en,
        location: itemData.location,
        location_en: itemData?.location_en,
        job_responsibilities: itemData?.job_responsibilities,
        job_responsibilities_en: itemData?.job_responsibilities_en,
        start_date: itemData?.start_date
          ? getMomentDateFormat(itemData.start_date, 'YYYY-MM-DD')
          : '',
        end_date: itemData?.end_date
          ? getMomentDateFormat(itemData?.end_date, 'YYYY-MM-DD')
          : '',
        employment_type_id: itemData?.employment_type_id,
        area_of_businesses: itemData?.area_of_businesses,
        area_of_experiences: itemData?.area_of_experiences,
      });
      setCurrentWorkStatus(itemData?.is_currently_working);
      setSelectedAreaOfExperienceList(itemData?.area_of_experiences);
      setSelectedAreaOfBusinessList(itemData?.area_of_businesses);
    } else {
      reset(initialValues);
      setCurrentWorkStatus(initialValues.is_currently_working);
    }
  }, [itemData]);

  const onAreaOfExperienceChange = useCallback((options) => {
    setSelectedAreaOfExperienceList(options);
  }, []);

  const onAreaOfBusinessChange = useCallback((options) => {
    setSelectedAreaOfBusinessList(options);
  }, []);

  useEffect(() => {
    const errorKeysArr = getAllKeysFromErrorObj(errors);
    if (submitCount && errorKeysArr.length > 0) {
      let field = document.getElementsByName(errorKeysArr?.[0]);
      if (field.length > 0) {
        field[0]?.focus();
      }
    }
  }, [errors, submitCount]);

  const onSubmit: SubmitHandler<YouthJobExperience> = async (
    data: YouthJobExperience,
  ) => {
    data.is_currently_working = currentWorkStatus;
    if (currentWorkStatus == 1) delete data.end_date;

    let areaOfExperienceIds: any = [];
    if (selectedAreaOfExperienceList) {
      selectedAreaOfExperienceList.map((experience: any) => {
        areaOfExperienceIds.push(experience.id);
      });
    }
    data.area_of_experiences = areaOfExperienceIds;

    let areaOfBusinessIds: any = [];
    if (selectedAreaOfBusinessList) {
      selectedAreaOfBusinessList.map((business: any) => {
        areaOfBusinessIds.push(business.id);
      });
    }
    data.area_of_businesses = areaOfBusinessIds;

    try {
      if (itemId) {
        await updateJobExperience(itemId, data);
        updateSuccessMessage('job_experience.label');
      } else {
        await createJobExperience(data);
        createSuccessMessage('job_experience.label');
      }
      jobExperienceMutate();
      closeJobExperienceAddEditPage();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  const handleCurrentWorkStatusChange = (event: any) => {
    setCurrentWorkStatus(event.target.checked ? 1 : 0);
  };

  return (
    <Zoom in={true}>
      <Box>
        <CustomHookForm
          title={messages['common.job_experience']}
          handleSubmit={handleSubmit(onSubmit)}
          actions={
            <React.Fragment>
              <CancelButton
                onClick={closeJobExperienceAddEditPage}
                isLoading={isLoading}
              />
              <SubmitButton isSubmitting={isSubmitting} isLoading={isLoading} />
            </React.Fragment>
          }
          onClose={closeJobExperienceAddEditPage}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='company_name'
                label={messages['common.company_name_bn']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
                inputProps={{
                  autofocus: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='company_name_en'
                label={messages['common.company_name_en']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='position'
                label={messages['common.post_bn']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='position_en'
                label={messages['common.post_en']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='location'
                label={messages['common.location_bn']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='location_en'
                label={messages['common.location_en']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomSelectAutoComplete
                required
                id='area_of_experiences'
                label={messages['common.area_of_experience']}
                isLoading={isLoadingAreaOfExperienceData}
                control={control}
                options={areaOfExperienceData}
                optionValueProp='id'
                optionTitleProp={['title']}
                defaultValue={selectedAreaOfExperienceList}
                errorInstance={errors}
                onChange={onAreaOfExperienceChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomSelectAutoComplete
                required
                id='area_of_businesses'
                label={messages['common.area_of_business']}
                isLoading={isLoadingAreaOfBusinessData}
                control={control}
                options={areaOfBusinessData}
                optionValueProp='id'
                optionTitleProp={['title']}
                defaultValue={selectedAreaOfBusinessList}
                errorInstance={errors}
                onChange={onAreaOfBusinessChange}
              />
            </Grid>

            <Grid item container spacing={2} xs={12} md={12}>
              <Grid item xs={12} md={6}>
                <CustomFilterableFormSelect
                  required
                  id={'employment_type_id'}
                  label={messages['common.job_type']}
                  isLoading={isLoading}
                  control={control}
                  options={employmentTypes}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomDatePicker
                required
                id='start_date'
                label={messages['job_experience.start_date']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              {currentWorkStatus == 0 && (
                <CustomDatePicker
                  required
                  id='end_date'
                  label={messages['job_experience.end_date']}
                  control={control}
                  errorInstance={errors}
                  isLoading={isLoading}
                />
              )}
              <FormControlLabel
                control={
                  <Switch
                    onChange={handleCurrentWorkStatusChange}
                    checked={currentWorkStatus == 1}
                  />
                }
                label={messages['common.currently_working_here'] as string}
              />
            </Grid>
            <Grid item container spacing={2} xs={12} md={12}>
              <Grid item xs={12} md={6}>
                <CustomTextInput
                  id='job_responsibilities'
                  label={messages['common.job_responsibilities_bn']}
                  control={control}
                  errorInstance={errors}
                  isLoading={isLoading}
                  multiline={true}
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextInput
                  id='job_responsibilities_en'
                  label={messages['common.job_responsibilities_en']}
                  control={control}
                  errorInstance={errors}
                  isLoading={isLoading}
                  multiline={true}
                  rows={3}
                />
              </Grid>
            </Grid>
          </Grid>
          {isSubmitting && (
            <div role={'alert'} aria-live="assertive" style={{ position: 'absolute', top: '-9999px' }}>
              {messages['common.submitting'] as string}
            </div>
          )}
        </CustomHookForm>
      </Box>
    </Zoom>
  );
};

export default JobExperienceAddEditPage;
