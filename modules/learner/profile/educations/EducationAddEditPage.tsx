import {yupResolver} from '@hookform/resolvers/yup';
import {Box, FormControlLabel, Grid, Switch, Zoom} from '@mui/material';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useIntl} from 'react-intl';
import CancelButton from '../../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../../@core/elements/button/SubmitButton/SubmitButton';
import CustomCheckbox from '../../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import CustomFilterableFormSelect from '../../../../@core/elements/input/CustomFilterableFormSelect';
import CustomTextInput from '../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import useSuccessMessage from '../../../../@core/hooks/useSuccessMessage';
import yup from '../../../../@core/libs/yup';
import {
  getAllKeysFromErrorObj,
  passingYears,
} from '../../../../@core/utilities/helpers';
import {processServerSideErrors} from '../../../../@core/utilities/validationErrorHandler';
import {useFetchCountries} from '../../../../services/locationManagement/hooks';
import {
  createEducation,
  updateEducation,
} from '../../../../services/learnerManagement/EducationService';
import {
  useFetchEducation,
  useFetchEducationExamsBoardsEduGroupsAndSubjects,
  useFetchNUInstitutes,
} from '../../../../services/learnerManagement/hooks';
import {YouthEducation} from '../../../../services/learnerManagement/typing';
import FileUploadComponent from '../../../filepond/FileUploadComponent';
import CustomHookForm from '../component/CustomHookForm';
import {
  EducationLevelCodePHD,
  EducationLevelCodeWithBoard,
  EducationLevelCodeWithGroup,
  EducationLevelForMajorGroup,
  OtherExamDegree,
  OtherGroup,
  ResultCodeAppeared,
  ResultCodeDivisions,
  ResultCodeGrade,
} from '../utilities/EducationEnums';

interface EducationAddEditPageProps {
  itemId: number | null;
  onClose: () => void;
}

const initialValues = {
  education_level_id: '',
  institute_name: '',
  is_foreign_institute: false,
  exam_degree_id: '',
  exam_degree_name: '',
  edu_board_id: '',
  edu_group_id: '',
  foreign_institute_country_id: '',
  result: '',
  year_of_passing: '',
  expected_year_of_passing: '',
};

