import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {
  useFetchLocalizedRoles,
  useFetchUser,
} from '../../../services/userManagement/hooks';
import RowStatus from './RowStatus';
import yup from '../../../@core/libs/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import {Grid} from '@mui/material';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import CustomFormSelect from '../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import {
  createUser,
  updateUser,
} from '../../../services/userManagement/UserService';
import IconUser from '../../../@core/icons/IconUser';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {
  MOBILE_NUMBER_REGEX,
  TEXT_REGEX_PASSWORD,
} from '../../../@core/common/patternRegex';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {IUser} from '../../../shared/Interface/userManagement.interface';
import FormRadioButtons from '../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import {getUserType} from '../../../@core/utilities/helpers';
import DetailsInputView from '../../../@core/elements/display/DetailsInputView/DetailsInputView';
import {
  useFetchLocalizedBranches,
  useFetchLocalizedTrainingCenters,
} from '../../../services/instituteManagement/hooks';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import AddressForm from '../../../@core/components/AddressFormComponent';
import {DistrictOrCityCorporation} from '../../../@core/components/AddressFormComponent/addressEnum';
import {InstituteUserTypes} from '../../../@core/utilities/InstituteUserTypes';

interface UserAddEditPopupProps {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  name_en: '',
  name: '',
  username: '',
  password: '',
  email: '',
  mobile: '',
  role_id: '',
  loc_division_id: '',
  loc_district_id: '',
  loc_union_id: '',
  loc_upazila_municipality_id: '',
  district_or_city_corporation: '',
  loc_city_corporation_id: '',
  row_status: '1',
  institute_user_type: 'institute',
  branch_id: '',
  training_center_id: '',
};

