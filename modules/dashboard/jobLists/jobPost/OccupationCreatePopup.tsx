import React, {FC, useEffect, useMemo} from 'react';
import {useIntl} from 'react-intl';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import useSuccessMessage from '../../../../@core/hooks/useSuccessMessage';
import yup from '../../../../@core/libs/yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import {IOccupation} from '../../../../shared/Interface/occupation.interface';
import {publicCreateOccupation} from '../../../../services/organaizationManagement/OccupationService';
import {processServerSideErrors} from '../../../../@core/utilities/validationErrorHandler';
import HookFormMuiModal from '../../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import IconOccupation from '../../../../@core/icons/IconOccupation';
import IntlMessages from '../../../../@core/utility/IntlMessages';
import {isBreakPointUp} from '../../../../@core/utility/Utils';
import CancelButton from '../../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../../@core/elements/button/SubmitButton/SubmitButton';
import {Grid} from '@mui/material';
import CustomTextInput from '../../../../@core/elements/input/CustomTextInput/CustomTextInput';

interface OccupationCreatePopupProps {
  onClose: (occupationId?: number) => void;
  occupationData: any;
}

const initialValues = {
  title_en: '',
  title: '',
  row_status: '1',
};

const OccupationCreatePopup: FC<OccupationCreatePopupProps> = ({
  occupationData,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage} = useSuccessMessage();

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
    reset({
      ...initialValues,
      title_en: occupationData?.title,
      title: occupationData?.title,
    });
  }, []);

  const onSubmit: SubmitHandler<IOccupation> = async (data: IOccupation) => {
    try {
      data.job_sector_id = occupationData?.job_sector_id;
      let response = await publicCreateOccupation(data);
      createSuccessMessage('occupations.label');
      props.onClose(response.data?.id);
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
          <IconOccupation />
          <IntlMessages
            id='common.add_new'
            values={{subject: <IntlMessages id='occupations.label' />}}
          />
        </>
      }
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
      handleSubmit={handleSubmit(onSubmit)}
      actions={
        <>
          <CancelButton onClick={props.onClose} isLoading={false} />
          <SubmitButton isSubmitting={isSubmitting} isLoading={false} />
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
            isLoading={false}
          />
        </Grid>
        <Grid item xs={12}>
          <CustomTextInput
            id='title_en'
            label={messages['common.title_en']}
            control={control}
            errorInstance={errors}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </HookFormMuiModal>
  );
};

export default OccupationCreatePopup;
