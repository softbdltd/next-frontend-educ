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
import IconSkill from '../../../@core/icons/IconSkill';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import {
  createSkill,
  updateSkill,
} from '../../../services/organaizationManagement/SkillService';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {ISkill} from '../../../shared/Interface/organization.interface';
import {useFetchSkill} from '../../../services/learnerManagement/hooks';
import {isBreakPointUp} from '../../../@core/utility/Utils';

interface SkillAddEditPopupProps {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  title_en: '',
  title: '',
};

const SkillAddEditPopup: FC<SkillAddEditPopupProps> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const isEdit = itemId != null;
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const {
    data: itemData,
    isLoading,
    mutate: mutateSkill,
  } = useFetchSkill(itemId);

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

      description: yup.string(),
      row_status: yup.string(),
    });
  }, [messages]);

  const {
    control,
    reset,
    setError,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<ISkill>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemData) {
      reset({
        title_en: itemData?.title_en,
        title: itemData?.title,
      });
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  const onSubmit: SubmitHandler<ISkill> = async (data: ISkill) => {
    try {
      if (itemId) {
        await updateSkill(itemId, data);
        updateSuccessMessage('skill.label');
        mutateSkill();
      } else {
        await createSkill(data);
        createSuccessMessage('skill.label');
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
          <IconSkill />
          {isEdit ? (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='skill.label' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='skill.label' />}}
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
      </Grid>
    </HookFormMuiModal>
  );
};
export default SkillAddEditPopup;
