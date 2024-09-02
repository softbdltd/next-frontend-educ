import yup from '../../../@core/libs/yup';
import {Grid} from '@mui/material';
import {
  createTrainer,
  updateTrainer,
} from '../../../services/instituteManagement/TrainerService';
import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {
  MOBILE_NUMBER_REGEX,
  NID_REGEX,
  TEXT_REGEX_ENGLISH_CHARACTERS_ONLY,
} from '../../../@core/common/patternRegex';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {useIntl} from 'react-intl';
import {
  getMomentDateFormat,
  objectFilter,
} from '../../../@core/utilities/helpers';
import IntlMessages from '../../../@core/utility/IntlMessages';
import FormRowStatus from '../../../@core/elements/input/FormRowStatus/FormRowStatus';
import CustomFormSelect from '../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import RowStatus from '../../../@core/utilities/RowStatus';
import IconTrainer from '../../../@core/icons/IconTrainer';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {ITrainer} from '../../../shared/Interface/institute.interface';

import {
  useFetchLocalizedBranches,
  useFetchLocalizedInstitutes,
  useFetchLocalizedTrainingCenters,
  useFetchTrainer,
} from '../../../services/instituteManagement/hooks';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import FormRadioButtons from '../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import FileUploadComponent from '../../filepond/FileUploadComponent';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {useFetchLocalizedRoles} from '../../../services/userManagement/hooks';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import CustomSelectAutoComplete from '../../learner/registration/CustomSelectAutoComplete';
import {useFetchLocalizedSkills} from '../../../services/learnerManagement/hooks';
import {Gender} from '../../industry/enrollment/constants/GenderEnums';
import moment from 'moment';
import {DATE_OF_BIRTH_MIN_AGE} from '../../../@core/common/constants';
import {InstituteServiceTypes} from '../../../@core/utilities/InstituteServiceTypes';
import CustomCheckbox from '../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import AddressFormComponent from '../../../@core/components/AddressFormComponent';
import {DistrictOrCityCorporation} from '../../../@core/components/AddressFormComponent/addressEnum';
import CustomDatePicker from '../../../@core/elements/input/CustomDatePicker';

interface TrainerAddEditPopupProps {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  trainer_first_name_en: '',
  trainer_last_name_en: '',
  trainer_first_name: '',
  trainer_last_name: '',
  institute_id: '',
  industry_association_id: '',
  branch_id: '',
  training_center_id: '',
  trainer_registration_number: '',
  email: '',
  subject: '',
  subject_en: '',
  mobile: '',
  about_me: '',
  about_me_en: '',
  gender: '1',
  marital_status: '0',
  religion: '',
  nationality: '',
  role_id: '',
  nid: '',
  passport_number: '',
  present_address_division_id: '',
  present_address_district_id: '',
  present_address_upazila_id: '',
  permanent_address_division_id: '',
  permanent_address_district_id: '',
  permanent_address_upazila_id: '',
  present_house_address: '',
  present_house_address_en: '',
  permanent_house_address: '',
  permanent_house_address_en: '',
  educational_qualification: '',
  educational_qualification_en: '',
  photo: '',
  signature: '',
  skills: [],
  skills_en: '',
  row_status: '1',
  is_same_as_present_address: false,
};

