import {Box, Grid, Zoom} from '@mui/material';
import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import CustomTextInput from '../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {
  getAllKeysFromErrorObj,
  getIdentityNumberFieldCaptionKey,
  getMomentDateFormat,
} from '../../../../@core/utilities/helpers';
import {processServerSideErrors} from '../../../../@core/utilities/validationErrorHandler';
import yup from '../../../../@core/libs/yup';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import {useIntl} from 'react-intl';
import CustomFormSelect from '../../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import CancelButton from '../../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../../@core/elements/button/SubmitButton/SubmitButton';
import CustomHookForm from '../component/CustomHookForm';
import {useFetchLocalizedSkills} from '../../../../services/learnerManagement/hooks';
import {updateYouthPersonalInfo} from '../../../../services/learnerManagement/YouthService';
import {YouthPersonalInfo} from '../../../../services/learnerManagement/typing';
import RowStatus from '../../../../@core/utilities/RowStatus';
import {
  MOBILE_NUMBER_REGEX,
  NID_REGEX,
} from '../../../../@core/common/patternRegex';
import FormRadioButtons from '../../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import Genders from '../../../../@core/utilities/Genders';
import PhysicalDisabilityStatus from '../../../../@core/utilities/PhysicalDisabilityStatus';
import UserNameType from '../../../../@core/utilities/UserNameType';
import PhysicalDisabilities from '../../../../@core/utilities/PhysicalDisabilities';
import MaritalStatus from '../../../../@core/utilities/MaritalStatus';
import FreedomFighterStatus from '../../../../@core/utilities/FreedomFighterStatus';
import Religions from '../../../../@core/utilities/Religions';
import CustomCheckbox from '../../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../../redux/types/models/CommonAuthUser';
import EthnicGroupStatus from '../../../../@core/utilities/EthnicGroupStatus';
import useSuccessMessage from '../../../../@core/hooks/useSuccessMessage';
import CustomFilterableFormSelect from '../../../../@core/elements/input/CustomFilterableFormSelect';
import FileUploadComponent from '../../../filepond/FileUploadComponent';
import AddressFormComponent from '../../../../@core/components/AddressFormComponent';
import {DistrictOrCityCorporation} from '../../../../@core/components/AddressFormComponent/addressEnum';
import CustomSelectAutoComplete from '../../registration/CustomSelectAutoComplete';
import _ from 'lodash';
import {styled} from '@mui/material/styles';
import NidAndBrnVerificationComponent from './NidAndBrnVerificationComponent';
import IdentityNumberTypes from '../../../../@core/utilities/IdentityNumberTypes';
import {DATE_OF_BIRTH_MIN_AGE} from '../../../../@core/common/constants';
import moment from 'moment';
import CustomDatePicker from '../../../../@core/elements/input/CustomDatePicker';

interface PersonalInformationEditProps {
  onClose: (loadProfile: boolean) => void;
}

const PREFIX = 'PersonalInformationEdit';
const classes = {
  textInputStyle: `${PREFIX}-textInputStyle`,
};

