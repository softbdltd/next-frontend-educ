import React, {useCallback, useEffect, useState} from 'react';
import {FormControlLabel, Grid, Switch} from '@mui/material';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import {useFetchCountries} from '../../../services/locationManagement/hooks';
import {
  DIPLOMABOARD,
  EducationLevel,
  EducationLevelCodePHD,
  EducationLevelCodeWithBoard,
  EducationLevelCodeWithGroup,
  EducationLevelForMajorGroup,
  OtherExamDegree,
  OtherGroup,
  ResultCodeDivisions,
  ResultCodeDoNotMention,
  ResultCodeGrade,
} from '../profile/utilities/EducationEnums';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {useIntl} from 'react-intl';
import {
  useFetchEducationExamsBoardsEduGroupsAndSubjects,
  useFetchNUInstitutes,
} from '../../../services/learnerManagement/hooks';
import CustomCheckbox from '../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import {passingYears} from '../../../@core/utilities/helpers';

interface EducationComponentProps {
  label: string;
  errors: any;
  control: any;
  register: any;
  onEducationLevelChange: any;
  onExamDegreeLevelChange: any;
  onEduRunningChange: any;
  onEduGroupChange: any;
  setSelectedResult: any;
  selectedResult: any;
  setValue: any;
  onEduIsForeignChange?: any;
  onEduNUChange?: any;
}