const EducationAddEditPage: FC<EducationAddEditPageProps> = ({
  itemId,
  onClose: onEducationEditPageClose,
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const {
    data: itemData,
    isLoading,
    mutate: mutateEducation,
  } = useFetchEducation(itemId);
  const {data: educationsData, isLoading: isLoadingEducationsData} =
    useFetchEducationExamsBoardsEduGroupsAndSubjects();

  const [countryFilters] = useState<any>({});
  const {data: countries, isLoading: isLoadingCountries} =
    useFetchCountries(countryFilters);

  const [isForeignInstitute, setIsForeignInstitute] = useState<boolean>(false);
  const [selectedEducationLevel, setSelectedEducationLevel] =
    useState<any>(null);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [selectedExamDegree, setSelectedExamDegree] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [isRunning, setIsRunning] = useState<number>(0);
  const [checkedNUCheckbox, setCheckedNUCheckbox] = useState<boolean>(false);

  const {data: nuInstitutesData, isLoading: isLoadingNuInstitutesData} =
    useFetchNUInstitutes();

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      institute_name: !checkedNUCheckbox
        ? yup
            .string()
            .title('bn', true)
            .label(messages['common.edu_institute_name_en'] as string)
        : yup
            .string()
            .title('bn', false)
            .label(messages['common.edu_institute_name_en'] as string),
      institute_name_en: isForeignInstitute
        ? yup
            .string()
            .title('en', true)
            .label(messages['common.edu_institute_name_en'] as string)
        : yup
            .string()
            .title('en', false)
            .label(messages['common.edu_institute_name_en'] as string),

      nu_institute_name: checkedNUCheckbox
        ? yup
            .string()
            .trim()
            .label(messages['common.institute_name'] as string)
            .required()
        : yup
            .string()
            .trim()
            .label(messages['common.institute_name'] as string)
            .nullable(),
      education_level_id: yup
        .string()
        .required()
        .label(messages['education.education_level'] as string),
      foreign_institute_country_id: yup
        .string()
        // .required()
        .label(messages['education.foreign_institute_country'] as string)
        .when('is_foreign_institute', {
          is: (value: any) => value,
          then: yup.string().required(),
        }),
      exam_degree_id:
        selectedEducationLevel &&
        selectedEducationLevel?.code != EducationLevelCodePHD
          ? yup
              .string()
              .required()
              .label(messages['education.education_exam_degree'] as string)
          : yup.string().nullable(),
      exam_degree_name:
        selectedEducationLevel &&
        selectedEducationLevel?.code == EducationLevelCodePHD
          ? yup
              .string()
              .title('bn', true)
              .label(
                messages['education.education_exam_degree_name_bn'] as string,
              )
          : yup.string().nullable(),
      exam_degree_name_en:
        selectedEducationLevel &&
        selectedEducationLevel?.code == EducationLevelCodePHD
          ? yup
              .string()
              .title('en', false)
              .label(
                messages['education.education_exam_degree_name_en'] as string,
              )
          : yup.string().nullable(),
      other:
        selectedExamDegree && selectedExamDegree.code == OtherExamDegree
          ? yup
              .string()
              .title('bn', true)
              .label(messages['education.others'] as string)
          : yup.string().nullable(),
      other_en:
        selectedExamDegree && selectedExamDegree.code == OtherExamDegree
          ? yup
              .string()
              .title('en', false)
              .label(messages['education.others_en'] as string)
          : yup.string().nullable(),
      major_or_concentration:
        selectedEducationLevel &&
        EducationLevelForMajorGroup.includes(selectedEducationLevel?.code)
          ? yup
              .string()
              .title('bn', true)
              .label(messages['education.major_group_name_bn'] as string)
          : yup.string().nullable(),
      major_or_concentration_en: yup
        .string()
        .title('en', false)
        .label(messages['education.major_group_name_en'] as string),

      edu_board_id:
        selectedEducationLevel &&
        !isForeignInstitute &&
        EducationLevelCodeWithBoard.includes(selectedEducationLevel?.code)
          ? yup
              .string()
              .required()
              .label(messages['education.board'] as string)
          : yup.string().nullable(),
      edu_group_id:
        selectedEducationLevel &&
        EducationLevelCodeWithGroup.includes(selectedEducationLevel?.code)
          ? yup
              .string()
              .required()
              .label(messages['education.group'] as string)
          : yup.string().nullable(),

      other_group:
        selectedGroup && selectedGroup.code == OtherGroup
          ? yup
              .string()
              .title('bn', true)
              .label(messages['education.others'] as string)
          : yup.string().nullable(),
      other_group_en: yup.string().nullable(),
      result: !isRunning
        ? yup
            .string()
            .required()
            .label(messages['education.result'] as string)
        : yup
            .string()
            .nullable()
            .label(messages['education.result'] as string),
      marks_in_percentage:
        selectedResult && ResultCodeDivisions.includes(selectedResult?.code)
          ? yup
              .number()
              .required()
              .max(100)
              .label(messages['education.marks'] as string)
          : yup.string().nullable(),
      cgpa_scale:
        selectedResult && selectedResult?.code == ResultCodeGrade
          ? yup
              .number()
              .required()
              .max(5)
              .label(messages['education.cgpa_scale'] as string)
          : yup.string().nullable(),
      cgpa:
        selectedResult && selectedResult?.code == ResultCodeGrade
          ? yup
              .number()
              .required()
              .max(5)
              .label(messages['education.cgpa'] as string)
          : yup.string().nullable(),
      year_of_passing:
        selectedResult && selectedResult?.code != ResultCodeAppeared
          ? yup
              .string()
              .required()
              .label(messages['education.passing_year'] as string)
          : yup.string().nullable(),
      expected_year_of_passing:
        selectedResult && selectedResult?.code == ResultCodeAppeared
          ? yup
              .string()
              .required()
              .label(messages['education.expected_passing_year'] as string)
          : yup.string().nullable(),
      achievements_en: yup
        .string()
        .title('en', false)
        .label(messages['education.achievements_en'] as string),
    });
  }, [
    messages,
    selectedEducationLevel,
    selectedResult,
    selectedExamDegree,
    isForeignInstitute,
    isRunning,
    checkedNUCheckbox,
  ]);

  const {
    control,
    register,
    reset,
    setValue,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting, submitCount},
  } = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemData) {
      reset({
        institute_name: itemData?.institute_name,
        institute_name_en: itemData?.institute_name_en,
        education_level_id: itemData?.education_level_id,
        exam_degree_id: itemData?.exam_degree_id,
        exam_degree_name: itemData?.exam_degree_name,
        exam_degree_name_en: itemData?.exam_degree_name_en,
        major_or_concentration: itemData?.major_or_concentration,
        major_or_concentration_en: itemData?.major_or_concentration_en,
        edu_board_id: itemData?.edu_board_id,
        edu_group_id: itemData?.edu_group_id,
        foreign_institute_country_id: itemData?.foreign_institute_country_id,
        result: itemData?.result?.id,
        marks_in_percentage: itemData?.marks_in_percentage,
        cgpa_scale: itemData?.cgpa_scale,
        cgpa: itemData?.cgpa,
        year_of_passing: itemData?.year_of_passing,
        expected_year_of_passing: itemData?.expected_year_of_passing,
        duration: itemData?.duration,
        achievements: itemData?.achievements,
        achievements_en: itemData?.achievements_en,
        other: itemData?.other,
        other_en: itemData?.other_en,
        other_group: itemData?.other_group,
        other_group_en: itemData?.other_group_en,
        // is_education_running: itemData?.is_education_running,
      });
      setEducationLevel(itemData?.education_level_id);
      setSelectedResult(itemData?.result);
      setIsForeignInstitute(itemData?.is_foreign_institute == 1);
      setIsRunning(itemData?.is_education_running);
      //   other data feed
      const selectedDegree = educationsData?.education_level_with_degrees
        .find((level: any) => level.id === itemData?.education_level_id)
        ?.exam_degrees.find(
          (degree: any) => degree.id === itemData?.exam_degree_id,
        );
      setSelectedExamDegree(selectedDegree);
    } else {
      reset(initialValues);
    }
  }, [itemData, educationsData]);

  const handleRunningChange = (event: any) => {
    setIsRunning(event.target.checked ? 1 : 0);
    // setSelectedResult((prev: any) => (event.target.checked ? null : {...prev}));
    setSelectedResult(null);
    setValue('result', null);
  };
  const setEducationLevel = (eduLevelId: number | undefined) => {
    if (eduLevelId) {
      const educationLevel =
        educationsData?.education_level_with_degrees.filter(
          (educationLevel: any) => educationLevel.id == eduLevelId,
        );

      setSelectedEducationLevel(
        Array.isArray(educationLevel) ? educationLevel[0] : educationLevel,
      );
    }
  };

  const onEducationLevelChange = useCallback(
    (eduLevelId: number | undefined) => {
      if (eduLevelId) {
        const educationLevel =
          educationsData?.education_level_with_degrees.filter(
            (educationLevel: any) => educationLevel.id == eduLevelId,
          );

        setSelectedEducationLevel(
          Array.isArray(educationLevel) ? educationLevel[0] : educationLevel,
        );
        setCheckedNUCheckbox(false);
      } else {
        setSelectedEducationLevel(null);
      }
    },
    [educationsData],
  );

  const onExamDegreeChange = useCallback(
    (eId: number | undefined) => {
      if (eId) {
        const examLevel = selectedEducationLevel?.exam_degrees.filter(
          (exam: any) => exam.id == eId,
        );

        let eduLevelDegree = Array.isArray(examLevel)
          ? examLevel[0]
          : examLevel;
        setSelectedExamDegree(eduLevelDegree);
      } else {
        setSelectedExamDegree(null);
      }
    },
    [selectedEducationLevel],
  );

  const onGroupChange = useCallback(
    (eId: number | undefined) => {
      if (eId) {
        const groupObj = educationsData?.edu_groups?.filter(
          (item: any) => item.id == eId,
        );

        let eduLevelGroup = Array.isArray(groupObj) ? groupObj[0] : groupObj;
        setSelectedGroup(eduLevelGroup);
      } else {
        setSelectedGroup(null);
      }
    },
    [educationsData],
  );

  const onResultChange = useCallback(
    (resultId: number | undefined) => {
      if (resultId) {
        const result = educationsData?.result.filter(
          (res: any) => res.id == resultId,
        );
        setSelectedResult(Array.isArray(result) ? result[0] : result);
      } else {
        setSelectedResult(null);
      }
    },
    [educationsData],
  );

  useEffect(() => {
    const errorKeysArr = getAllKeysFromErrorObj(errors);
    if (submitCount && errorKeysArr.length > 0) {
      let field = document.getElementsByName(errorKeysArr?.[0]);
      if (field.length > 0) {
        field[0]?.focus();
      }
    }
  }, [errors, submitCount]);

  const onSubmit: SubmitHandler<YouthEducation> = async (
    data: YouthEducation,
  ) => {
    data.is_foreign_institute = 1;
    if (!isForeignInstitute) {
      data.is_foreign_institute = 0;
      delete data.foreign_institute_country_id;
    }
    if (selectedEducationLevel?.code == EducationLevelCodePHD) {
      delete data.exam_degree_id;
    }
    if (!EducationLevelCodeWithGroup.includes(selectedEducationLevel?.code)) {
      delete data.edu_group_id;
    }
    if (!EducationLevelCodeWithBoard.includes(selectedEducationLevel?.code)) {
      delete data.edu_board_id;
    }

    if (selectedResult?.code == ResultCodeAppeared) {
      delete data.year_of_passing;
    } else if (selectedResult?.code == ResultCodeGrade) {
      delete data.marks_in_percentage;
    } else if (ResultCodeDivisions.includes(selectedResult?.code)) {
      delete data.cgpa;
      delete data.cgpa_scale;
    }

    data.is_education_running = isRunning ? 1 : 0;
    data.is_national_university = checkedNUCheckbox ? 1 : 0;
    if (isRunning == 1) {
      delete data.result;
    }
    try {
      if (itemId) {
        await updateEducation(itemId, data);
        updateSuccessMessage('education.label');
      } else {
        console.log('create education', data);
        await createEducation(data);
        createSuccessMessage('education.label');
      }
      mutateEducation();
      onEducationEditPageClose();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  console.log('education error', errors, isRunning);

  return (
    <Zoom in={true}>
      <Box>
        <CustomHookForm
          title={messages['education.label']}
          handleSubmit={handleSubmit(onSubmit)}
          actions={
            <React.Fragment>
              <CancelButton
                onClick={onEducationEditPageClose}
                isLoading={isLoading}
              />
              <SubmitButton isSubmitting={isSubmitting} isLoading={isLoading} />
            </React.Fragment>
          }
          onClose={onEducationEditPageClose}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomCheckbox
                id='is_foreign_institute'
                label={messages['education.is_foreign_institute']}
                register={register}
                errorInstance={errors}
                checked={isForeignInstitute}
                onChange={() => {
                  setIsForeignInstitute((prev) => !prev);
                }}
                isLoading={false}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFilterableFormSelect
                required
                id='education_level_id'
                label={messages['education.education_level']}
                isLoading={isLoadingEducationsData}
                control={control}
                options={educationsData?.education_level_with_degrees}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
                onChange={onEducationLevelChange}
              />
            </Grid>

            {selectedEducationLevel &&
              selectedEducationLevel?.code != EducationLevelCodePHD && (
                <Grid item xs={12} md={6}>
                  <CustomFilterableFormSelect
                    required
                    id='exam_degree_id'
                    label={messages['education.education_exam_degree']}
                    isLoading={isLoadingEducationsData}
                    control={control}
                    options={selectedEducationLevel?.exam_degrees}
                    optionValueProp={'id'}
                    optionTitleProp={['title']}
                    errorInstance={errors}
                    onChange={onExamDegreeChange}
                  />
                </Grid>
              )}

            {selectedEducationLevel &&
              selectedEducationLevel?.code == EducationLevelCodePHD && (
                <React.Fragment>
                  <Grid item xs={12} md={6}>
                    <CustomTextInput
                      id='exam_degree_name'
                      label={
                        messages['education.education_exam_degree_name_bn']
                      }
                      control={control}
                      errorInstance={errors}
                      isLoading={isLoading}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CustomTextInput
                      id='exam_degree_name_en'
                      label={
                        messages['education.education_exam_degree_name_en']
                      }
                      control={control}
                      errorInstance={errors}
                      isLoading={isLoading}
                    />
                  </Grid>
                </React.Fragment>
              )}
            {selectedExamDegree && selectedExamDegree?.code == OtherExamDegree && (
              <>
                <Grid item xs={12} md={6}>
                  <CustomTextInput
                    required
                    id='other'
                    label={messages['education.others']}
                    control={control}
                    errorInstance={errors}
                    isLoading={false}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomTextInput
                    id='other_en'
                    label={messages['education.others_en']}
                    control={control}
                    errorInstance={errors}
                    isLoading={false}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required={
                  selectedEducationLevel &&
                  EducationLevelForMajorGroup.includes(
                    selectedEducationLevel?.code,
                  )
                }
                id='major_or_concentration'
                label={messages['education.major_group_name_bn']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='major_or_concentration_en'
                label={messages['education.major_group_name_en']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>

            {selectedEducationLevel &&
              !isForeignInstitute &&
              EducationLevelCodeWithBoard.includes(
                selectedEducationLevel?.code,
              ) && (
                <Grid item xs={12} md={6}>
                  <CustomFilterableFormSelect
                    required
                    id='edu_board_id'
                    label={messages['education.board']}
                    isLoading={isLoadingEducationsData}
                    control={control}
                    options={educationsData?.edu_boards}
                    optionValueProp={'id'}
                    optionTitleProp={['title']}
                    errorInstance={errors}
                  />
                </Grid>
              )}
            {selectedEducationLevel &&
              EducationLevelCodeWithGroup.includes(
                selectedEducationLevel?.code,
              ) && (
                <Grid item xs={12} md={6}>
                  <CustomFilterableFormSelect
                    required
                    id='edu_group_id'
                    label={messages['education.group']}
                    isLoading={isLoadingEducationsData}
                    control={control}
                    options={educationsData?.edu_groups}
                    optionValueProp={'id'}
                    optionTitleProp={['title']}
                    errorInstance={errors}
                    onChange={onGroupChange}
                  />
                </Grid>
              )}

            {selectedGroup && selectedGroup?.code == OtherGroup && (
              <>
                <Grid item xs={12} md={6}>
                  <CustomTextInput
                    required
                    id='other_group'
                    label={messages['education.others']}
                    control={control}
                    errorInstance={errors}
                    isLoading={false}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomTextInput
                    id='other_group_en'
                    label={messages['education.others_en']}
                    control={control}
                    errorInstance={errors}
                    isLoading={false}
                  />
                </Grid>
              </>
            )}

            {isForeignInstitute && (
              <Grid item xs={12} md={6}>
                <CustomFilterableFormSelect
                  required
                  id='foreign_institute_country_id'
                  label={messages['education.foreign_institute_country']}
                  isLoading={isLoadingCountries}
                  control={control}
                  options={countries}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                />
              </Grid>
            )}

            {selectedEducationLevel &&
              !isForeignInstitute &&
              EducationLevelForMajorGroup.includes(
                selectedEducationLevel?.code,
              ) && (
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={6}>
                      <CustomCheckbox
                        id='is_national_university'
                        label={messages['learner.is_national_university']}
                        register={register}
                        errorInstance={errors}
                        checked={checkedNUCheckbox}
                        onChange={() => {
                          setCheckedNUCheckbox((prev: any) => !prev);
                        }}
                        isLoading={false}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
            {checkedNUCheckbox ? (
              <Grid item xs={6}>
                <CustomFilterableFormSelect
                  required
                  id='nu_institute_name'
                  label={messages['common.institute_name']}
                  isLoading={isLoadingNuInstitutesData}
                  control={control}
                  options={nuInstitutesData}
                  optionValueProp={'college_name'}
                  optionTitleProp={['college_name']}
                  errorInstance={errors}
                />
              </Grid>
            ) : (
              <>
                <Grid item xs={12} md={6}>
                  <CustomTextInput
                    required
                    id='institute_name'
                    label={messages['common.edu_institute_name_bn']}
                    control={control}
                    errorInstance={errors}
                    isLoading={isLoading}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomTextInput
                    required={isForeignInstitute}
                    id='institute_name_en'
                    label={messages['common.edu_institute_name_en']}
                    control={control}
                    errorInstance={errors}
                    isLoading={isLoading}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} md={6}>
              {!isRunning ? (
                <CustomFilterableFormSelect
                  required
                  id='result'
                  label={messages['education.result']}
                  isLoading={isLoadingCountries}
                  control={control}
                  options={educationsData?.result}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                  onChange={onResultChange}
                />
              ) : (
                ''
              )}
              <FormControlLabel
                control={
                  <Switch
                    onChange={handleRunningChange}
                    checked={isRunning == 1}
                  />
                }
                label={messages['common.running'] as string}
              />
            </Grid>

            {selectedResult &&
              ResultCodeDivisions.includes(selectedResult?.code) && (
                <Grid item xs={12} md={6}>
                  <CustomTextInput
                    required
                    id='marks_in_percentage'
                    type={'number'}
                    label={messages['education.marks']}
                    control={control}
                    errorInstance={errors}
                    isLoading={isLoading}
                  />
                </Grid>
              )}

            {selectedResult && selectedResult?.code == ResultCodeGrade && (
              <Grid item xs={12} md={6}>
                <Grid container spacing={3}>
                  <Grid item xs={6} md={6}>
                    <CustomTextInput
                      required
                      id='cgpa_scale'
                      type={'number'}
                      inputProps={{
                        step: 0.01,
                      }}
                      label={messages['education.cgpa_scale']}
                      control={control}
                      errorInstance={errors}
                      isLoading={isLoading}
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <CustomTextInput
                      required
                      id='cgpa'
                      type={'number'}
                      inputProps={{
                        step: 0.01,
                      }}
                      label={messages['education.cgpa']}
                      control={control}
                      errorInstance={errors}
                      isLoading={isLoading}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}

            {selectedResult && selectedResult?.code != ResultCodeAppeared && (
              <Grid item xs={12} md={6}>
                <CustomFilterableFormSelect
                  required
                  id='year_of_passing'
                  label={messages['education.passing_year']}
                  isLoading={isLoading}
                  control={control}
                  options={passingYears()}
                  optionValueProp={'year'}
                  optionTitleProp={['year']}
                  errorInstance={errors}
                />
              </Grid>
            )}

            {selectedResult && selectedResult?.code == ResultCodeAppeared && (
              <Grid item xs={12} md={6}>
                <CustomFilterableFormSelect
                  required
                  id='expected_year_of_passing'
                  label={messages['education.expected_passing_year']}
                  isLoading={isLoading}
                  control={control}
                  options={passingYears()}
                  optionValueProp={'year'}
                  optionTitleProp={['year']}
                  errorInstance={errors}
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='duration'
                label={messages['education.duration']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='achievements'
                label={messages['education.achievements_bn']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='achievements_en'
                label={messages['education.achievements_en']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FileUploadComponent
                id='certificate_file_path'
                defaultFileUrl={itemData?.certificate_file_path}
                acceptedFileTypes={['image/*', 'application/pdf']}
                errorInstance={errors}
                setValue={setValue}
                register={register}
                label={messages['common.certificate']}
                required={false}
              />
            </Grid>
          </Grid>
          {isSubmitting && (
            <div
              role={'alert'}
              aria-live='assertive'
              style={{position: 'absolute', top: '-9999px'}}>
              {messages['common.submitting'] as string}
            </div>
          )}
        </CustomHookForm>
      </Box>
    </Zoom>
  );
};

export default EducationAddEditPage;
