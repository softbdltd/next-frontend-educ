import React, {useCallback, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import yup from '../../../@core/libs/yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import PageContentBlock from '../../../@core/components/PageContentBlock';
import Paper from '@mui/material/Paper';
import {Grid, Typography} from '@mui/material';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import IconStaticPage from '../../../@core/icons/IconStaticPage';
import IntlMessages from '../../../@core/utility/IntlMessages';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import {useFetchFilteredIndustryAssocYouthCount} from '../../../services/IndustryAssociationManagement/hooks';
import SendSms from './SendSms';
import {EMAIL_REGEX} from '../../../@core/common/patternRegex';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import {sendIndustryMessageToBulkYouth} from '../../../services/IndustryAssociationManagement/IndustryAssociationService';

const IndustryAssocUserMessage = () => {
  const {messages, formatNumber} = useIntl();
  const {warningStack} = useNotiStack();
  const [learnerCountFilter, setYouthCountFilter] = useState<any>(null);

  const {data: learnerSearchData, isLoading: isLoadingYouthSearchData} =
    useFetchFilteredIndustryAssocYouthCount(learnerCountFilter);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      email: yup
        .string()
        .trim()
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .matches(EMAIL_REGEX)
        .label(messages['common.email'] as string),
    });
  }, [messages]);

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  const filterResetHandler = useCallback(() => {
    reset({
      name: '',
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
          <Grid container spacing={1}>
            <Grid item xs={6} sm={6} md={6}>
              <CustomTextInput
                id='name'
                label={messages['common.name']}
                control={control}
                errorInstance={errors}
                isLoading={false}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <CustomTextInput
                id='email'
                label={messages['learner.email']}
                control={control}
                errorInstance={errors}
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
            {messages['member.total_result']}:{' '}
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
          sendIndustryMessageToBulkYouth({...data, ...learnerCountFilter})
        }
      />
    </PageContentBlock>
  );
};

export default IndustryAssocUserMessage;
