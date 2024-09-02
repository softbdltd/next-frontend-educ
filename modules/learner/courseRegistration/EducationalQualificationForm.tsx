import {Box, Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import React, {FC, useCallback, useState} from 'react';
import {useIntl} from 'react-intl';
import CourseConfigKeys, {
  FormKeyConfigType,
} from '../../../@core/utilities/CourseConfigKeys';
import {useFetchCountries} from '../../../services/locationManagement/hooks';
import {EducationLevel} from '../profile/utilities/EducationEnums';
import SectionDiplomaForm from './educationQualification/SectionDiplomaForm';
import SectionHonoursForm from './educationQualification/SectionHonoursForm';
import SectionHscForm from './educationQualification/SectionHSCForm';
import SectionJscForm from './educationQualification/SectionJSCForm';
import SectionMastersForm from './educationQualification/SectionMastersForm';
import SectionPhdForm from './educationQualification/SectionPhdForm';
import SectionPscForm from './educationQualification/SectionPSCForm';
import SectionSscForm from './educationQualification/SectionSSCForm';

const PREFIX = 'EducationalQualification';

const classes = {
  visuallyHidden: `${PREFIX}-visuallyHidden`,
};

const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.visuallyHidden}`]: {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    width: '1px',
  },
}));

interface EducationalQualificationFormProps {
  register: any;
  errors: any;
  control: any;
  setValue: any;
  getValues: any;
  visibleFieldKeys: Array<string>;
  requiredFormConfigKeys: Array<string>;
  formConfig: FormKeyConfigType;
  stepKey: string;
  setFormConfig: (value: FormKeyConfigType) => void;
  educationsData: any;
}

const EducationalQualificationForm: FC<EducationalQualificationFormProps> = ({
  register,
  errors,
  control,
  setValue,
  getValues,
  formConfig,
  setFormConfig,
  requiredFormConfigKeys,
  stepKey,
  educationsData,
}) => {
  const [countryFilters] = useState<any>({});
  const {data: countries} = useFetchCountries(countryFilters);
  const {messages} = useIntl();

  const getExamDegreesByLevel = useCallback(
    (levelCode: string) => {
      return educationsData?.education_level_with_degrees?.find(
        (eduLevel: any) => eduLevel.code == levelCode,
      )?.exam_degrees;
    },
    [educationsData],
  );

  return (
    <StyledBox>
      <span id={stepKey} className={classes.visuallyHidden} tabIndex={0}>{`${
        messages['common.step']
      }${messages['common.' + stepKey]}`}</span>
      <Grid container spacing={2}>
        {formConfig && formConfig.psc_passing_info.visible && (
          <Grid item xs={12}>
            <SectionPscForm
              errors={errors}
              control={control}
              register={register}
              getValues={getValues}
              setValue={setValue}
              examDegrees={getExamDegreesByLevel(EducationLevel.PSC)}
              eduBoards={educationsData?.edu_boards}
              countries={countries}
              result={educationsData?.result}
              formConfig={formConfig}
              changeFormConfig={setFormConfig}
              isOnlyVisibleField={
                !requiredFormConfigKeys.includes(
                  CourseConfigKeys.EDUCATION_PSC_KEY,
                )
              }
            />
          </Grid>
        )}
        {formConfig && formConfig.jsc_passing_info.visible && (
          <Grid item xs={12}>
            <SectionJscForm
              errors={errors}
              control={control}
              register={register}
              getValues={getValues}
              setValue={setValue}
              examDegrees={getExamDegreesByLevel(EducationLevel.JSC)}
              eduBoards={educationsData?.edu_boards}
              countries={countries}
              result={educationsData?.result}
              formConfig={formConfig}
              changeFormConfig={setFormConfig}
              isOnlyVisibleField={
                !requiredFormConfigKeys.includes(
                  CourseConfigKeys.EDUCATION_JSC_KEY,
                )
              }
            />
          </Grid>
        )}
        {formConfig && formConfig.ssc_passing_info.visible && (
          <Grid item xs={12}>
            <SectionSscForm
              errors={errors}
              control={control}
              register={register}
              getValues={getValues}
              setValue={setValue}
              examDegrees={getExamDegreesByLevel(EducationLevel.SSC)}
              eduBoards={educationsData?.edu_boards}
              eduGroups={educationsData?.edu_groups}
              countries={countries}
              result={educationsData?.result}
              formConfig={formConfig}
              changeFormConfig={setFormConfig}
              isOnlyVisibleField={
                !requiredFormConfigKeys.includes(
                  CourseConfigKeys.EDUCATION_SSC_KEY,
                )
              }
            />
          </Grid>
        )}
        {formConfig && formConfig.hsc_passing_info.visible && (
          <Grid item xs={12}>
            <SectionHscForm
              errors={errors}
              control={control}
              register={register}
              getValues={getValues}
              setValue={setValue}
              examDegrees={getExamDegreesByLevel(EducationLevel.HSC)}
              eduBoards={educationsData?.edu_boards}
              eduGroups={educationsData?.edu_groups}
              countries={countries}
              result={educationsData?.result}
              formConfig={formConfig}
              changeFormConfig={setFormConfig}
              isOnlyVisibleField={
                !requiredFormConfigKeys.includes(
                  CourseConfigKeys.EDUCATION_HSC_KEY,
                )
              }
            />
          </Grid>
        )}
        {formConfig && formConfig.diploma_passing_info.visible && (
          <Grid item xs={12}>
            <SectionDiplomaForm
              errors={errors}
              control={control}
              register={register}
              getValues={getValues}
              setValue={setValue}
              examDegrees={getExamDegreesByLevel(EducationLevel.DIPLOMA)}
              countries={countries}
              result={educationsData?.result}
              formConfig={formConfig}
              changeFormConfig={setFormConfig}
              isOnlyVisibleField={
                !requiredFormConfigKeys.includes(
                  CourseConfigKeys.EDUCATION_DIPLOMA_KEY,
                )
              }
            />
          </Grid>
        )}
        {formConfig && formConfig.honors_passing_info.visible && (
          <Grid item xs={12}>
            <SectionHonoursForm
              errors={errors}
              control={control}
              register={register}
              getValues={getValues}
              setValue={setValue}
              examDegrees={getExamDegreesByLevel(EducationLevel.HONOURS)}
              countries={countries}
              result={educationsData?.result}
              formConfig={formConfig}
              changeFormConfig={setFormConfig}
              isOnlyVisibleField={
                !requiredFormConfigKeys.includes(
                  CourseConfigKeys.EDUCATION_HONOURS_KEY,
                )
              }
            />
          </Grid>
        )}
        {formConfig && formConfig.masters_passing_info.visible && (
          <Grid item xs={12}>
            <SectionMastersForm
              errors={errors}
              control={control}
              register={register}
              getValues={getValues}
              setValue={setValue}
              examDegrees={getExamDegreesByLevel(EducationLevel.MASTERS)}
              countries={countries}
              result={educationsData?.result}
              formConfig={formConfig}
              changeFormConfig={setFormConfig}
              isOnlyVisibleField={
                !requiredFormConfigKeys.includes(
                  CourseConfigKeys.EDUCATION_MASTERS_KEY,
                )
              }
            />
          </Grid>
        )}
        {formConfig && formConfig.phd_passing_info.visible && (
          <Grid item xs={12}>
            <SectionPhdForm
              errors={errors}
              control={control}
              register={register}
              getValues={getValues}
              setValue={setValue}
              countries={countries}
              result={educationsData?.result}
              formConfig={formConfig}
              changeFormConfig={setFormConfig}
              isOnlyVisibleField={
                !requiredFormConfigKeys.includes(
                  CourseConfigKeys.EDUCATION_PHD_KEY,
                )
              }
            />
          </Grid>
        )}
      </Grid>
    </StyledBox>
  );
};

export default EducationalQualificationForm;
