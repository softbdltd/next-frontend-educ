import React, {FC, useEffect, useMemo} from 'react';
import {useIntl} from 'react-intl';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import IntlMessages from '../../../@core/utility/IntlMessages';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import Grid from '@mui/material/Grid';
import yup from '../../../@core/libs/yup';
import {updateCourseEmploymentStatus} from '../../../services/instituteManagement/BatchService';
import IconBatch from '../../../@core/icons/IconBatch';
import CustomFormSelect from '../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import {useFetchCourseEmployment} from '../../../services/instituteManagement/hooks';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {ICourseEmployment} from '../../../shared/Interface/institute.interface';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {isBreakPointUp} from '../../../@core/utility/Utils';

interface BatchAddEditPopupProps {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  course_enrollment_id: '',
  employment_status: '',
};

const CourseEmploymentStatusUpdateModalPopUp: FC<BatchAddEditPopupProps> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {updateSuccessMessage} = useSuccessMessage();
  const isEdit = itemId != null;
  const authUser = useAuthUser<CommonAuthUser>();

  const employmentList = [
    {
      id: 1,
      title: messages['common.unemployed'] as string,
    },
    {
      id: 2,
      title: messages['common.employed'] as string,
    },
    {
      id: 3,
      title: messages['common.freelancer'] as string,
    },
    {
      id: 4,
      title: messages['common.entrepreneur'] as string,
    },
  ];

  const {
    data: itemData,
    isLoading,
    mutate: mutateBatch,
  } = useFetchCourseEmployment(itemId);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      course_enrollment_id: yup
        .string()
        .trim()
        .required()
        .label(messages['course.label'] as string),
      employment_status: yup
        .string()
        .trim()
        .required()
        .label(messages['batches.total_seat'] as string),
    });
  }, [messages, authUser]);

  const {
    control,
    reset,
    setError,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<ICourseEmployment>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (itemData) {
      reset({
        course_enrollment_id: itemData?.id,
        employment_status: itemData?.employment_status,
      });
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  const onSubmit: SubmitHandler<ICourseEmployment> = async (
    data: ICourseEmployment,
  ) => {
    try {
      await updateCourseEmploymentStatus(data);
      mutateBatch();
      updateSuccessMessage('course.employment_status');
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
          <IconBatch />
          {isEdit ? (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='course.employment_status' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='course.employment_status' />}}
            />
          )}
        </>
      }
      handleSubmit={handleSubmit(onSubmit)}
      maxWidth={isBreakPointUp('xl') ? 'lg' : 'md'}
      actions={
        <>
          <CancelButton onClick={props.onClose} isLoading={isLoading} />
          <SubmitButton isSubmitting={isSubmitting} isLoading={isLoading} />
        </>
      }>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={12} md={12}>
          <CustomFormSelect
            required
            id='employment_status'
            label={messages['course.employment_status']}
            control={control}
            options={employmentList}
            optionValueProp={'id'}
            optionTitleProp={['title']}
            errorInstance={errors}
          />
        </Grid>
      </Grid>
    </HookFormMuiModal>
  );
};

export default CourseEmploymentStatusUpdateModalPopUp;
