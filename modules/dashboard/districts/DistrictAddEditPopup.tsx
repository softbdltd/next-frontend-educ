import React, {FC, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import IntlMessages from '../../../@core/utility/IntlMessages';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import Grid from '@mui/material/Grid';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import yup from '../../../@core/libs/yup';
import {
  createDistrict,
  updateDistrict,
} from '../../../services/locationManagement/DistrictService';
import CustomFormSelect from '../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import IconDistrict from '../../../@core/icons/IconDistrict';
import {
  useFetchDistrict,
  useFetchLocalizedDivisions,
} from '../../../services/locationManagement/hooks';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {District} from '../../../shared/Interface/location.interface';
import {isBreakPointUp} from '../../../@core/utility/Utils';

interface DistrictAddEditPopupProps {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  title_en: '',
  title: '',
  bbs_code: '',
  loc_division_id: '',
};

const DistrictAddEditPopup: FC<DistrictAddEditPopupProps> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const isEdit = itemId != null;
  const [divisionFilter] = useState({});
  const {
    data: itemData,
    isLoading,
    mutate: mutateDistrict,
  } = useFetchDistrict(itemId);
  const {data: divisions, isLoading: isDivisionsLoading} =
    useFetchLocalizedDivisions(divisionFilter);

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

      bbs_code: yup
        .string()
        .trim()
        .required()
        .label(messages['common.bbs_code'] as string),
      loc_division_id: yup
        .string()
        .trim()
        .required()
        .label(messages['divisions.label'] as string),
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
        bbs_code: itemData?.bbs_code,
        loc_division_id: itemData?.loc_division_id,
      });
    } else {
      reset(initialValues);
    }
  }, [itemData]);
  const onSubmit: SubmitHandler<District> = async (data: District) => {
    try {
      if (itemId) {
        await updateDistrict(itemId, data);
        updateSuccessMessage('districts.label');
        mutateDistrict();
      } else {
        await createDistrict(data);
        createSuccessMessage('districts.label');
      }
      props.onClose();
      refreshDataTable();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <HookFormMuiModal
      {...props}
      open={true}
      title={
        <>
          <IconDistrict />
          {isEdit ? (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='districts.label' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='districts.label' />}}
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
          <CustomFormSelect
            required
            id='loc_division_id'
            label={messages['divisions.label']}
            isLoading={isDivisionsLoading}
            control={control}
            options={divisions}
            optionValueProp={'id'}
            optionTitleProp={['title']}
            errorInstance={errors}
          />
        </Grid>
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
            required
            id='title_en'
            label={messages['common.title_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='bbs_code'
            label={messages['common.bbs_code']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </HookFormMuiModal>
  );
};

export default DistrictAddEditPopup;
