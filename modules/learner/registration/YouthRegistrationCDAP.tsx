import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {styled} from '@mui/material/styles';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import CustomSelectAutoComplete from './CustomSelectAutoComplete';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import {SubmitHandler, useForm} from 'react-hook-form';
import {Container, Grid, Paper, Typography} from '@mui/material';
import CustomDateTimeField from '../../../@core/elements/input/CustomDateTimeField';
import {useIntl} from 'react-intl';
import yup from '../../../@core/libs/yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {MOBILE_NUMBER_REGEX} from '../../../@core/common/patternRegex';
import RowStatus from '../../../@core/utilities/RowStatus';
import Genders from '../../../@core/utilities/Genders';
import FormRadioButtons from '../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import {useFetchLocalizedSkills} from '../../../services/learnerManagement/hooks';
import {learnerRegistrationCDAP} from '../../../services/learnerManagement/YouthRegistrationService';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import PhysicalDisabilities from '../../../@core/utilities/PhysicalDisabilities';
import PhysicalDisabilityStatus from '../../../@core/utilities/PhysicalDisabilityStatus';
import UserNameType from '../../../@core/utilities/UserNameType';
import {useRouter} from 'next/router';
import moment from 'moment';
import {
  DATE_OF_BIRTH_MIN_AGE,
  learnerDomain,
} from '../../../@core/common/constants';
import {
  getBrowserCookie,
  removeBrowserCookie,
  setBrowserCookie,
} from '../../../@core/libs/cookieInstance';
import {
  COOKIE_KEY_AUTH_ACCESS_TOKEN,
  COOKIE_KEY_AUTH_ID_TOKEN,
  COOKIE_KEY_AUTH_REFRESH_TOKEN,
  COOKIE_KEY_CDAP_SESSION_STATE,
  COOKIE_KEY_CDAP_USER_DATA,
  COOKIE_KEY_TEMP_CALLBACK_INFO,
  COOKIE_KEY_TEMP_ID_TOKEN,
} from '../../../shared/constants/AppConst';
import {LINK_FRONTEND_LEARNER_FEED} from '../../../@core/common/appLinks';
import AddressFormComponent from '../../../@core/components/AddressFormComponent';
import {
  DistrictOrCityCorporation,
  UpazilaOrMunicipality,
} from '../../../@core/components/AddressFormComponent/addressEnum';

const PREFIX = 'YouthRegistrationCDAP';

const classes = {
  rootContainer: `${PREFIX}-rootContainer`,
  PaperBox: `${PREFIX}-PaperBox`,
  signInStyle: `${PREFIX}-signInStyle`,
};

