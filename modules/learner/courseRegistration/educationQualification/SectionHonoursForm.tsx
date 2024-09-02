import {Box, Checkbox, FormControlLabel, Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import React, {FC} from 'react';
import {useIntl} from 'react-intl';
import CustomCheckbox from '../../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import CustomFilterableFormSelect from '../../../../@core/elements/input/CustomFilterableFormSelect';
import CustomTextInput from '../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {FormKeyConfigType} from '../../../../@core/utilities/CourseConfigKeys';
import {passingYears} from '../../../../@core/utilities/helpers';
import FileUploadComponent from '../../../filepond/FileUploadComponent';
import {
  OtherExamDegree,
  ResultCodeAppeared,
  ResultCodeDivisions,
  ResultCodeGrade,
} from '../../profile/utilities/EducationEnums';
import useEducationFormValue from './useEducationFormValue';

interface SectionHonoursFormProps {
  errors: any;
  control: any;
  register: any;
  getValues: any;
  setValue: any;
  examDegrees: Array<any>;
  countries: Array<any>;
  result: Array<any>;
  changeFormConfig: (value: FormKeyConfigType) => void;
  formConfig: FormKeyConfigType;
  isOnlyVisibleField: boolean;
}

const SectionHonoursForm: FC<SectionHonoursFormProps> = ({
  errors,
  register,
  control,
  getValues,
  setValue,
  examDegrees,
  countries,
  result,
  changeFormConfig,
  formConfig,
  isOnlyVisibleField,
}) => {
  const {messages} = useIntl();
  const {
    isForeignInstitute,
    selectedResult,
    onCheckboxValueChange,
    onExamDegreeChange,
    selectedExamDegree,
    checked,
    defaultCertificateImagePath,
    setIsForeignInstitute,
    onResultChange,
  } = useEducationFormValue({
    getValues,
    result,
    examDegrees,
    formConfig,
    changeFormConfig,
    edu_level: 'honours_info',
    edu_level_config_name: 'honors_passing_info',
  });

  return (
    <Box sx={{boxShadow: '0px 0px 5px 5px #e9e9e9', padding: '15px'}}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant={'h6'} tabIndex={0}>
                {messages['course_registration.education_honours_title']}
              </Typography>
            </Grid>
            {isOnlyVisibleField && !formConfig.honors_passing_info.dataExist && (
              <Grid>
                <FormControlLabel
                  sx={{
                    marginLeft: '0',
                  }}
                  tabIndex={0}
                  control={
                    <Checkbox
                      color='primary'
                      checked={checked}
                      onChange={onCheckboxValueChange}
                      style={{padding: '2px', marginRight: 5}}
                    />
                  }
                  label={
                    messages[
                      'course_registration.eduction_label_text'
                    ] as string
                  }
                />
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomFilterableFormSelect
            required={
              formConfig.honors_passing_info.required ||
              formConfig.honors_passing_info.dataExist
            }
            id='honours_info[exam_degree_id]'
            label={messages['education.education_exam_degree']}
            isLoading={false}
            control={control}
            options={examDegrees}
            optionValueProp={'id'}
            optionTitleProp={['title']}
            errorInstance={errors}
            onChange={onExamDegreeChange}
            isDisabled={
              !(
                formConfig.honors_passing_info.required ||
                formConfig.honors_passing_info.dataExist
              )
            }
          />
        </Grid>
        {selectedExamDegree && selectedExamDegree?.code == OtherExamDegree && (
          <>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required={
                  formConfig.honors_passing_info.required ||
                  formConfig.honors_passing_info.dataExist
                }
                id='honours_info[other]'
                label={messages['education.others']}
                control={control}
                errorInstance={errors}
                isLoading={false}
                isDisabled={
                  !(
                    formConfig.honors_passing_info.required ||
                    formConfig.honors_passing_info.dataExist
                  )
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='honours_info[other_en]'
                label={messages['education.others_en']}
                control={control}
                errorInstance={errors}
                isLoading={false}
                isDisabled={
                  !(
                    formConfig.honors_passing_info.required ||
                    formConfig.honors_passing_info.dataExist
                  )
                }
              />
            </Grid>
          </>
        )}
        <Grid item xs={12} md={6}>
          <CustomTextInput
            required={
              formConfig.honors_passing_info.required ||
              formConfig.honors_passing_info.dataExist
            }
            id='honours_info[major_or_concentration]'
            label={messages['education.major_group_name_bn']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            isDisabled={
              !(
                formConfig.honors_passing_info.required ||
                formConfig.honors_passing_info.dataExist
              )
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='honours_info[major_or_concentration_en]'
            label={messages['education.major_group_name_en']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.honors_passing_info.required ||
                formConfig.honors_passing_info.dataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            required={
              formConfig.honors_passing_info.required ||
              formConfig.honors_passing_info.dataExist
            }
            id='honours_info[institute_name]'
            label={messages['common.edu_institute_name_bn']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.honors_passing_info.required ||
                formConfig.honors_passing_info.dataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='honours_info[institute_name_en]'
            label={messages['common.edu_institute_name_en']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.honors_passing_info.required ||
                formConfig.honors_passing_info.dataExist
              )
            }
          />
        </Grid>

        <Grid item xs={12}>
          <CustomCheckbox
            id='honours_info[is_foreign_institute]'
            label={messages['education.is_foreign_institute']}
            register={register}
            errorInstance={errors}
            checked={isForeignInstitute}
            onChange={() => {
              setIsForeignInstitute((prev: any) => !prev);
            }}
            isLoading={false}
            isDisabled={
              !(
                formConfig.honors_passing_info.required ||
                formConfig.honors_passing_info.dataExist
              )
            }
          />
        </Grid>

        {Boolean(isForeignInstitute) && (
          <Grid item xs={12} md={6}>
            <CustomFilterableFormSelect
              required={
                formConfig.honors_passing_info.required ||
                formConfig.honors_passing_info.dataExist
              }
              id='honours_info[foreign_institute_country_id]'
              label={messages['education.foreign_institute_country']}
              isLoading={false}
              control={control}
              options={countries}
              optionValueProp={'id'}
              optionTitleProp={['title']}
              errorInstance={errors}
              isDisabled={
                !(
                  formConfig.honors_passing_info.required ||
                  formConfig.honors_passing_info.dataExist
                )
              }
            />
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <CustomFilterableFormSelect
            required={
              formConfig.honors_passing_info.required ||
              formConfig.honors_passing_info.dataExist
            }
            id='honours_info[result]'
            label={messages['education.result']}
            isLoading={false}
            control={control}
            options={result}
            optionValueProp={'id'}
            optionTitleProp={['title']}
            errorInstance={errors}
            onChange={onResultChange}
            isDisabled={
              !(
                formConfig.honors_passing_info.required ||
                formConfig.honors_passing_info.dataExist
              )
            }
          />
        </Grid>

        {selectedResult && ResultCodeDivisions.includes(selectedResult.code) && (
          <Grid item xs={12} md={6}>
            <CustomTextInput
              required={
                formConfig.honors_passing_info.required ||
                formConfig.honors_passing_info.dataExist
              }
              id='honours_info[marks_in_percentage]'
              type={'number'}
              label={messages['education.marks']}
              control={control}
              errorInstance={errors}
              isLoading={false}
              disabled={
                !(
                  formConfig.honors_passing_info.required ||
                  formConfig.honors_passing_info.dataExist
                )
              }
            />
          </Grid>
        )}

        {selectedResult && selectedResult.code == ResultCodeGrade && (
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              <Grid item xs={6} md={6}>
                <CustomTextInput
                  required={
                    formConfig.honors_passing_info.required ||
                    formConfig.honors_passing_info.dataExist
                  }
                  id='honours_info[cgpa_scale]'
                  type={'number'}
                  label={messages['education.cgpa_scale']}
                  control={control}
                  errorInstance={errors}
                  isLoading={false}
                  disabled={
                    !(
                      formConfig.honors_passing_info.required ||
                      formConfig.honors_passing_info.dataExist
                    )
                  }
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <CustomTextInput
                  required={
                    formConfig.honors_passing_info.required ||
                    formConfig.honors_passing_info.dataExist
                  }
                  id='honours_info[cgpa]'
                  type={'number'}
                  inputProps={{
                    step: 0.01,
                  }}
                  label={messages['education.cgpa']}
                  control={control}
                  errorInstance={errors}
                  isLoading={false}
                  disabled={
                    !(
                      formConfig.honors_passing_info.required ||
                      formConfig.honors_passing_info.dataExist
                    )
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        )}

        {selectedResult && selectedResult.code != ResultCodeAppeared && (
          <Grid item xs={12} md={6}>
            <CustomFilterableFormSelect
              required={
                formConfig.honors_passing_info.required ||
                formConfig.honors_passing_info.dataExist
              }
              id='honours_info[year_of_passing]'
              label={messages['education.passing_year']}
              isLoading={false}
              control={control}
              options={passingYears()}
              optionValueProp={'year'}
              optionTitleProp={['year']}
              errorInstance={errors}
              isDisabled={
                !(
                  formConfig.honors_passing_info.required ||
                  formConfig.honors_passing_info.dataExist
                )
              }
            />
          </Grid>
        )}

        {selectedResult && selectedResult.code == ResultCodeAppeared && (
          <Grid item xs={12} md={6}>
            <CustomFilterableFormSelect
              required={
                formConfig.honors_passing_info.required ||
                formConfig.honors_passing_info.dataExist
              }
              id='honours_info[expected_year_of_passing]'
              label={messages['education.expected_passing_year']}
              isLoading={false}
              control={control}
              options={passingYears()}
              optionValueProp={'year'}
              optionTitleProp={['year']}
              errorInstance={errors}
              isDisabled={
                !(
                  formConfig.honors_passing_info.required ||
                  formConfig.honors_passing_info.dataExist
                )
              }
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <FileUploadComponent
            id='honours_info[certificate_file_path]'
            defaultFileUrl={defaultCertificateImagePath}
            acceptedFileTypes={['image/*', 'application/pdf']}
            errorInstance={errors}
            setValue={setValue}
            register={register}
            label={messages['common.certificate']}
            required={false}
            disabled={
              !(
                formConfig.honors_passing_info.required ||
                formConfig.honors_passing_info.dataExist
              )
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SectionHonoursForm;
