import yup from '../../../@core/libs/yup';
import {Checkbox, Grid} from '@mui/material';
import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
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
  createTrainingCenter,
  updateTrainingCenter,
} from '../../../services/instituteManagement/TrainingCenterService';
import IconTrainingCenter from '../../../@core/icons/IconTrainingCenter';
import {
  useFetchLocalizedBranches,
  useFetchLocalizedInstitutes,
  useFetchTrainingCenter,
} from '../../../services/instituteManagement/hooks';
import RowStatus from '../../../@core/utilities/RowStatus';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {ITrainingCenter} from '../../../shared/Interface/institute.interface';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {
  FORM_PLACEHOLDER,
  isLatLongValid,
} from '../../../@core/common/constants';
import AddressFormComponent from '../../../@core/components/AddressFormComponent';
import {
  GOOGLE_MAP_URL,
  MOBILE_NUMBER_REGEX,
} from '../../../@core/common/patternRegex';
import {DistrictOrCityCorporation} from '../../../@core/components/AddressFormComponent/addressEnum';
import BankInfoFormSection from './BankInfoFormSection';

interface ProgrammeAddEditPopupProps {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  title_en: '',
  title: '',
  institute_id: '',
  industry_association_id: '',
  branch_id: '',
  loc_division_id: '',
  loc_district_id: '',
  loc_union_id: '',
  loc_upazila_municipality_id: '',
  district_or_city_corporation: '',
  loc_city_corporation_id: '',
  village_ward_area: '',
  village_ward_area_en: '',
  location_latitude: '',
  location_longitude: '',
  address_en: '',
  center_location_type: '',
  address: '',
  google_map_src: '',
  row_status: '1',
};

