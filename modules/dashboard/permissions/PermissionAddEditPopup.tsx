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
import IntlMessages from '../../../@core/utility/IntlMessages';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import {useFetchPermission} from '../../../services/userManagement/hooks';
import {
  createPermission,
  updatePermission,
} from '../../../services/userManagement/PermissionService';
import IconPermission from '../../../@core/icons/IconPermission';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {IPermission} from '../../../shared/Interface/userManagement.interface';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import CustomFormSelect from '../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import {PermissionMethodsKeyByLabel} from '../../../@core/utilities/Permission';

interface PermissionGroupAddEditPopupProps {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  title: '',
  title_en: '',
  uri: '',
  method: '',
  module: '',
  key: '',
};

const PermissionAddEditPopup: FC<PermissionGroupAddEditPopupProps> = ({
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
    mutate: mutatePermission,
  } = useFetchPermission(itemId);
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
        .trim()
        .required()
        .label(messages['permission.key'] as string),
      uri: yup
        .string()
        .required()
        .label('URI')
        .label(messages['permission.uri'] as string),
      method: yup
        .number()
        .required()
        .max(5)
        .label(messages['permission.method'] as string),
      module: yup
        .string()
        .required()
        .label(messages['permission.module'] as string),
    });
  }, [messages]);

  const methods = useMemo(
    () => [
      {
        id: PermissionMethodsKeyByLabel.GET,
        label: messages['permissions.method_get'],
      },
      {
        id: PermissionMethodsKeyByLabel.POST,
        label: messages['permissions.method_post'],
      },
      {
        id: PermissionMethodsKeyByLabel.PUT,
        label: messages['permissions.method_put'],
      },
      {
        id: PermissionMethodsKeyByLabel.PATCH,
        label: messages['permissions.method_patch'],
      },
      {
        id: PermissionMethodsKeyByLabel.DELETE,
        label: messages['permissions.method_delete'],
      },
    ],
    [messages],
  );

  const {
    // register,
    control,
    reset,
    setError,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<IPermission>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemData) {
      reset({
        title_en: itemData?.title_en,
        title: itemData?.title,
        uri: itemData?.uri,
        method: itemData?.method,
        module: itemData?.module,
        key: itemData?.key,
      });
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  const onSubmit: SubmitHandler<IPermission> = async (data: IPermission) => {
    try {
      if (itemId) {
        await updatePermission(itemId, data);
        updateSuccessMessage('permission.label');
        mutatePermission();
      } else {
        await createPermission(data);
        createSuccessMessage('permission.label');
      }
      props.onClose();
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({
        setError,
        validationSchema,
        errorStack,
        error,
      });
    }
  };

  return (
    <HookFormMuiModal
      open={true}
      {...props}
      title={
        <>
          <IconPermission />
          {isEdit ? (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='permission.label' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='permission.label' />}}
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
            label={messages['permission.key']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextInput
            required
            id='module'
            label={messages['permission.module']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextInput
            required
            id='uri'
            label={messages['permission.uri']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12}>
          <CustomFormSelect
            required
            isLoading={false}
            id='method'
            label={messages['permission.method']}
            control={control}
            options={methods}
            optionValueProp={'id'}
            optionTitleProp={['label']}
            errorInstance={errors}
          />
        </Grid>
      </Grid>
    </HookFormMuiModal>
  );
};
export default PermissionAddEditPopup;
