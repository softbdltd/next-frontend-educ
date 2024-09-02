import {yupResolver} from '@hookform/resolvers/yup';
import {Grid} from '@mui/material';
import moment from 'moment';
import React, {FC, useEffect, useMemo} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import CustomDatePicker from '../../../@core/elements/input/CustomDatePicker';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import CustomTimePicker from '../../../@core/elements/input/TimePicker';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import IconBranch from '../../../@core/icons/IconBranch';
import yup from '../../../@core/libs/yup';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {
  createCalendar,
  updateCalendar,
} from '../../../services/cmsManagement/EventService';
import {useFetchCalendarEvent} from '../../../services/cmsManagement/hooks';
import {ICalendarDto} from '../../../shared/Interface/common.interface';
import FileUploadComponent from '../../filepond/FileUploadComponent';

interface CalendarAddEditPopupProps {
  itemId: number | null | undefined;
  startDate: string | null | undefined;
  endDate: string | null | undefined;
  onClose: () => void;
  refreshDataTable: (events: string, item?: any) => void;
}

let initialValues = {
  title: '',
  title_en: '',
  image_path: '',
  file_path: '',
  batch_id: '',
  start_date: '',
  end_date: '',
  start_time: '',
  end_time: '',
  color: '',
};

const CalendarAddEditPopup: FC<CalendarAddEditPopupProps> = ({
  itemId,
  startDate,
  endDate,
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
    mutate: mutateCalenderEvent,
  } = useFetchCalendarEvent(itemId);

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
      start_date: yup
        .string()
        .nullable(true)
        .trim()
        .required()
        .label(messages['common.start_date'] as string),
      end_date: yup
        .string()
        .nullable(true)
        .trim()
        .required()
        .label(messages['common.end_date'] as string),
    });
  }, [messages]);
  const {
    control,
    register,
    reset,
    setError,
    handleSubmit,
    setValue,
    formState: {errors, isSubmitting},
  } = useForm<ICalendarDto>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemData) {
      reset({
        ...itemData,
        start_date: itemData?.start_date,
        end_date: itemData?.end_date,
      });
    } else {
      initialValues.start_date = moment(startDate).format('yyyy-MM-DD');
      initialValues.end_date = moment(endDate).format('yyyy-MM-DD');
      initialValues.start_time = moment(startDate).format('HH:mm');
      initialValues.end_time = moment(endDate).format('HH:mm');
      reset(initialValues);
    }
  }, [itemData]);
  const hasSecond = (time: any) => {
    if (time) {
      const timearray = time.split(':');
      return timearray.length === 3;
    } else {
      return false;
    }
  };
  const onSubmit: SubmitHandler<ICalendarDto> = async (data: ICalendarDto) => {
    data.start = data.start_date;
    data.end = data.end_date;
    if (data.start_time) {
      data.start_time = hasSecond(data.start_time)
        ? data.start_time
        : `${data.start_time}:00`;
    }
    if (data.end_time) {
      data.end_time = hasSecond(data.end_time)
        ? data.end_time
        : `${data.end_time}:00`;
    }

    try {
      if (itemId) {
        await updateCalendar(itemId, data);
        updateSuccessMessage('menu.events');
        mutateCalenderEvent();
        refreshDataTable('update', data);
      } else {
        const create = await createCalendar(data);
        data.id = create.data.id;
        createSuccessMessage('menu.events');
        refreshDataTable('create', data);
      }
      props.onClose();
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
          <IconBranch />
          {isEdit ? (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='menu.events' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='menu.events' />}}
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
        <Grid item xs={12} sm={6} md={6}>
          <FileUploadComponent
            id='image_path'
            defaultFileUrl={itemData?.image_path}
            errorInstance={errors}
            setValue={setValue}
            register={register}
            label={messages['common.photo']}
            required={false}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <FileUploadComponent
            id='file_path'
            errorInstance={errors}
            defaultFileUrl={itemData?.file_path}
            setValue={setValue}
            register={register}
            sizeLimitText={'3MB'}
            label={messages['common.guideline_upload']}
            required={false}
            acceptedFileTypes={[
              'application/pdf',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ]}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomDatePicker
            required
            id='start_date'
            label={messages['common.event_start_date']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomDatePicker
            required
            id='end_date'
            label={messages['common.event_end_date']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTimePicker
            id='start_time'
            label={messages['common.start_time']}
            register={register}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomTimePicker
            id='end_time'
            label={messages['common.end_time']}
            register={register}
          />
        </Grid>
      </Grid>
    </HookFormMuiModal>
  );
};
export default CalendarAddEditPopup;
