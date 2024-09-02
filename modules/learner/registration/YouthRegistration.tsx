import {yupResolver} from '@hookform/resolvers/yup';
import {Box, Container, Grid, Paper, Typography} from '@mui/material';
import {styled} from '@mui/material/styles';
import _ from 'lodash';
import moment from 'moment';
import {useRouter} from 'next/router';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {LINK_FRONTEND_INSTITUTE_ROOT, LINK_LEARNER_REGISTRATION_VERIFICATION} from '../../../@core/common/appLinks';
import {DATE_OF_BIRTH_MIN_AGE} from '../../../@core/common/constants';
import {
  MOBILE_NUMBER_REGEX,
  TEXT_REGEX_PASSWORD,
} from '../../../@core/common/patternRegex';
import {getSSOLoginUrl} from '../../../@core/common/SSOConfig';
import AddressFormComponent from '../../../@core/components/AddressFormComponent';
import {
  DistrictOrCityCorporation,
  UpazilaOrMunicipality,
} from '../../../@core/components/AddressFormComponent/addressEnum';
import BackButton from '../../../@core/elements/button/BackButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import {Link} from '../../../@core/elements/common';
import CustomDatePicker from '../../../@core/elements/input/CustomDatePicker';
import CustomFormSelect from '../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import FormRadioButtons from '../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import yup from '../../../@core/libs/yup';
import Genders from '../../../@core/utilities/Genders';
import {getAllKeysFromErrorObj} from '../../../@core/utilities/helpers';
import IntendedSessions from '../../../@core/utilities/IntendedSessions';
import PhysicalDisabilities from '../../../@core/utilities/PhysicalDisabilities';
import PhysicalDisabilityStatus from '../../../@core/utilities/PhysicalDisabilityStatus';
import RowStatus from '../../../@core/utilities/RowStatus';
import UserNameType from '../../../@core/utilities/UserNameType';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {useFetchLocalizedSkills} from '../../../services/learnerManagement/hooks';
import {learnerRegistration} from '../../../services/learnerManagement/YouthRegistrationService';
import {SUBSCRIPTION_DATA_KEY} from '../../../shared/constants/AppConst';
import {
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
import CustomSelectAutoComplete from './CustomSelectAutoComplete';
import EducationComponent from './EducationComponent';

const PREFIX = 'YouthRegistration';

const classes = {
  rootContainer: `${PREFIX}-rootContainer`,
  PaperBox: `${PREFIX}-PaperBox`,
  signInStyle: `${PREFIX}-signInStyle`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  [theme.breakpoints.only('xs')]: {
    height: 'calc(100vh - 56px)',
  },
  [theme.breakpoints.only('sm')]: {
    height: 'calc(100vh - 75px)',
  },

  [`& .${classes.PaperBox}`]: {
    padding: 40,
    margin: '35px auto',
  },

  [`& .${classes.signInStyle}`]: {
    color: theme.palette.primary.main + ' !important',
  },
}));

const initialValues = {
  first_name: '',
  first_name_en: '',
  last_name: '',
  last_name_en: '',
  date_of_birth: '',
  physical_disability_status: PhysicalDisabilityStatus.NO,
  physical_disabilities: [],
  email: '',
  mobile: '',
  gender: Genders.MALE,
  skills: [],
  loc_division_id: '',
  loc_district_id: '',
  loc_union_id: '',
  loc_upazila_municipality_id: '',
  district_or_city_corporation: '',
  loc_city_corporation_id: '',
  village_ward_area: '',
  village_ward_area_en: '',
  highest_education_info: {
    education_level_id: '',
    institute_name: '',
    exam_degree_id: '',
    exam_degree_name: '',
    edu_board_id: '',
    edu_group_id: '',
    result: '',
    marks_in_percentage: null,
    cgpa_scale: null,
    cgpa: null,
    year_of_passing: '',
    other: '',
    other_en: '',
  },
  career_fair_items: {
    career_type: null,
    fair_district_id: 45, // Bogra District
    electronic_devices: [],
    intended_session: IntendedSessions.workshop_with_freelancers,
    participated_trainings: [],
    fair_expectations: '',
    smart_bd_expectations: '',
  },
};

