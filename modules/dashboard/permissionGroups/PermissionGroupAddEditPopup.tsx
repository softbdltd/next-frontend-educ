import yup from '../../../@core/libs/yup';
import {Grid} from '@mui/material';
import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import React, {FC, useEffect, useMemo} from 'react';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {useIntl} from 'react-intl';
import FormRowStatus from '../../../@core/elements/input/FormRowStatus/FormRowStatus';
import IntlMessages from '../../../@core/utility/IntlMessages';
import IconPermissionGroup from '../../../@core/icons/IconPermissionGroup';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import {useFetchPermissionGroup} from '../../../services/userManagement/hooks';
import {
  createPermissionGroup,
  updatePermissionGroup,
} from '../../../services/userManagement/PermissionGroupService';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {
  IPermissionGroup,
  IPermissionGroupAddEditPopupProps,
} from '../../../shared/Interface/userManagement.interface';
import {isBreakPointUp} from '../../../@core/utility/Utils';

const initialValues = {
  title_en: '',
  title: '',
  key: '',
  row_status: '1',
};

const PermissionGroupAddEditPopup: FC<IPermissionGroupAddEditPopupProps> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const isEdit = itemId != null;

  const {
    data: itemData,
    isLoading,
    mutate: mutatePermissionGroup,
  } = useFetchPermissionGroup(itemId);

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

      key: yup
        .string()
        .required()
        .label(messages['permission.key'] as string),
      row_status: yup.string(),
    });
  }, [messages]);
  const {
    control,
    // register,
    reset,
    setError,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<IPermissionGroup>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemData) {
      reset({
        title_en: itemData?.title_en,
        title: itemData?.title,
        key: itemData?.key,
        row_status: String(itemData?.row_status),
      });
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  const onSubmit: SubmitHandler<IPermissionGroup> = async (
    data: IPermissionGroup,
  ) => {
    try {
      if (itemId) {
        await updatePermissionGroup(itemId, data);
        updateSuccessMessage('permission_group.label');
        mutatePermissionGroup();
      } else {
        await createPermissionGroup(data);
        createSuccessMessage('permission_group.label');
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
          <IconPermissionGroup />
          {isEdit ? (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='permission_group.label' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='permission_group.label' />}}
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
        <Grid item xs={12}>
          <CustomTextInput
            required
            id='title'
            label={messages['common.title']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextInput
            required
            id='title_en'
            label={messages['common.title_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12}>
          <CustomTextInput
            required
            id='key'
            label={messages['permission_group.key']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
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
export default PermissionGroupAddEditPopup;
