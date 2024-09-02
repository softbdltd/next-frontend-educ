import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {getMomentDateFormat} from '../../../@core/utilities/helpers';
import IntlMessages from '../../../@core/utility/IntlMessages';
import HookFormMuiModal from '../../../@core/modals/HookFormMuiModal/HookFormMuiModal';
import CancelButton from '../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import Grid from '@mui/material/Grid';
import FormRowStatus from '../../../@core/elements/input/FormRowStatus/FormRowStatus';
import yup from '../../../@core/libs/yup';
import {
  assignTrainersToBatch,
  createBatch,
  updateBatch,
} from '../../../services/instituteManagement/BatchService';
import IconBatch from '../../../@core/icons/IconBatch';
import CustomFormSelect from '../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import CustomDatePicker from '../../../@core/elements/input/CustomDatePicker';
import {
  useFetchBatch,
  useFetchLocalizedBranches,
  useFetchLocalizedCourses,
  useFetchLocalizedInstitutes,
  useFetchLocalizedTrainers,
  useFetchLocalizedTrainingCenters,
} from '../../../services/instituteManagement/hooks';
import RowStatus from '../../../@core/utilities/RowStatus';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import {useAuthUser} from '../../../@core/utility/AppHooks';
import {IBatch} from '../../../shared/Interface/institute.interface';
import {CommonAuthUser} from '../../../redux/types/models/CommonAuthUser';
import {isBreakPointUp} from '../../../@core/utility/Utils';
import CustomSelectAutoComplete from '../../learner/registration/CustomSelectAutoComplete';

interface BatchAddEditPopupProps {
  itemId: number | null;
  onClose: () => void;
  refreshDataTable: () => void;
}

const initialValues = {
  title_en: '',
  title: '',
  course_id: '',
  programme_id: '',
  institute_id: '',
  industry_association_id: '',
  branch_id: '',
  training_center_id: '',
  registration_start_date: '',
  registration_end_date: '',
  batch_start_date: '',
  batch_end_date: '',
  number_of_seats: '',
  // available_seats: '',
  row_status: '1',
  trainers: [],
};