const YouthRegistration = () => {
  const {messages} = useIntl();
  const {errorStack, successStack} = useNotiStack();
  const router = useRouter();
  const backUrl = router.query?.redirected_from;
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [isForeignInstitute, setIsForeignInstitute] = useState<boolean>(false);
  const [checkedNUCheckbox, setCheckedNUCheckbox] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [isRunning, setIsRunning] = useState<number>(0);
  const [learnerSkillsFilter] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const {data: skills} = useFetchLocalizedSkills(learnerSkillsFilter);
  const [subscriptionInfo, setSubscriptionInfo] = useState<any>({});

  const [selectedEducationLevel, setSelectedEducationLevel] =
    useState<any>(null);
  const [selectedExamDegree, setSelectedExamDegree] = useState<any>(null);
  const [isWantToParticipate] = useState<boolean>(false);

  const [disabilityStatus, setDisabilityStatus] = useState<number>(
    PhysicalDisabilityStatus.NO,
  );
  //const [userNameType, setUserNameType] = useState<number>(UserNameType.MOBILE);

  const devices = useMemo(
    () => [
      {
        id: 1,
        label: messages['common.smartphone'],
      },
      {
        id: 2,
        label: messages['common.laptop'],
      },
      {
        id: 3,
        label: messages['common.desktop'],
      },
      {
        id: 4,
        label: messages['common.tab'],
      },
      {
        id: 5,
        label: messages['common.have_purchase_plan'],
      },
    ],
    [messages],
  );

  const training_participations = useMemo(
    () => [
      {
        id: 1,
        label: messages['common.ledp'],
      },
      {
        id: 2,
        label: messages['common.seip'],
      },
      {
        id: 3,
        label: messages['common.ftfl'],
      },
      {
        id: 4,
        label: messages['common.others'],
      },
    ],
    [messages],
  );

  const careerType = useMemo(
    () => [
      {
        id: 1,
        label: messages['common.freelancer'],
      },
      {
        id: 2,
        label: messages['common.e_commerce_entrepreneur'],
      },
      {
        id: 3,
        label: messages['common.f_commerce_entrepreneur'],
      },
      {
        id: 4,
        label: messages['common.general_job'],
      },
      {
        id: 5,
        label: messages['common.government_job'],
      },
      {
        id: 6,
        label: messages['common.others'],
      },
    ],
    [messages],
  );

  const physicalDisabilities = useMemo(
    () => [
      {
        id: PhysicalDisabilities.VISUAL,
        label: messages['physical_disability.visual'],
      },
      {
        id: PhysicalDisabilities.HEARING,
        label: messages['physical_disability.hearing'],
      },
      {
        id: PhysicalDisabilities.MENTAL_HEALTH,
        label: messages['physical_disability.mental_health'],
      },
      {
        id: PhysicalDisabilities.INTELLECTUAL,
        label: messages['physical_disability.intellectual'],
      },
      {
        id: PhysicalDisabilities.PHYSICAL,
        label: messages['physical_disability.physical_disability'],
      },
      {
        id: PhysicalDisabilities.SPEECH,
        label: messages['physical_disability.speech'],
      },
      {
        id: PhysicalDisabilities.DEAF_BLINDNESS,
        label: messages['physical_disability.deaf_blindness'],
      },
      {
        id: PhysicalDisabilities.CEREBAL_PALSY,
        label: messages['physical_disability.cerebral_palsy'],
      },
      {
        id: PhysicalDisabilities.DOWN_SYNDROME,
        label: messages['physical_disability.down_syndrome'],
      },
      {
        id: PhysicalDisabilities.AUTISM_OR_AUTISM_SPECTRUM,
        label:
          messages['physical_disability.autism_or_autism_spectrum_disorder'],
      },
      {
        id: PhysicalDisabilities.MULTIPLE,
        label: messages['physical_disability.multiple'],
      },
      {
        id: PhysicalDisabilities.OTHER,
        label: messages['physical_disability.other'],
      },
    ],
    [messages],
  );

  const validationSchema = useMemo(() => {
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
      skills: yup
        .array()
        .of(yup.object())
        .min(1, messages['common.must_have_one_skill'] as string)
        .label(messages['common.skills'] as string),
      date_of_birth: yup
        .string()
        .nullable(true)
        .trim()
        .required()
        .matches(
          /(19|20)\d\d-[01]\d-[0123]\d/,
          messages['yup_validation_dd_mm_yyyy_format'] as string,
        )
        .label(messages['common.date_of_birth'] as string)
        .test(
          'DOB',
          messages['common.invalid_date_of_birth'] as string,
          (value) =>
            moment().diff(moment(value), 'years') >= DATE_OF_BIRTH_MIN_AGE,
        ),
      physical_disability_status: yup
        .string()
        .trim()
        .required()
        .label(messages['common.physical_disabilities_status'] as string),
      physical_disabilities:
        disabilityStatus == PhysicalDisabilityStatus.YES
          ? yup
              .array()
              .of(yup.object())
              .min(
                1,
                messages['common.must_have_one_physical_disability'] as string,
              )
              .label(messages['common.physical_disability'] as string)
          : yup.array().of(yup.object()),
      email: yup
        .string()
        .trim()
        .required()
        .email()
        .label(messages['common.email'] as string),
      mobile: yup
        .string()
        .trim()
        .required()
        .matches(MOBILE_NUMBER_REGEX)
        .label(messages['common.mobile_en'] as string),
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
            return Number(value) === DistrictOrCityCorporation.CITY_CORPORATION;
          },
          then: yup.string().required(),
        }),
      password: yup
        .string()
        .trim()
        .min(8)
        .required()
        .label(messages['common.password'] as string)
        .matches(TEXT_REGEX_PASSWORD),
      password_confirmation: yup
        .string()
        .label(messages['common.password'] as string)
        .oneOf(
          [yup.ref('password'), null],
          messages['password.not_matched'] as string,
        ),
      village_ward_area_en: yup.string().title('en', false),
      highest_education_info: yup.object().shape({
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
        foreign_institute_country_id: yup
          .string()
          // .required()
          .label(messages['education.foreign_institute_country'] as string)
          .when('is_foreign_institute', {
            is: (value: any) => value,
            then: yup.string().required(),
          }),
        institute_name: !checkedNUCheckbox
          ? yup
              .string()
              .title('bn', true)
              .label(messages['common.edu_institute_name_en'] as string)
          : yup
              .string()
              .title('bn', false)
              .label(messages['common.edu_institute_name_en'] as string),
        institute_name_en: yup
          .string()
          .trim()
          .nullable()
          .when('is_foreign_institute', {
            is: (value: any) => value,
            then: yup
              .string()
              .title('en', true)
              .label(messages['common.edu_institute_name_en'] as string),
            otherwise: yup
              .string()
              .title('en', false)
              .label(messages['common.edu_institute_name_en'] as string),
          }),
        education_level_id: yup
          .string()
          .required()
          .label(messages['education.education_level'] as string),
        exam_degree_id:
          selectedEducationLevel &&
          selectedEducationLevel.code != EducationLevelCodePHD
            ? yup
                .string()
                .required()
                .label(messages['education.education_exam_degree'] as string)
            : yup.string().nullable(),
        exam_degree_name:
          selectedEducationLevel &&
          selectedEducationLevel.code == EducationLevelCodePHD
            ? yup
                .string()
                .title('bn', true)
                .label(
                  messages['education.education_exam_degree_name_bn'] as string,
                )
            : yup.string().nullable(),
        exam_degree_name_en:
          selectedEducationLevel &&
          selectedEducationLevel.code == EducationLevelCodePHD
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
          EducationLevelForMajorGroup.includes(selectedEducationLevel.code)
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
          EducationLevelCodeWithBoard.includes(selectedEducationLevel.code)
            ? yup
                .string()
                .nullable()
                .label(messages['education.board'] as string)
                .when('is_foreign_institute', {
                  is: (value: any) => !value,
                  then: yup.string().required(),
                })
            : yup.string().nullable(),
        edu_group_id:
          selectedEducationLevel &&
          EducationLevelCodeWithGroup.includes(selectedEducationLevel.code)
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
          selectedResult && ResultCodeDivisions.includes(selectedResult.code)
            ? yup
                .number()
                .nullable()
                .required()
                .max(100)
                .label(messages['education.marks'] as string)
            : yup.string().nullable(),
        cgpa_scale:
          selectedResult && selectedResult.code == ResultCodeGrade
            ? yup
                .number()
                .nullable()
                .required()
                .max(5)
                .label(messages['education.cgpa_scale'] as string)
            : yup.string().nullable(),
        cgpa:
          selectedResult && selectedResult.code == ResultCodeGrade
            ? yup
                .number()
                .nullable()
                .required()
                .max(5)
                .label(messages['education.cgpa'] as string)
            : yup.string().nullable(),
        year_of_passing:
          selectedResult && selectedResult.code != ResultCodeDoNotMention
            ? yup
                .string()
                .required()
                .label(messages['education.passing_year'] as string)
            : yup.string().nullable(),
      }),
      career_fair_items: isWantToParticipate
        ? yup.object().shape({
            career_type: yup
              .string()
              .nullable()
              .required()
              .label(messages['common.career_type'] as string),
            electronic_devices: yup
              .array()
              .of(yup.object())
              .min(1, messages['common.must_select_one'] as string)
              .label(messages['common.type_of_electronic_device'] as string),
            intended_session: yup
              .string()
              .nullable()
              .required()
              .label(messages['common.intended_session'] as string),
            participated_trainings: yup
              .array()
              .of(yup.object())
              .min(1, messages['common.must_select_one'] as string)
              .label(messages['common.item'] as string),
            fair_expectations: yup
              .string()
              .label(messages['common.expectations'] as string),
            smart_bd_expectations: yup
              .string()
              .label(messages['common.smart_bd'] as string),
            fair_district_id: yup.number(),
          })
        : yup.object().shape({}),
    });
  }, [
    messages,
    selectedEducationLevel,
    selectedResult,
    isWantToParticipate,
    selectedExamDegree,
    isRunning,
    selectedGroup,
    checkedNUCheckbox,
  ]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: {errors, isSubmitting, submitCount},
  } = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });
  useEffect(() => {
    const retrievedSubscriptionData = localStorage.getItem(
      SUBSCRIPTION_DATA_KEY,
    );
    const subscriptionData: any = retrievedSubscriptionData
      ? JSON.parse(retrievedSubscriptionData)
      : null;

    setSubscriptionInfo(subscriptionData);
    initialValues.email = subscriptionData?.email;
    reset(initialValues);
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

  const onDisabilityStatusChange = useCallback((value: number) => {
    setDisabilityStatus(value);
  }, []);

  const onEducationLevelChange = useCallback((eduLevel) => {
    setSelectedEducationLevel(eduLevel);
  }, []);
  const onExamDegreeLevelChange = useCallback((eId) => {
    setSelectedExamDegree(eId);
  }, []);

  const onEduNUChange = useCallback((eId) => {
    setCheckedNUCheckbox(eId);
  }, []);

  const onEduIsForeignChange = useCallback((eId) => {
    setIsForeignInstitute(eId);
  }, []);

  const onEduGroupChange = useCallback((eId) => {
    setSelectedGroup(eId);
  }, []);
  const onEduRunningChange = useCallback((eId) => {
    setIsRunning(eId);
  }, []);

  console.log('errors', errors);
/*  const redirectToSSO = () => {
    if (router.query?.redirected_from) {
      window.location.href = getSSOLoginUrl({
        redirected_from: router.query.redirected_from,
      });
    } else {
      window.location.href = getSSOLoginUrl();
    }
  };*/
  const onSubmit: SubmitHandler<any> = async (formData: any) => {
    let data = _.cloneDeep(formData);

    if (data.is_interested_in_fair) {
      data.is_interested_in_fair = 1;
      if (!data.career_fair_items) {
        data.career_fair_items = {};
      }
      let electronicDevicesId: any[] = [];
      (data.career_fair_items?.electronic_devices || []).forEach(
        (item: any) => {
          electronicDevicesId.push(item.id);
        },
      );
      data.career_fair_items.electronic_devices = electronicDevicesId;

      let participatedTrainingsId: any[] = [];
      (data.career_fair_items?.participated_trainings || []).forEach(
        (item: any) => {
          participatedTrainingsId.push(item.id);
        },
      );
      data.career_fair_items.participated_trainings = participatedTrainingsId;
    } else {
      data.is_interested_in_fair = 0;
      delete data.career_fair_items;
    }

    try {
      const queryParam: any = {mobile: data?.mobile};
      if (router.query?.redirected_from) {
        queryParam.redirected_from = router.query.redirected_from;
      }

      data.user_name_type = UserNameType.MOBILE;
      if (data.physical_disability_status == PhysicalDisabilityStatus.NO) {
        delete data.physical_disabilities;
      } else {
        let physicalDisabilityIds: any = [];
        data.physical_disabilities.map((physical_disability: any) => {
          physicalDisabilityIds.push(physical_disability.id);
        });
        data.physical_disabilities = physicalDisabilityIds;
      }

      let skillIds: any = [];
      (data?.skills || []).map((skill: any) => {
        skillIds.push(skill.id);
      });
      data.skills = skillIds;
      if (data?.district_or_city_corporation) {
        if (
          Number(data?.district_or_city_corporation) ===
          DistrictOrCityCorporation.DISTRICT
        ) {
          data.loc_city_corporation_id = null;
        } else {
          data.loc_district_id = null;
          data.loc_upazila_municipality_type = null;
        }
      } else {
        data.loc_city_corporation_id = null;
        data.loc_district_id = null;
        data.loc_upazila_municipality_type = null;
      }
      if (!data?.loc_upazila_municipality_type) {
        data.loc_upazila_municipality_id = null;
        data.loc_union_id = null;
      } else {
        if (
          Number(data?.loc_upazila_municipality_type) ===
          UpazilaOrMunicipality.MUNICIPALITY
        ) {
          data.loc_union_id = null;
        }
      }
      delete data.loc_upazila_municipality_type;

      if (subscriptionInfo?.type) {
        data['subscription_types'] = subscriptionInfo.type;
      }
      data.highest_education_info.is_foreign_institute = 1;

      if (!isForeignInstitute) {
        data.highest_education_info.is_foreign_institute = 0;
        delete data.highest_education_info.foreign_institute_country_id;
      }
      if (!checkedNUCheckbox) {
        delete data.highest_education_info?.nu_institute_name;
        data.highest_education_info.is_national_university = 0;
      }
      data.highest_education_info.is_education_running = isRunning ? 1 : 0;
      data.highest_education_info.is_national_university = checkedNUCheckbox
        ? 1
        : 0;
      if (isRunning == 1) {
        delete data.result;
      }
      console.log('learnerRegistration', data);
      await learnerRegistration(data);

      successStack(<IntlMessages id='learner_registration.success' />);
      setIsFormSubmitted(true);
      //redirectToSSO();
      router
        .push({
          pathname: LINK_LEARNER_REGISTRATION_VERIFICATION,
          query: queryParam,
        })
        .then((r) => {});
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <StyledContainer maxWidth={'md'}>
      <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: '20px'}}>
        <BackButton url={(backUrl as string) || LINK_FRONTEND_INSTITUTE_ROOT} />
      </Box>
      <Paper className={classes.PaperBox}>
        <Typography
          tabIndex={0}
          variant={'h3'}
          style={{marginBottom: '20px', fontSize: '25px', fontWeight: 'bold'}}>
          {messages['common.registration']}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Grid container spacing={4} maxWidth={'md'}>
            {/*<Grid item xs={12}>
              <CustomCheckbox
                id='is_interested_in_fair'
                label={messages['common.career_fair']}
                register={register}
                errorInstance={errors}
                checked={isWantToParticipate}
                onChange={() => {
                  setIsWantToParticipate((prev) => !prev);
                }}
                isLoading={false}
              />
            </Grid>*/}
            {isWantToParticipate && (
              <Grid item xs={12} alignItems={'center'}>
                <fieldset
                  style={{padding: '10px', border: '1.5px solid #b8b1b1'}}>
                  <legend>{messages['common.smart_career_label']}</legend>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <CustomFormSelect
                        required
                        id='career_fair_items.career_type'
                        label={messages['common.career_type']}
                        isLoading={false}
                        control={control}
                        options={careerType}
                        optionTitleProp={['label']}
                        optionValueProp={'id'}
                        errorInstance={errors}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomSelectAutoComplete
                        required
                        id='career_fair_items.electronic_devices'
                        label={messages['common.type_of_electronic_device']}
                        control={control}
                        options={devices}
                        optionTitleProp={['label']}
                        optionValueProp={'id'}
                        errorInstance={errors}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormRadioButtons
                        required
                        id='career_fair_items.intended_session'
                        label={'common.intended_session'}
                        radios={[
                          {
                            key: IntendedSessions.workshop_with_freelancers,
                            label: messages['common.workshop_with_freelancers'],
                          },
                          {
                            key: IntendedSessions.workshop_with_entrepreneurs,
                            label:
                              messages['common.workshop_with_entrepreneurs'],
                          },
                          {
                            key: IntendedSessions.workshop_with_job_seekers,
                            label: messages['common.workshop_with_job_seekers'],
                          },
                        ]}
                        control={control}
                        defaultValue={
                          IntendedSessions.workshop_with_freelancers
                        }
                        isLoading={false}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{fontSize: '1.125rem', color: 'rgba(0,0,0,0.6)'}}>
                        {messages['common.did_you_participate']}
                      </Typography>
                      <CustomSelectAutoComplete
                        required
                        id='career_fair_items.participated_trainings'
                        label={messages['common.select']}
                        control={control}
                        options={training_participations}
                        optionTitleProp={['label']}
                        optionValueProp={'id'}
                        errorInstance={errors}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextInput
                        id='career_fair_items.fair_expectations'
                        label={messages['common.expectations']}
                        control={control}
                        errorInstance={errors}
                        isLoading={false}
                        multiline={true}
                        rows={3}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextInput
                        id='career_fair_items.smart_bd_expectations'
                        label={messages['common.smart_bd']}
                        control={control}
                        errorInstance={errors}
                        isLoading={false}
                        multiline={true}
                        rows={3}
                      />
                    </Grid>
                  </Grid>
                </fieldset>
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='first_name'
                label={messages['common.first_name_bn']}
                control={control}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='first_name_en'
                label={messages['common.first_name_en']}
                control={control}
                errorInstance={errors}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='last_name'
                label={messages['common.last_name_bn']}
                control={control}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='last_name_en'
                label={messages['common.last_name_en']}
                control={control}
                errorInstance={errors}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormRadioButtons
                required
                id='gender'
                label={'common.gender'}
                radios={[
                  {
                    key: Genders.MALE,
                    label: messages['common.male'],
                  },
                  {
                    key: Genders.FEMALE,
                    label: messages['common.female'],
                  },
                  {
                    key: Genders.OTHERS,
                    label: messages['common.others'],
                  },
                ]}
                control={control}
                defaultValue={Genders.MALE}
                isLoading={false}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomSelectAutoComplete
                required
                id='skills'
                label={messages['common.skills']}
                control={control}
                options={skills}
                optionTitleProp={['title']}
                optionValueProp={'id'}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormRadioButtons
                required
                id='physical_disability_status'
                label={'common.physical_disabilities_status'}
                radios={[
                  {
                    key: PhysicalDisabilityStatus.YES,
                    label: messages['common.yes'],
                  },
                  {
                    key: PhysicalDisabilityStatus.NO,
                    label: messages['common.no'],
                  },
                ]}
                control={control}
                defaultValue={'0'}
                isLoading={false}
                onChange={onDisabilityStatusChange}
              />
            </Grid>
            {disabilityStatus == PhysicalDisabilityStatus.YES && (
              <Grid item xs={12} md={6}>
                <CustomSelectAutoComplete
                  required
                  id='physical_disabilities'
                  label={messages['common.physical_disability']}
                  control={control}
                  options={physicalDisabilities}
                  optionTitleProp={['label']}
                  optionValueProp={'id'}
                  errorInstance={errors}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6} md={6}>
              <CustomDatePicker
                required
                id='date_of_birth'
                label={messages['common.date_of_birth']}
                control={control}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='email'
                label={messages['common.email']}
                control={control}
                errorInstance={errors}
                disabled={subscriptionInfo?.email}
                placeholder='example@gmail.com'
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='mobile'
                label={messages['common.mobile_en']}
                control={control}
                errorInstance={errors}
                placeholder='017xxxxxxxx'
              />
            </Grid>

            <AddressFormComponent
              control={control}
              errors={errors}
              label={messages['common.address_info'] as string}
              setValue={setValue}
              requiredField={['loc_division_id', 'loc_district_id']}
            />

            <EducationComponent
              label={
                messages['learner_registration.highest_education_info'] as string
              }
              errors={errors}
              register={register}
              control={control}
              selectedResult={selectedResult}
              setSelectedResult={setSelectedResult}
              setValue={setValue}
              onEducationLevelChange={onEducationLevelChange}
              onExamDegreeLevelChange={onExamDegreeLevelChange}
              onEduGroupChange={onEduGroupChange}
              onEduRunningChange={onEduRunningChange}
              onEduNUChange={onEduNUChange}
              onEduIsForeignChange={onEduIsForeignChange}
            />

            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='password'
                label={messages['common.password']}
                helperText={messages['common.passwordHint']}
                control={control}
                errorInstance={errors}
                type={'password'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='password_confirmation'
                label={messages['common.retype_password']}
                control={control}
                errorInstance={errors}
                type={'password'}
              />
            </Grid>

            <Grid item xs={12}>
              <SubmitButton
                startIcon={false}
                isSubmitting={isSubmitting}
                label={messages['common.create_account'] as string}
                size='large'
                isDisable={isSubmitting || isFormSubmitted}
              />
              <Typography
                sx={{
                  color: 'red',
                  marginLeft: '10px',
                  fontStyle: 'italic',
                  verticalAlign: 'middle',
                }}
                tabIndex={0}
                variant={'caption'}>
                *({messages['learner.registration_username_note']})
              </Typography>
              <Typography
                tabIndex={0}
                style={{marginTop: '15px'}}
                variant={'body1'}>
                {messages['common.already_have_account']}{' '}
                <Link
                  href={getSSOLoginUrl(router.query)}
                  className={classes.signInStyle}>
                  {messages['common.signin_here']}
                </Link>
              </Typography>
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
        </form>
      </Paper>
    </StyledContainer>
  );
};

export default YouthRegistration;
