import {yupResolver} from '@hookform/resolvers/yup';
import {Grid} from '@mui/material';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import FormRowStatus from '../../../@core/elements/input/FormRowStatus/FormRowStatus';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import IconOccupation from '../../../@core/icons/IconOccupation';
import yup from '../../../@core/libs/yup';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import RowStatus from '../../../@core/utilities/RowStatus';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {
  useFetchLocalizedJobSectors,
  useFetchOccupation,
} from '../../../services/organaizationManagement/hooks';
import {
  createOccupation,
  updateOccupation,
} from '../../../services/organaizationManagement/OccupationService';
import {IOccupation} from '../../../shared/Interface/occupation.interface';

interface OccupationAddEditPopupProps {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  title_en: '',
  title: '',
  job_sector_id: '',
  row_status: '1',
};

const OccupationAddEditPopup: FC<OccupationAddEditPopupProps> = ({
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
    mutate: mutateOccupation,
  } = useFetchOccupation(itemId);
  const [jobSectorFilters] = useState({row_status: RowStatus.ACTIVE});
  const {data: jobSectors, isLoading: isJobSectorsLoading} =
    useFetchLocalizedJobSectors(jobSectorFilters);

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

      job_sector_id: yup
        .string()
        .trim()
        .required()
        .label(messages['job_sectors.label'] as string),
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
        title_en: itemData?.title_en,
        title: itemData?.title,
        row_status: String(itemData?.row_status),
        job_sector_id: itemData?.job_sector_id,
      });
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  const onSubmit: SubmitHandler<IOccupation> = async (data: IOccupation) => {
    try {
      if (itemId) {
        await updateOccupation(itemId, data);
        updateSuccessMessage('occupations.label');
        mutateOccupation();
      } else {
        await createOccupation(data);
        createSuccessMessage('occupations.label');
      }
      props.onClose();
      refreshDataTable();
    } catch (error: any) {
      // setServerValidationErrors(response.errors, setError, validationSchema);
      processServerSideErrors({error, setError, validationSchema, errorStack});
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
              id='common.edit'
              values={{subject: <IntlMessages id='occupations.label' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='occupations.label' />}}
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

        <Grid item xs={12}>
          <CustomFilterableFormSelect
            required
            id='job_sector_id'
            label={messages['job_sectors.label']}
            isLoading={isJobSectorsLoading}
            control={control}
            options={jobSectors}
            optionValueProp={'id'}
            optionTitleProp={['title']}
            errorInstance={errors}
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

export default OccupationAddEditPopup;
