import React, {FC, useCallback, useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';
import {Box, Typography, FormControlLabel, Checkbox} from '@mui/material';
import {useIntl} from 'react-intl';
import CustomTextInput from '../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import CustomCheckbox from '../../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import {
  ResultCodeAppeared,
  ResultCodeDivisions,
  ResultCodeGrade,
} from '../../profile/utilities/EducationEnums';
import {passingYears} from '../../../../@core/utilities/helpers';
import CustomFilterableFormSelect from '../../../../@core/elements/input/CustomFilterableFormSelect';
import {FormKeyConfigType} from '../../../../@core/utilities/CourseConfigKeys';
import {cloneDeep} from 'lodash';
import FileUploadComponent from '../../../filepond/FileUploadComponent';
interface SectionPhdFormProps {
  errors: any;
  control: any;
  register: any;
  getValues: any;
  setValue: any;
  countries: Array<any>;
  result: Array<any>;
  changeFormConfig: (value: FormKeyConfigType) => void;
  formConfig: FormKeyConfigType;
  isOnlyVisibleField: boolean;
}

const SectionPhdForm: FC<SectionPhdFormProps> = ({
  errors,
  register,
  control,
  getValues,
  setValue,
  countries,
  result,
  changeFormConfig,
  formConfig,
  isOnlyVisibleField,
}) => {
  const {messages} = useIntl();
  const [isForeignInstitute, setIsForeignInstitute] = useState<boolean>(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [defaultCertificateImagePath, setDefaultCertificateImagePath] =
    useState<string | null>(null);

  useEffect(() => {
    if (getValues) {
      const phdInfo: any = getValues('phd_info');
      const isForeignInstituteValue: any = phdInfo?.is_foreign_institute;

      setIsForeignInstitute(isForeignInstituteValue);
      if (phdInfo.result) {
        onResultChange(phdInfo.result);
      }

      const certificatePath = getValues('phd_info.certificate_file_path]');
      if (certificatePath) setDefaultCertificateImagePath(certificatePath);
      else setDefaultCertificateImagePath(null);
    }
  }, [getValues, result]);

  const onResultChange = useCallback(
    (resultId: number | undefined) => {
      if (resultId && result) {
        const filteredResult = result.filter((res: any) => res.id == resultId);
        setSelectedResult(
          Array.isArray(filteredResult) ? filteredResult[0] : filteredResult,
        );
      } else {
        setSelectedResult(null);
      }
    },
    [result],
  );
  const onCheckboxValueChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(evt.target.checked ?? false);
      const clonedData = cloneDeep(formConfig);
      if (evt.target.checked) {
        clonedData.phd_passing_info.required = true;
      } else {
        clonedData.phd_passing_info.required = false;
      }
      changeFormConfig(clonedData);
    },
    [formConfig],
  );
  return (
    <Box sx={{boxShadow: '0px 0px 5px 5px #e9e9e9', padding: '15px'}}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant={'h6'} tabIndex={0}>
                {messages['course_registration.education_phd_title']}
              </Typography>
            </Grid>
            {isOnlyVisibleField && !formConfig.phd_passing_info.dataExist && (
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
          <CustomTextInput
            required={
              formConfig.phd_passing_info.required ||
              formConfig.phd_passing_info.dataExist
            }
            id='phd_info[exam_degree_name]'
            label={messages['education.education_exam_degree_name_bn']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.phd_passing_info.required ||
                formConfig.phd_passing_info.dataExist
              )
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='phd_info[exam_degree_name_en]'
            label={messages['education.education_exam_degree_name_en']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.phd_passing_info.required ||
                formConfig.phd_passing_info.dataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            required={
              formConfig.phd_passing_info.required ||
              formConfig.phd_passing_info.dataExist
            }
            id='phd_info[major_or_concentration]'
            label={messages['education.major_group_name_bn']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.phd_passing_info.required ||
                formConfig.phd_passing_info.dataExist
              )
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='phd_info[major_or_concentration_en]'
            label={messages['education.major_group_name_en']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.phd_passing_info.required ||
                formConfig.phd_passing_info.dataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            required={
              formConfig.phd_passing_info.required ||
              formConfig.phd_passing_info.dataExist
            }
            id='phd_info[institute_name]'
            label={messages['common.edu_institute_name_bn']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.phd_passing_info.required ||
                formConfig.phd_passing_info.dataExist
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='phd_info[institute_name_en]'
            label={messages['common.edu_institute_name_en']}
            control={control}
            errorInstance={errors}
            isLoading={false}
            disabled={
              !(
                formConfig.phd_passing_info.required ||
                formConfig.phd_passing_info.dataExist
              )
            }
          />
        </Grid>

        <Grid item xs={12}>
          <CustomCheckbox
            id='phd_info[is_foreign_institute]'
            label={messages['education.is_foreign_institute']}
            register={register}
            errorInstance={errors}
            checked={isForeignInstitute}
            onChange={() => {
              setIsForeignInstitute((prev) => !prev);
            }}
            isLoading={false}
            isDisabled={
              !(
                formConfig.phd_passing_info.required ||
                formConfig.phd_passing_info.dataExist
              )
            }
          />
        </Grid>

        {Boolean(isForeignInstitute) && (
          <Grid item xs={12} md={6}>
            <CustomFilterableFormSelect
              required={
                formConfig.phd_passing_info.required ||
                formConfig.phd_passing_info.dataExist
              }
              id='phd_info[foreign_institute_country_id]'
              label={messages['education.foreign_institute_country']}
              isLoading={false}
              control={control}
              options={countries}
              optionValueProp={'id'}
              optionTitleProp={['title']}
              errorInstance={errors}
              isDisabled={
                !(
                  formConfig.phd_passing_info.required ||
                  formConfig.phd_passing_info.dataExist
                )
              }
            />
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <CustomFilterableFormSelect
            required={
              formConfig.phd_passing_info.required ||
              formConfig.phd_passing_info.dataExist
            }
            id='phd_info[result]'
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
                formConfig.phd_passing_info.required ||
                formConfig.phd_passing_info.dataExist
              )
            }
          />
        </Grid>

        {selectedResult && ResultCodeDivisions.includes(selectedResult.code) && (
          <Grid item xs={12} md={6}>
            <CustomTextInput
              required={
                formConfig.phd_passing_info.required ||
                formConfig.phd_passing_info.dataExist
              }
              id='phd_info[marks_in_percentage]'
              type={'number'}
              label={messages['education.marks']}
              control={control}
              errorInstance={errors}
              isLoading={false}
              disabled={
                !(
                  formConfig.phd_passing_info.required ||
                  formConfig.phd_passing_info.dataExist
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
                  required={formConfig.phd_passing_info.required}
                  id='phd_info[cgpa_scale]'
                  type={'number'}
                  label={messages['education.cgpa_scale']}
                  control={control}
                  errorInstance={errors}
                  isLoading={false}
                  disabled={
                    !(
                      formConfig.phd_passing_info.required ||
                      formConfig.phd_passing_info.dataExist
                    )
                  }
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <CustomTextInput
                  required={formConfig.phd_passing_info.required}
                  id='phd_info[cgpa]'
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
                      formConfig.phd_passing_info.required ||
                      formConfig.phd_passing_info.dataExist
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
              required={formConfig.phd_passing_info.required}
              id='phd_info[year_of_passing]'
              label={messages['education.passing_year']}
              isLoading={false}
              control={control}
              options={passingYears()}
              optionValueProp={'year'}
              optionTitleProp={['year']}
              errorInstance={errors}
              isDisabled={
                !(
                  formConfig.phd_passing_info.required ||
                  formConfig.phd_passing_info.dataExist
                )
              }
            />
          </Grid>
        )}

        {selectedResult && selectedResult.code == ResultCodeAppeared && (
          <Grid item xs={12} md={6}>
            <CustomFilterableFormSelect
              required={formConfig.phd_passing_info.required}
              id='phd_info[expected_year_of_passing]'
              label={messages['education.expected_passing_year']}
              isLoading={false}
              control={control}
              options={passingYears()}
              optionValueProp={'year'}
              optionTitleProp={['year']}
              errorInstance={errors}
              isDisabled={
                !(
                  formConfig.phd_passing_info.required ||
                  formConfig.phd_passing_info.dataExist
                )
              }
            />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <FileUploadComponent
            id='phd_info[certificate_file_path]'
            defaultFileUrl={defaultCertificateImagePath}
            acceptedFileTypes={['image/*', 'application/pdf']}
            errorInstance={errors}
            setValue={setValue}
            register={register}
            label={messages['common.certificate']}
            required={false}
            disabled={
              !(
                formConfig.phd_passing_info.required ||
                formConfig.phd_passing_info.dataExist
              )
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SectionPhdForm;