const TrainerAddEditPopup: FC<TrainerAddEditPopupProps> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const [permanentAddressDisabled, setPermanentAddressDisabled] =
    useState<boolean>(false);
  const isEdit = itemId != null;
  const authUser = useAuthUser<CommonAuthUser>();

  const genders = [
    {
      key: Gender.MALE,
      label: messages['common.male'],
    },
    {
      key: Gender.FEMALE,
      label: messages['common.female'],
    },
    {
      key: Gender.OTHERS,
      label: messages['common.others'],
    },
  ];

  const marital_status = [
    {
      key: 0,
      label: messages['common.unmarried'],
    },
    {
      key: 1,
      label: messages['common.marital_status_married'],
    },
  ];

  const religions = [
    {
      id: 1,
      label: messages['common.religion_islam'],
    },
    {
      id: 2,
      label: messages['common.religion_hinduism'],
    },
    {
      id: 3,
      label: messages['common.religion_christianity'],
    },
    {
      id: 4,
      label: messages['common.religion_buddhism'],
    },
    {
      id: 5,
      label: messages['common.notDefined'],
    },
  ];

  const {
    data: itemData,
    isLoading: isLoading,
    mutate: mutateTrainer,
  } = useFetchTrainer(itemId);

  const [instituteFilters, setInstituteFilters] = useState<any>(null);
  const [branchFilters, setBranchFilters] = useState<any>(null);
  const [trainingCenterFilters, setTrainingCenterFilters] = useState<any>(null);

  const {data: institutes, isLoading: isLoadingInstitutes} =
    useFetchLocalizedInstitutes(instituteFilters);

  const {data: branches, isLoading: isLoadingBranches} =
    useFetchLocalizedBranches(branchFilters);

  const {data: trainingCenters, isLoading: isLoadingTrainingCenters} =
    useFetchLocalizedTrainingCenters(trainingCenterFilters);

  const [roleFilter] = useState({});
  const {data: roles, isLoading: isLoadingRoles} =
    useFetchLocalizedRoles(roleFilter);

  const [skillFilter] = useState({});
  const {data: skills, isLoading: isLoadingSkills} =
    useFetchLocalizedSkills(skillFilter);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      trainer_first_name: yup
        .string()
        .title('bn', true)
        .label(messages['common.first_name'] as string),
      trainer_first_name_en: yup
        .string()
        .title('en', true)
        .label(messages['common.first_name_en'] as string),
      trainer_last_name: yup
        .string()
        .title('bn', true)
        .label(messages['common.last_name'] as string),
      trainer_last_name_en: yup
        .string()
        .title('en', true)
        .label(messages['common.last_name_en'] as string),
      mobile: yup
        .string()
        .trim()
        .required()
        .matches(MOBILE_NUMBER_REGEX)
        .label(messages['common.mobile_en'] as string),
      email: yup
        .string()
        .required()
        .email()
        .label(messages['common.email'] as string),
      gender: yup
        .string()
        .required()
        .label(messages['common.gender'] as string),
      subject: yup
        .string()
        .required()
        .label(messages['common.subject'] as string),
      subject_en: yup
        .string()
        .title('en', false)
        .label(messages['common.subject_en'] as string),
      marital_status: yup
        .string()
        .required()
        .label(messages['common.marital_status'] as string),
      skills: yup
        .array()
        .of(yup.object())
        .min(1, messages['common.must_have_one_skill'] as string)
        .label(messages['common.skills'] as string),
      role_id: !isEdit
        ? yup
            .string()
            .trim()
            .required()
            .label(messages['role.label'] as string)
        : yup.string(),
      present_address_division_id: yup
        .string()
        .trim()
        .required()
        .label(messages['common.division_title_present_address'] as string),
      present_address_district_or_city_corporation: yup
        .string()
        .trim()
        .label(messages['label.district_or_city_corporation'] as string)
        .required(),
      present_address_district_id: yup
        .string()
        .trim()
        .nullable()
        .label(messages['common.district_title_present_address'] as string)
        .when('district_or_city_corporation', {
          is: (value: any) => {
            return Number(value) === DistrictOrCityCorporation.DISTRICT;
          },
          then: yup
            .string()
            .required()
            .label(messages['common.district_title_present_address'] as string),
        }),
      present_address_city_corporation_id: yup
        .string()
        .trim()
        .nullable()
        .label(
          messages['common.city_corporartion_title_present_address'] as string,
        )
        .when('present_address_district_or_city_corporation', {
          is: (value: any) => {
            return Number(value) === DistrictOrCityCorporation.CITY_CORPORATION;
          },
          then: yup
            .string()
            .required()
            .label(
              messages[
                'common.city_corporartion_title_present_address'
              ] as string,
            ),
        }),
      nid: yup
        .mixed()
        .label(messages['common.nid_en'] as string)
        .test(
          'nid_validation',
          messages['common.nid_validation'] as string,
          (value) => !value || Boolean(value.match(NID_REGEX)),
        ),
      institute_id: authUser?.isSystemUser
        ? yup
            .string()
            .trim()
            .required()
            .label(messages['institute.label'] as string)
        : yup.string().nullable(),
      nationality: yup
        .string()
        .trim()
        .required()
        .matches(TEXT_REGEX_ENGLISH_CHARACTERS_ONLY)
        .label(messages['common.nationality_en'] as string),
      date_of_birth: yup
        .string()
        .nullable(true)
        .trim()
        .required()
        .matches(/(19|20)\d\d-[01]\d-[0123]\d/)
        .test(
          'DOB',
          messages['common.invalid_date_of_birth'] as string,
          (value) =>
            moment().diff(moment(value), 'years') >= DATE_OF_BIRTH_MIN_AGE,
        )
        .label(messages['common.date_of_birth'] as string),
      is_same_as_present_address: yup
        .boolean()
        .required()
        .label(messages['course_registration.is_permanent'] as string),
      present_address_village_ward_area_en: yup
        .string()
        .title('en', false)
        .label(messages['common.village_house_en'] as string),
      permanent_address_village_ward_area_en: yup
        .string()
        .title('en', false)
        .label(messages['common.village_house_en'] as string),
      about_me_en: yup
        .string()
        .title('en', false)
        .label(messages['common.about_me'] as string),
      educational_qualification_en: yup
        .string()
        .title('en', false)
        .label(messages['common.educational_qualification_en'] as string),
    });
  }, [messages]);

  const {
    register,
    control,
    reset,
    handleSubmit,
    setError,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm<ITrainer>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (authUser?.isSystemUser) {
      setInstituteFilters({row_status: RowStatus.ACTIVE});
    }

    if (
      authUser?.isInstituteUser &&
      String(authUser?.institute?.service_type) !=
        InstituteServiceTypes.CERTIFICATE &&
      !authUser?.isTrainingCenterUser
    ) {
      setBranchFilters({
        row_status: RowStatus.ACTIVE,
      });

      setTrainingCenterFilters({
        row_status: RowStatus.ACTIVE,
      });
    }
  }, [authUser]);

  useEffect(() => {
    if (itemData) {
      reset({
        trainer_first_name_en: itemData?.trainer_first_name_en,
        trainer_first_name: itemData?.trainer_first_name,
        trainer_last_name_en: itemData?.trainer_last_name_en,
        trainer_last_name: itemData?.trainer_last_name,
        institute_id: itemData?.institute_id,
        industry_association_id: itemData?.industry_association_id,
        branch_id: itemData?.branch_id,
        training_center_id: itemData?.training_center_id,
        trainer_registration_number: itemData?.trainer_registration_number,
        email: itemData?.email,
        role_id: itemData?.role_id,
        mobile: itemData?.mobile,
        about_me: itemData?.about_me,
        about_me_en: itemData?.about_me_en,
        gender: itemData?.gender,
        subject: itemData?.subject,
        subject_en: itemData?.subject_en,
        marital_status: itemData?.marital_status,
        religion: itemData?.religion,
        date_of_birth: itemData?.date_of_birth
          ? getMomentDateFormat(itemData.date_of_birth, 'YYYY-MM-DD')
          : null,
        nationality: itemData?.nationality,
        nid: itemData?.nid,
        passport_number: itemData?.passport_number,

        present_address_division_id: itemData?.present_address_division_id,
        present_address_district_or_city_corporation:
          itemData?.present_address_district_or_city_corporation,
        present_address_district_id: itemData?.present_address_district_id,
        present_address_upazila_municipality_id:
          itemData?.present_address_upazila_municipality_id,
        present_address_city_corporation_id:
          itemData?.present_address_city_corporation_id,
        present_address_union_id: itemData?.present_address_union_id,
        present_address_village_ward_area:
          itemData?.present_address_village_ward_area,
        present_address_village_ward_area_en:
          itemData?.present_address_village_ward_area_en,

        permanent_address_division_id: itemData?.permanent_address_division_id,
        permanent_address_district_or_city_corporation:
          itemData?.permanent_address_district_or_city_corporation,
        permanent_address_district_id: itemData?.permanent_address_district_id,
        permanent_address_upazila_municipality_id:
          itemData?.permanent_address_upazila_municipality_id,
        permanent_address_city_corporation_id:
          itemData?.permanent_address_city_corporation_id,
        permanent_address_union_id: itemData?.permanent_address_union_id,
        permanent_address_village_ward_area:
          itemData?.permanent_address_village_ward_area,
        permanent_address_village_ward_area_en:
          itemData?.permanent_address_village_ward_area_en,

        educational_qualification: itemData?.educational_qualification,
        educational_qualification_en: itemData?.educational_qualification_en,
        photo: itemData?.photo,
        signature: itemData?.signature,
        skills: itemData?.skills,
        row_status: String(itemData?.row_status),
        is_same_as_present_address: Boolean(
          itemData?.is_same_as_present_address,
        ),
      });

      setPermanentAddressDisabled(
        Boolean(itemData?.is_same_as_present_address),
      );
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  const onInstituteChange = useCallback((instituteId: number) => {
    setBranchFilters(
      instituteId
        ? {
            row_status: RowStatus.ACTIVE,
            institute_id: instituteId,
          }
        : {row_status: RowStatus.ACTIVE},
    );
    setTrainingCenterFilters(
      instituteId
        ? {
            row_status: RowStatus.ACTIVE,
            institute_id: instituteId,
          }
        : {row_status: RowStatus.ACTIVE},
    );
  }, []);

  const onBranchChange = useCallback((branchId: number) => {
    setTrainingCenterFilters((prev: any) => {
      const filter = objectFilter({
        ...prev,
        ...{row_status: RowStatus.ACTIVE, branch_id: branchId},
      });
      return filter;
    });
  }, []);

  const onSubmit: SubmitHandler<ITrainer> = async (data: ITrainer) => {
    try {
      //console.log('before data:', data);
      if (!authUser?.isSystemUser) {
        delete data.institute_id;
        delete data.industry_association_id;
      }
      if (
        !(
          authUser?.isInstituteUser &&
          String(authUser?.institute?.service_type) !=
            InstituteServiceTypes.CERTIFICATE &&
          !authUser?.isTrainingCenterUser
        )
      ) {
        delete data.branch_id;
        delete data.training_center_id;
      }
      let skillIds: any = [];
      (data?.skills || []).map((skill: any) => {
        skillIds.push(skill.id);
      });
      data.skills = skillIds;
      if (data?.is_same_as_present_address) {
        data.permanent_address_division_id = data?.present_address_division_id;
        data.permanent_address_district_or_city_corporation =
          data?.present_address_district_or_city_corporation;
        data.permanent_address_district_id = data?.present_address_district_id;
        data.permanent_address_upazila_municipality_id =
          data?.present_address_upazila_municipality_id;
        data.permanent_address_city_corporation_id =
          data?.present_address_city_corporation_id;
        data.permanent_address_union_id = data?.present_address_union_id;
        data.permanent_address_village_ward_area =
          data?.present_address_village_ward_area;
        data.permanent_address_village_ward_area_en =
          data?.present_address_village_ward_area_en;
        data.is_same_as_present_address = 1;
      } else {
        data.is_same_as_present_address = 0;
      }
      console.log(data);
      if (itemId) {
        await updateTrainer(itemId, data);
        updateSuccessMessage('trainers.label');
        mutateTrainer();
      } else {
        await createTrainer(data);
        createSuccessMessage('trainers.label');
      }
      props.onClose();
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  console.log('errors:', errors);

  return (
    <HookFormMuiModal
      {...props}
      open={true}
      title={
        <>
          <IconTrainer />
          {isEdit ? (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='trainers.label' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='trainers.label' />}}
            />
          )}
        </>
      }
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
      handleSubmit={handleSubmit(onSubmit)}
      actions={
        <>
          <CancelButton onClick={props.onClose} isLoading={isLoading} />
          <SubmitButton isSubmitting={isSubmitting} isLoading={isLoading} />
        </>
      }>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='trainer_first_name'
            label={messages['common.first_name']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='trainer_first_name_en'
            label={messages['common.first_name_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='trainer_last_name'
            label={messages['common.last_name']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='trainer_last_name_en'
            label={messages['common.last_name_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>

        {!isEdit && (
          <Grid item xs={12} sm={6} md={!isEdit ? 6 : 12}>
            <CustomFilterableFormSelect
              required
              id={'role_id'}
              isLoading={isLoadingRoles}
              options={roles}
              control={control}
              label={messages['role.label']}
              optionValueProp={'id'}
              optionTitleProp={['title']}
              errorInstance={errors}
            />
          </Grid>
        )}

        {!isEdit && (
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              required
              id='email'
              label={messages['common.email']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              placeholder='example@gmail.com'
            />
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='about_me'
            label={messages['common.about_trainer']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='about_me_en'
            label={messages['common.about_trainer_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        {!isEdit && (
          <Grid item xs={12} sm={6} md={6}>
            <CustomTextInput
              required
              id='mobile'
              label={messages['common.mobile_en']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              placeholder='017xxxxxxxx'
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
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='subject'
            label={messages['common.subject']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='subject_en'
            label={messages['common.subject_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>

        {isEdit && <Grid item xs={12} sm={6} md={6} />}
        <AddressFormComponent
          control={control}
          errors={errors}
          label={messages['common.present_address'] as string}
          itemData={itemData}
          setValue={setValue}
          requiredField={['loc_division_id', 'loc_district_id']}
          fieldKeys={{
            loc_division_id: 'present_address_division_id',
            district_or_city_corporation:
              'present_address_district_or_city_corporation',
            loc_district_id: 'present_address_district_id',
            loc_city_corporation_id: 'present_address_city_corporation_id',
            loc_upazila_municipality_type:
              'loc_upazila_municipality_type_permanent_address',
            loc_upazila_municipality_id:
              'present_address_upazila_municipality_id',
            loc_union_id: 'present_address_union_id',
            village_ward_area: 'present_address_village_ward_area',
            village_ward_area_en: 'present_address_village_ward_area_en',
          }}
        />

        <Grid item xs={12}>
          <CustomCheckbox
            id='is_same_as_present_address'
            label={messages['common.same_as_present']}
            register={register}
            errorInstance={errors}
            checked={permanentAddressDisabled}
            onChange={() => {
              setPermanentAddressDisabled((prev) => !prev);
            }}
            isLoading={false}
          />
        </Grid>
        {!permanentAddressDisabled && (
          <AddressFormComponent
            control={control}
            errors={errors}
            label={messages['common.permanent_address'] as string}
            itemData={itemData}
            setValue={setValue}
            requiredField={[]}
            fieldKeys={{
              loc_division_id: 'permanent_address_division_id',
              district_or_city_corporation:
                'permanent_address_district_or_city_corporation',
              loc_district_id: 'permanent_address_district_id',
              loc_city_corporation_id: 'permanent_address_city_corporation_id',
              loc_upazila_municipality_type:
                'loc_upazila_municipality_type_permanent_address',
              loc_upazila_municipality_id:
                'permanent_address_upazila_municipality_id',
              loc_union_id: 'permanent_address_union_id',
              village_ward_area: 'permanent_address_village_ward_area',
              village_ward_area_en: 'permanent_address_village_ward_area_en',
            }}
          />
        )}

        <Grid item xs={12} sm={6} md={6}>
          <FormRadioButtons
            id='gender'
            label={'common.gender'}
            radios={genders}
            control={control}
            defaultValue={initialValues.gender}
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CustomFormSelect
            id='religion'
            label={messages['common.religion']}
            isLoading={isLoading}
            control={control}
            options={religions}
            optionValueProp={'id'}
            optionTitleProp={['label']}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <FormRadioButtons
            id='marital_status'
            label={'common.marital_status'}
            radios={marital_status}
            control={control}
            defaultValue={initialValues.marital_status}
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='nid'
            label={messages['common.nid_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='educational_qualification'
            label={messages['common.educational_qualification_bn']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='educational_qualification_en'
            label={messages['common.educational_qualification_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='trainer_registration_number'
            label={messages['common.registration_number_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomSelectAutoComplete
            required
            id={'skills'}
            label={messages['common.skills']}
            isLoading={isLoadingSkills}
            options={skills}
            optionValueProp={'id'}
            optionTitleProp={['title']}
            control={control}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='passport_number'
            label={messages['common.passport_number_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        {authUser?.isSystemUser && (
          <Grid item xs={12} sm={6} md={6}>
            <CustomFilterableFormSelect
              required
              id={'institute_id'}
              isLoading={isLoadingInstitutes}
              options={institutes}
              control={control}
              label={messages['institute.label']}
              optionValueProp={'id'}
              optionTitleProp={['title']}
              errorInstance={errors}
              onChange={onInstituteChange}
            />
          </Grid>
        )}

        {authUser?.isInstituteUser &&
          String(authUser?.institute?.service_type) !=
            InstituteServiceTypes.CERTIFICATE &&
          !authUser?.isTrainingCenterUser && (
            <>
              <Grid item xs={12} sm={6} md={6}>
                <CustomFilterableFormSelect
                  id='branch_id'
                  label={messages['branch.label']}
                  isLoading={isLoadingBranches}
                  control={control}
                  options={branches}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                  onChange={onBranchChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomFilterableFormSelect
                  id='training_center_id'
                  label={messages['menu.training_center']}
                  isLoading={isLoadingTrainingCenters}
                  control={control}
                  options={trainingCenters}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                />
              </Grid>
            </>
          )}

        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='nationality'
            label={messages['common.nationality_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <FileUploadComponent
            id='signature'
            defaultFileUrl={itemData?.signature}
            errorInstance={errors}
            setValue={setValue}
            register={register}
            label={messages['common.signature']}
            required={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <FileUploadComponent
            id='photo'
            defaultFileUrl={itemData?.photo}
            errorInstance={errors}
            setValue={setValue}
            register={register}
            label={messages['common.photo']}
            required={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <FormRowStatus
            id='row_status'
            control={control}
            defaultValue={initialValues.row_status}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </HookFormMuiModal>
  );
};
export default TrainerAddEditPopup;