const TrainingCenterAddEditPopup: FC<ProgrammeAddEditPopupProps> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const isEdit = itemId != null;
  const authUser = useAuthUser<CommonAuthUser>();
  const [hasBankAccount, setHasBankAccount] = useState<boolean>(false);

  const center_location_type = [
    {id: 1, title: messages['common.on_institute_premises']},
    {id: 2, title: messages['common.on_branch_premises']},
    {id: 3, title: messages['common.on_training_premises']},
  ];

  const [instituteFilters, setInstituteFilters] = useState<any>(null);
  const {data: institutes, isLoading: isLoadingInstitutes} =
    useFetchLocalizedInstitutes(instituteFilters);

  const [branchFilters, setBranchFilters] = useState<any>(null);
  const {data: branches, isLoading: isLoadingBranches} =
    useFetchLocalizedBranches(branchFilters);

  const {
    data: itemData,
    isLoading,
    mutate: mutateTrainingCenter,
  } = useFetchTrainingCenter(itemId);

  useEffect(() => {
    if (authUser?.isSystemUser) {
      setInstituteFilters({row_status: RowStatus.ACTIVE});
    }

    if (!authUser?.isIndustryAssociationUser) {
      setBranchFilters({
        row_status: RowStatus.ACTIVE,
      });
    }
  }, [authUser]);

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

      institute_id:
        authUser?.isInstituteUser || authUser?.isIndustryAssociationUser
          ? yup.string().nullable()
          : yup
              .string()
              .trim()
              .required()
              .label(messages['institute.label'] as string),
      center_location_type: yup
        .string()
        .trim()
        .required()
        .label(messages['training_center.centerLocationType'] as string),
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
      google_map_src: yup
        .mixed()
        .nullable()
        .test(
          'google_map_validation',
          messages['yup_validation_google_map_matches'] as string,
          (value: any) => !value || Boolean(value.match(GOOGLE_MAP_URL)),
        )
        .label(messages['common.google_map_src'] as string),
      village_ward_area_en: yup
        .string()
        .title('en', false)
        .label(messages['common.village_house_en'] as string),
      address_en: yup
        .string()
        .title('en', false)
        .label(messages['common.address_en'] as string),
      bank_name:
        authUser?.userId === 1 && hasBankAccount
          ? yup
              .string()
              .title('en', true)
              .label(messages['common.bank_name'] as string)
          : yup.string().nullable(),
      branch_name:
        authUser?.userId === 1 && hasBankAccount
          ? yup
              .string()
              .title('en', true)
              .label(messages['common.branch_name'] as string)
          : yup.string().nullable(),
      routing_number:
        authUser?.userId === 1 && hasBankAccount
          ? yup
              .string()
              .title('en', true)
              .label(messages['common.routing_number'] as string)
          : yup.string().nullable(),
      account_name:
        authUser?.userId === 1 && hasBankAccount
          ? yup
              .string()
              .title('en', true)
              .label(messages['common.account_name'] as string)
          : yup.string().nullable(),
      account_number:
        authUser?.userId === 1 && hasBankAccount
          ? yup
              .string()
              .title('en', true)
              .label(messages['common.account_number'] as string)
          : yup.string().nullable(),
      contact_person_name:
        authUser?.userId === 1 && hasBankAccount
          ? yup
              .string()
              .title('en', true)
              .label(messages['common.contact_person_name'] as string)
          : yup.string().nullable(),
      mobile_number:
        authUser?.userId === 1 && hasBankAccount
          ? yup
              .string()
              .title('en', true)
              .matches(MOBILE_NUMBER_REGEX)
              .label(messages['common.mobile_number'] as string)
          : yup.string().nullable(),
    });
  }, [messages, authUser, hasBankAccount]);

  const {
    control,
    reset,
    setError,
    setValue,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<ITrainingCenter>({
    resolver: yupResolver(validationSchema),
  });

  // console.log('form getValues ',getValues())
  // console.log('form errors ', errors);

  useEffect(() => {
    if (itemData) {
      const bankInfo = itemData?.training_center_payment_account_info;

      let finalData: any = {
        title_en: itemData?.title_en,
        title: itemData?.title,
        institute_id: itemData?.institute_id,
        industry_association_id: itemData?.industry_association_id,
        branch_id: itemData?.branch_id,
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
        location_latitude: itemData?.location_latitude,
        location_longitude: itemData?.location_longitude,
        center_location_type: itemData?.center_location_type,
        google_map_src: itemData?.google_map_src,
        row_status: String(itemData?.row_status),
      };

      if (authUser?.userId === 1) {
        finalData = {
          ...finalData,
          bank_name: bankInfo?.bank_name,
          branch_name: bankInfo?.branch_name,
          routing_number: bankInfo?.routing_number,
          account_name: bankInfo?.account_name,
          account_number: bankInfo?.account_number,
          contact_person_name: bankInfo?.contact_person_name,
          mobile_number: bankInfo?.mobile_number,
        };
        if (bankInfo?.bank_name) {
          setHasBankAccount(true);
        }
      }

      reset(finalData);
      if (!authUser?.isIndustryAssociationUser) {
        setBranchFilters({
          institute_id: itemData?.institute_id,
          row_status: RowStatus.ACTIVE,
        });
      }
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  /** Methods called on changing the division and districts in dropdown */

  const handleInstituteChange = useCallback((instituteId: number) => {
    setBranchFilters({
      institute_id: instituteId,
      row_status: RowStatus.ACTIVE,
    });
  }, []);

  const onSubmit: SubmitHandler<ITrainingCenter> = async (
    data: ITrainingCenter,
  ) => {
    if (!authUser?.isSystemUser) {
      delete data.institute_id;
      delete data.industry_association_id;
    }

    try {
      if (itemId) {
        await updateTrainingCenter(itemId, data);
        updateSuccessMessage('training_center.label');
        mutateTrainingCenter();
      } else {
        await createTrainingCenter(data);
        createSuccessMessage('training_center.label');
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
          <IconTrainingCenter />
          {isEdit ? (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='training_center.label' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='training_center.label' />}}
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
              onChange={handleInstituteChange}
            />
          </Grid>
        )}
        {!authUser?.isIndustryAssociationUser && (
          <Grid item xs={12} sm={6} md={6}>
            <CustomFormSelect
              id='branch_id'
              label={messages['branch.label']}
              isLoading={isLoadingBranches}
              control={control}
              options={branches}
              optionValueProp={'id'}
              optionTitleProp={['title']}
              errorInstance={errors}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={6}>
          <CustomFormSelect
            required
            id='center_location_type'
            label={messages['training_center.centerLocationType']}
            isLoading={isLoading}
            control={control}
            options={center_location_type}
            optionValueProp={'id'}
            optionTitleProp={['title']}
            errorInstance={errors}
          />
        </Grid>
        <AddressFormComponent
          control={control}
          errors={errors}
          label={messages['common.address_info'] as string}
          itemData={itemData}
          setValue={setValue}
          requiredField={['loc_division_id', 'loc_district_id']}
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
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='location_latitude'
            label={messages['common.location_latitude']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
            placeholder={FORM_PLACEHOLDER.LATITUDE}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            id='location_longitude'
            label={messages['common.location_longitude']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
            placeholder={FORM_PLACEHOLDER.LONGITUDE}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextInput
            id='google_map_src'
            label={messages['common.google_map_src']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
            placeholder={FORM_PLACEHOLDER.MAP_SOURCE}
          />
        </Grid>

        {authUser?.userId === 1 && (
          <Grid
            item
            xs={12}
            sx={{
              paddingTop: '20px !important',
            }}>
            <label>
              <Checkbox
                checked={hasBankAccount}
                onChange={() => setHasBankAccount((prev) => !prev)}
              />
              {messages['common.has_bank_account']}
            </label>
          </Grid>
        )}

        {/*bank account info form section */}
        {authUser?.userId === 1 && hasBankAccount && (
          <BankInfoFormSection control={control} errors={errors} />
        )}

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
export default TrainingCenterAddEditPopup;