const BatchAddEditPopup: FC<BatchAddEditPopupProps> = ({
  itemId,
  refreshDataTable,
  ...props
}) => {
  const {messages} = useIntl();
  const {errorStack, successStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const isEdit = itemId != null;
  const authUser = useAuthUser<CommonAuthUser>();

  const [instituteFilters, setInstituteFilters] = useState<any>(null);
  const {data: institutes, isLoading: isLoadingInstitutes} =
    useFetchLocalizedInstitutes(instituteFilters);

  const {
    data: itemData,
    isLoading,
    mutate: mutateBatch,
  } = useFetchBatch(itemId);

  const [branchFilters, setBranchFilters] = useState<any>(null);
  const [trainingCenterFilters, setTrainingCenterFilters] = useState<any>(null);
  const [coursesFilters, setCoursesFilters] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });

  const {data: branches, isLoading: isLoadingBranches} =
    useFetchLocalizedBranches(branchFilters);

  const {data: trainingCenters, isLoading: isLoadingTrainingCenters} =
    useFetchLocalizedTrainingCenters(trainingCenterFilters);

  const {data: courses, isLoading: isLoadingCourses} =
    useFetchLocalizedCourses(coursesFilters);

  const [trainersFilters] = useState({row_status: RowStatus.ACTIVE});
  const {data: trainers, isLoading: isLoadingTrainers} =
    useFetchLocalizedTrainers(trainersFilters);

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

      institute_id: authUser?.isSystemUser
        ? yup
            .string()
            .trim()
            .required()
            .label(messages['institute.label'] as string)
        : yup.string().nullable(),
      course_id: yup
        .string()
        .trim()
        .required()
        .label(messages['course.label'] as string),
      training_center_id:
        authUser && !authUser?.isTrainingCenterUser
          ? yup
              .string()
              .trim()
              .required()
              .label(messages['training_center.label'] as string)
          : yup.string(),
      number_of_seats: yup
        .string()
        .trim()
        .required()
        .label(messages['batches.total_seat'] as string),
      // available_seats: yup
      //   .string()
      //   .trim()
      //   .required()
      //   .label(messages['batches.available_seat'] as string),
      registration_start_date: yup
        .string()
        .nullable(true)
        .trim()
        .required()
        .matches(/(19|20)\d\d-[01]\d-[0123]\d/)
        .label(messages['batches.registration_start_date'] as string),
      registration_end_date: yup
        .string()
        .nullable(true)
        .trim()
        .required()
        .matches(/(19|20)\d\d-[01]\d-[0123]\d/)
        .label(messages['batches.registration_end_date'] as string),
      batch_start_date: yup
        .string()
        .nullable(true)
        .trim()
        .required()
        .matches(/(19|20)\d\d-[01]\d-[0123]\d/)
        .label(messages['batches.start_date'] as string),
      batch_end_date: yup
        .string()
        .nullable(true)
        .trim()
        .required()
        .matches(/(19|20)\d\d-[01]\d-[0123]\d/)
        .label(messages['batches.end_date'] as string),
    });
  }, [messages, authUser]);

  const {
    control,
    reset,
    setError,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<IBatch>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (authUser?.isSystemUser) {
      setInstituteFilters({row_status: RowStatus.ACTIVE});
    }

    if (
      !authUser?.isTrainingCenterUser &&
      !authUser?.isIndustryAssociationUser
    ) {
      setBranchFilters({
        row_status: RowStatus.ACTIVE,
      });

      setTrainingCenterFilters({
        row_status: RowStatus.ACTIVE,
      });
    }

    if (authUser?.isIndustryAssociationUser) {
      setTrainingCenterFilters({
        row_status: RowStatus.ACTIVE,
      });
    }
  }, [authUser]);

  useEffect(() => {
    if (itemData) {
      reset({
        title_en: itemData?.title_en,
        title: itemData?.title,
        course_id: itemData?.course_id,
        institute_id: itemData?.institute_id,
        industry_association_id: itemData?.industry_association_id,
        branch_id: itemData?.branch_id,
        training_center_id: itemData?.training_center_id,
        registration_start_date: itemData?.registration_start_date
          ? getMomentDateFormat(itemData.registration_start_date, 'YYYY-MM-DD')
          : '',
        registration_end_date: itemData?.registration_end_date
          ? getMomentDateFormat(itemData.registration_end_date, 'YYYY-MM-DD')
          : '',
        batch_start_date: itemData?.batch_start_date
          ? getMomentDateFormat(itemData.batch_start_date, 'YYYY-MM-DD')
          : '',
        batch_end_date: itemData?.batch_end_date
          ? getMomentDateFormat(itemData.batch_end_date, 'YYYY-MM-DD')
          : '',
        number_of_seats: itemData?.number_of_seats,
        // available_seats: itemData?.available_seats,
        trainers: itemData?.trainers,
        row_status: String(itemData?.row_status),
      });

      setCoursesFilters({
        row_status: RowStatus.ACTIVE,
        institute_id: itemData?.institute_id,
      });

      if (
        !authUser?.isTrainingCenterUser &&
        !authUser?.isIndustryAssociationUser
      ) {
        setBranchFilters({
          row_status: RowStatus.ACTIVE,
          institute_id: itemData?.institute_id,
        });

        setTrainingCenterFilters({
          row_status: RowStatus.ACTIVE,
          branch_id: itemData?.branch_id,
        });
      }
    } else {
      reset(initialValues);
    }
  }, [itemData]);

  const getTrainerIds = (trainers: any) => {
    return (trainers || []).map((item: any) => item.id);
  };

  const onInstituteChange = useCallback((instituteId: number) => {
    setBranchFilters(
      instituteId
        ? {
            row_status: RowStatus.ACTIVE,
            institute_id: instituteId,
          }
        : {
            row_status: RowStatus.ACTIVE,
          },
    );
    setCoursesFilters(
      instituteId
        ? {
            row_status: RowStatus.ACTIVE,
            institute_id: instituteId,
          }
        : {
            row_status: RowStatus.ACTIVE,
          },
    );

    setTrainingCenterFilters(
      instituteId
        ? {
            row_status: RowStatus.ACTIVE,
            institute_id: instituteId,
          }
        : {
            row_status: RowStatus.ACTIVE,
          },
    );
  }, []);

  const onBranchChange = useCallback((branchId: number) => {
    setTrainingCenterFilters({
      row_status: RowStatus.ACTIVE,
      branch_id: branchId,
    });
  }, []);

  const onSubmit: SubmitHandler<IBatch> = async (data: IBatch) => {
    let assignTrainersResponse;

    if (!authUser?.isSystemUser) {
      delete data.institute_id;
      delete data.industry_association_id;
    }

    if (authUser?.isTrainingCenterUser) {
      delete data.branch_id;
      delete data.training_center_id;
    }

    try {
      if (itemId) {
        await updateBatch(itemId, data);
        mutateBatch();
        assignTrainersResponse = await assignTrainersToBatch(
          itemId,
          getTrainerIds(data.trainers),
        );
        if (assignTrainersResponse) {
          updateSuccessMessage('batches.label');
        }
      } else {
        const response = await createBatch(data);
        createSuccessMessage('batches.label');
        if (
          data.trainers &&
          data.trainers.length > 0 &&
          response &&
          response.data
        ) {
          assignTrainersResponse = await assignTrainersToBatch(
            response.data.id,
            getTrainerIds(data.trainers),
          );
        }
        if (assignTrainersResponse) {
          successStack(messages['trainers.assign_success'] as string);
        }
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
          <IconBatch />
          {isEdit ? (
            <IntlMessages
              id='common.edit'
              values={{subject: <IntlMessages id='batches.label' />}}
            />
          ) : (
            <IntlMessages
              id='common.add_new'
              values={{subject: <IntlMessages id='batches.label' />}}
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
        {authUser?.isSystemUser && (
          <Grid item xs={12} sm={6} md={6}>
            <CustomFormSelect
              required
              id='institute_id'
              label={messages['institute.label']}
              isLoading={isLoadingInstitutes}
              control={control}
              options={institutes}
              optionValueProp='id'
              optionTitleProp={['title']}
              errorInstance={errors}
              onChange={onInstituteChange}
            />
          </Grid>
        )}

        {!authUser?.isTrainingCenterUser && (
          <React.Fragment>
            {!authUser?.isIndustryAssociationUser && (
              <Grid item xs={12} sm={6} md={6}>
                <CustomFilterableFormSelect
                  id='branch_id'
                  label={messages['branch.label']}
                  isLoading={isLoadingBranches}
                  control={control}
                  options={branches}
                  optionValueProp='id'
                  optionTitleProp={['title']}
                  errorInstance={errors}
                  onChange={onBranchChange}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={6}>
              <CustomFilterableFormSelect
                required
                id='training_center_id'
                label={messages['skill_development.label']}
                isLoading={isLoadingTrainingCenters}
                control={control}
                options={trainingCenters}
                optionValueProp='id'
                optionTitleProp={['title']}
                errorInstance={errors}
              />
            </Grid>
          </React.Fragment>
        )}

        <Grid item xs={12} sm={6} md={6}>
          <CustomFilterableFormSelect
            required
            id='course_id'
            label={messages['course.label']}
            isLoading={isLoadingCourses}
            control={control}
            options={courses}
            optionValueProp='id'
            optionTitleProp={['title']}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomDatePicker
            required
            id='registration_start_date'
            label={messages['batches.registration_start_date']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomDatePicker
            required
            id='registration_end_date'
            label={messages['batches.registration_end_date']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomDatePicker
            required
            id='batch_start_date'
            label={messages['batches.start_date']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomDatePicker
            required
            id='batch_end_date'
            label={messages['batches.end_date']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={6}>
          <CustomTextInput
            required
            id='number_of_seats'
            label={messages['batches.total_seat_en']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
            type={'number'}
            InputProps={{inputProps: {min: 0}}}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CustomSelectAutoComplete
            id='trainers'
            label={messages['trainers.label']}
            isLoading={isLoadingTrainers}
            control={control}
            options={trainers}
            optionValueProp='id'
            optionTitleProp={[
              'trainer_first_name',
              'trainer_last_name',
              'subject',
            ]}
            errorInstance={errors}
            defaultValue={initialValues.trainers}
          />
          {/* <CustomTextInput
            required
            id='available_seats'
            label={messages['batches.available_seat']}
            control={control}
            errorInstance={errors}
            isLoading={isLoading}
          /> */}
        </Grid>

        {/* <Grid item xs={12} sm=6 md={6}>
            <CustomFormSelect
            id='trainers'
            label={messages['trainers.label']}
            isLoading={isLoadingTrainers}
            control={control}
            options={trainers}
            optionValueProp='id'
            optionTitleProp={['trainer_name_en', 'trainer_name']}
            errorInstance={errors}
            multiple={true}
            defaultValue={initialValues.trainers}
          />
        </Grid> */}

        <Grid item xs={12} sm={6} md={6}>
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

export default BatchAddEditPopup;
