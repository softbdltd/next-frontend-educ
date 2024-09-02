import yup from '../../../@core/libs/yup';
import Grid from '@mui/material/Grid';
import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import React, {FC, useEffect, useMemo} from 'react';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import FormRowStatus from '../../../@core/elements/input/FormRowStatus/FormRowStatus';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {Book} from '@mui/icons-material';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {useFetchResources} from '../../../services/cmsManagement/hooks';
import {IResource} from '../../../shared/Interface/common.interface';
import FileUploadComponent from '../../filepond/FileUploadComponent';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import {
  createResource,
  updateResource,
} from '../../../services/cmsManagement/ResourcesService';

interface Props {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  title: '',
  thumbnail_image: '',
  file_path: '',
  row_status: 1,
};

const ResourceAddEditPopup: FC<Props> = ({
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
    mutate: mutatePartners,
  } = useFetchResources(itemId);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      title: yup
        .string()
        .required()
        .label(messages['common.title'] as string),

      thumbnail_image: yup.string().label(messages['common.image'] as string),

      file_path: yup
        .string()
        .required()
        .label(messages['common.logo'] as string),
    });
  }, [messages]);

  const {
    register,
    reset,
    control,
    setError,
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm<IResource>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemData) {
      let data: any = {
        title: itemData?.title,
        thumbnail_path: itemData?.thumbnail_path,
        file_path: itemData?.file_path,
        row_status: String(itemData?.row_status),
      };
      reset(data);
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  console.log('errors->', errors);

  const onSubmit: SubmitHandler<any> = async (formData: any) => {
    try {
      let data = {...formData};
      if (itemId) {
        await updateResource(itemId, data);
        updateSuccessMessage('common.resource');
        mutatePartners();
      } else {
        await createResource(data);
        createSuccessMessage('common.resource');
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
          <Book />
          {isEdit ? (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='common.resource' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='common.resource' />}}
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
        <Grid item xs={12} sm={6} md={6}>
          <FileUploadComponent
            id='thumbnail_image'
            defaultFileUrl={itemData?.thumbnail_image}
            height='350'
            width='300'
            errorInstance={errors}
            setValue={setValue}
            register={register}
            label={messages['common.image']}
            sizeLimitText='1MB'
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <FileUploadComponent
            required
            id='file_path'
            defaultFileUrl={itemData?.file_path}
            setValue={setValue}
            register={register}
            label={messages['common.pdf']}
            errorInstance={errors}
            allowMultiple={false}
            acceptedFileTypes={['application/pdf']}
            sizeLimitText='1MB'
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

export default ResourceAddEditPopup;