const EducationComponent = ({
  label,
  control,
  register,
  errors,
  setSelectedResult,
  selectedResult,
  onEducationLevelChange: onEducationLevelChangeCallback,
  onExamDegreeLevelChange: onExamDegreeLevelChangeCallback,
  onEduRunningChange: onEduRunningChangeCallback,
  onEduGroupChange: onEduGroupChangeCallback,
  onEduIsForeignChange: onEduIsForeignChangeCallback,
  onEduNUChange: onEduNUChangeCallback,
  setValue,
}: EducationComponentProps) => {
  const {messages} = useIntl();

  const {data: educationsData, isLoading: isLoadingEducationsData} =
    useFetchEducationExamsBoardsEduGroupsAndSubjects();

  const {data: nuInstitutesData, isLoading: isLoadingNuInstitutesData} =
    useFetchNUInstitutes();
  const [isForeignInstitute, setIsForeignInstitute] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [isRunning, setIsRunning] = useState<number>(0);

  const [selectedExamDegree, setSelectedExamDegree] = useState<any>(null);
  const [updateBoardList, setUpdateBoardList] = useState<any>([]);

  const [selectedEducationLevel, setSelectedEducationLevel] =
    useState<any>(null);

  const [checkedNUCheckbox, setCheckedNUCheckbox] = useState<boolean>(false);
  const [countryFilters] = useState<any>({});
  const {data: countries, isLoading: isLoadingCountries} =
    useFetchCountries(countryFilters);

  useEffect(() => {
    if (selectedEducationLevel) {
      if (selectedEducationLevel?.code === EducationLevel.DIPLOMA) {
        setUpdateBoardList(
          educationsData?.edu_boards?.filter(
            (board: any) => board?.code === DIPLOMABOARD,
          ),
        );
      } else {
        setUpdateBoardList(
          educationsData?.edu_boards?.filter(
            (board: any) => board?.code !== DIPLOMABOARD,
          ),
        );
      }
    }
  }, [selectedEducationLevel, educationsData]);

  const onGroupChange = useCallback(
    (eId: number | undefined) => {
      if (eId) {
        const groupObj = educationsData?.edu_groups?.filter(
          (item: any) => item.id == eId,
        );

        let eduLevelGroup = Array.isArray(groupObj) ? groupObj[0] : groupObj;
        setSelectedGroup(eduLevelGroup);
        onEduGroupChangeCallback(eduLevelGroup);
      } else {
        setSelectedGroup(null);
        onEduGroupChangeCallback(null);
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

        setValue('highest_education_info[marks_in_percentage]', null);
        setValue('highest_education_info[cgpa_scale]', null);
        setValue('highest_education_info[cgpa]', null);
        setValue('highest_education_info[year_of_passing]', '');
      } else {
        setSelectedResult(null);
      }
    },
    [educationsData],
  );

  const onEducationLevelChange = useCallback(
    (eduLevelId: number | undefined) => {
      if (eduLevelId) {
        const educationLevel =
          educationsData?.education_level_with_degrees.filter(
            (educationLevel: any) => educationLevel.id == eduLevelId,
          );

        let eduLevel = Array.isArray(educationLevel)
          ? educationLevel[0]
          : educationLevel;

        setSelectedEducationLevel(eduLevel);
        onEducationLevelChangeCallback(eduLevel);
        setCheckedNUCheckbox(false);
      } else {
        setSelectedEducationLevel(null);
        onEducationLevelChangeCallback(null);
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

        let eduLevel = Array.isArray(examLevel) ? examLevel[0] : examLevel;
        setSelectedExamDegree(eduLevel);
        onExamDegreeLevelChangeCallback(eduLevel);
      } else {
        setSelectedExamDegree(null);
        onExamDegreeLevelChangeCallback(null);
      }
    },
    [selectedEducationLevel],
  );
  const handleRunningChange = (event: any) => {
    setIsRunning(event.target.checked ? 1 : 0);
    onEduRunningChangeCallback(event.target.checked ? 1 : 0);
    setSelectedResult(null);
    setValue('result', null);
  };
  return (
    <Grid item xs={12} alignItems={'center'}>
      <fieldset style={{padding: '10px', border: '1.5px solid #b8b1b1'}}>
        <legend>{label}</legend>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomCheckbox
              id='highest_education_info[is_foreign_institute]'
              label={messages['education.is_foreign_institute']}
              register={register}
              errorInstance={errors}
              checked={isForeignInstitute}
              onChange={() => {
                setIsForeignInstitute((prev) => !prev);
                onEduIsForeignChangeCallback(!isForeignInstitute);
                onEduNUChangeCallback(false);
                setCheckedNUCheckbox(false);
              }}
              isLoading={false}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomFilterableFormSelect
              required
              id='highest_education_info[education_level_id]'
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
            selectedEducationLevel.code != EducationLevelCodePHD && (
              <Grid item xs={12} md={6}>
                <CustomFilterableFormSelect
                  required
                  id='highest_education_info[exam_degree_id]'
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
            selectedEducationLevel.code == EducationLevelCodePHD && (
              <React.Fragment>
                <Grid item xs={12} md={6}>
                  <CustomTextInput
                    id='highest_education_info[exam_degree_name]'
                    label={messages['education.education_exam_degree_name_bn']}
                    control={control}
                    errorInstance={errors}
                    isLoading={false}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomTextInput
                    id='highest_education_info[exam_degree_name_en]'
                    label={messages['education.education_exam_degree_name_en']}
                    control={control}
                    errorInstance={errors}
                    isLoading={false}
                  />
                </Grid>
              </React.Fragment>
            )}

          {selectedExamDegree && selectedExamDegree.code == OtherExamDegree && (
            <>
              <Grid item xs={12} md={6}>
                <CustomTextInput
                  required
                  id='highest_education_info[other]'
                  label={messages['education.others']}
                  control={control}
                  errorInstance={errors}
                  isLoading={false}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomTextInput
                  id='highest_education_info[other_en]'
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
                  selectedEducationLevel.code,
                )
              }
              id='highest_education_info[major_or_concentration]'
              label={messages['education.major_group_name_bn']}
              control={control}
              errorInstance={errors}
              isLoading={false}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomTextInput
              id='highest_education_info[major_or_concentration_en]'
              label={messages['education.major_group_name_en']}
              control={control}
              errorInstance={errors}
              isLoading={false}
            />
          </Grid>

          {selectedEducationLevel &&
            !isForeignInstitute &&
            EducationLevelCodeWithBoard.includes(
              selectedEducationLevel.code,
            ) && (
              <Grid item xs={12} md={6}>
                <CustomFilterableFormSelect
                  required
                  id='highest_education_info[edu_board_id]'
                  label={messages['education.board']}
                  isLoading={isLoadingEducationsData}
                  control={control}
                  options={updateBoardList}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                />
              </Grid>
            )}

          {/*{selectedEducationLevel &&*/}
          {/*  selectedEducationLevel.code == EducationLevel.DIPLOMA && (*/}
          {/*    <Grid item xs={12} md={6}>*/}
          {/*      <CustomFilterableFormSelect*/}
          {/*        required*/}
          {/*        id='highest_education_info[edu_board_id]'*/}
          {/*        label={messages['education.board']}*/}
          {/*        isLoading={isLoadingEducationsData}*/}
          {/*        control={control}*/}
          {/*        options={updateBoardList}*/}
          {/*        optionValueProp={'id'}*/}
          {/*        optionTitleProp={['title']}*/}
          {/*        errorInstance={errors}*/}
          {/*        // defaultValue={selectedBoard?.id}*/}
          {/*        // isDisabled={true}*/}
          {/*      />*/}
          {/*    </Grid>*/}
          {/*  )}*/}
          {selectedEducationLevel &&
            EducationLevelCodeWithGroup.includes(
              selectedEducationLevel.code,
            ) && (
              <Grid item xs={12} md={6}>
                <CustomFilterableFormSelect
                  required
                  id='highest_education_info[edu_group_id]'
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
                  id='highest_education_info[other_group]'
                  label={messages['education.others']}
                  control={control}
                  errorInstance={errors}
                  isLoading={false}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <CustomTextInput
                  id='highest_education_info[other_group_en]'
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
                id='highest_education_info[foreign_institute_country_id]'
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
                      id='highest_education_info[is_national_university]'
                      label={messages['learner.is_national_university']}
                      register={register}
                      errorInstance={errors}
                      checked={checkedNUCheckbox}
                      onChange={() => {
                        setCheckedNUCheckbox((prev) => !prev);
                        onEduNUChangeCallback(!checkedNUCheckbox);
                        onEduIsForeignChangeCallback(false);
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
                id='highest_education_info[nu_institute_name]'
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
                  id='highest_education_info[institute_name]'
                  label={messages['common.edu_institute_name_bn']}
                  control={control}
                  errorInstance={errors}
                  isLoading={false}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextInput
                  required={isForeignInstitute}
                  id='highest_education_info[institute_name_en]'
                  label={messages['common.edu_institute_name_en']}
                  control={control}
                  errorInstance={errors}
                  isLoading={false}
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} md={6}>
            {!isRunning ? (
              <CustomFilterableFormSelect
                required
                id='highest_education_info[result]'
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

          {selectedResult && ResultCodeDivisions.includes(selectedResult.code) && (
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='highest_education_info[marks_in_percentage]'
                type={'number'}
                label={messages['education.marks']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
          )}

          {selectedResult && selectedResult.code == ResultCodeGrade && (
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={6} md={6}>
                  <CustomTextInput
                    required
                    id='highest_education_info[cgpa_scale]'
                    type={'number'}
                    inputProps={{
                      step: 0.01,
                    }}
                    label={messages['education.cgpa_scale']}
                    control={control}
                    errorInstance={errors}
                    isLoading={false}
                  />
                </Grid>
                <Grid item xs={6} md={6}>
                  <CustomTextInput
                    required
                    id='highest_education_info[cgpa]'
                    type={'number'}
                    inputProps={{
                      step: 0.01,
                    }}
                    label={messages['education.cgpa']}
                    control={control}
                    errorInstance={errors}
                    isLoading={false}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}

          {selectedResult && selectedResult.code != ResultCodeDoNotMention && (
            <Grid item xs={12} md={6}>
              <CustomFilterableFormSelect
                required
                id='highest_education_info[year_of_passing]'
                label={messages['education.passing_year']}
                isLoading={false}
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
              id='highest_education_info[duration]'
              label={messages['education.duration']}
              control={control}
              errorInstance={errors}
              isLoading={isLoadingEducationsData}
            />
          </Grid>
        </Grid>
      </fieldset>
    </Grid>
  );
};

export default EducationComponent;
