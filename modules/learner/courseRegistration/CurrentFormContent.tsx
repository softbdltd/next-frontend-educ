import React from 'react';
import CourseConfigKeys from '../../../@core/utilities/CourseConfigKeys';
import {EnrollmentManageTypes} from '../../../@core/utilities/EnrollmentManageTypes';
import AddressForm from './AddressForm';
import EducationalQualificationForm from './EducationalQualificationForm';
import GuardiansInfoForm from './GuardiansInfoForm';
import OccupationalInfoForm from './OccupationalInfoForm';
import OtherInfoForm from './OtherInfoForm';
import PersonalInfoForm from './PersonalInfoForm';

export const getCurrentFormContent = ({
  activeStepKey,
  register,
  errors,
  control,
  getValues,
  visibleFormConfigKeys,
  courseId,
  apprenticeshipId,
  fetchedData,
  onChangeSameAsPresentCheck,
  requiredFormConfigKeys,
  formKeyConfig,
  setFormKeyConfig,
  educationsData,
  setValue,
}: any) => {
  switch (activeStepKey) {
    case CourseConfigKeys.PERSONAL_KEY:
      return (
        <PersonalInfoForm
          register={register}
          errors={errors}
          control={control}
          getValues={getValues}
          setValue={setValue}
          visibleFieldKeys={visibleFormConfigKeys}
          courseOrApprenticeshipId={courseId ? courseId : apprenticeshipId}
          isApprenticeship={!!apprenticeshipId}
          isTrainingCenterRequired={
            Number(fetchedData?.enrollment_managed_by) ==
            EnrollmentManageTypes.TRAINING_CENTER
          }
          stepKey={CourseConfigKeys.PERSONAL_KEY}
        />
      );
    case CourseConfigKeys.ADDRESS_KEY:
      return (
        <AddressForm
          register={register}
          errors={errors}
          control={control}
          getValues={getValues}
          setValue={setValue}
          onChangeSameAsPresentCheck={onChangeSameAsPresentCheck}
          stepKey={CourseConfigKeys.ADDRESS_KEY}
        />
      );
    case CourseConfigKeys.EDUCATION_KEY:
      return (
        <EducationalQualificationForm
          register={register}
          errors={errors}
          control={control}
          getValues={getValues}
          setValue={setValue}
          visibleFieldKeys={visibleFormConfigKeys}
          requiredFormConfigKeys={requiredFormConfigKeys}
          formConfig={formKeyConfig}
          setFormConfig={setFormKeyConfig}
          stepKey={CourseConfigKeys.EDUCATION_KEY}
          educationsData={educationsData}
        />
      );
    case CourseConfigKeys.OCCUPATION_KEY:
      return (
        <OccupationalInfoForm
          register={register}
          control={control}
          errors={errors}
          getValues={getValues}
          isOnlyVisibleField={
            !requiredFormConfigKeys.includes(CourseConfigKeys.OCCUPATION_KEY)
          }
          formConfig={formKeyConfig}
          changeFormConfig={setFormKeyConfig}
          stepKey={CourseConfigKeys.OCCUPATION_KEY}
        />
      );
    case CourseConfigKeys.GUARDIAN_KEY:
      return (
        <GuardiansInfoForm
          register={register}
          errors={errors}
          isOnlyVisibleField={
            !requiredFormConfigKeys.includes(CourseConfigKeys.GUARDIAN_KEY)
          }
          formConfig={formKeyConfig}
          changeFormConfig={setFormKeyConfig}
          control={control}
          stepKey={CourseConfigKeys.GUARDIAN_KEY}
        />
      );
    case CourseConfigKeys.MISCELLANEOUS_KEY:
      return (
        <OtherInfoForm
          register={register}
          errors={errors}
          control={control}
          isOnlyVisibleField={
            !requiredFormConfigKeys.includes(CourseConfigKeys.MISCELLANEOUS_KEY)
          }
          formConfig={formKeyConfig}
          changeFormConfig={setFormKeyConfig}
          stepKey={CourseConfigKeys.MISCELLANEOUS_KEY}
        />
      );
    default:
      return <></>;
  }
};