const UserAddEditPopup: FC<UserAddEditPopupProps> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const authUser = useAuthUser();

  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const isEdit = itemId != null;
  const {data: itemData, isLoading, mutate: mutateUser} = useFetchUser(itemId);

  const [roleFilters, setRoleFilters] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });

  const {data: roles, isLoading: isLoadingRoles} =
    useFetchLocalizedRoles(roleFilters);

  const [branchFilters, setBranchFilters] = useState<any>(null);

  const [trainingCenterFilters, setTrainingCenterFilters] = useState<any>(null);

  const {data: branchList, isLoading: isBranchListLoading} =
    useFetchLocalizedBranches(branchFilters);

  const {data: trainingCenterList, isLoading: isTrainingCenterLoading} =
    useFetchLocalizedTrainingCenters(trainingCenterFilters);

  const [filterUserSelection, setFilterUserSelection] = useState<string>('');
  useEffect(() => {
    if (
      authUser?.isInstituteUser &&
      !authUser?.training_center_id &&
      !authUser?.branch_id
    ) {
      setBranchFilters({
        institute_id: authUser?.institute_id,
        row_status: RowStatus.ACTIVE,
      });
      setTrainingCenterFilters({
        institute_id: authUser?.institute_id,
        row_status: RowStatus.ACTIVE,
      });
    }
  }, [authUser]);

  const rowStatusArr = useMemo(() => {
    return [
      {
        key: RowStatus.PENDING,
        label: messages['common.pending'],
        disabled: true,
      },
      {
        key: RowStatus.CANCEL,
        label: messages['common.cancel'],
        disabled: true,
      },
      {
        key: RowStatus.ACTIVE,
        label: messages['common.active'],
      },
      {
        key: RowStatus.INACTIVE,
        label: messages['common.inactive'],
      },
    ];
  }, []);

  const userTypes = useMemo(() => {
    return [
      {
        key: InstituteUserTypes.INSTITUTE,
        label: messages['common.institute'],
      },
      {
        key: InstituteUserTypes.BRANCH,
        label: messages['branch.label'],
      },
      {
        key: InstituteUserTypes.TRAINING_CENTER,
        label: messages['training_center.label'],
      },
    ];
  }, [messages]);

  const getPossibleRowStatus = useCallback(() => {
    if (isEdit) {
      return rowStatusArr;
    } else {
      return [rowStatusArr[2], rowStatusArr[3]];
    }
  }, [isEdit]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      name_en: yup
        .string()
        .title('en', true)
        .min(2)
        .label(messages['common.name_en'] as string),
      name: yup
        .string()
        .title('bn', true)
        .min(2)
        .label(messages['common.name'] as string),
      username: isEdit
        ? yup.string()
        : yup
            .string()
            .trim()
            .required()
            .min(3)
            .label(messages['common.user_id'] as string),
      email: isEdit
        ? yup.string()
        : yup
            .string()
            .trim()
            .required()
            .email()
            .label(messages['common.email'] as string),
      mobile: isEdit
        ? yup.string()
        : yup
            .string()
            .trim()
            .required()
            .matches(MOBILE_NUMBER_REGEX)
            .label(messages['common.mobile_en'] as string),
      password: isEdit
        ? yup.string()
        : yup
            .string()
            .trim()
            .required()
            .min(8)
            .matches(TEXT_REGEX_PASSWORD)
            .label(messages['common.password'] as string),
      password_confirmation: yup
        .string()
        .label(messages['common.password'] as string)
        .oneOf(
          [yup.ref('password'), null],
          messages['password.not_matched'] as string,
        ),
      institute_user_type:
        !isEdit &&
        authUser &&
        authUser.isInstituteUser &&
        !authUser?.training_center_id &&
        !authUser?.branch_id
          ? yup.string().required()
          : yup.string(),
      branch_id: yup
        .mixed()
        .label(messages['branch.label'] as string)
        .when('institute_user_type', {
          is: (value: string) => value == 'branch',
          then: yup.string().required(),
        }),
      training_center_id: yup
        .mixed()
        .label(messages['common.training_center'] as string)
        .when('institute_user_type', {
          is: (value: string) => value == 'training center',
          then: yup.string().required(),
        }),
      loc_division_id: yup.mixed().nullable(),
      district_or_city_corporation: yup
        .string()
        .label(messages['label.district_or_city_corporation'] as string)
        .nullable(),
      loc_district_id: yup
        .string()
        .trim()
        .label(messages['districts.label'] as string)
        .nullable(),
      loc_city_corporation_id: yup
        .string()
        .trim()
        .label(messages['city_corporation.label'] as string)
        .nullable(),
      upazila_or_municipality: yup
        .string()
        .label(messages['label.upazila_or_municipality'] as string)
        .nullable(),
      loc_upazila_municipality_id: yup
        .mixed()
        .nullable()
        .label(messages['label.upazila_or_municipality'] as string),
      row_status: yup
        .string()
        .required()
        .label(messages['common.status'] as string),
      village_ward_area_en: yup
        .string()
        .title('en', false)
        .label(messages['common.village_house_en'] as string),
    });
  }, [itemId, messages, isEdit]);

  const {
    // register,
    control,
    reset,
    setError,
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm<IUser>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (authUser) {
      if (authUser?.isInstituteUser && authUser.institute_id) {
        setRoleFilters({
          institute_id: authUser.institute_id,
          row_status: RowStatus.ACTIVE,
        });
      } else if (authUser?.isOrganizationUser && authUser.organization_id) {
        setRoleFilters({
          organization_id: authUser.organization_id,
          row_status: RowStatus.ACTIVE,
        });
      }
    }
  }, [authUser]);

  useEffect(() => {
    if (itemData) {
      reset({
        name_en: itemData?.name_en,
        name: itemData?.name,
        role_id: itemData?.role_id,
        row_status: String(itemData?.row_status),
        branch_id: itemData?.branch_id,
        training_center_id: itemData?.training_center_id,
        loc_division_id: itemData?.loc_division_id,
        loc_district_id: itemData?.loc_district_id,
        loc_union_id: itemData?.loc_union_id,
        loc_upazila_municipality_id: itemData?.loc_upazila_municipality_id,
        district_or_city_corporation: itemData?.district_or_city_corporation,
        loc_upazila_municipality_type: itemData?.loc_upazila_municipality_type,
        loc_city_corporation_id: itemData?.loc_city_corporation_id,
        village_ward_area: itemData?.village_ward_area,
        village_ward_area_en: itemData?.village_ward_area_en,
      });
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  const changeUserTypes = useCallback(
    (userSection: string) => {
      if (userSection == 'institute') {
        setFilterUserSelection(userSection);
        setValue('branch_id', '');
        setValue('training_center_id', '');
      }

      if (userSection == 'branch') {
        setFilterUserSelection(userSection);
        setValue('training_center_id', '');
        setTrainingCenterFilters({
          institute_id: authUser?.institute_id,
          row_status: RowStatus.ACTIVE,
        });
      }

      if (userSection == 'training center') {
        setTrainingCenterFilters({
          institute_id: authUser?.institute_id,
          row_status: RowStatus.ACTIVE,
        });
        setFilterUserSelection(userSection);
      }
    },
    [filterUserSelection],
  );

  const changeBranch = useCallback((branchId: any) => {
    setTrainingCenterFilters({
      institute_id: authUser?.institute_id,
      row_status: RowStatus.ACTIVE,
      branch_id: branchId,
    });
  }, []);

  const onSubmit: SubmitHandler<IUser> = async (data: IUser) => {
    /**Todo
     * this if else section will be removed after backend refactor user creation
     */
    if (authUser?.isInstituteUser) {
      data.user_type = String(getUserType(authUser));
      data.institute_id = authUser?.institute_id;

      if (authUser?.training_center_id || authUser?.branch_id) {
        delete data.institute_user_type;
        delete data.training_center_id;
        delete data.branch_id;
      }
    } else if (authUser?.isOrganizationUser) {
      data.organization_id = authUser?.organization_id;
    }

    if (
      authUser?.isSystemUser &&
      itemData?.registered_training_organization_id
    ) {
      data.registered_training_organization_id =
        itemData?.registered_training_organization_id;
    }

    if (data?.district_or_city_corporation) {
      if (
        Number(data?.district_or_city_corporation) ===
        DistrictOrCityCorporation.DISTRICT
      ) {
        data.loc_city_corporation_id = null;
      } else {
        data.loc_district_id = null;
      }
    }
    if (!data?.loc_upazila_municipality_type) {
      data.loc_upazila_municipality_id = null;
      data.loc_union_id = null;
    }

    try {
      if (itemId) {
        data.user_type = String(itemData?.user_type); //this will be removed after backend refactor user creation
        await updateUser(itemId, data);
        updateSuccessMessage('user.label');
        mutateUser();
      } else {
        data.user_type = String(getUserType(authUser)); //this will be removed after backend refactor user creation
        await createUser(data);
        createSuccessMessage('user.label');
      }
      props.onClose();
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  console.log('errors', errors);
  return (
    <HookFormMuiModal
      open={true}
      {...props}
      title={
        <>
          <IconUser />
          {isEdit ? (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='user.label' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='user.label' />}}
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
            id='name'
            label={messages['common.name']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='name_en'
            label={messages['common.name_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>

        {!isEdit && (
          <>
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                required
                id='username'
                label={messages['common.user_id']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
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
          </>
        )}
        <Grid item xs={12} sm={6} md={6}>
          <CustomFilterableFormSelect
            id='role_id'
            label={messages['role.label']}
            isLoading={isLoadingRoles}
            control={control}
            options={roles}
            optionValueProp={'id'}
            optionTitleProp={['title']}
            errorInstance={errors}
          />
        </Grid>
        <AddressForm
          control={control}
          errors={errors}
          label={messages['common.address_info'] as string}
          itemData={itemData}
          setValue={setValue}
          requiredField={[]}
        />

        {authUser?.isInstituteUser &&
          !authUser?.training_center_id &&
          !authUser?.branch_id &&
          !isEdit && (
            <Grid item xs={12}>
              <FormRadioButtons
                id='institute_user_type'
                control={control}
                defaultValue={initialValues.institute_user_type}
                isLoading={false}
                label={'user.user_type'}
                radios={userTypes}
                onChange={changeUserTypes}
              />
            </Grid>
          )}
        {filterUserSelection &&
          (filterUserSelection == 'branch' ||
            filterUserSelection == 'training center') && (
            <Grid item xs={12} sm={6} md={6}>
              <CustomFormSelect
                required={filterUserSelection == 'branch'}
                id='branch_id'
                label={messages['branch.label']}
                isLoading={isBranchListLoading}
                control={control}
                options={branchList}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
                onChange={changeBranch}
              />
            </Grid>
          )}

        {filterUserSelection && filterUserSelection == 'training center' && (
          <Grid item xs={12} sm={6} md={6}>
            <CustomFormSelect
              required
              id='training_center_id'
              label={messages['common.training_center']}
              isLoading={isTrainingCenterLoading}
              control={control}
              options={trainingCenterList}
              optionValueProp={'id'}
              optionTitleProp={['title']}
              errorInstance={errors}
            />
          </Grid>
        )}

        {!isEdit && (
          <>
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                required
                id='password'
                label={messages['common.password']}
                helperText={messages['common.passwordHint']}
                type={'password'}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
                placeholder='xxxxXXXX123'
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                required
                id='password_confirmation'
                label={messages['common.retype_password']}
                type={'password'}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
                placeholder='xxxxXXXX123'
              />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <FormRadioButtons
            id={'row_status'}
            label={'common.status'}
            radios={getPossibleRowStatus()}
            control={control}
            defaultValue={RowStatus.ACTIVE}
            errorInstance={errors}
          />
        </Grid>

        {authUser && authUser.isInstituteUser && isEdit && itemData && (
          <Grid item xs={6}>
            {itemData?.training_center_id ? (
              <DetailsInputView
                label={messages['user.user_type']}
                value={messages['user.training_center_user']}
                isLoading={isLoading}
              />
            ) : itemData?.branch_id ? (
              <DetailsInputView
                label={messages['user.user_type']}
                value={messages['user.branch_user']}
                isLoading={isLoading}
              />
            ) : (
              <DetailsInputView
                label={messages['user.user_type']}
                value={messages['user.institute_user']}
                isLoading={isLoading}
              />
            )}
          </Grid>
        )}
      </Grid>
    </HookFormMuiModal>
  );
};

export default UserAddEditPopup;
