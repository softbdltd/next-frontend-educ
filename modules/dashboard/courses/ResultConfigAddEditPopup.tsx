import {useIntl} from 'react-intl';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import {Grid, Typography} from '@mui/material';
import React, {useEffect, useMemo, useState} from 'react';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import yup from '../../../@core/libs/yup';
import _ from 'lodash';
import FormRadioButtons from '../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import {ResultTypes} from '../../../@core/utilities/ResultTypes';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {Body1} from '../../../@core/elements/common';
import CustomFieldArrayResultConfigGrading from './CustomFieldArrayResultConfigGrading';
import IconResultConfig from '../../../@core/icons/IconResultConfig';
import InputAdornment from '@mui/material/InputAdornment';
import {createResultConfig} from '../../../services/instituteManagement/CourseResultConfig';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {useFetchResultConfigs} from '../../../services/instituteManagement/hooks';

type IProps = {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
};

const ResultConfigAddEditPopup = ({
  itemId,
  refreshDataTable,
  ...props
}: IProps) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();

  const [courseId] = useState({course_id: itemId});
  const {data: itemData, isLoading, mutate} = useFetchResultConfigs(courseId);

  const [selectedResultType, setSelectedResultType] = useState<any>(null);
  const [totalPercentage, setTotalPercentage] = useState<any>(0);
  const [isAttendanceRequired, setIsAttendanceRequired] =
    useState<boolean>(false);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      result_type: yup
        .string()
        .required()
        .label(messages['common.result_type'] as string),
      gradings:
        selectedResultType && Number(selectedResultType) == ResultTypes.GRADING
          ? yup.array().of(
              yup.object().shape({
                label: yup
                  .string()
                  .required()
                  .label(messages['common.label'] as string),
                min: yup
                  .string()
                  .required()
                  .label(messages['common.min'] as string),
                max: yup
                  .string()
                  .required()
                  .label(messages['common.max'] as string),
              }),
            )
          : yup.mixed().nullable(),
      pass_marks:
        selectedResultType && Number(selectedResultType) == ResultTypes.MARKING
          ? yup
              .string()
              .required()
              .label(messages['common.pass_marks'] as string)
          : yup.string().nullable(),
      total_percentage: yup
        .number()
        .required()
        .test(
          'max_validation_percentage',
          `${messages['common.total_percentage']}`,
          (value) => {
            return totalPercentage && Boolean(Number(totalPercentage) == 100);
          },
        ),
      total_gradings: yup.number().nullable(),
      total_attendance_marks: isAttendanceRequired
        ? yup
            .string()
            .required()
            .label(messages['common.attendance_total_mark'] as string)
        : yup.mixed().nullable(),
    });
  }, [messages, totalPercentage, isAttendanceRequired, selectedResultType]);

  const {
    control,
    register,
    reset,
    setError,
    watch,
    handleSubmit,
    setValue,
    getValues,
    setFocus,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  let watchResultPercentage = watch([
    'result_percentages[online]',
    'result_percentages[offline]',
    'result_percentages[mixed]',
    'result_percentages[practical]',
    'result_percentages[field_work]',
    'result_percentages[presentation]',
    'result_percentages[assignment]',
    'result_percentages[attendance]',
  ]);

  useEffect(() => {
    let values: number = 0;
    watchResultPercentage.map((value: any) => {
      if (value) {
        values += Number(value);
      }
    });

    setTotalPercentage(values);
    setValue('total_percentage', values);
  }, [watchResultPercentage]);

  useEffect(() => {
    if (itemData && itemData.id) {
      reset({
        result_type: Number(itemData?.result_type),
        pass_marks: itemData?.pass_marks,
        result_percentages: itemData?.result_percentages,
        gradings: itemData?.gradings ? itemData?.gradings : [{min: 0}],
        total_attendance_marks: itemData?.total_attendance_marks,
      });
      setSelectedResultType(Number(itemData?.result_type));
      setIsAttendanceRequired(
        !isNaN(itemData?.result_percentages?.attendance) &&
          Number(itemData.result_percentages.attendance) > 0,
      );
    } else {
      reset({
        gradings: [{min: 0}],
      });
    }
  }, [itemData]);

  const resultTypeLists = useMemo(
    () => [
      {
        key: ResultTypes.GRADING,
        label: messages['common.grading'],
      },
      {
        key: ResultTypes.MARKING,
        label: messages['common.marks'],
      },
    ],
    [messages],
  );

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      if (data.result_type == ResultTypes.GRADING) {
        let max = 0;
        let isMaxSmall: boolean = false;
        let isMinBig: boolean = false;
        if (data.gradings) {
          data.gradings.map((grad: any, i: number) => {
            if (Number(grad.max) > max) {
              max = Number(grad.max);
            }
            if (Number(grad.max) <= Number(grad.min)) {
              isMaxSmall = true;
              setFocus(`gradings[${i}][max]`);
            }
            if (i > 0) {
              if (Number(data.gradings[i - 1].max) > Number(grad.min)) {
                isMinBig = true;
                setFocus(`gradings[${i - 1}][max]`);
              }
            }
          });
        }

        if (isMaxSmall) {
          setError('total_gradings', {
            message: messages['batch.grad_max_will_greater_min'] as string,
          });
          return;
        }

        if (isMinBig) {
          setError('total_gradings', {
            message: messages['batch.grad_min_will_greater_max'] as string,
          });
          return;
        }
        if (max != 100) {
          setError('total_gradings', {
            message: messages['common.total_gradings'] as string,
          });
          return;
        }
      }

      let formData = _.cloneDeep(data);

      if (ResultTypes.GRADING == formData.result_type) {
        delete formData.pass_marks;
      }

      if (ResultTypes.MARKING == formData.result_type) {
        delete formData.gradings;
      }

      formData.course_id = itemId;
      if (itemData?.id) formData.id = itemData.id;

      if (!formData.result_percentages.online) {
        delete formData.result_percentages.online;
      }

      if (!formData.result_percentages.offline) {
        delete formData.result_percentages.offline;
      }

      if (!formData.result_percentages.mixed) {
        delete formData.result_percentages.mixed;
      }

      if (!formData.result_percentages.practical) {
        delete formData.result_percentages.practical;
      }

      if (!formData.result_percentages.field_work) {
        delete formData.result_percentages.field_work;
      }

      if (!formData.result_percentages.presentation) {
        delete formData.result_percentages.presentation;
      }

      if (!formData.result_percentages.assignment) {
        delete formData.result_percentages.assignment;
      }

      if (!formData.result_percentages.attendance) {
        delete formData.result_percentages.attendance;
      }

      await createResultConfig(formData);
      if (itemData && itemData.id) {
        updateSuccessMessage('common.result_config');
        mutate();
      } else {
        createSuccessMessage('common.result_config');
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
          <IconResultConfig />
          {itemData?.id != null ? (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='common.result_config' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='common.result_config' />}}
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
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormRadioButtons
            label={'common.result_type'}
            required
            id='result_type'
            radios={resultTypeLists}
            control={control}
            isLoading={isLoading}
            onChange={(value) => {
              setSelectedResultType(value);
            }}
          />
        </Grid>

        {selectedResultType == ResultTypes.GRADING && (
          <>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={4} sm={3} md={3}>
                  <Body1>
                    {messages['common.label']}{' '}
                    <span style={{color: 'red'}}>*</span>
                  </Body1>
                </Grid>
                <Grid item xs={4} sm={3} md={3}>
                  <Body1>
                    {messages['common.min']}{' '}
                    <span style={{color: 'red'}}>*</span>
                  </Body1>
                </Grid>
                <Grid item xs={4} sm={3} md={3}>
                  <Body1>
                    {messages['common.max']}{' '}
                    <span style={{color: 'red'}}>*</span>
                  </Body1>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <CustomFieldArrayResultConfigGrading
                id='gradings'
                isLoading={false}
                control={control}
                register={register}
                errors={errors}
                setValue={setValue}
                getValues={getValues}
              />
            </Grid>
          </>
        )}
        {selectedResultType == ResultTypes.MARKING && (
          <Grid item xs={12}>
            <CustomTextInput
              required
              id='pass_marks'
              type={'number'}
              label={messages['common.pass_marks']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
              InputProps={{inputProps: {min: 0, max: 100}}}
            />
          </Grid>
        )}
        {selectedResultType !== null && (
          <>
            <Grid item xs={12}>
              <Body1>{messages['common.result_percentage']}</Body1>
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id={'result_percentages[online]'}
                type={'number'}
                label={messages['common.online']}
                control={control}
                errorInstance={errors}
                isLoading={false}
                InputProps={{
                  inputProps: {min: 0},
                  endAdornment: (
                    <InputAdornment position='end'>%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id={'result_percentages[offline]'}
                type={'number'}
                label={messages['common.offline']}
                control={control}
                errorInstance={errors}
                isLoading={false}
                InputProps={{
                  inputProps: {min: 0},
                  endAdornment: (
                    <InputAdornment position='end'>%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id={'result_percentages[mixed]'}
                type={'number'}
                label={messages['common.mixed']}
                control={control}
                errorInstance={errors}
                isLoading={false}
                InputProps={{
                  inputProps: {min: 0},
                  endAdornment: (
                    <InputAdornment position='end'>%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id={'result_percentages[practical]'}
                type={'number'}
                label={messages['common.practical']}
                control={control}
                errorInstance={errors}
                isLoading={false}
                InputProps={{
                  inputProps: {min: 0},
                  endAdornment: (
                    <InputAdornment position='end'>%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id={'result_percentages[field_work]'}
                type={'number'}
                label={messages['common.field_work']}
                control={control}
                errorInstance={errors}
                isLoading={false}
                InputProps={{
                  inputProps: {min: 0},
                  endAdornment: (
                    <InputAdornment position='end'>%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id={'result_percentages[presentation]'}
                type={'number'}
                label={messages['common.presentation']}
                control={control}
                errorInstance={errors}
                isLoading={false}
                InputProps={{
                  inputProps: {min: 0},
                  endAdornment: (
                    <InputAdornment position='end'>%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id={'result_percentages[assignment]'}
                type={'number'}
                label={messages['common.assignment']}
                control={control}
                errorInstance={errors}
                isLoading={false}
                InputProps={{
                  inputProps: {min: 0},
                  endAdornment: (
                    <InputAdornment position='end'>%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextInput
                id={'result_percentages[attendance]'}
                type={'number'}
                label={messages['common.attendance']}
                control={control}
                errorInstance={errors}
                isLoading={false}
                onInput={(value: any) => {
                  setIsAttendanceRequired(!isNaN(value) && Number(value) > 0);
                }}
                InputProps={{
                  inputProps: {min: 0},
                  endAdornment: (
                    <InputAdornment position='end'>%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            {errors?.['total_percentage'] && (
              <Grid item xs={12}>
                <Typography sx={{color: 'red'}}>
                  {errors['total_percentage']?.message}
                </Typography>
              </Grid>
            )}

            {isAttendanceRequired && (
              <Grid item xs={6}>
                <CustomTextInput
                  required
                  id='total_attendance_marks'
                  type={'number'}
                  InputProps={{
                    inputProps: {min: 0},
                  }}
                  label={messages['common.attendance_total_mark']}
                  control={control}
                  errorInstance={errors}
                  isLoading={isLoading}
                />
              </Grid>
            )}
          </>
        )}
      </Grid>
    </HookFormMuiModal>
  );
};

export default ResultConfigAddEditPopup;
