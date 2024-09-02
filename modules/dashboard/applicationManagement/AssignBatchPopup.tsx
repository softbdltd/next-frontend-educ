import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
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
import {
  useFetchApplicationDetails,
  useFetchBatchesWithParams,
  useFetchPrivateTrainingCentersWithBatches,
} from '../../../services/instituteManagement/hooks';
import {assignBatch} from '../../../services/instituteManagement/RegistrationService';
import {IBatchAssign} from '../../../shared/Interface/organization.interface';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import RowStatus from '../../../@core/utilities/RowStatus';
import LocaleLanguage from '../../../@core/utilities/LocaleLanguage';

interface AssignBatchPopup {
  itemId: number | null;
  onClose: () => void;
  courseId: number | null;
  refreshDataTable: () => void;
}

const initialValues = {
  batch_id: '',
};

const AssignBatchPopup: FC<AssignBatchPopup> = ({
  itemId,
  refreshDataTable,
  courseId,
  ...props
}) => {
  const {messages, locale, formatDate} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const authUser = useAuthUser<CommonAuthUser>();

  const isEdit = itemId != null;
  const {data: itemData, isLoading} = useFetchApplicationDetails(itemId);

  const [batchesFilters, setBatchesFilters] = useState<any>(null);
  const {data: batchesData, isLoading: isBatchesLoading} =
    useFetchBatchesWithParams(batchesFilters);

  const [batches, setBatches] = useState<Array<any>>([]);

  const [trainingCenterFilters] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });

  const {
    data: trainingCentersWithBatches,
    isLoading: isLoadingTrainingCenters,
  } = useFetchPrivateTrainingCentersWithBatches(
    courseId,
    trainingCenterFilters,
  );

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
    reset,
    setError,
    setValue,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemData) {
      reset({
        training_center_id: itemData?.training_center_id,
        batch_id: itemData?.batch_id,
      });

      if (authUser?.training_center_id) {
        setBatchesFilters({
          course_id: courseId,
          training_center_id: authUser?.training_center_id,
        });
      } else if (itemData?.training_center_id) {
        const trainingCenter = (trainingCentersWithBatches || [])?.filter(
          (item: any) => item.id == itemData?.training_center_id,
        );
        setBatches(trainingCenter[0]?.batches || []);
      }
    } else {
      reset(initialValues);
    }
  }, [itemData, trainingCentersWithBatches]);

  useEffect(() => {
    if (batchesData && batchesData.length > 0) {
      setBatches(batchesData);
    }
  }, [batchesData]);

  const onTrainingCenterChange = useCallback(
    (trainingCenterId: number) => {
      const trainingCenter = (trainingCentersWithBatches || [])?.filter(
        (item: any) => item.id == trainingCenterId,
      );
      setValue('batch_id', '');
      setBatches(trainingCenter[0]?.batches || []);
    },
    [trainingCentersWithBatches],
  );

  const onSubmit: SubmitHandler<IBatchAssign> = async (data: IBatchAssign) => {
    const itemIdArray: Array<any> = [itemId];
    try {
      if (itemId) {
        await assignBatch(data, itemIdArray);
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
          {isEdit ? (
            <IntlMessages
              id='applicationManagement.assignBatch'
              values={{
                subject: <IntlMessages id='applicationManagement.label' />,
              }}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{
                subject: <IntlMessages id='applicationManagement.label' />,
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
      <Grid container spacing={3}>
        {itemData?.preferred_training_center_id && (
          <Grid item xs={12}>
            {messages['common.preferred_training_center']}:{' '}
            {locale == LocaleLanguage.BN
              ? itemData?.preferred_training_center_title
              : itemData?.preferred_training_center_title_en}
          </Grid>
        )}

        {itemData?.preferred_batch_id && (
          <Grid item xs={12}>
            {messages['common.preferred_batch']}:{' '}
            {locale == LocaleLanguage.BN
              ? itemData?.preferred_batch_title
              : itemData?.preferred_batch_title_en}
          </Grid>
        )}

        {!authUser?.training_center_id && (
          <Grid item xs={12}>
            <CustomFormSelect
              required
              id='training_center_id'
              label={messages['common.training_center']}
              isLoading={isLoadingTrainingCenters}
              control={control}
              options={trainingCentersWithBatches}
              optionTitleProp={['title']}
              optionValueProp={'id'}
              errorInstance={errors}
              onChange={onTrainingCenterChange}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <CustomFormSelect
            required
            id='batch_id'
            label={messages['batches.label']}
            isLoading={isBatchesLoading || isLoadingTrainingCenters}
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

export default AssignBatchPopup;
