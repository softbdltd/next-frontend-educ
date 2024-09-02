import React, {FC, useEffect, useMemo, useState} from 'react';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {Checkbox, Grid, Typography} from '@mui/material';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useIntl} from 'react-intl';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import FileUploadComponent from '../../filepond/FileUploadComponent';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import yup from '../../../@core/libs/yup';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import {useFetchInstituteProfile} from '../../../services/instituteManagement/hooks';
import {updateInstituteProfile} from '../../../services/instituteManagement/InstituteService';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {
  FORM_PLACEHOLDER,
  isLatLongValid,
} from '../../../@core/common/constants';
import {DistrictOrCityCorporation} from '../../../@core/components/AddressFormComponent/addressEnum';
import AddressFormComponent from '../../../@core/components/AddressFormComponent';
import {GOOGLE_MAP_URL} from '../../../@core/common/patternRegex';

interface InstituteProfileEditPopupProps {
  onClose: () => void;
}

const InstituteProfileEditPopup: FC<InstituteProfileEditPopupProps> = ({
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {updateSuccessMessage} = useSuccessMessage();
  const [hasPaymentEnabled, setHasPaymentEnabled] = useState<boolean>(false);

  const {data: profileData, mutate: mutateProfile} = useFetchInstituteProfile();

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      title: yup
        .string()
        .title('bn', true)
        .label(messages['common.title'] as string),
      title_en: yup
        .string()
        .title('en', false)
        .label(messages['common.title_en'] as string),
      address: yup
        .string()
        .trim()
        .required()
        .label(messages['common.address'] as string),
      address_en: yup
        .string()
        .title('en', false)
        .label(messages['common.address_en'] as string),
      email: yup
        .string()
        .required()
        .email()
        .label(messages['common.email'] as string),
      name_of_the_office_head: yup
        .string()
        .trim()
        .required()
        .label(messages['institute.name_of_the_office_head'] as string),
      // name_of_the_office_head_en: yup
      //   .string()
      //   .title('en', false)
      //   .label(messages['institute.name_of_the_office_head_en'] as string),
      name_of_the_office_head_designation: yup
        .string()
        .trim()
        .required()
        .label(
          messages['institute.name_of_the_office_head_designation'] as string,
        ),
      name_of_the_office_head_designation_en: yup
        .string()
        .title('en', false)
        .label(
          messages[
            'institute.name_of_the_office_head_designation_en'
          ] as string,
        ),
      contact_person_name: yup
        .string()
        .trim()
        .required()
        .label(messages['common.contact_person_name'] as string),
      contact_person_name_en: yup
        .string()
        .title('en', false)
        .label(messages['common.contact_person_name_en'] as string),
      contact_person_designation: yup
        .string()
        .title('bn', true)
        .label(messages['common.contact_person_designation_en'] as string),
      contact_person_designation_en: yup
        .string()
        .title('en', false)
        .label(messages['common.contact_person_designation_en'] as string),
      village_ward_area_en: yup
        .string()
        .title('en', false)
        .label(messages['common.village_ward_area_en'] as string),
      contact_person_email: yup
        .string()
        .trim()
        .required()
        .email()
        .label(messages['common.contact_person_email'] as string),
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
      google_map_src: yup
        .mixed()
        .nullable()
        .test(
          'google_map_validation',
          messages['yup_validation_google_map_matches'] as string,
          (value: any) => !value || Boolean(value.match(GOOGLE_MAP_URL)),
        )
        .label(messages['common.google_map_src'] as string),
    });
  }, [messages]);

  const {
    control,
    reset,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: {errors, isSubmitting},
  } = useForm<any>({resolver: yupResolver(validationSchema)});

  useEffect(() => {
    if (profileData) {
      reset({
        title_en: profileData?.title_en,
        title: profileData?.title,
        email: profileData?.email,
        address: profileData?.address,
        address_en: profileData?.address_en,
        loc_division_id: profileData?.loc_division_id,
        loc_district_id: profileData?.loc_district_id,
        loc_union_id: profileData?.loc_union_id,
        loc_upazila_municipality_id: profileData?.loc_upazila_municipality_id,
        district_or_city_corporation: profileData?.district_or_city_corporation,
        loc_upazila_municipality_type:
          profileData?.loc_upazila_municipality_type,
        loc_city_corporation_id: profileData?.loc_city_corporation_id,
        village_ward_area: profileData?.village_ward_area,
        village_ward_area_en: profileData?.village_ward_area_en,
        google_map_src: profileData?.google_map_src,
        name_of_the_office_head: profileData?.name_of_the_office_head,
        name_of_the_office_head_en: profileData?.name_of_the_office_head_en,
        name_of_the_office_head_designation:
          profileData?.name_of_the_office_head_designation,
        name_of_the_office_head_designation_en:
          profileData?.name_of_the_office_head_designation_en,
        contact_person_name: profileData?.contact_person_name,
        contact_person_name_en: profileData?.contact_person_name_en,
        contact_person_designation: profileData?.contact_person_designation,
        contact_person_designation_en:
          profileData?.contact_person_designation_en,
        contact_person_email: profileData?.contact_person_email,
        /*row_status: String(profileData?.row_status),*/
        logo: profileData?.logo,
      });
      setHasPaymentEnabled(profileData?.is_payment_enabled);
    }
  }, [profileData]);

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      data.is_payment_enabled = hasPaymentEnabled ? 1 : 0;
      // console.log('institute_profile data', data);
      await updateInstituteProfile(data);

      updateSuccessMessage('institute_profile.label');
      mutateProfile();
      props.onClose();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

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
      handleSubmit={handleSubmit(onSubmit)}
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
      actions={
        <>
          <CancelButton onClick={props.onClose} isLoading={false} />
          <SubmitButton isSubmitting={isSubmitting} isLoading={false} />
        </>
      }>
      <Grid container spacing={3} sx={{overflow: 'hidden'}}>
        <Grid item xs={12}>
          <Typography variant={'h6'}>
            {messages['common.institute_information']}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FileUploadComponent
            id='logo'
            defaultFileUrl={profileData?.logo}
            errorInstance={errors}
            setValue={setValue}
            register={register}
            label={messages['common.image_path']}
            required={false}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='title'
            label={messages['common.institute_name_bn']}
            control={control}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='title_en'
            label={messages['common.institute_name_en']}
            control={control}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='email'
            label={messages['common.email']}
            control={control}
            errorInstance={errors}
            placeholder='example@gmail.com'
          />
        </Grid>
        <AddressFormComponent
          control={control}
          errors={errors}
          label={messages['common.address_info'] as string}
          itemData={profileData}
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
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextInput
                  id='address_en'
                  label={messages['common.address_en']}
                  control={control}
                  errorInstance={errors}
                  isLoading={false}
                />
              </Grid>
            </>
          }
        />
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
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='google_map_src'
            label={messages['common.google_map_src']}
            control={control}
            errorInstance={errors}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='name_of_the_office_head'
            label={messages['common.name_of_the_office_head']}
            control={control}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='name_of_the_office_head_en '
            label={messages['common.name_of_the_office_head_en']}
            control={control}
            errorInstance={errors}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='name_of_the_office_head_designation'
            label={messages['common.name_of_the_office_head_designation']}
            control={control}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='name_of_the_office_head_designation_en'
            label={messages['common.name_of_the_office_head_designation_en']}
            control={control}
            errorInstance={errors}
          />
        </Grid>
        <Grid
          item
          xs={6}
          sx={
            {
              // paddingTop: '20px !important',
            }
          }>
          <label>
            <Checkbox
              checked={hasPaymentEnabled}
              onChange={() => setHasPaymentEnabled((prev) => !prev)}
            />
            {messages['common.has_Payment_enabled']}
          </label>
        </Grid>
        <Grid item xs={12} sx={{mb: 3}}>
          <Typography variant={'h6'}>
            {messages['common.contact_person_info']}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='contact_person_name'
            label={messages['common.contact_person_name_bn']}
            control={control}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='contact_person_name_en'
            label={messages['common.contact_person_name_en']}
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
          <CustomTextInput
            id='contact_person_designation_en'
            label={messages['common.contact_person_designation_en']}
            control={control}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='contact_person_email'
            label={messages['common.contact_person_email']}
            control={control}
            errorInstance={errors}
            placeholder='example@gmail.com'
          />
        </Grid>

        {/*        <Grid item xs={12} sm=6 md={6}>
          <FormRowStatus
            id='row_status'
            control={control}
            defaultValue={profileData?.row_status}
            isLoading={isLoadingData}
          />
        </Grid>*/}
      </Grid>
    </HookFormMuiModal>
  );
};

export default InstituteProfileEditPopup;