const StyledContainer = styled(Container)(({theme}) => ({
  display: 'flex',
  [theme.breakpoints.only('xs')]: {
    height: 'calc(100vh - 56px)',
  },
  [theme.breakpoints.only('sm')]: {
    height: 'calc(100vh - 75px)',
  },

  [`& .${classes.PaperBox}`]: {
    padding: 40,
    margin: '70px auto',
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
  zip_or_postal_code: '',
};

const YouthRegistration = () => {
  const {messages} = useIntl();
  const {errorStack, successStack} = useNotiStack();
  const router = useRouter();

  const [CDAPUserData] = useState<any>(
    getBrowserCookie(COOKIE_KEY_CDAP_USER_DATA),
  );

  //const callbackInfo = getBrowserCookie(COOKIE_KEY_CALLBACK_INFO);
  const cookieIdToken = getBrowserCookie(COOKIE_KEY_TEMP_ID_TOKEN);
  const callbackInfo = getBrowserCookie(COOKIE_KEY_TEMP_CALLBACK_INFO);

  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [learnerSkillsFilter] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const {data: skills} = useFetchLocalizedSkills(learnerSkillsFilter);
  const [disabilityStatus, setDisabilityStatus] = useState<number>(
    PhysicalDisabilityStatus.NO,
  );

  const [itemData, setItemData] = useState<any>(null);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      first_name: yup
        .string()
        .title('bn')
        .label(messages['common.first_name_bn'] as string),
      first_name_en: yup
        .string()
        .title('en', true)
        .label(messages['common.first_name_en'] as string),
      last_name: yup
        .string()
        .title('bn')
        .label(messages['common.last_name_bn'] as string),
      last_name_en: yup
        .string()
        .title('en', true)
        .label(messages['common.last_name_en'] as string),
      skills: yup
        .array()
        .of(yup.object())
        .min(1, messages['common.must_have_one_skill'] as string)
        .label(messages['common.skills'] as string)
        .required(),
      date_of_birth: yup
        .string()
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
          then: yup
            .string()
            .required()
            .label(messages['districts.label'] as string),
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
          then: yup
            .string()
            .required()
            .label(messages['city_corporation.label'] as string),
        }),
      zip_or_postal_code: yup
        .mixed()
        .label(messages['common.zip_or_postal_code'] as string)
        .test(
          'min_max_check',
          messages['common.four_digit'] as string,
          (value) => !value || Boolean(value.length === 4),
        ),
    });
  }, [messages]);

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
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  console.log('form errors: ', errors);
  useEffect(() => {
    if (CDAPUserData) {
      const data = {...initialValues, ...CDAPUserData};
      console.log('data reset in form->', data);
      setItemData(data);
      reset(data);
    } else {
      reset(initialValues);
    }
  }, [CDAPUserData]);

  const onDisabilityStatusChange = useCallback((value: number) => {
    setDisabilityStatus(value);
  }, []);

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
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

      console.log('submittedData:', data);

      await learnerRegistrationCDAP(data, callbackInfo);

      let expireDate = new Date();
      expireDate.setTime(
        new Date().getTime() + Number(callbackInfo?.expires_in) * 10000,
      );

      await setBrowserCookie(
        COOKIE_KEY_CDAP_SESSION_STATE,
        callbackInfo?.session_state,
      );

      await setBrowserCookie(
        COOKIE_KEY_AUTH_ACCESS_TOKEN,
        callbackInfo?.access_token,
        {expires: expireDate},
      );
      await setBrowserCookie(
        COOKIE_KEY_AUTH_REFRESH_TOKEN,
        callbackInfo?.refresh_token,
      );
      await setBrowserCookie(COOKIE_KEY_AUTH_ID_TOKEN, cookieIdToken, {
        expires: expireDate,
      });

      successStack(<IntlMessages id='learner_registration.success' />);
      setIsFormSubmitted(true);

      removeBrowserCookie(COOKIE_KEY_CDAP_USER_DATA);
      //removeBrowserCookie(COOKIE_KEY_CALLBACK_INFO);
      removeBrowserCookie(COOKIE_KEY_TEMP_ID_TOKEN);
      removeBrowserCookie(COOKIE_KEY_TEMP_CALLBACK_INFO);
      router.push(learnerDomain() + LINK_FRONTEND_LEARNER_FEED).then((r) => {});
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <StyledContainer maxWidth={'md'}>
      <Paper className={classes.PaperBox}>
        <Typography
          variant={'h6'}
          style={{marginBottom: '20px', fontSize: '25px', fontWeight: 'bold'}}>
          {messages['cdap.required_info']}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
          <Grid container spacing={4} maxWidth={'md'}>
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
              <CustomDateTimeField
                required
                id='date_of_birth'
                label={messages['common.date_of_birth']}
                register={register}
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
                placeholder='example@gmail.com'
                disabled={Boolean(CDAPUserData?.email)}
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
                disabled={Boolean(CDAPUserData?.mobile)}
              />
            </Grid>
            {CDAPUserData?.nid && (
              <Grid item xs={12} md={6}>
                <CustomTextInput
                  id='identity_number'
                  label={messages['common.identity_type_nid']}
                  isLoading={false}
                  control={control}
                  errorInstance={errors}
                  disabled={Boolean(CDAPUserData?.nid)}
                />
              </Grid>
            )}
            <AddressFormComponent
              control={control}
              errors={errors}
              label={messages['common.address_info'] as string}
              setValue={setValue}
              requiredField={['loc_division_id', 'loc_district_id']}
              withFieldSet={true}
              itemData={itemData}
              component={
                <Grid item xs={12} md={6}>
                  <CustomTextInput
                    id='zip_or_postal_code'
                    label={messages['common.zip_or_postal_code']}
                    isLoading={false}
                    control={control}
                    errorInstance={errors}
                  />
                </Grid>
              }
            />

            <Grid item xs={12} sx={{textAlign: 'center', mt: 2}}>
              <SubmitButton
                startIcon={false}
                isSubmitting={isSubmitting}
                label={messages['common.submit'] as string}
                size='large'
                isDisable={isSubmitting || isFormSubmitted}
              />
            </Grid>
          </Grid>
        </form>
      </Paper>
    </StyledContainer>
  );
};

export default YouthRegistration;