const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.textInputStyle}`]: {
    '& > .Mui-disabled': {
      color: 'rgba(0,0,0,0.6)',
    },
    '& > .Mui-disabled > .MuiInputBase-input': {
      color: 'black',
      '-webkit-text-fill-color': 'black',
    },
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
  marital_status: MaritalStatus.SINGLE,
  freedom_fighter_status: FreedomFighterStatus.NO,
  religion: Religions.ISLAM,
  nationality: '',
  identity_number: '',
  does_belong_to_ethnic_group: EthnicGroupStatus.NO,
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
  signature_image_path: '',
  cv_path: '',
  identity_number_type: '1',
};

const PersonalInformationEdit: FC<PersonalInformationEditProps> = ({
  onClose: onEditPageClose,
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {updateSuccessMessage} = useSuccessMessage();
  const authUser = useAuthUser<YouthAuthUser>();

  const nationalities = [
    {
      id: 1,
      title: messages['nationality.bangladeshi'],
    },
    {
      id: 2,
      title: messages['nationality.indian'],
    },
    {
      id: 3,
      title: messages['nationality.pakistani'],
    },
    {
      id: 4,
      title: messages['nationality.nepali'],
    },
  ];

  const [learnerSkillsFilter] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const {data: skills, isLoading: isLoadingSkills} =
    useFetchLocalizedSkills(learnerSkillsFilter);
  const [disabilityStatus, setDisabilityStatus] = useState<number>(
    PhysicalDisabilityStatus.NO,
  );
  const [userNameType, setUserNameType] = useState<number>(UserNameType.MOBILE);
  const [isBelongToEthnicGroup, setIsBelongToEthnicGroup] =
    useState<boolean>(false);
  const [identityNumberType, setIdentityNumberType] = useState<
    string | undefined
  >();

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
        .min(1)
        .max(15)
        .label(messages['common.skills'] as string),
      physical_disability_status: yup
        .string()
        .trim()
        .required()
        .label(messages['common.physical_disabilities_status'] as string),
      physical_disabilities:
        disabilityStatus == PhysicalDisabilityStatus.YES
          ? yup
              .array()
              .of(yup.number())
              .min(1)
              .label(messages['common.physical_disability'] as string)
          : yup.array().of(yup.number()),
      email:
        userNameType == UserNameType.EMAIL
          ? yup.string()
          : yup
              .string()
              .trim()
              .required()
              .email()
              .label(messages['common.email'] as string),
      mobile:
        userNameType == UserNameType.MOBILE
          ? yup.string()
          : yup
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
      bio_en: yup.string().title('en', false),
      village_ward_area_en: yup.string().title('en', false),
      identity_number: yup
        .string()
        .trim()
        .required()
        .matches(NID_REGEX)
        .label(messages['common.identity_number'] as string),
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
    });
  }, [messages, userNameType, disabilityStatus, identityNumberType]);

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

  const maritalStatus = useMemo(
    () => [
      {
        id: MaritalStatus.SINGLE,
        label: messages['common.marital_status_single'],
      },
      {
        id: MaritalStatus.MARRIED,
        label: messages['common.marital_status_married'],
      },
      {
        id: MaritalStatus.WIDOWED,
        label: messages['common.marital_status_widowed'],
      },
      {
        id: MaritalStatus.DIVORCED,
        label: messages['common.marital_status_divorced'],
      },
    ],
    [messages],
  );

  const freedomFighterStatus = useMemo(
    () => [
      {
        id: FreedomFighterStatus.NO,
        label: messages['common.no'],
      },
      {
        id: FreedomFighterStatus.YES,
        label: messages['common.yes'],
      },
      {
        id: FreedomFighterStatus.CHILD,
        label: messages['freedom_fighter_status.child'],
      },
      {
        id: FreedomFighterStatus.GRAND_CHILD,
        label: messages['freedom_fighter_status.grand_child'],
      },
    ],
    [messages],
  );

  const religions = useMemo(
    () => [
      {
        id: Religions.ISLAM,
        label: messages['common.religion_islam'],
      },
      {
        id: Religions.HINDUISM,
        label: messages['common.religion_hinduism'],
      },
      {
        id: Religions.CHRISTIANITY,
        label: messages['common.religion_christianity'],
      },
      {
        id: Religions.BUDDHISM,
        label: messages['common.religion_buddhism'],
      },
      {
        id: Religions.JUDAISM,
        label: messages['common.religion_judaism'],
      },
      {
        id: Religions.SIKHISM,
        label: messages['common.religion_sikhism'],
      },
      {
        id: Religions.ETHNIC,
        label: messages['common.religion_ethnic'],
      },
      {
        id: Religions.ATHEIST,
        label: messages['common.religion_atheist'],
      },
    ],
    [messages],
  );

  const {
    register,
    reset,
    handleSubmit,
    setError,
    control,
    setValue,
    formState: {errors, isSubmitting, submitCount},
  } = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });
  console.log('error ', errors);

  useEffect(() => {
    if (authUser) {
      reset({
        first_name: authUser?.first_name,
        first_name_en: authUser?.first_name_en,
        last_name: authUser?.last_name,
        last_name_en: authUser?.last_name_en,
        gender: authUser?.gender,
        email: authUser?.email,
        mobile: authUser?.mobile,
        skills: authUser?.skills ?? [],
        physical_disability_status: authUser?.physical_disability_status,
        physical_disabilities: getPhysicalDisabilityIds(
          authUser?.physical_disabilities,
        ),
        freedom_fighter_status: authUser?.freedom_fighter_status,
        identity_number_type: authUser?.identity_number_type ?? '1',
        identity_number: authUser?.identity_number,
        marital_status: authUser?.marital_status,
        religion: authUser?.religion,
        nationality: authUser?.nationality,
        date_of_birth: getMomentDateFormat(
          authUser?.date_of_birth,
          'YYYY-MM-DD',
        ),
        loc_division_id: authUser?.loc_division_id,
        loc_district_id: authUser?.loc_district_id,
        loc_union_id: authUser?.loc_union_id,
        loc_upazila_municipality_id: authUser?.loc_upazila_municipality_id,
        district_or_city_corporation: authUser?.district_or_city_corporation,
        loc_upazila_municipality_type: authUser?.loc_upazila_municipality_type,
        loc_city_corporation_id: authUser?.loc_city_corporation_id,
        village_ward_area: authUser?.village_ward_area,
        village_ward_area_en: authUser?.village_ward_area_en,
        zip_or_postal_code: authUser?.zip_or_postal_code,
        bio: authUser?.bio,
        bio_en: authUser?.bio_en,
        photo: authUser?.photo,
        signature_image_path: authUser?.signature_image_path,
        cv_path: authUser?.cv_path,
      });
      setIdentityNumberType(authUser?.identity_number_type ?? '1');
      setIsBelongToEthnicGroup(
        authUser?.does_belong_to_ethnic_group == EthnicGroupStatus.YES,
      );
      setDisabilityStatus(authUser?.physical_disability_status);
      setUserNameType(authUser?.user_name_type);
    } else {
      reset(initialValues);
      setIdentityNumberType('1');
    }
  }, [authUser]);

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

  const onDisabilityStatusChange = useCallback((value: number) => {
    setDisabilityStatus(value);
  }, []);

  const onIdentityTypeChange = useCallback((value: string) => {
    setIdentityNumberType(value);
  }, []);

  const onSubmit: SubmitHandler<YouthPersonalInfo> = async (
    data: YouthPersonalInfo,
  ) => {
    let formData = _.cloneDeep(data);
    if (formData.physical_disability_status == PhysicalDisabilityStatus.NO) {
      delete formData.physical_disabilities;
    }
    formData.does_belong_to_ethnic_group = isBelongToEthnicGroup
      ? EthnicGroupStatus.YES
      : EthnicGroupStatus.NO;

    formData.skills = (data?.skills || []).map((skill: any) => skill.id);

    //delete formData?.date_of_birth;
    //delete formData?.identity_number;

    try {
      await updateYouthPersonalInfo(formData);
      updateSuccessMessage('personal_info.label');
      onEditPageClose(true);
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <Zoom in={true}>
      <StyledBox>
        <CustomHookForm
          title={messages['personal_info_edit.label']}
          handleSubmit={handleSubmit(onSubmit)}
          actions={
            <React.Fragment>
              <CancelButton
                onClick={() => onEditPageClose(false)}
                isLoading={false}
              />
              <SubmitButton
                isSubmitting={isSubmitting}
                isLoading={false}
                disabled={
                  isSubmitting
                    ? isSubmitting
                    : !Boolean(authUser?.nid_brn_verified_at)
                }
              />
            </React.Fragment>
          }
          onClose={() => onEditPageClose(false)}>
          <Grid container spacing={2}>
            {!authUser?.nid_brn_verified_at && (
              <NidAndBrnVerificationComponent />
            )}

            <Grid item xs={12} md={12}>
              <FileUploadComponent
                id='photo'
                defaultFileUrl={authUser?.photo}
                errorInstance={errors}
                setValue={setValue}
                register={register}
                label={messages['common.profile_picture_upload']}
                required={false}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='first_name'
                label={messages['common.first_name_bn']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='first_name_en'
                label={messages['common.first_name_en']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='last_name'
                label={messages['common.last_name_bn']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='last_name_en'
                label={messages['common.last_name_en']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
            {authUser?.user_name_type != UserNameType.EMAIL && (
              <Grid item xs={12} md={6}>
                <CustomTextInput
                  required
                  id='email'
                  label={messages['common.email']}
                  control={control}
                  errorInstance={errors}
                  isLoading={false}
                  placeholder='example@gmail.com'
                />
              </Grid>
            )}
            {authUser?.user_name_type != UserNameType.MOBILE && (
              <Grid item xs={12} md={6}>
                <CustomTextInput
                  id='mobile'
                  label={messages['common.mobile_en']}
                  control={control}
                  errorInstance={errors}
                  isLoading={false}
                  placeholder='017xxxxxxxx'
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <CustomSelectAutoComplete
                required
                id='skills'
                label={messages['common.skills']}
                isLoading={isLoadingSkills}
                control={control}
                options={skills || []}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
                defaultValue={[]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormRadioButtons
                id='identity_number_type'
                label={'common.identity_number_type'}
                radios={[
                  {
                    key: IdentityNumberTypes.NID,
                    label: messages['common.nid_only'],
                  },
                  {
                    key: IdentityNumberTypes.BIRTH_CERT,
                    label: messages['common.birth_certificate_only'],
                  },
                ]}
                control={control}
                defaultValue={identityNumberType}
                isLoading={false}
                onChange={onIdentityTypeChange}
              />
            </Grid>
            {identityNumberType && (
              <Grid item xs={12} md={6}>
                <CustomTextInput
                  required
                  id='identity_number'
                  label={
                    messages[
                      getIdentityNumberFieldCaptionKey(identityNumberType)
                    ]
                  }
                  isLoading={false}
                  control={control}
                  errorInstance={errors}
                  //disabled={true}
                  className={classes.textInputStyle}
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <CustomDatePicker
                required
                id='date_of_birth'
                label={messages['common.date_of_birth']}
                isLoading={false}
                control={control}
                errorInstance={errors}
              />
              {/*<CustomTextInput
                required
                id='date_of_birth'
                label={messages['common.date_of_birth']}
                control={control}
                errorInstance={errors}
                isLoading={false}
                //disabled={true}
                className={classes.textInputStyle}
              />*/}
            </Grid>
            <Grid item xs={12} md={6}>
              <FormRadioButtons
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

            <Grid item xs={6}>
              <CustomFilterableFormSelect
                id='marital_status'
                label={messages['common.marital_status']}
                isLoading={false}
                control={control}
                options={maritalStatus}
                optionValueProp={'id'}
                optionTitleProp={['label']}
                errorInstance={errors}
              />
            </Grid>

            <Grid item xs={6}>
              <CustomFilterableFormSelect
                id='nationality'
                label={messages['common.nationality']}
                isLoading={false}
                control={control}
                options={nationalities}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
              />
            </Grid>

            <Grid item xs={6}>
              <CustomFilterableFormSelect
                id='religion'
                label={messages['common.religion']}
                isLoading={false}
                control={control}
                options={religions}
                optionValueProp={'id'}
                optionTitleProp={['label']}
                errorInstance={errors}
              />
            </Grid>

            <Grid item xs={6}>
              <CustomFilterableFormSelect
                id='freedom_fighter_status'
                label={messages['common.freedom_fighter_status']}
                isLoading={false}
                control={control}
                options={freedomFighterStatus}
                optionValueProp={'id'}
                optionTitleProp={['label']}
                errorInstance={errors}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormRadioButtons
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
                defaultValue={String(PhysicalDisabilityStatus.NO)}
                isLoading={false}
                onChange={onDisabilityStatusChange}
              />
            </Grid>

            {disabilityStatus == 1 && (
              <Grid item xs={12} md={6}>
                <CustomFormSelect
                  id='physical_disabilities'
                  label={messages['common.physical_disability']}
                  isLoading={false}
                  control={control}
                  options={physicalDisabilities}
                  optionValueProp={'id'}
                  optionTitleProp={['label']}
                  errorInstance={errors}
                  multiple={true}
                  defaultValue={[]}
                />
              </Grid>
            )}

            <AddressFormComponent
              control={control}
              errors={errors}
              label={messages['common.address_info'] as string}
              itemData={authUser}
              setValue={setValue}
              requiredField={['loc_division_id', 'loc_district_id']}
            />
            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='bio'
                label={messages['common.bio']}
                control={control}
                errorInstance={errors}
                isLoading={false}
                multiline={true}
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='bio_en'
                label={messages['common.bio_en']}
                control={control}
                errorInstance={errors}
                isLoading={false}
                multiline={true}
                rows={3}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FileUploadComponent
                id='cv_path'
                defaultFileUrl={authUser?.cv_path}
                errorInstance={errors}
                setValue={setValue}
                register={register}
                label={messages['common.cv']}
                required={false}
                acceptedFileTypes={['image/*', 'application/pdf']}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FileUploadComponent
                id='signature_image_path'
                defaultFileUrl={authUser?.signature_image_path}
                errorInstance={errors}
                setValue={setValue}
                register={register}
                label={messages['common.signature']}
                required={false}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomCheckbox
                id='does_belong_to_ethnic_group'
                label={messages['learner_registration.ethnic_group']}
                register={register}
                errorInstance={errors}
                checked={isBelongToEthnicGroup}
                onChange={() => {
                  setIsBelongToEthnicGroup((prev) => !prev);
                }}
                isLoading={false}
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
      </StyledBox>
    </Zoom>
  );
};

export default PersonalInformationEdit;
