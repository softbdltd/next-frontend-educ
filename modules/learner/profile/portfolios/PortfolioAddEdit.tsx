import {Box, Grid, Zoom} from '@mui/material';
import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import React, {FC, useEffect, useMemo} from 'react';
import CustomTextInput from '../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {processServerSideErrors} from '../../../../@core/utilities/validationErrorHandler';
import yup from '../../../../@core/libs/yup';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import {useIntl} from 'react-intl';
import CancelButton from '../../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../../@core/elements/button/SubmitButton/SubmitButton';
import {useFetchPortfolio} from '../../../../services/learnerManagement/hooks';
import {
  createPortfolio,
  updatePortfolio,
} from '../../../../services/learnerManagement/PortfolioService';
import CustomHookForm from '../component/CustomHookForm';
import {YouthPortfolio} from '../../../../services/learnerManagement/typing';
import useSuccessMessage from '../../../../@core/hooks/useSuccessMessage';
import FileUploadComponent from '../../../filepond/FileUploadComponent';
import { getAllKeysFromErrorObj } from "../../../../@core/utilities/helpers";

interface PortfolioAddEditProps {
  itemId: number | null;
  onClose: () => void;
}

const initialValues = {
  title: '',
  title_en: '',
  description: '',
  description_en: '',
  file_path: '',
};

const PortfolioAddEdit: FC<PortfolioAddEditProps> = ({itemId, ...props}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const {
    data: itemData,
    mutate: mutatePortfolio,
    isLoading,
  } = useFetchPortfolio(itemId);

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

      file_path: yup
        .string()
        .required()
        .label(messages['common.file_upload'] as string),
    });
  }, [messages]);

  const {
    register,
    control,
    reset,
    handleSubmit,
    setError,
    setValue,
    formState: {errors, isSubmitting, submitCount},
  } = useForm<YouthPortfolio>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemData) {
      reset({
        title: itemData?.title,
        title_en: itemData?.title_en,
        description: itemData?.description,
        description_en: itemData?.description_en,
        file_path: itemData?.file_path,
      });
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  useEffect(() => {
    const errorKeysArr = getAllKeysFromErrorObj(errors);
    if (submitCount && errorKeysArr.length > 0) {
      let field = document.getElementsByName(errorKeysArr?.[0]);
      if (field.length > 0) {
        field[0]?.focus();
      }
    }
  }, [errors, submitCount]);

  const onSubmit: SubmitHandler<any> = async (data: YouthPortfolio) => {
    console.log('data-------', data);

    try {
      if (itemId) {
        await updatePortfolio(itemId, data);
        updateSuccessMessage('portfolio.label');
      } else {
        await createPortfolio(data);
        createSuccessMessage('portfolio.label');
      }
      mutatePortfolio();
      props.onClose();
    } catch (error: any) {
      console.log('errors----', error);
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <Zoom in={true}>
      <Box>
        <CustomHookForm
          title={messages['portfolio.label']}
          handleSubmit={handleSubmit(onSubmit)}
          actions={
            <React.Fragment>
              <CancelButton onClick={props.onClose} isLoading={isLoading} />
              <SubmitButton isSubmitting={isSubmitting} isLoading={isLoading} />
            </React.Fragment>
          }
          onClose={props.onClose}>
          <Grid container spacing={3}>
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
                id='title_en'
                label={messages['common.title_en']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextInput
                id='description'
                label={messages['common.description']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
                multiline={true}
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextInput
                id='description_en'
                label={messages['common.description_en']}
                control={control}
                errorInstance={errors}
                isLoading={isLoading}
                multiline={true}
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FileUploadComponent
                id='file_path'
                defaultFileUrl={itemData?.file_path}
                errorInstance={errors}
                setValue={setValue}
                register={register}
                label={messages['upload_file.portfolio_modal']}
                required={true}
              />
            </Grid>
          </Grid>
          {isSubmitting && (
            <div role={'alert'} aria-live="assertive" style={{ position: 'absolute', top: '-9999px' }}>
              {messages['common.submitting'] as string}
            </div>
          )}
        </CustomHookForm>
      </Box>
    </Zoom>
  );
};

export default PortfolioAddEdit;
