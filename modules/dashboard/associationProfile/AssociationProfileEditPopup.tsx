import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import {Grid, Typography} from '@mui/material';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import {SubmitHandler, useForm} from 'react-hook-form';
import yup from '../../../@core/libs/yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useIntl} from 'react-intl';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import FileUploadComponent from '../../filepond/FileUploadComponent';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {updateIndustryAssocProfile} from '../../../services/IndustryAssociationManagement/IndustryAssociationService';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import CustomSelectAutoComplete from '../../learner/registration/CustomSelectAutoComplete';
import {useFetchLocalizedSkills} from '../../../services/learnerManagement/hooks';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {
  FORM_PLACEHOLDER,
  isLatLongValid,
} from '../../../@core/common/constants';
import {
  getMobilePhoneValidationSchema,
  getObjectArrayFromValueArray,
  getValuesFromObjectArray,
} from '../../../@core/utilities/helpers';
import {
  MOBILE_NUMBER_REGEX,
  PHONE_NUMBER_REGEX,
} from '../../../@core/common/patternRegex';
import CustomFieldArray from '../../../@core/elements/input/CustomFieldArray';
import TextEditor from '../../../@core/components/editor/TextEditor';
import AddressFormComponent from '../../../@core/components/AddressFormComponent';
import {DistrictOrCityCorporation} from '../../../@core/components/AddressFormComponent/addressEnum';

interface AssociationProfileEditPopupProps {
  onClose: () => void;
  userData: any;
}

