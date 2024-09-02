import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
import {useFetchBatchesWithParams} from '../../../services/instituteManagement/hooks';
import {assignBatch} from '../../../services/instituteManagement/RegistrationService';
import {IBatchAssign} from '../../../shared/Interface/organization.interface';

interface IBulkBatchAssignPopup {
  itemIds: Array<any>;
  onClose: () => void;
  courseId: number | null;
  trainingCenterId: number;
  refreshDataTable: () => void;
}

const BulkAssignBatchPopup = ({
  itemIds,
  refreshDataTable,
  courseId,
  trainingCenterId,
  ...props
}: IBulkBatchAssignPopup) => {
  const {messages, formatDate} = useIntl();
  const {successStack, errorStack} = useNotiStack();

  const [batchesFilters] = useState<any>({
    course_id: courseId,
    training_center_id: trainingCenterId,
  });

  const {data: batchesData, isLoading: isBatchesLoading} =
    useFetchBatchesWithParams(batchesFilters);

  const [batches, setBatches] = useState<Array<any>>([]);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      batch_id: yup
        .string()
        .trim()
        .required()
        .label(messages['batches.label'] as string),
    });
  }, [messages]);

  const {
    control,
    setError,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (batchesData && batchesData.length > 0) {
      setBatches(batchesData);
    }
  }, [batchesData]);

  const onSubmit: SubmitHandler<IBatchAssign> = async (data: IBatchAssign) => {
    try {
      if (itemIds) {
        data.training_center_id = trainingCenterId;
        await assignBatch(data, itemIds);
        successStack(
          <IntlMessages
            id='applicationManagement.batchAssigned'
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

  const formattedLabel = useCallback((item: any) => {
    return `${item?.title ?? ''} (${messages['common.start_date']}: ${
      item?.batch_start_date ? formatDate(item?.batch_start_date) : ''
    })`;
  }, []);

  return (
    <HookFormMuiModal
      {...props}
      open={true}
      title={
        <>
          <IconOccupation />
          <IntlMessages
            id='applicationManagement.assignBatch'
            values={{
              subject: <IntlMessages id='applicationManagement.label' />,
            }}
          />
        </>
      }
      maxWidth={'sm'}
      handleSubmit={handleSubmit(onSubmit)}
      actions={
        <>
          <CancelButton onClick={props.onClose} isLoading={isBatchesLoading} />
          <SubmitButton
            isSubmitting={isSubmitting}
            isLoading={isBatchesLoading}
          />
        </>
      }>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <CustomFormSelect
            required
            id='batch_id'
            label={messages['batches.label']}
            isLoading={isBatchesLoading}
            control={control}
            options={batches}
            optionTitleProp={['title']}
            optionValueProp={'id'}
            formattedLabel={formattedLabel}
            errorInstance={errors}
          />
        </Grid>
      </Grid>
    </HookFormMuiModal>
  );
};

export default BulkAssignBatchPopup;
