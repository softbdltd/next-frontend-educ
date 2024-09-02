import React, {FC, useEffect, useMemo, useState} from 'react';
import yup from '../../../@core/libs/yup';
import {useIntl} from 'react-intl';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import {Grid} from '@mui/material';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import CustomFormSelect from '../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconOccupation from '../../../@core/icons/IconOccupation';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {useFetchIndustryAssociation} from '../../../services/IndustryManagement/hooks';
import {
  useFetchLocalizedPermissionGroups,
  useFetchLocalizedPermissionSubGroups,
} from '../../../services/userManagement/hooks';
import RowStatus from '../../../@core/utilities/RowStatus';
import {ApproveInstitute} from '../../../services/instituteManagement/InstituteService';
import {IPermissionSubGroupAssignInstitute} from '../../../shared/Interface/institute.interface';
import {PERMISSION_GROUP_INSTITUTE_KEY} from '../../../@core/common/constants';

interface AssignPermissionSubGroupPopup {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  permission_sub_group_id: '',
};

const AssignPermissionSubGroupPopup: FC<AssignPermissionSubGroupPopup> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const isEdit = itemId != null;
  const {data: itemData, isLoading} = useFetchIndustryAssociation(itemId);

  const [permissionGroupFilters] = useState({
    row_status: RowStatus.ACTIVE,
    key: PERMISSION_GROUP_INSTITUTE_KEY,
  });
  const {data: permissionGroups} = useFetchLocalizedPermissionGroups(
    permissionGroupFilters,
  );

  const [permissionSubGroupFilters, setPermissionSubGroupFilters] =
    useState<any>({
      row_status: RowStatus.ACTIVE,
    });

  const {data: permissionSubGroups, isLoading: isLoadingPermissionSubGroups} =
    useFetchLocalizedPermissionSubGroups(permissionSubGroupFilters);

  useEffect(() => {
    if (permissionGroups && permissionGroups.length > 0) {
      setPermissionSubGroupFilters({
        permission_group_id: permissionGroups[0]?.id,
        row_status: RowStatus.ACTIVE,
      });
    }
  }, [permissionGroups]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      permission_sub_group_id: yup
        .string()
        .trim()
        .required()
        .label(messages['permission_sub_group.label'] as string),
    });
  }, [messages]);

  const {
    control,
    reset,
    setError,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemData) {
      reset({
        permission_sub_group_id: itemData?.permission_sub_group_id,
      });
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  const onSubmit: SubmitHandler<IPermissionSubGroupAssignInstitute> = async (
    data: IPermissionSubGroupAssignInstitute,
  ) => {
    try {
      if (itemId) {
        await ApproveInstitute(itemId, data);
        successStack(
          <IntlMessages
            id='institute_reg.approved'
            values={{subject: <IntlMessages id='common.label' />}}
          />,
        );
      }
      props.onClose();
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({error, validationSchema, setError, errorStack});
    }
  };

  return (
    <HookFormMuiModal
      {...props}
      open={true}
      title={
        <>
          <IconOccupation />
          {isEdit ? (
            <IntlMessages
              id='industry_association.assignPermission'
              values={{
                subject: <IntlMessages id='industry_association.label' />,
              }}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{
                subject: <IntlMessages id='industry_association.label' />,
              }}
            />
          )}
        </>
      }
      maxWidth={'sm'}
      handleSubmit={handleSubmit(onSubmit)}
      actions={
        <>
          <CancelButton onClick={props.onClose} isLoading={isLoading} />
          <SubmitButton isSubmitting={isSubmitting} isLoading={isLoading} />
        </>
      }>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <CustomFormSelect
            id='permission_sub_group_id'
            label={messages['permission_sub_group.label']}
            isLoading={isLoadingPermissionSubGroups}
            control={control}
            options={permissionSubGroups}
            optionValueProp={'id'}
            optionTitleProp={['title']}
            errorInstance={errors}
          />
        </Grid>
      </Grid>
    </HookFormMuiModal>
  );
};

export default AssignPermissionSubGroupPopup;
