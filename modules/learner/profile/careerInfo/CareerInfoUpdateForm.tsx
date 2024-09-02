import React, {FC, useEffect, useMemo} from 'react';
import {Box, Grid, Zoom} from '@mui/material';
import CustomHookForm from '../component/CustomHookForm';
import CancelButton from '../../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../../@core/elements/button/SubmitButton/SubmitButton';
import {useIntl} from 'react-intl';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import useSuccessMessage from '../../../../@core/hooks/useSuccessMessage';
import yup from '../../../../@core/libs/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {processServerSideErrors} from '../../../../@core/utilities/validationErrorHandler';
import CustomTextInput from '../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import CustomFormSelect from '../../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import {JobLevel} from '../../../dashboard/jobLists/jobPost/enums/JobPostEnums';
import {useAuthUser} from '../../../../@core/utility/AppHooks';
import {YouthAuthUser} from '../../../../redux/types/models/CommonAuthUser';
import {updateJobApplicationInfo} from '../../../../services/learnerManagement/YouthService';
import { getAllKeysFromErrorObj } from "../../../../@core/utilities/helpers";

interface CareerInfoUpdateFormProps {
  onUpdateFormClose: () => void;
}

const initialValues = {
  expected_salary: '',
  job_level: '',
};

const CareerInfoUpdateForm: FC<CareerInfoUpdateFormProps> = ({
  onUpdateFormClose,
}) => {
  const {messages} = useIntl();
  const authUser = useAuthUser<YouthAuthUser>();
  const {errorStack} = useNotiStack();
  const {updateSuccessMessage} = useSuccessMessage();

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      expected_salary: yup
        .string()
        .required()
        .label(messages['common.expected_salary'] as string),
      job_level: yup
        .string()
        .required()
        .label(messages['learner.job_level'] as string),
    });
  }, [messages]);

  const jobLevels = useMemo(
    () => [
      {
        id: JobLevel.ENTRY,
        title: messages['label.job_level_entry'],
      },
      {
        id: JobLevel.MID,
        title: messages['label.job_level_mid'],
      },
      {
        id: JobLevel.TOP,
        title: messages['label.job_level_top'],
      },
    ],
    [messages],
  );

  const {
    control,
    reset,
    setError,
    handleSubmit,
    formState: {errors, isSubmitting, submitCount},
  } = useForm<any>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (authUser) {
      reset({
        expected_salary: authUser?.expected_salary,
        job_level: authUser?.job_level,
      });
    } else {
      reset(initialValues);
    }
  }, [authUser]);

  useEffect(() => {
    const errorKeysArr = getAllKeysFromErrorObj(errors);
    if (submitCount && errorKeysArr.length > 0) {
      let field = document.getElementsByName(errorKeysArr?.[0]);
      if (field.length > 0) {
        field[0]?.focus();
      }
    }
  }, [errors, submitCount]);

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      await updateJobApplicationInfo(data);
      updateSuccessMessage('learner.career_and_application_info');
      onUpdateFormClose();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return (
    <Zoom in={true}>
      <Box>
        <CustomHookForm
          title={messages['learner.career_and_application_info']}
          handleSubmit={handleSubmit(onSubmit)}
          actions={
            <React.Fragment>
              <CancelButton onClick={onUpdateFormClose} isLoading={false} />
              <SubmitButton isSubmitting={isSubmitting} isLoading={false} />
            </React.Fragment>
          }
          onClose={onUpdateFormClose}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                required
                id='expected_salary'
                label={messages['common.expected_salary']}
                type={'number'}
                control={control}
                errorInstance={errors}
                isLoading={false}
                InputProps={{inputProps: {min: 0}}}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomFormSelect
                required
                id='job_level'
                label={messages['learner.job_level']}
                isLoading={false}
                control={control}
                options={jobLevels}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
              />
            </Grid>
          </Grid>
        </CustomHookForm>
      </Box>
    </Zoom>
  );
};

export default CareerInfoUpdateForm;
