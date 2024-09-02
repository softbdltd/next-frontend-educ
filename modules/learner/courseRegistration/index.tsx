import {yupResolver} from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {cloneDeep} from 'lodash';
import moment from 'moment';
import {useRouter} from 'next/router';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useIntl} from 'react-intl';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {
  LINK_FRONTEND_LEARNER_APPRENTICESHIP_ENROLLMENT_SUBMITTED,
  LINK_FRONTEND_LEARNER_COURSE_ENROLLMENT_SUBMITTED,
} from '../../../@core/common/appLinks';
import {DATE_OF_BIRTH_MIN_AGE} from '../../../@core/common/constants';
import {MOBILE_NUMBER_REGEX} from '../../../@core/common/patternRegex';
import {DistrictOrCityCorporation} from '../../../@core/components/AddressFormComponent/addressEnum';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import yup from '../../../@core/libs/yup';
import CourseConfigKeys, {
  FormKeyConfigType,
} from '../../../@core/utilities/CourseConfigKeys';
import {EnrollmentManageTypes} from '../../../@core/utilities/EnrollmentManageTypes';
import EthnicGroupStatus from '../../../@core/utilities/EthnicGroupStatus';
import FreedomFighterStatus from '../../../@core/utilities/FreedomFighterStatus';
import {
  getAllKeysFromErrorObj,
  getMomentDateFormat,
} from '../../../@core/utilities/helpers';
import PhysicalDisabilityStatus from '../../../@core/utilities/PhysicalDisabilityStatus';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {YouthAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {useFetchPublicCourseOrApprenticeshipDetails} from '../../../services/instituteManagement/hooks';
import {useFetchEducationExamsBoardsEduGroupsAndSubjects} from '../../../services/learnerManagement/hooks';
import {courseEnroll} from '../../../services/learnerManagement/YouthService';
import NidAndBrnVerificationComponent from '../profile/personalInfo/NidAndBrnVerificationComponent';
import {AddressTypeId} from '../profile/utilities/AddressType';
import {
  EducationLevelId,
  ResultCodeAppearedId,
  ResultCodeDivisionIds,
  ResultCodeGradeId,
} from '../profile/utilities/EducationEnums';
import {getCurrentFormContent} from './CurrentFormContent';
import {
  getAddressDataByLevel,
  getEducationDataByLevel,
  getGuardiansInfo,
  initialValuesOfCourseEnrollment,
  intialFormKeyConfig,
  tabKeys,
} from './helpers';

const PREFIX = 'YouthCourseRegistrationPage';

const classes = {
  rootContainer: `${PREFIX}-rootContainer`,
  paperBox: `${PREFIX}-paperBox`,
  btnGroup: `${PREFIX}-btnGroup`,
  headingTitle: `${PREFIX}-headingTitle`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  marginTop: 20,
  marginBottom: 20,

  [`& .${classes.paperBox}`]: {
    padding: 15,
  },

  [`& .${classes.btnGroup}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '15px 0px',
  },
  [`& .${classes.headingTitle}`]: {
    fontSize: '1.7138rem',

    [theme.breakpoints.up('sm')]: {
      fontSize: '1.75rem',
    },

    [theme.breakpoints.up('lg')]: {
      fontSize: '1.75rem',
    },

    [theme.breakpoints.up('xl')]: {
      fontSize: '1.875rem',
    },
  },
  '& .MuiStepIcon-text': {
    fontSize: '1rem',
  },
}));

const YouthCourseRegistrationPage = () => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const router = useRouter();
  const {courseId, apprenticeshipId} = router.query;
  const authUser = useAuthUser<YouthAuthUser>();
  const {data: fetchedData} = useFetchPublicCourseOrApprenticeshipDetails(
    Number(courseId),
    Number(apprenticeshipId),
  );

  const [visibleFormConfigKeys, setVisibleFormConfigKeys] = useState<any>([]);
  const [requiredFormConfigKeys, setRequiredFormConfigKeys] = useState<any>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [activeStepKey, setActiveStepKey] = useState<string>(
    CourseConfigKeys.PERSONAL_KEY.toString(),
  );
  const [stepKeys, setStepKeys] = useState<Array<string>>([]);
  const [hasDisabilities, setHasDisabilities] = useState<boolean>(false);
  const [isPhysicalDisabilitiesRequired, setIsPhysicalDisabilitiesRequired] =
    useState<boolean>(false);
  const [isPermanentAddressSameAsPresent, setIsPermanentAddressSameAsPresent] =
    useState<boolean>(false);
  const [isSuccessSubmit, setIsSuccessSubmit] = useState<boolean>(false);
  const [formKeyConfig, setFormKeyConfig] =
    useState<FormKeyConfigType>(intialFormKeyConfig);

  const {data: educationsData} =
    useFetchEducationExamsBoardsEduGroupsAndSubjects();

  const transformedLevelWithDegreeObj =
    educationsData?.education_level_with_degrees?.reduce(
      (acc: any, item: any) => {
        acc[item.code] = item;
        return acc;
      },
      {},
    );

  const isValidationForOthersDegree = (level: string, val: string) => {
    return !!transformedLevelWithDegreeObj[level]?.exam_degrees?.find(
      (item: any) => item.code === 'OTHERS' && item.id == val,
    );
  };

  const validationSchema = useMemo(() => {
    switch (activeStepKey) {
      case CourseConfigKeys.PERSONAL_KEY:
        return yup.object().shape({
          first_name: yup
            .string()
            .title('bn', true)
            .label(messages['common.first_name_bn'] as string),
          first_name_en: yup
            .string()
            .title('en', true)
            .label(messages['common.first_name_en'] as string),
          last_name: yup
            .string()
            .title('bn', true)
            .label(messages['common.last_name_bn'] as string),
          last_name_en: yup
            .string()
            .title('en', true)
            .label(messages['common.last_name_en'] as string),
          date_of_birth: yup
            .string()
            .nullable(true)
            .trim()
            .required()
            .matches(/(19|20)\d\d-[01]\d-[0123]\d/)
            .label(messages['common.date_of_birth'] as string)
            .test(
              'DOB',
              messages['common.invalid_date_of_birth'] as string,
              (value) =>
                moment().diff(moment(value), 'years') >= DATE_OF_BIRTH_MIN_AGE,
            ),
          physical_disability_status: isPhysicalDisabilitiesRequired
            ? yup
                .string()
                .trim()
                .required()
                .label(
                  messages['common.physical_disabilities_status'] as string,
                )
            : yup.string(),
          physical_disabilities:
            hasDisabilities && isPhysicalDisabilitiesRequired
              ? yup
                  .array()
                  .of(yup.string())
                  .min(1)
                  .label(messages['common.physical_disability'] as string)
              : yup.array().of(yup.string()),
          does_belong_to_ethnic_group: yup
            .boolean()
            .required()
            .label(messages['learner_registration.ethnic_group'] as string),
          marital_status: yup
            .string()
            .trim()
            .required()
            .label(messages['common.marital_status'] as string),
          religion: yup
            .string()
            .trim()
            .required()
            .label(messages['common.religion'] as string),
          training_center_id:
            Number(fetchedData?.enrollment_managed_by) ==
            EnrollmentManageTypes.TRAINING_CENTER
              ? yup
                  .string()
                  .trim()
                  .required()
                  .label(messages['common.training_center'] as string)
              : yup
                  .string()
                  .nullable()
                  .label(messages['common.training_center'] as string),
          preferred_training_center_id:
            Number(fetchedData?.enrollment_managed_by) ==
            EnrollmentManageTypes.TRAINING_CENTER
              ? yup
                  .string()
                  .nullable()
                  .label(messages['common.preferred_training_center'] as string)
              : yup
                  .string()
                  .required()
                  .label(
                    messages['common.preferred_training_center'] as string,
                  ),
          preferred_batch_id: yup
            .string()
            .required()
            .label(messages['common.preferred_batch'] as string),
          freedom_fighter_status: yup
            .string()
            .trim()
            .required()
            .label(messages['common.freedom_fighter_status'] as string),
        });
      case CourseConfigKeys.ADDRESS_KEY:
        return yup.object().shape({
          is_permanent_address: yup
            .boolean()
            .required()
            .label(messages['course_registration.is_permanent'] as string),
          present_address: yup.object().shape({
            loc_division_id: yup
              .string()
              .trim()
              .required()
              .label(messages['divisions.label'] as string),
            district_or_city_corporation: yup
              .string()
              .trim()
              .label(messages['label.district_or_city_corporation'] as string)
              .required(),
            loc_district_id: yup
              .string()
              .trim()
              .label(messages['districts.label'] as string)
              .nullable()
              .when('district_or_city_corporation', {
                is: (value: any) => {
                  return Number(value) === DistrictOrCityCorporation.DISTRICT;
                },
                then: yup.string().required(),
              }),
            loc_city_corporation_id: yup
              .string()
              .trim()
              .label(messages['city_corporation.label'] as string)
              .nullable()
              .when('district_or_city_corporation', {
                is: (value: any) => {
                  return (
                    Number(value) === DistrictOrCityCorporation.CITY_CORPORATION
                  );
                },
                then: yup.string().required(),
              }),
            loc_upazila_municipality_type: yup
              .string()
              .trim()
              .label(messages['label.upazila_or_municipality'] as string)
              .nullable()
              .when('district_or_city_corporation', {
                is: (value: any) => {
                  return Number(value) === DistrictOrCityCorporation.DISTRICT;
                },
                then: yup.string().required(),
              }),
            loc_upazila_municipality_id: yup
              .string()
              .trim()
              .label(messages['label.upazila_or_municipality'] as string)
              .nullable()
              .when('district_or_city_corporation', {
                is: (value: any) => {
                  return Number(value) === DistrictOrCityCorporation.DISTRICT;
                },
                then: yup.string().required(),
              }),
            zip_or_postal_code: yup
              .mixed()
              .label(messages['common.zip_or_postal_code'] as string)
              .test(
                'min_max_check',
                messages['common.four_digit'] as string,
                (value) => !value || Boolean(value.length === 4),
              ),
            village_ward_area_en: yup.string().title('en', false),
          }),
          permanent_address: !isPermanentAddressSameAsPresent
            ? yup.object().shape({
                loc_division_id: yup
                  .string()
                  .trim()
                  .required()
                  .label(messages['divisions.label'] as string),
                district_or_city_corporation: yup
                  .string()
                  .trim()
                  .label(
                    messages['label.district_or_city_corporation'] as string,
                  )
                  .required(),
                loc_district_id: yup
                  .string()
                  .trim()
                  .label(messages['districts.label'] as string)
                  .nullable()
                  .when('district_or_city_corporation', {
                    is: (value: any) => {
                      return (
                        Number(value) === DistrictOrCityCorporation.DISTRICT
                      );
                    },
                    then: yup.string().required(),
                  }),
                loc_city_corporation_id: yup
                  .string()
                  .trim()
                  .label(messages['city_corporation.label'] as string)
                  .nullable()
                  .when('district_or_city_corporation', {
                    is: (value: any) => {
                      return (
                        Number(value) ===
                        DistrictOrCityCorporation.CITY_CORPORATION
                      );
                    },
                    then: yup.string().required(),
                  }),

                zip_or_postal_code: yup
                  .mixed()
                  .label(messages['common.zip_or_postal_code'] as string)
                  .test(
                    'min_max_check',
                    messages['common.four_digit'] as string,
                    (value) => !value || Boolean(value.length === 4),
                  ),
                village_ward_area_en: yup.string().title('en', false),
              })
            : yup.object().shape({}),
        });
      case CourseConfigKeys.EDUCATION_KEY:
        return yup.object().shape({
          psc_info:
            formKeyConfig.psc_passing_info.visible &&
            (formKeyConfig.psc_passing_info.required ||
              formKeyConfig.psc_passing_info.dataExist)
              ? yup.object().shape({
                  exam_degree_id: yup
                    .string()
                    .required()
                    .label(
                      messages['education.education_exam_degree'] as string,
                    ),
                  other: yup.string().when('exam_degree_id', {
                    is: (val: any) => {
                      return isValidationForOthersDegree('PSC_5_PASS', val);
                    },
                    then: yup
                      .string()
                      .required()
                      .label(messages['education.others'] as string),
                    otherwise: yup.string().nullable(),
                  }),
                  other_en: yup
                    .string()
                    .title('en', false)
                    .nullable()
                    .label(messages['education.others_en'] as string),
                  edu_board_id: yup
                    .string()
                    .required()
                    .label(messages['education.board'] as string),
                  institute_name: yup
                    .string()
                    .title(
                      'bn',
                      true,
                      messages['common.special_character_error'] as string,
                    )
                    .label(messages['common.edu_institute_name_bn'] as string),
                  institute_name_en: yup
                    .string()
                    .title('en', false)
                    .label(messages['common.edu_institute_name_en'] as string),
                  is_foreign_institute: yup
                    .boolean()
                    .required()
                    .label(
                      messages['education.is_foreign_institute'] as string,
                    ),
                  foreign_institute_country_id: yup
                    .mixed()
                    .label(
                      messages['education.foreign_institute_country'] as string,
                    )
                    .when('is_foreign_institute', {
                      is: true,
                      then: yup.string().required(),
                    }),
                  result: yup
                    .string()
                    .required()
                    .label(messages['education.result'] as string),
                  marks_in_percentage: yup
                    .mixed()
                    .label(messages['education.marks'] as string)
                    .when('result', {
                      is: (value: any) => ResultCodeDivisionIds.includes(value),
                      then: yup.string().max(3).required(),
                    }),
                  cgpa_scale: yup
                    .mixed()
                    .label(messages['education.cgpa_scale'] as string)
                    .when('result', {
                      is: (value: any) => value == ResultCodeGradeId,
                      then: yup.string().max(1).required(),
                    })
                    .test(
                      'cgpa_scale_validation',
                      messages['common.cgpa_scale'] as string,
                      (value) => Boolean(value <= 5),
                    ),
                  cgpa: yup
                    .mixed()
                    .label(messages['education.cgpa'] as string)
                    .when('result', {
                      is: (value: any) => value == ResultCodeGradeId,
                      then: yup.string().max(4).required(),
                    })
                    .test(
                      'cgpa_scale_validation',
                      messages['common.cgpa_scale'] as string,
                      (value) => Boolean(value <= 5),
                    ),
                  year_of_passing: yup
                    .mixed()
                    .label(messages['education.passing_year'] as string)
                    .when('result', {
                      is: (value: any) => value != ResultCodeAppearedId,
                      then: yup.string().required(),
                    }),
                  expected_year_of_passing: yup
                    .mixed()
                    .label(
                      messages['education.expected_passing_year'] as string,
                    )
                    .when('result', {
                      is: (value: any) => value == ResultCodeAppearedId,
                      then: yup.string().required(),
                    }),
                })
              : yup.object().shape({}),
          jsc_info:
            formKeyConfig.jsc_passing_info.visible &&
            (formKeyConfig.jsc_passing_info.required ||
              formKeyConfig.jsc_passing_info.dataExist)
              ? yup.object().shape({
                  exam_degree_id: yup
                    .string()
                    .required()
                    .label(
                      messages['education.education_exam_degree'] as string,
                    ),
                  other: yup.string().when('exam_degree_id', {
                    is: (val: any) => {
                      return isValidationForOthersDegree('JSC_JDC_8_PASS', val);
                    },
                    then: yup
                      .string()
                      .required()
                      .label(messages['education.others'] as string),
                    otherwise: yup.string().nullable(),
                  }),
                  other_en: yup
                    .string()
                    .title('en', false)
                    .nullable()
                    .label(messages['education.others_en'] as string),
                  edu_board_id: yup
                    .string()
                    .required()
                    .label(messages['education.board'] as string),
                  institute_name: yup
                    .string()
                    .title('bn', true)
                    .label(messages['common.edu_institute_name_bn'] as string),
                  institute_name_en: yup
                    .string()
                    .title('en', false)
                    .label(messages['common.edu_institute_name_en'] as string),
                  is_foreign_institute: yup
                    .boolean()
                    .required()
                    .label(
                      messages['education.is_foreign_institute'] as string,
                    ),
                  foreign_institute_country_id: yup
                    .mixed()
                    .label(
                      messages['education.foreign_institute_country'] as string,
                    )
                    .when('is_foreign_institute', {
                      is: true,
                      then: yup.string().required(),
                    }),
                  result: yup
                    .string()
                    .required()
                    .label(messages['education.result'] as string),
                  marks_in_percentage: yup
                    .mixed()
                    .label(messages['education.marks'] as string)
                    .when('result', {
                      is: (value: any) => ResultCodeDivisionIds.includes(value),
                      then: yup.string().max(3).required(),
                    }),
                  cgpa_scale: yup
                    .mixed()
                    .label(messages['education.cgpa_scale'] as string)
                    .when('result', {
                      is: (value: any) => value == ResultCodeGradeId,
                      then: yup.string().max(1).required(),
                    })
                    .test(
                      'cgpa_scale_validation',
                      messages['common.cgpa_scale'] as string,
                      (value) => Boolean(value <= 5),
                    ),
                  cgpa: yup
                    .mixed()
                    .label(messages['education.cgpa'] as string)
                    .when('result', {
                      is: (value: any) => value == ResultCodeGradeId,
                      then: yup.string().max(4).required(),
                    })
                    .test(
                      'cgpa_scale_validation',
                      messages['common.cgpa_scale'] as string,
                      (value) => Boolean(value <= 5),
                    ),
                  year_of_passing: yup
                    .mixed()
                    .label(messages['education.passing_year'] as string)
                    .when('result', {
                      is: (value: any) => value != ResultCodeAppearedId,
                      then: yup.string().required(),
                    }),
                  expected_year_of_passing: yup
                    .mixed()
                    .label(
                      messages['education.expected_passing_year'] as string,
                    )
                    .when('result', {
                      is: (value: any) => value == ResultCodeAppearedId,
                      then: yup.string().required(),
                    }),
                })
              : yup.object().shape({}),
          ssc_info:
            formKeyConfig.ssc_passing_info.visible &&
            (formKeyConfig.ssc_passing_info.required ||
              formKeyConfig.ssc_passing_info.dataExist)
              ? yup.object().shape({
                  exam_degree_id: yup
                    .string()
                    .required()
                    .label(
                      messages['education.education_exam_degree'] as string,
                    ),
                  other: yup.string().when('exam_degree_id', {
                    is: (val: any) => {
                      return isValidationForOthersDegree('SECONDARY', val);
                    },
                    then: yup
                      .string()
                      .required()
                      .label(messages['education.others'] as string),
                    otherwise: yup.string().nullable(),
                  }),
                  other_en: yup
                    .string()
                    .title('en', false)
                    .nullable()
                    .label(messages['education.others_en'] as string),
                  edu_group_id: yup
                    .string()
                    .required()
                    .label(messages['education.group'] as string),
                  edu_board_id: yup
                    .string()
                    .required()
                    .label(messages['education.board'] as string),
                  institute_name: yup
                    .string()
                    .title('bn', true)
                    .label(messages['common.edu_institute_name_bn'] as string),
                  institute_name_en: yup
                    .string()
                    .title('en', false)
                    .label(messages['common.edu_institute_name_en'] as string),
                  is_foreign_institute: yup
                    .boolean()
                    .required()
                    .label(
                      messages['education.is_foreign_institute'] as string,
                    ),
                  foreign_institute_country_id: yup
                    .mixed()
                    .label(
                      messages['education.foreign_institute_country'] as string,
                    )
                    .when('is_foreign_institute', {
                      is: true,
                      then: yup.string().required(),
                    }),
                  result: yup
                    .string()
                    .required()
                    .label(messages['education.result'] as string),
                  marks_in_percentage: yup
                    .mixed()
                    .label(messages['education.marks'] as string)
                    .when('result', {
                      is: (value: any) => ResultCodeDivisionIds.includes(value),
                      then: yup.string().max(3).required(),
                    }),
                  cgpa_scale: yup
                    .mixed()
                    .label(messages['education.cgpa_scale'] as string)
                    .when('result', {
                      is: (value: any) => value == ResultCodeGradeId,
                      then: yup.string().max(1).required(),
                    })
                    .test(
                      'cgpa_scale_validation',
                      messages['common.cgpa_scale'] as string,
                      (value) => Boolean(value <= 5),
                    ),
                  cgpa: yup
                    .mixed()
                    .label(messages['education.cgpa'] as string)
                    .when('result', {
                      is: (value: any) => value == ResultCodeGradeId,
                      then: yup.string().max(4).required(),
                    })
                    .test(
                      'cgpa_scale_validation',
                      messages['common.cgpa_scale'] as string,
                      (value) => Boolean(value <= 5),
                    ),
                  year_of_passing: yup
                    .mixed()
                    .label(messages['education.passing_year'] as string)
                    .when('result', {
                      is: (value: any) => value != ResultCodeAppearedId,
                      then: yup.string().required(),
                    }),
                  expected_year_of_passing: yup
                    .mixed()
                    .label(
                      messages['education.expected_passing_year'] as string,
                    )
                    .when('result', {
                      is: (value: any) => value == ResultCodeAppearedId,
                      then: yup.string().required(),
                    }),
                })
              : yup.object().shape({}),
          hsc_info:
            formKeyConfig.hsc_passing_info.visible &&
            (formKeyConfig.hsc_passing_info.required ||
              formKeyConfig.hsc_passing_info.dataExist)
              ? yup.object().shape({
                  exam_degree_id: yup
                    .string()
                    .required()
                    .label(
                      messages['education.education_exam_degree'] as string,
                    ),
                  other: yup.string().when('exam_degree_id', {
                    is: (val: any) => {
                      return isValidationForOthersDegree(
                        'HIGHER_SECONDARY',
                        val,
                      );
                    },
                    then: yup
                      .string()
                      .required()
                      .label(messages['education.others'] as string),
                    otherwise: yup.string().nullable(),
                  }),
                  other_en: yup
                    .string()
                    .title('en', false)
                    .nullable()
                    .label(messages['education.others_en'] as string),
                  edu_group_id: yup
                    .string()
                    .required()
                    .label(messages['education.group'] as string),
                  edu_board_id: yup
                    .string()
                    .required()
                    .label(messages['education.board'] as string),
                  institute_name: yup
                    .string()
                    .title('bn', true)
                    .label(messages['common.edu_institute_name_bn'] as string),
                  institute_name_en: yup
                    .string()
                    .title('en', false)
                    .label(messages['common.edu_institute_name_en'] as string),
                  is_foreign_institute: yup
                    .boolean()
                    .required()
                    .label(
                      messages['education.is_foreign_institute'] as string,
                    ),
                  foreign_institute_country_id: yup
                    .mixed()
                    .label(
                      messages['education.foreign_institute_country'] as string,
                    )
                    .when('is_foreign_institute', {
                      is: true,
                      then: yup.string().required(),
                    }),
                  result: yup
                    .string()
                    .required()
                    .label(messages['education.result'] as string),
                  marks_in_percentage: yup
                    .mixed()
                    .label(messages['education.marks'] as string)
                    .when('result', {
                      is: (value: any) => ResultCodeDivisionIds.includes(value),
                      then: yup.string().max(3).required(),
                    }),
                  cgpa_scale: yup
                    .mixed()
                    .label(messages['education.cgpa_scale'] as string)
                    .when('result', {
                      is: (value: any) => value == ResultCodeGradeId,
                      then: yup.string().max(1).required(),
                    })
                    .test(
                      'cgpa_scale_validation',
                      messages['common.cgpa_scale'] as string,
                      (value) => Boolean(value <= 5),
                    ),
                  cgpa: yup
                    .mixed()
                    .label(messages['education.cgpa'] as string)
                    .when('result', {
                      is: (value: any) => value == ResultCodeGradeId,
                      then: yup.string().max(4).required(),
                    })
                    .test(
                      'cgpa_scale_validation',
                      messages['common.cgpa_scale'] as string,
                      (value) => Boolean(value <= 5),
                    ),
                  year_of_passing: yup
                    .mixed()
                    .label(messages['education.passing_year'] as string)
                    .when('result', {
                      is: (value: any) => value != ResultCodeAppearedId,
                      then: yup.string().required(),
                    }),
                  expected_year_of_passing: yup
                    .mixed()
                    .label(
                      messages['education.expected_passing_year'] as string,
                    )
                    .when('result', {
                      is: (value: any) => value == ResultCodeAppearedId,
                      then: yup.string().required(),
                    }),
                })
              : yup.object().shape({}),
          diploma_info:
            formKeyConfig.diploma_passing_info.visible &&
            (formKeyConfig.diploma_passing_info.required ||
              formKeyConfig.diploma_passing_info.dataExist)
              ? yup.object().shape({
                  exam_degree_id: yup
                    .string()
                    .required()
                    .label(
                      messages['education.education_exam_degree'] as string,
                    ),
                  other: yup.string().when('exam_degree_id', {
                    is: (val: any) => {
                      return isValidationForOthersDegree('DIPLOMA', val);
                    },
                    then: yup
                      .string()
                      .required()
                      .label(messages['education.others'] as string),
                    otherwise: yup.string().nullable(),
                  }),
                  other_en: yup
                    .string()
                    .title('en', false)
                    .nullable()
                    .label(messages['education.others_en'] as string),
                  major_or_concentration: yup
                    .string()
                    .title()
                    .label(messages['education.major_group_name_bn'] as string),
                  major_or_concentration_en: yup
                    .string()
                    .title('en', false)
                    .label(messages['education.major_group_name_en'] as string),
                  institute_name: yup
                    .string()
                    .title('bn', true)
                    .label(messages['common.edu_institute_name_bn'] as string),
                  institute_name_en: yup
                    .string()
                    .title('en', false)
                    .label(messages['common.edu_institute_name_bn'] as string),
                  is_foreign_institute: yup
                    .boolean()
                    .required()
                    .label(
                      messages['education.is_foreign_institute'] as string,
                    ),
                  foreign_institute_country_id: yup
                    .mixed()
                    .label(
                      messages['education.foreign_institute_country'] as string,
                    )
                    .when('is_foreign_institute', {
                      is: true,
                      then: yup.string().required(),
                    }),
                  result: yup
                    .string()
                    .required()
                    .label(messages['education.result'] as string),
                  marks_in_percentage: yup
                    .mixed()
                    .label(messages['education.marks'] as string)
                    .when('result', {
                      is: (value: any) => ResultCodeDivisionIds.includes(value),
                      then: yup.string().max(3).required(),
                    }),
                  cgpa_scale: yup
                    .mixed()
                    .label(messages['education.cgpa_scale'] as string)
                    .when('result', {
                      is: (value: any) => value == ResultCodeGradeId,
                      then: yup.string().max(1).required(),
                    })
                    .test(
                      'cgpa_scale_validation',
                      messages['common.cgpa_scale'] as string,
                      (value) => Boolean(value <= 5),
                    ),
                  cgpa: yup
                    .mixed()
                    .label(messages['education.cgpa'] as string)
                    .when('result', {
                      is: (value: any) => value == ResultCodeGradeId,
                      then: yup.string().max(4).required(),
                    })
                    .test(
                      'cgpa_scale_validation',
                      messages['common.cgpa_scale'] as string,
                      (value) => Boolean(value <= 5),
                    ),
                  year_of_passing: yup
                    .mixed()
                    .label(messages['education.passing_year'] as string)
                    .when('result', {
                      is: (value: any) => value != ResultCodeAppearedId,
                      then: yup.string().required(),
                    }),
                  expected_year_of_passing: yup
                    .mixed()
                    .label(
                      messages['education.expected_passing_year'] as string,
                    )
                    .when('result', {
                      is: (value: any) => value == ResultCodeAppearedId,
                      then: yup.string().required(),
                    }),
                })
              : yup.object().shape({}),
          honours_info:
            formKeyConfig.honors_passing_info.visible &&
            (formKeyConfig.honors_passing_info.required ||
              formKeyConfig.honors_passing_info.dataExist)
              ? yup.object().shape({
                  exam_degree_id: yup
                    .string()
                    .required()
                    .label(
                      messages['education.education_exam_degree'] as string,
                    ),
                  other: yup.string().when('exam_degree_id', {
                    is: (val: any) => {
                      return isValidationForOthersDegree('BACHELOR', val);
                    },
                    then: yup
                      .string()
                      .required()
                      .label(messages['education.others'] as string),
                    otherwise: yup.string().nullable(),
                  }),
                  other_en: yup
                    .string()
                    .title('en', false)
                    .nullable()
                    .label(messages['education.others_en'] as string),
                  major_or_concentration: yup
                    .string()
                    .required()
                    .label(messages['education.major_group_name_bn'] as string),
                  major_or_concentration_en: yup
                    .string()
                    .title('en', false)
                    .label(messages['education.major_group_name_bn'] as string),
                  institute_name: yup
                    .string()
                    .title('bn', true)
                    .label(messages['common.edu_institute_name_bn'] as string),
                  institute_name_en: yup
                    .string()
                    .title('en', false)
                    .label(messages['common.edu_institute_name_bn'] as string),
                  is_foreign_institute: yup
                    .boolean()
                    .required()
                    .label(
                      messages['education.is_foreign_institute'] as string,
                    ),
                  foreign_institute_country_id: yup
                    .mixed()
                    .label(
                      messages['education.foreign_institute_country'] as string,
                    )
                    .when('is_foreign_institute', {
                      is: true,
                      then: yup.string().required(),
                    }),
                  result: yup
                    .string()
                    .required()
                    .label(messages['education.result'] as string),
                  marks_in_percentage: yup
                    .mixed()
                    .label(messages['education.marks'] as string)
                    .when('result', {
                      is: (value: any) => ResultCodeDivisionIds.includes(value),
                      then: yup.string().max(3).required(),
                    }),
                  cgpa_scale: yup
                    .mixed()
                    .label(messages['education.cgpa_scale'] as string)
                    .when('result', {
                      is: (value: any) => value == ResultCodeGradeId,
                      then: yup.string().max(1).required(),
                    })
                    .test(
                      'cgpa_scale_validation',
                      messages['common.cgpa_scale'] as string,
                      (value) => Boolean(value <= 5),
                    ),
                  cgpa: yup
                    .mixed()
                    .label(messages['education.cgpa'] as string)
                    .when('result', {
                      is: (value: any) => value == ResultCodeGradeId,
                      then: yup.string().max(4).required(),
                    })
                    .test(
                      'cgpa_scale_validation',
                      messages['common.cgpa_scale'] as string,
                      (value) => Boolean(value <= 5),
                    ),
                  year_of_passing: yup
                    .mixed()
                    .label(messages['education.passing_year'] as string)
                    .when('result', {
                      is: (value: any) => value != ResultCodeAppearedId,
                      then: yup.string().required(),
                    }),
                  expected_year_of_passing: yup
                    .mixed()
                    .label(
                      messages['education.expected_passing_year'] as string,
                    )
                    .when('result', {
                      is: (value: any) => value == ResultCodeAppearedId,
                      then: yup.string().required(),
                    }),
                })
              : yup.object().shape({}),
          masters_info:
            formKeyConfig.masters_passing_info.visible &&
            (formKeyConfig.masters_passing_info.required ||
              formKeyConfig.masters_passing_info.dataExist)
              ? yup.object().shape({
                  exam_degree_id: yup
                    .string()
                    .required()
                    .label(
                      messages['education.education_exam_degree'] as string,
                    ),
                  other: yup.string().when('exam_degree_id', {
                    is: (val: any) => {
                      return isValidationForOthersDegree('MASTERS', val);
                    },
                    then: yup
                      .string()
                      .required()
                      .label(messages['education.others'] as string),
                    otherwise: yup.string().nullable(),
                  }),
                  other_en: yup
                    .string()
                    .title('en', false)
                    .nullable()
                    .label(messages['education.others_en'] as string),
                  major_or_concentration: yup
                    .string()
                    .title()
                    .label(messages['education.major_group_name_bn'] as string),
                  major_or_concentration_en: yup
                    .string()
                    .title('en', false)
                    .label(messages['education.major_group_name_bn'] as string),
                  institute_name: yup
                    .string()
                    .title('bn', true)
                    .label(messages['common.edu_institute_name_bn'] as string),
                  institute_name_en: yup
                    .string()
                    .title('en', false)
                    .label(messages['common.edu_institute_name_bn'] as string),
                  is_foreign_institute: yup
                    .boolean()
                    .required()
                    .label(
                      messages['education.is_foreign_institute'] as string,
                    ),
                  foreign_institute_country_id: yup
                    .mixed()
                    .label(
                      messages['education.foreign_institute_country'] as string,
                    )
                    .when('is_foreign_institute', {
                      is: true,
                      then: yup.string().required(),
                    }),
                  result: yup
                    .string()
                    .required()
                    .label(messages['education.result'] as string),
                  marks_in_percentage: yup
                    .mixed()
                    .label(messages['education.marks'] as string)
                    .when('result', {
                      is: (value: any) => ResultCodeDivisionIds.includes(value),
                      then: yup.string().max(3).required(),
                    }),
                  cgpa_scale: yup
                    .mixed()
                    .label(messages['education.cgpa_scale'] as string)
                    .when('result', {
                      is: (value: any) => value == ResultCodeGradeId,
                      then: yup.string().max(1).required(),
                    })
                    .test(
                      'cgpa_scale_validation',
                      messages['common.cgpa_scale'] as string,
                      (value) => Boolean(value <= 5),
                    ),
                  cgpa: yup
                    .mixed()
                    .label(messages['education.cgpa'] as string)
                    .when('result', {
                      is: (value: any) => value == ResultCodeGradeId,
                      then: yup.string().max(4).required(),
                    })
                    .test(
                      'cgpa_scale_validation',
                      messages['common.cgpa_scale'] as string,
                      (value) => Boolean(value <= 5),
                    ),
                  year_of_passing: yup
                    .mixed()
                    .label(messages['education.passing_year'] as string)
                    .when('result', {
                      is: (value: any) => value != ResultCodeAppearedId,
                      then: yup.string().required(),
                    }),
                  expected_year_of_passing: yup
                    .mixed()
                    .label(
                      messages['education.expected_passing_year'] as string,
                    )
                    .when('result', {
                      is: (value: any) => value == ResultCodeAppearedId,
                      then: yup.string().required(),
                    }),
                })
              : yup.object().shape({}),
          phd_info:
            formKeyConfig.phd_passing_info.visible &&
            (formKeyConfig.phd_passing_info.required ||
              formKeyConfig.phd_passing_info.dataExist)
              ? yup.object().shape({
                  exam_degree_name: yup
                    .string()
                    .title()
                    .label(
                      messages[
                        'education.education_exam_degree_name_bn'
                      ] as string,
                    ),
                  exam_degree_name_en: yup
                    .string()
                    .title('en', false)
                    .label(
                      messages[
                        'education.education_exam_degree_name_bn'
                      ] as string,
                    ),
                  major_or_concentration: yup
                    .string()
                    .required()
                    .label(messages['education.major_group_name_bn'] as string),
                  major_or_concentration_en: yup
                    .string()
                    .title('en', false)
                    .label(messages['education.major_group_name_bn'] as string),
                  institute_name: yup
                    .string()
                    .title('bn', true)
                    .label(messages['common.edu_institute_name_bn'] as string),
                  institute_name_en: yup
                    .string()
                    .title('en', false)
                    .label(messages['common.edu_institute_name_bn'] as string),
                  is_foreign_institute: yup
                    .boolean()
                    .required()
                    .label(
                      messages['education.is_foreign_institute'] as string,
                    ),
                  foreign_institute_country_id: yup
                    .mixed()
                    .label(
                      messages['education.foreign_institute_country'] as string,
                    )
                    .when('is_foreign_institute', {
                      is: true,
                      then: yup.string().required(),
                    }),
                  result: yup
                    .string()
                    .required()
                    .label(messages['education.result'] as string),
                  marks_in_percentage: yup
                    .mixed()
                    .label(messages['education.marks'] as string)
                    .when('result', {
                      is: (value: any) => ResultCodeDivisionIds.includes(value),
                      then: yup.string().max(3).required(),
                    }),
                  cgpa_scale: yup
                    .mixed()
                    .label(messages['education.cgpa_scale'] as string)
                    .when('result', {
                      is: (value: any) => value == ResultCodeGradeId,
                      then: yup.string().max(1).required(),
                    })
                    .test(
                      'cgpa_scale_validation',
                      messages['common.cgpa_scale'] as string,
                      (value) => Boolean(value <= 5),
                    ),
                  cgpa: yup
                    .mixed()
                    .label(messages['education.cgpa'] as string)
                    .when('result', {
                      is: (value: any) => value == ResultCodeGradeId,
                      then: yup.string().max(4).required(),
                    })
                    .test(
                      'cgpa_scale_validation',
                      messages['common.cgpa_scale'] as string,
                      (value) => Boolean(value <= 5),
                    ),
                  year_of_passing: yup
                    .mixed()
                    .label(messages['education.passing_year'] as string)
                    .when('result', {
                      is: (value: any) => value != ResultCodeAppearedId,
                      then: yup.string().required(),
                    }),
                  expected_year_of_passing: yup
                    .mixed()
                    .label(
                      messages['education.expected_passing_year'] as string,
                    )
                    .when('result', {
                      is: (value: any) => value == ResultCodeAppearedId,
                      then: yup.string().required(),
                    }),
                })
              : yup.object().shape({}),
        });
      case CourseConfigKeys.OCCUPATION_KEY:
        return yup.object().shape({
          professional_info:
            formKeyConfig.occupation_info.visible &&
            (formKeyConfig.occupation_info.required ||
              formKeyConfig.occupation_info.dataExist)
              ? yup.object().shape({
                  main_profession: yup
                    .string()
                    .trim()
                    .required()
                    .label(messages['common.main_occupation'] as string),
                  monthly_income: yup
                    .string()
                    .trim()
                    .required()
                    .label(messages['common.monthly_income'] as string),
                  years_of_experiences: yup
                    .string()
                    .trim()
                    .required()
                    .label(messages['common.year_of_experience'] as string),
                  is_currently_employed: yup
                    .boolean()
                    .required()
                    .label(messages['common.currently_working'] as string),
                })
              : yup.object().shape({}),
        });
      case CourseConfigKeys.GUARDIAN_KEY:
        return yup.object().shape({
          guardian_info:
            formKeyConfig.guardian_info.visible &&
            (formKeyConfig.guardian_info.required ||
              formKeyConfig.guardian_info.dataExist)
              ? yup.object().shape({
                  father_name: yup
                    .string()
                    .title()
                    .label(messages['common.name_bn'] as string),
                  father_name_en: yup
                    .string()
                    .title('bn', false)
                    .label(messages['common.name_bn'] as string),
                  father_mobile: yup
                    .string()
                    .trim()
                    .label(messages['common.mobile_en'] as string)
                    .test(
                      'mobile_number_validation',
                      messages['common.invalid_mobile'] as string,
                      (value) =>
                        !value || Boolean(value.match(MOBILE_NUMBER_REGEX)),
                    ),
                  mother_name: yup
                    .string()
                    .title()
                    .label(messages['common.name_bn'] as string),
                  mother_name_en: yup
                    .string()
                    .title('en', false)
                    .label(messages['common.name_bn'] as string),
                  mother_mobile: yup
                    .string()
                    .trim()
                    .label(messages['common.mobile_en'] as string)
                    .test(
                      'mobile_number_validation',
                      messages['common.invalid_mobile'] as string,
                      (value) =>
                        !value || Boolean(value.match(MOBILE_NUMBER_REGEX)),
                    ),
                })
              : yup.object().shape({}),
        });
      case CourseConfigKeys.MISCELLANEOUS_KEY:
        return yup.object().shape({
          miscellaneous_info:
            formKeyConfig.miscellaneous_info.visible &&
            (formKeyConfig.miscellaneous_info.required ||
              formKeyConfig.miscellaneous_info.dataExist)
              ? yup.object().shape({
                  has_own_family_home: yup
                    .string()
                    .trim()
                    .required()
                    .label(messages['common.has_own_family_home'] as string),
                  has_own_family_land: yup
                    .string()
                    .trim()
                    .required()
                    .label(messages['common.has_own_family_land'] as string),
                  number_of_siblings: yup
                    .string()
                    .trim()
                    .required()
                    .label(messages['common.number_of_siblings'] as string),
                  recommended_by_any_organization: yup
                    .string()
                    .trim()
                    .required()
                    .label(
                      messages[
                        'common.recommended_by_any_organization'
                      ] as string,
                    ),
                })
              : yup.object().shape({}),
        });
      default:
        return yup.object().shape({});
    }
  }, [
    activeStepKey,
    hasDisabilities,
    isPhysicalDisabilitiesRequired,
    isPermanentAddressSameAsPresent,
    formKeyConfig,
    messages,
    fetchedData,
  ]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    getValues,
    setValue,
    formState: {errors, isSubmitting, submitCount},
  } = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const physicalDisabilityStatus: any = getValues(
      'physical_disability_status',
    );

    setHasDisabilities(
      physicalDisabilityStatus == PhysicalDisabilityStatus.YES,
    );
  }, [getValues]);

  useEffect(() => {
    let activeStepEl = document.getElementById(activeStepKey);
    if (activeStepEl) {
      activeStepEl.focus();
    }
  }, [activeStepKey]);

  useEffect(() => {
    const clonedData = cloneDeep(formKeyConfig);
    visibleFormConfigKeys.forEach((key: keyof typeof clonedData) => {
      if (Object.keys(clonedData).includes(key) && clonedData?.[key]) {
        clonedData[key].visible = true;
      }
    });
    requiredFormConfigKeys.forEach((key: keyof typeof clonedData) => {
      if (Object.keys(clonedData).includes(key) && clonedData?.[key]) {
        clonedData[key].required = true;
      }
    });
    setFormKeyConfig(clonedData);
  }, [requiredFormConfigKeys, visibleFormConfigKeys]);

  useEffect(() => {
    if (fetchedData && authUser?.isYouthUser) {
      setFormSettings(fetchedData.application_form_settings);
      const clonedData = cloneDeep(formKeyConfig);
      const learnerData: any = {
        first_name: authUser?.first_name,
        last_name: authUser?.last_name,
        first_name_en: authUser?.first_name_en,
        last_name_en: authUser?.last_name_en,
        passport_photo_path: authUser?.photo,
        signature_image_path: authUser?.signature_image_path,
        date_of_birth: getMomentDateFormat(
          authUser?.date_of_birth,
          'YYYY-MM-DD',
        ),
        physical_disability_status: authUser?.physical_disability_status,
        physical_disabilities: getPhysicalDisabilityIds(
          authUser?.physical_disabilities,
        ),
        gender: authUser?.gender,
        mobile: authUser?.mobile,
        email: authUser?.email,
        marital_status: authUser?.marital_status,
        freedom_fighter_status: authUser?.freedom_fighter_status
          ? authUser?.freedom_fighter_status
          : FreedomFighterStatus.NO,
        religion: authUser?.religion,
        nationality: authUser?.nationality,
        does_belong_to_ethnic_group:
          String(authUser?.does_belong_to_ethnic_group) ==
          EthnicGroupStatus.YES,
      };

      (authUser.educations || []).forEach((education: any) => {
        if (education.education_level_id == EducationLevelId.PSC) {
          clonedData.psc_passing_info.dataExist = true;
          learnerData.psc_info = getEducationDataByLevel(education);
        } else if (education.education_level_id == EducationLevelId.JSC) {
          clonedData.jsc_passing_info.dataExist = true;
          learnerData.jsc_info = getEducationDataByLevel(education);
        } else if (education.education_level_id == EducationLevelId.SSC) {
          clonedData.ssc_passing_info.dataExist = true;
          learnerData.ssc_info = getEducationDataByLevel(education);
        } else if (education.education_level_id == EducationLevelId.HSC) {
          clonedData.hsc_passing_info.dataExist = true;
          learnerData.hsc_info = getEducationDataByLevel(education);
        } else if (education.education_level_id == EducationLevelId.DIPLOMA) {
          clonedData.diploma_passing_info.dataExist = true;
          learnerData.diploma_info = getEducationDataByLevel(education);
        } else if (education.education_level_id == EducationLevelId.HONOURS) {
          clonedData.honors_passing_info.dataExist = true;
          learnerData.honours_info = getEducationDataByLevel(education);
        } else if (education.education_level_id == EducationLevelId.MASTERS) {
          clonedData.masters_passing_info.dataExist = true;
          learnerData.masters_info = getEducationDataByLevel(education);
        } else if (education.education_level_id == EducationLevelId.PHD) {
          clonedData.phd_passing_info.dataExist = true;
          learnerData.phd_info = getEducationDataByLevel(education);
        }
      });

      if (authUser?.guardians) {
        let {data, dataExist, localDataExist} = getGuardiansInfo(
          authUser.guardians,
        );
        learnerData.guardian_info = data;
        clonedData.guardian_info.dataExist = dataExist;
        clonedData.guardian_info.localDataExist = localDataExist;
      }

      (authUser?.addresses || []).forEach((address: any) => {
        if (address.address_type == AddressTypeId.PRESENT) {
          learnerData.present_address = getAddressDataByLevel(address);
        } else if (address.address_type == AddressTypeId.PERMANENT) {
          learnerData.permanent_address = getAddressDataByLevel(address);
        }
      });
      setFormKeyConfig(clonedData);
      reset({
        ...initialValuesOfCourseEnrollment,
        ...learnerData,
      });
    }
  }, [fetchedData, authUser]);

  useEffect(() => {
    const errorKeysArr = getAllKeysFromErrorObj(errors);
    if (submitCount && errorKeysArr.length > 0) {
      let field = document.getElementsByName(errorKeysArr?.[0]);
      if (field.length > 0) {
        field[0]?.focus();
      }
    }
  }, [errors, submitCount]);

  const getPhysicalDisabilityIds = (physicalDisabilities: any) => {
    return (physicalDisabilities || []).map(
      (physicalDisability: any) => physicalDisability.id,
    );
  };

  const setFormSettings = (config: string | undefined | null) => {
    try {
      const steps = [
        CourseConfigKeys.PERSONAL_KEY.toString(),
        CourseConfigKeys.ADDRESS_KEY.toString(),
      ];
      let configJson = JSON.parse(config || '{}');
      let itemsState: any = [];
      let itemsRequiredState: any = [];
      Object.keys(configJson || {}).map((key: string) => {
        let value = configJson[key];
        if (value[0]) {
          itemsState.push(key);
          if (tabKeys.includes(key)) {
            steps.push(key);
          }
        }
        if (value[1]) {
          itemsRequiredState.push(key);
        }
      });
      setStepKeys(steps);
      setVisibleFormConfigKeys(itemsState);
      setRequiredFormConfigKeys(itemsRequiredState);
      //physical disabilities visible and required
      if (
        visibleFormConfigKeys.includes(CourseConfigKeys.DISABILITY_KEY) &&
        requiredFormConfigKeys.includes(CourseConfigKeys.DISABILITY_KEY)
      ) {
        setIsPhysicalDisabilitiesRequired(true);
      } else {
        setIsPhysicalDisabilitiesRequired(false);
      }
    } catch (e) {
      console.log('Failed to parse config data', e);
    }
  };

  const onChangeSameAsPresentCheck = useCallback((checked: boolean) => {
    setIsPermanentAddressSameAsPresent((prev) => !prev);
  }, []);

  const handleNext = () => {
    setActiveStepKey(stepKeys[activeStep + 1]);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStepKey(stepKeys[activeStep - 1]);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  console.log('errors', errors);

  const onSubmit: SubmitHandler<any> = async (formData: any) => {
    console.log('formdata', formData);
    try {
      if (activeStep < stepKeys.length - 1) {
        handleNext();
      } else if (activeStep == stepKeys.length - 1) {
        let data: any = cloneDeep(formData);
        data.learner_id = authUser?.learnerId;
        data.learner_code = authUser?.learnerCode;
        data.course_id = fetchedData?.id;
        data.does_belong_to_ethnic_group = formData.does_belong_to_ethnic_group
          ? 1
          : 0;
        data.address_info = {};
        data.address_info.present_address = formData.present_address;
        data.address_info.is_permanent_address =
          formData.is_permanent_address == true ? 1 : 0;
        data.address_info.permanent_address = formData.is_permanent_address
          ? formData.present_address
          : formData.permanent_address;

        if (
          !visibleFormConfigKeys.includes(CourseConfigKeys.FREEDOM_FIGHTER_KEY)
        ) {
          delete data.freedom_fighter_status;
        }

        if (!data?.physical_disability_status) {
          data.physical_disability_status = PhysicalDisabilityStatus.NO;
          delete data.physical_disabilities;
        }

        if (visibleFormConfigKeys.includes(CourseConfigKeys.EDUCATION_KEY)) {
          data.education_info = {};

          if (
            (formKeyConfig.psc_passing_info.required ||
              formKeyConfig.psc_passing_info.dataExist) &&
            formKeyConfig.psc_passing_info.visible
          ) {
            data.psc_info.is_foreign_institute = formData.psc_info
              .is_foreign_institute
              ? 1
              : 0;
            data.education_info['1'] = data.psc_info;
          }

          if (
            (formKeyConfig.jsc_passing_info.required ||
              formKeyConfig.jsc_passing_info.dataExist) &&
            formKeyConfig.jsc_passing_info.visible
          ) {
            data.jsc_info.is_foreign_institute = formData.jsc_info
              .is_foreign_institute
              ? 1
              : 0;
            data.education_info['2'] = data.jsc_info;
          }

          if (
            (formKeyConfig.ssc_passing_info.required ||
              formKeyConfig.ssc_passing_info.dataExist) &&
            formKeyConfig.ssc_passing_info.visible
          ) {
            data.ssc_info.is_foreign_institute = formData.ssc_info
              .is_foreign_institute
              ? 1
              : 0;
            data.education_info['3'] = data.ssc_info;
          }

          if (
            (formKeyConfig.hsc_passing_info.required ||
              formKeyConfig.hsc_passing_info.dataExist) &&
            formKeyConfig.hsc_passing_info.visible
          ) {
            data.hsc_info.is_foreign_institute = formData.hsc_info
              .is_foreign_institute
              ? 1
              : 0;
            data.education_info['4'] = data.hsc_info;
          }

          if (
            (formKeyConfig.diploma_passing_info.required ||
              formKeyConfig.diploma_passing_info.dataExist) &&
            formKeyConfig.diploma_passing_info.visible
          ) {
            data.diploma_info.is_foreign_institute = formData.diploma_info
              .is_foreign_institute
              ? 1
              : 0;
            data.education_info['5'] = data.diploma_info;
          }

          if (
            (formKeyConfig.honors_passing_info.required ||
              formKeyConfig.honors_passing_info.dataExist) &&
            formKeyConfig.honors_passing_info.visible
          ) {
            data.honours_info.is_foreign_institute = formData.honours_info
              .is_foreign_institute
              ? 1
              : 0;
            data.education_info['6'] = data.honours_info;
          }

          if (
            (formKeyConfig.masters_passing_info.required ||
              formKeyConfig.masters_passing_info.dataExist) &&
            formKeyConfig.masters_passing_info.visible
          ) {
            data.masters_info.is_foreign_institute = formData.masters_info
              .is_foreign_institute
              ? 1
              : 0;
            data.education_info['7'] = data.masters_info;
          }

          if (
            (formKeyConfig.phd_passing_info.required ||
              formKeyConfig.phd_passing_info.dataExist) &&
            formKeyConfig.phd_passing_info.visible
          ) {
            data.phd_info.is_foreign_institute = formData.phd_info
              .is_foreign_institute
              ? 1
              : 0;
            data.education_info['8'] = data.phd_info;
          }
        }

        if (
          !(
            data.guardian_info.mother_name ||
            data.guardian_info.father_name ||
            data.guardian_info.local_guardian_name ||
            data.guardian_info.mother_name_en ||
            data.guardian_info.father_name_en ||
            data.guardian_info.local_guardian_name_en
          )
        ) {
          delete data.guardian_info;
        } else {
          if (
            data.guardian_info.father_name ||
            data.guardian_info.father_name_en
          ) {
            data.guardian_info.father_name =
              data.guardian_info.father_name ??
              data.guardian_info.father_name_en;
          } else {
            delete data.guardian_info.father_name;
            delete data.guardian_info.father_name_en;
            delete data.guardian_info.father_mobile;
            delete data.guardian_info.father_date_of_birth;
            delete data.guardian_info.father_nid;
          }

          if (
            data.guardian_info.mother_name ||
            data.guardian_info.mother_name_en
          ) {
            data.guardian_info.mother_name =
              data.guardian_info.mother_name ??
              data.guardian_info.mother_name_en;
          } else {
            delete data.guardian_info.mother_name;
            delete data.guardian_info.mother_name_en;
            delete data.guardian_info.mother_mobile;
            delete data.guardian_info.mother_date_of_birth;
            delete data.guardian_info.mother_nid;
          }

          if (
            data.guardian_info.local_guardian_name ||
            data.guardian_info.local_guardian_name_en
          ) {
            data.guardian_info.local_guardian_name =
              data.guardian_info.local_guardian_name ??
              data.guardian_info.local_guardian_name_en;
          } else {
            delete data.guardian_info.local_guardian_name;
            delete data.guardian_info.local_guardian_name_en;
            delete data.guardian_info.local_guardian_mobile;
            delete data.guardian_info.local_guardian_date_of_birth;
            delete data.guardian_info.local_guardian_nid;
            delete data.guardian_info.local_guardian_relationship_title;
            delete data.guardian_info.local_guardian_relationship_title_en;
          }
        }

        if (!formKeyConfig.occupation_info.required)
          delete data.professional_info;
        else {
          data.professional_info.is_currently_employed = formData
            .professional_info.is_currently_employed
            ? 1
            : 0;
        }

        if (!formKeyConfig.miscellaneous_info.required)
          delete data.miscellaneous_info;

        delete data.psc_info;
        delete data.jsc_info;
        delete data.ssc_info;
        delete data.hsc_info;
        delete data.diploma_info;
        delete data.honours_info;
        delete data.masters_info;
        delete data.phd_info;
        delete data.present_address;
        delete data.is_permanent_address;
        delete data.permanent_address;

        if (
          Number(fetchedData?.enrollment_managed_by) ==
          EnrollmentManageTypes.CENTRALLY
        ) {
          delete data.training_center_id;
        } else {
          delete data.preferred_training_center_id;
        }

        if (apprenticeshipId) {
          delete data.training_center_id;
        }
        data.is_payment_enabled =
          fetchedData?.is_payment_enabled == null
            ? 0
            : fetchedData?.is_payment_enabled;
        const response = await courseEnroll(data);
        setIsSuccessSubmit(true);
        console.log('courseEnroll', {data, response, fetchedData});
        router
          .push({
            pathname: courseId
              ? LINK_FRONTEND_LEARNER_COURSE_ENROLLMENT_SUBMITTED + fetchedData.id
              : LINK_FRONTEND_LEARNER_APPRENTICESHIP_ENROLLMENT_SUBMITTED +
                fetchedData.id,
            query: {
              enrollment_id: response?.data?.id,
              is_course_paid:
                fetchedData?.is_payment_enabled === 1 &&
                (fetchedData?.course_fee || fetchedData?.admission_fee)
                  ? 1
                  : 2, //todo: 1 -> paid course, 2-> free course
            },
          })
          .then((r) => {});
      }
    } catch (error: any) {
      processServerSideErrors({
        setError,
        validationSchema,
        errorStack,
        error,
      });
    }
  };

  return (
    <StyledContainer maxWidth={'lg'}>
      <Paper className={classes.paperBox}>
        <Box sx={{textAlign: 'center', marginBottom: 5}}>
          <Typography
            variant={'h3'}
            className={classes.headingTitle}
            tabIndex={0}>
            {courseId
              ? messages['course_registration.title']
              : messages['common.apprenticeship_registration']}
          </Typography>
        </Box>

        <Box sx={{width: '100%'}}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {stepKeys.map((key, index) => {
              const stepProps: {completed?: boolean} = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              return (
                <Step key={key as string} {...stepProps}>
                  <StepLabel {...labelProps}>
                    {messages['common.' + key]}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <Grid container mt={4} mb={2}>
            <Grid item container xs={12} spacing={2}>
              {!authUser?.nid_brn_verified_at && (
                <NidAndBrnVerificationComponent isSingleRow={true} />
              )}
            </Grid>
          </Grid>
          {activeStep === stepKeys.length ? (
            <React.Fragment>
              <Box />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
                <Box sx={{p: '10px 0px', marginTop: 3}}>
                  {getCurrentFormContent({
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
                  })}
                </Box>
                <Box className={classes.btnGroup}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant={'outlined'}
                    color={'primary'}>
                    {messages['common.previous']}
                  </Button>
                  <Button
                    sx={{marginLeft: 3}}
                    type={'submit'}
                    variant={'contained'}
                    color={'primary'}
                    disabled={isSubmitting || isSuccessSubmit}>
                    {activeStep == stepKeys.length - 1
                      ? messages['common.submit']
                      : messages['common.next']}
                  </Button>
                </Box>
              </form>
              {isSubmitting && (
                <div
                  role={'alert'}
                  aria-live='assertive'
                  style={{position: 'absolute', top: '-9999px'}}>
                  {messages['common.verifying'] as string}
                </div>
              )}
            </React.Fragment>
          )}
        </Box>
      </Paper>
    </StyledContainer>
  );
};

export default YouthCourseRegistrationPage;