const AssociationProfileEditPopup: FC<AssociationProfileEditPopupProps> = ({
  userData,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();

  const {updateSuccessMessage} = useSuccessMessage();

  const [skillFilter] = useState({});
  const {data: skillData, isLoading: isLoadingSkillData} =
    useFetchLocalizedSkills(skillFilter);

  const [selectedSkillList, setSelectedSkillList] = useState<any>([]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      title: yup
        .string()
        .title('bn', true)
        .label(messages['association.association_name'] as string),
      logo: yup
        .string()
        .trim()
        .required()
        .label(messages['common.logo'] as string),
      name_of_the_office_head: yup
        .string()
        .trim()
        .required()
        .label(messages['association.head_of_office_or_chairman'] as string),
      name_of_the_office_head_designation: yup
        .string()
        .trim()
        .required()
        .label(messages['association.designation'] as string),
      contact_person_name: yup
        .string()
        .trim()
        .required()
        .label(messages['common.contact_person_name_en'] as string),
      skills: yup
        .array()
        .of(yup.object())
        .min(1, messages['common.must_have_one_skill'] as string)
        .label(messages['common.skills'] as string),
      address: yup
        .string()
        .trim()
        .required()
        .label(messages['association.association_address'] as string),
      address_en: yup
        .string()
        .title('en', false)
        .label(messages['association.association_address_en'] as string),
      loc_division_id: yup
        .string()
        .trim()
        .required()
        .label(messages['divisions.label'] as string),
      district_or_city_corporation: yup
        .string()
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
      contact_person_designation: yup
        .string()
        .trim()
        .required()
        .label(messages['common.contact_person_designation'] as string),
      phone_numbers: yup
        .array()
        .of(
          getMobilePhoneValidationSchema(
            yup,
            PHONE_NUMBER_REGEX,
            messages['common.invalid_phone'],
          ),
        ),
      mobile_numbers: yup
        .array()
        .of(
          getMobilePhoneValidationSchema(
            yup,
            MOBILE_NUMBER_REGEX,
            messages['common.invalid_mobile'],
          ),
        ),
      location_latitude: yup
        .string()
        .nullable()
        .test(
          'lat-err',
          `${messages['common.location_latitude']} ${messages['common.not_valid']}`,
          (value) => isLatLongValid(value as string),
        ),
      location_longitude: yup
        .string()
        .nullable()
        .test(
          'long-err',
          `${messages['common.location_longitude']} ${messages['common.not_valid']}`,
          (value) => isLatLongValid(value as string),
        ),
    });
  }, []);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    clearErrors,
    setError,
    formState: {errors, isSubmitting},
  } = useForm<any>({resolver: yupResolver(validationSchema)});

  useEffect(() => {
    if (userData) {
      reset({
        logo: userData?.logo,
        title: userData?.title,
        address: userData?.address,
        address_en: userData?.address_en,
        loc_division_id: userData?.loc_division_id,
        loc_district_id: userData?.loc_district_id,
        loc_union_id: userData?.loc_union_id,
        loc_upazila_municipality_id: userData?.loc_upazila_municipality_id,
        district_or_city_corporation: userData?.district_or_city_corporation,
        loc_upazila_municipality_type: userData?.loc_upazila_municipality_type,
        loc_city_corporation_id: userData?.loc_city_corporation_id,
        village_ward_area: userData?.village_ward_area,
        village_ward_area_en: userData?.village_ward_area_en,
        name_of_the_office_head: userData?.name_of_the_office_head,
        name_of_the_office_head_designation:
          userData?.name_of_the_office_head_designation,
        contact_person_name: userData?.contact_person_name,
        contact_person_designation: userData?.contact_person_designation,
        location_latitude: userData?.location_latitude,
        location_longitude: userData?.location_longitude,
        phone_numbers: getObjectArrayFromValueArray(userData?.phone_numbers),
        mobile_numbers: getObjectArrayFromValueArray(userData?.mobile_numbers),
      });
      setSelectedSkillList(userData?.skills);
    }
  }, [userData]);

  const onSkillChange = useCallback((options) => {
    setSelectedSkillList(options);
  }, []);

  const onSubmit: SubmitHandler<any> = async (data) => {
    let skillIds: any = [];
    if (selectedSkillList) {
      selectedSkillList.map((skill: any) => {
        skillIds.push(skill.id);
      });
    }

    if (!skillIds?.length) {
      setError('skills', {
        message: `"${messages['common.skills']}" ${messages['common.validation_required_error']}`,
      });
      return;
    }

    data.skills = skillIds;

    try {
      data.phone_numbers = getValuesFromObjectArray(data.phone_numbers);
      data.mobile_numbers = getValuesFromObjectArray(data.mobile_numbers);

      await updateIndustryAssocProfile(data);
      updateSuccessMessage('industry_association_reg.label');
      props.onClose();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  console.log('errors: ', errors);
  return (
    <HookFormMuiModal
      open={true}
      {...props}
      title={
        <>
          <IntlMessages
            id='common.edit'
            values={{
              subject: <IntlMessages id='common.profile' />,
            }}
          />
        </>
      }
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
      handleSubmit={handleSubmit(onSubmit)}
      actions={
        <>
          <CancelButton onClick={props.onClose} isLoading={false} />
          <SubmitButton isSubmitting={isSubmitting} isLoading={false} />
        </>
      }>
      <Grid container spacing={3} sx={{overflow: 'hidden'}}>
        <Grid item xs={12}>
          <Typography variant={'h6'}>
            {messages['association.association_information']}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <FileUploadComponent
            required
            id='logo'
            defaultFileUrl={userData?.logo}
            errorInstance={errors}
            setValue={setValue}
            register={register}
            label={messages['common.image_path']}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='title'
            label={messages['association.association_name']}
            control={control}
            errorInstance={errors}
          />
        </Grid>
        <AddressFormComponent
          control={control}
          errors={errors}
          label={messages['common.address_info'] as string}
          itemData={userData}
          setValue={setValue}
          requiredField={['loc_division_id', 'loc_district_id']}
          component={
            <>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextInput
                  required
                  id='address'
                  label={messages['common.address']}
                  control={control}
                  errorInstance={errors}
                  isLoading={false}
                  multiline={true}
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextInput
                  id='address_en'
                  label={messages['common.address_en']}
                  control={control}
                  errorInstance={errors}
                  isLoading={false}
                  multiline={true}
                  rows={3}
                />
              </Grid>
            </>
          }
        />

        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='name_of_the_office_head'
            label={messages['association.head_of_office_or_chairman']}
            control={control}
            errorInstance={errors}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='name_of_the_office_head_designation'
            label={messages['association.designation']}
            control={control}
            errorInstance={errors}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CustomFieldArray
            id='phone_numbers'
            labelLanguageId={'common.phone'}
            control={control}
            register={register}
            errors={errors}
          />
        </Grid>
        <Grid item container xs={12} sm={6} md={6} alignSelf='flex-start'>
          <CustomFieldArray
            id='mobile_numbers'
            labelLanguageId={'common.mobile_en'}
            control={control}
            register={register}
            errors={errors}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='location_latitude'
            label={messages['common.location_latitude']}
            control={control}
            errorInstance={errors}
            placeholder={FORM_PLACEHOLDER.LATITUDE}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='location_longitude'
            label={messages['common.location_longitude']}
            control={control}
            errorInstance={errors}
            placeholder={FORM_PLACEHOLDER.LONGITUDE}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant={'h6'}>
            {messages['common.userInfoText']}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='contact_person_name'
            label={messages['common.contact_person_name_bn']}
            control={control}
            errorInstance={errors}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='contact_person_designation'
            label={messages['common.contact_person_designation']}
            control={control}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomSelectAutoComplete
            id='skills'
            required
            label={messages['common.skills']}
            isLoading={isLoadingSkillData}
            control={control}
            options={skillData}
            optionValueProp='id'
            optionTitleProp={['title']}
            defaultValue={selectedSkillList}
            errorInstance={errors}
            onChange={onSkillChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextEditor
            id={'description'}
            label={messages['common.description']}
            errorInstance={errors}
            value={userData?.description || ''}
            height={'300px'}
            key={1}
            register={register}
            setValue={setValue}
            clearErrors={clearErrors}
            setError={setError}
          />
        </Grid>
      </Grid>
    </HookFormMuiModal>
  );
};

export default AssociationProfileEditPopup;
