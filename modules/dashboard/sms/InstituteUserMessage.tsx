import React, {useCallback, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import RowStatus from '../../../@core/utilities/RowStatus';
import {useFetchLocalizedDistricts} from '../../../services/locationManagement/hooks';
import yup from '../../../@core/libs/yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import Paper from '@mui/material/Paper';
import {Grid, Typography} from '@mui/material';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SendSms from './SendSms';
import IconStaticPage from '../../../@core/icons/IconStaticPage';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {
  useFetchBatchesWithParams,
  useFetchFilteredInstituteYouthCount,
  useFetchLocalizedCourses,
  useFetchLocalizedTrainingCenters,
} from '../../../services/instituteManagement/hooks';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import _ from 'lodash';
import {MOBILE_NUMBER_REGEX} from '../../../@core/common/patternRegex';
import SearchIcon from '@mui/icons-material/Search';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {sendInstituteNotificationToBulkYouth} from '../../../services/instituteManagement/InstituteService';

const InstituteUserMessage = () => {
  const {messages, formatNumber} = useIntl();
  const [learnerCountFilter, setYouthCountFilter] = useState<any>(null);
  const [districtsFilter] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const {warningStack} = useNotiStack();

  const [trainingCenterFilters, setTrainingCenterFilters] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const [coursesFilters] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const [batchFilter, setBatchFilter] = useState<any>(null);

  const {data: learnerSearchData, isLoading: isLoadingYouthSearchData} =
    useFetchFilteredInstituteYouthCount(learnerCountFilter);

  const {data: districts, isLoading: isLoadingDistricts} =
    useFetchLocalizedDistricts(districtsFilter);

  const {data: trainingCenters, isLoading: isLoadingTrainingCenters} =
    useFetchLocalizedTrainingCenters(trainingCenterFilters);

  const {data: courses, isLoading: isLoadingCourses} =
    useFetchLocalizedCourses(coursesFilters);

  const {data: batches, isLoading: isLoadingBatch} =
    useFetchBatchesWithParams(batchFilter);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      phone: yup
        .string()
        .trim()
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .matches(MOBILE_NUMBER_REGEX)
        .label(messages['common.mobile_en'] as string),
    });
  }, [messages]);

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    reset,
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  const filterResetHandler = useCallback(() => {
    reset({
      course_id: '',
      training_center_id: '',
      batch_id: '',
      loc_district_id: '',
      phone: '',
    });
    setYouthCountFilter(null);
  }, [reset]);

  const trainingCentersHandler = (trainingCenterId: number) => {
    setValue('batch_id', '');

    setBatchFilter((previousState: any) => {
      if (trainingCenterId) {
        return {
          ...previousState,
          row_status: RowStatus.ACTIVE,
          training_center_id: trainingCenterId,
        };
      } else {
        const {training_center_id, ...rest} = previousState;
        const {course_id} = rest;
        if (course_id) {
          return rest;
        } else {
          return null;
        }
      }
    });
  };

  const courseChangeHandler = (courseId: number) => {
    setValue('batch_id', '');
    setValue('training_center_id', '');

    setBatchFilter((previousState: any) => {
      if (courseId) {
        return {
          ...previousState,
          row_status: RowStatus.ACTIVE,
          course_id: courseId,
        };
      } else {
        return null;
      }
    });

    setTrainingCenterFilters((previousState: any) => {
      if (courseId) {
        return {
          ...previousState,
          course_id: courseId,
        };
      } else {
        const {course_id, ...rest} = previousState;
        return rest;
      }
    });
  };

  const onSubmit: any = async (data: any) => {
    Object.keys(data).forEach((key) => {
      if (!data[key]) {
        delete data[key];
      }
    });

    if (Object.keys(data)?.length == 0) {
      warningStack(messages['error.select_atleast_one_criteria'] as string);
      return;
    }
    setYouthCountFilter(data);
  };

  return (
    <PageContentBlock
      title={
        <>
          <IconStaticPage /> <IntlMessages id='common.message' />
        </>
      }>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper sx={{p: 2}}>
          <Grid container spacing={2}>
            <Grid item xs={4} sm={4} md={4}>
              <CustomFilterableFormSelect
                id='course_id'
                label={messages['course.label']}
                isLoading={isLoadingCourses}
                control={control}
                options={courses}
                optionValueProp='id'
                optionTitleProp={['title']}
                errorInstance={errors}
                onChange={courseChangeHandler}
              />
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
              <CustomFilterableFormSelect
                id='training_center_id'
                label={messages['training_center.label']}
                isLoading={isLoadingTrainingCenters}
                control={control}
                options={trainingCenters}
                optionValueProp='id'
                optionTitleProp={['title']}
                errorInstance={errors}
                onChange={trainingCentersHandler}
              />
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
              <CustomFilterableFormSelect
                id='batch_id'
                label={messages['menu.batch']}
                isLoading={isLoadingBatch}
                control={control}
                options={batches}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <CustomFilterableFormSelect
                id='loc_district_id'
                label={messages['districts.label']}
                isLoading={isLoadingDistricts}
                control={control}
                options={districts}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <CustomTextInput
                id='phone'
                label={messages['common.mobile_en']}
                control={control}
                errorInstance={errors}
                placeholder='015XXXXXXXX'
              />
            </Grid>
          </Grid>
        </Paper>
        <Box
          pt={1}
          display='flex'
          justifyContent='flex-end'
          alignItems='flex-end'>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            startIcon={<SearchIcon />}
            disabled={isLoadingYouthSearchData}
            sx={{height: 40}}>
            {messages['button.search']}
          </Button>
        </Box>
        <Box
          mb={1}
          sx={{
            visibility:
              learnerSearchData && !isLoadingYouthSearchData
                ? 'visible'
                : 'hidden',
          }}>
          <Typography variant='h6'>
            {messages['common.total_learner']}:{' '}
            {formatNumber(learnerSearchData?.count ?? 0)}
          </Typography>
        </Box>
      </form>
      <SendSms
        disabledMessage={
          !(
            learnerSearchData &&
            !isLoadingYouthSearchData &&
            learnerSearchData?.count > 0
          )
        }
        onFilterReset={filterResetHandler}
        onMessageSend={(data) =>
          sendInstituteNotificationToBulkYouth({...data, ...learnerCountFilter})
        }
      />
    </PageContentBlock>
  );
};

export default InstituteUserMessage;
