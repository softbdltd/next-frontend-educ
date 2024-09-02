import React, {useCallback, useMemo, useState} from 'react';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {Grid, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import Paper from '@mui/material/Paper';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import {useForm} from 'react-hook-form';
import {
  useFetchCityCorporations,
  useFetchLocalizedDistricts,
  useFetchLocalizedDivisions,
} from '../../../services/locationManagement/hooks';
import RowStatus from '../../../@core/utilities/RowStatus';
import yup from '../../../@core/libs/yup';
import {yupResolver} from '@hookform/resolvers/yup';
import IconStaticPage from '../../../@core/icons/IconStaticPage';
import IntlMessages from '../../../@core/utility/IntlMessages';
import {
  EMAIL_REGEX,
  MOBILE_NUMBER_REGEX,
} from '../../../@core/common/patternRegex';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import SendSms from './SendSms';
import {useFetchFilteredSystemUserYouthCount} from '../../../services/global/hooks';
import SearchIcon from '@mui/icons-material/Search';
import {sendSystemUserMsgToBulkYouth} from '../../../services/global/globalService';

const SystemUserMessage = () => {
  const {messages, formatNumber} = useIntl();
  const [learnerCountFilter, setYouthCountFilter] = useState<any>(null);
  const [divisionsFilter] = useState<any>({row_status: RowStatus.ACTIVE});
  const [districtsFilter, setDistrictsFilter] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const [cityCorporationFilter, setCityCorporationFilter] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });

  const {warningStack} = useNotiStack();

  const {data: learnerSearchData, isLoading: isLoadingYouthSearchData} =
    useFetchFilteredSystemUserYouthCount(learnerCountFilter);

  const {data: divisions, isLoading: isLoadingDivisions} =
    useFetchLocalizedDivisions(divisionsFilter);
  const {data: districts, isLoading: isLoadingDistricts} =
    useFetchLocalizedDistricts(districtsFilter);
  const {data: cityCorporations, isLoading: isLoadingCityCorporations} =
    useFetchCityCorporations(cityCorporationFilter);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      email: yup
        .string()
        .trim()
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .matches(EMAIL_REGEX)
        .label(messages['common.email'] as string),
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
    setValue,
    reset,
    formState: {errors},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  const divisionChangeHandler = useCallback((divisionId: number) => {
    setValue('loc_city_corporation_id', '');
    setValue('loc_district_id', '');

    setDistrictsFilter((previousState: any) => {
      if (divisionId) {
        return {
          ...previousState,
          loc_division_id: divisionId,
        };
      } else {
        const {loc_division_id, ...rest} = previousState;
        return rest;
      }
    });

    setCityCorporationFilter((previousState: any) => {
      if (divisionId) {
        return {
          ...previousState,
          loc_division_id: divisionId,
        };
      } else {
        const {loc_division_id, ...rest} = previousState;
        return rest;
      }
    });
  }, []);

  const filterResetHandler = useCallback(() => {
    reset({
      name: '',
      loc_division_id: '',
      loc_city_corporation_id: '',
      loc_district_id: '',
      email: '',
    });
    setYouthCountFilter(null);
  }, [reset]);

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
              <CustomTextInput
                id='name'
                label={messages['common.name']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
              <CustomFilterableFormSelect
                id='loc_division_id'
                label={messages['divisions.label']}
                isLoading={isLoadingDivisions}
                control={control}
                options={divisions}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
                onChange={divisionChangeHandler}
              />
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
              <CustomFilterableFormSelect
                id='loc_city_corporation_id'
                label={messages['city_corporation.label']}
                isLoading={isLoadingCityCorporations}
                control={control}
                options={cityCorporations}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
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
            <Grid item xs={4} sm={4} md={4}>
              <CustomTextInput
                id='email'
                label={messages['learner.email']}
                control={control}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
              <CustomTextInput
                id='mobile'
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
          sendSystemUserMsgToBulkYouth({...data, ...learnerCountFilter})
        }
      />
    </PageContentBlock>
  );
};

export default SystemUserMessage;
