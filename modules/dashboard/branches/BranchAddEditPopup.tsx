import yup from '../../../@core/libs/yup';
import {Grid} from '@mui/material';
import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import React, {FC, useEffect, useMemo, useState} from 'react';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import CustomFormSelect from '../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import {useIntl} from 'react-intl';
import FormRowStatus from '../../../@core/elements/input/FormRowStatus/FormRowStatus';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import {
  createBranch,
  updateBranch,
} from '../../../services/instituteManagement/BranchService';
import IconBranch from '../../../@core/icons/IconBranch';
import {
  useFetchBranch,
  useFetchLocalizedInstitutes,
} from '../../../services/instituteManagement/hooks';
import RowStatus from '../../../@core/utilities/RowStatus';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {IBranch} from '../../../shared/Interface/institute.interface';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import AddressFormComponent from '../../../@core/components/AddressFormComponent';
import {DistrictOrCityCorporation} from '../../../@core/components/AddressFormComponent/addressEnum';
import {GOOGLE_MAP_URL} from '../../../@core/common/patternRegex';

interface BranchAddEditPopupProps {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  title_en: '',
  title: '',
  institute_id: '',
  address: '',
  loc_division_id: '',
  loc_district_id: '',
  loc_union_id: '',
  loc_upazila_municipality_id: '',
  district_or_city_corporation: '',
  loc_city_corporation_id: '',
  google_map_src: '',
  row_status: '1',
};

const BranchAddEditPopup: FC<BranchAddEditPopupProps> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const isEdit = itemId != null;
  const authUser = useAuthUser();

  const [institutesFilter, setInstitutesFilter] = useState<any>(null);
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const {data: institutes, isLoading: isLoadingInstitutes} =
    useFetchLocalizedInstitutes(institutesFilter);

  const {
    data: itemData,
    isLoading,
    mutate: mutateBranch,
  } = useFetchBranch(itemId);

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

      district_or_city_corporation: yup
        .string()
        .label(messages['label.district_or_city_corporation'] as string)
        .nullable(),
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
      institute_id: authUser?.isSystemUser
        ? yup
            .string()
            .trim()
            .required()
            .label(messages['institute.label'] as string)
        : yup.string(),
      google_map_src: yup
        .mixed()
        .nullable()
        .test(
          'google_map_validation',
          messages['yup_validation_google_map_matches'] as string,
          (value: any) => !value || Boolean(value.match(GOOGLE_MAP_URL)),
        )
        .label(messages['common.google_map_src'] as string),
      address_en: yup
        .string()
        .title('en', false)
        .label(messages['common.address_en'] as string),
      village_ward_area_en: yup
        .string()
        .title('en', false)
        .label(messages['common.village_ward_area_en'] as string),
    });
  }, [messages, authUser]);

  const {
    control,
    // register,
    reset,
    setError,
    setValue,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<IBranch>({
    resolver: yupResolver(validationSchema),
  });

  // const getUseForm = useForm<IBranch>({
  //   resolver: yupResolver(validationSchema),
  // });

  // console.log('frm ', validationSchema);

  useEffect(() => {
    if (authUser?.isSystemUser) {
      setInstitutesFilter({row_status: RowStatus.ACTIVE});
    }
  }, [authUser]);

  useEffect(() => {
    if (itemData) {
      reset({
        title_en: itemData?.title_en,
        title: itemData?.title,
        institute_id: itemData?.institute_id,
        address: itemData?.address,
        address_en: itemData?.address_en,
        loc_division_id: itemData?.loc_division_id,
        loc_district_id: itemData?.loc_district_id,
        loc_union_id: itemData?.loc_union_id,
        loc_upazila_municipality_id: itemData?.loc_upazila_municipality_id,
        district_or_city_corporation: itemData?.district_or_city_corporation,
        loc_upazila_municipality_type: itemData?.loc_upazila_municipality_type,
        loc_city_corporation_id: itemData?.loc_city_corporation_id,
        village_ward_area: itemData?.village_ward_area,
        village_ward_area_en: itemData?.village_ward_area_en,
        google_map_src: itemData?.google_map_src,
        row_status: String(itemData?.row_status),
      });
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  const onSubmit: SubmitHandler<IBranch> = async (data: IBranch) => {
    if (!authUser?.isSystemUser) {
      delete data.institute_id;
    }
    delete data.loc_upazila_municipality_type;
    console.log('submittedData:', data);
    try {
      if (itemId) {
        await updateBranch(itemId, data);
        updateSuccessMessage('branch.label');
        mutateBranch();
      } else {
        await createBranch(data);
        createSuccessMessage('branch.label');
      }
      props.onClose();
      refreshDataTable();
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
          <IconBranch />
          {isEdit ? (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='branch.label' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='branch.label' />}}
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
            id='title'
            label={messages['common.title']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='title_en'
            label={messages['common.title_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        {authUser?.isSystemUser && (
          <Grid item xs={12} sm={6} md={6}>
            <CustomFormSelect
              required
              id='institute_id'
              label={messages['institute.label']}
              isLoading={isLoadingInstitutes}
              control={control}
              options={institutes}
              optionValueProp={'id'}
              optionTitleProp={['title']}
              errorInstance={errors}
            />
          </Grid>
        )}
        <Grid
          item
          xs={12}
          sm={authUser?.isSystemUser ? 6 : 12}
          md={authUser?.isSystemUser ? 6 : 12}>
          <CustomTextInput
            id='google_map_src'
            label={messages['common.google_map_src']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <AddressFormComponent
          control={control}
          errors={errors}
          label={messages['common.address_info'] as string}
          itemData={itemData}
          setValue={setValue}
          requiredField={[]}
          component={
            <>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextInput
                  id='address'
                  label={messages['common.address']}
                  control={control}
                  errorInstance={errors}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <CustomTextInput
                  id='address_en'
                  label={messages['common.address_en']}
                  control={control}
                  errorInstance={errors}
                  isLoading={isLoading}
                />
              </Grid>
            </>
          }
        />
        <Grid item xs={12}>
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
export default BranchAddEditPopup;
