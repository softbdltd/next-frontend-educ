import React, {useEffect, useMemo, useState} from 'react';
import {Box, Button, Grid, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import yup from '../../../../../@core/libs/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {processServerSideErrors} from '../../../../../@core/utilities/validationErrorHandler';
import useNotiStack from '../../../../../@core/hooks/useNotifyStack';
import CustomFormSelect from '../../../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import CustomFormSwitch from '../../../../../@core/elements/input/CustomFormSwitch';
import Tooltip from '@mui/material/Tooltip';
import {Help} from '@mui/icons-material';
import CustomTextInput from '../../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {useFetchJobCompanyInfoVisibility} from '../../../../../services/IndustryManagement/hooks';
import {saveCompanyInfoVisibility} from '../../../../../services/IndustryManagement/JobService';
import {useFetchLocalizedIndustryAssociationTrades} from '../../../../../services/IndustryAssociationManagement/hooks';
import usePageLoadToTop from './usePageLoadToTop';

interface Props {
  jobId: string;
  onBack: () => void;
  onContinue: () => void;
  setLatestStep: (step: number) => void;
}

const initialValue = {
  is_company_name_visible: false,
  is_company_address_visible: false,
  is_company_business_visible: false,
  company_industry_type: '',
  company_name: '',
  company_name_en: '',
};

const CompanyInfoVisibility = ({
  jobId,
  onBack,
  onContinue,
  setLatestStep,
}: Props) => {
  const {messages} = useIntl();
  const {successStack, errorStack} = useNotiStack();
  const [isShowCompanyName, setIsShowCompanyName] = useState<boolean>(false);
  const {data: companyInfo} = useFetchJobCompanyInfoVisibility(jobId);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [associationTradeFilter] = useState<any>({});
  const {data: associationTrades, isLoading: isLoadingTrades} =
    useFetchLocalizedIndustryAssociationTrades(associationTradeFilter);

  const id = 'top';
  usePageLoadToTop({id, dependency: isReady});

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      is_company_name_visible: yup
        .boolean()
        .required()
        .label(messages['common.company_name_bn'] as string),
      company_name: yup
        .mixed()
        .label(messages['common.company_name_bn'] as string)
        .when('is_company_name_visible', {
          is: (value: boolean) => !value,
          then: yup.string().required(),
        }),
      company_industry_type: yup
        .string()
        .required()
        .label(messages['job_posting.company_type'] as string),
    });
  }, [messages]);

  const {
    register,
    control,
    setError,
    reset,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (companyInfo && companyInfo?.latest_step) {
      const latestStep = companyInfo.latest_step;
      delete companyInfo?.latest_step;

      if (latestStep >= 4) {
        setIsReady(true);
        reset({
          is_company_name_visible: companyInfo?.is_company_name_visible,
          is_company_address_visible: companyInfo?.is_company_address_visible,
          is_company_business_visible: companyInfo?.is_company_business_visible,
          company_industry_type: companyInfo?.company_industry_type,
          company_name: companyInfo?.company_name,
          company_name_en: companyInfo?.company_name_en,
        });
        setIsShowCompanyName(companyInfo.is_company_name_visible != 1);
      }
      setLatestStep(latestStep);
    } else {
      reset(initialValue);
    }
  }, [companyInfo]);

  console.log('error', errors);

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    try {
      data.job_id = jobId;

      data.is_company_name_visible = data.is_company_name_visible ? 1 : 0;
      data.is_company_address_visible = data.is_company_address_visible ? 1 : 0;
      data.is_company_business_visible = data.is_company_business_visible
        ? 1
        : 0;

      // console.log('data-->', data);
      await saveCompanyInfoVisibility(data);

      successStack(messages['common.data_saved']);
      onContinue();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  return isReady ? (
    <Box mt={2} id={id}>
      <Typography mb={3} variant={'h5'} fontWeight={'bold'}>
        {messages['job_posting.company_info_visibility']}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <CustomFormSwitch
              required
              id={'is_company_name_visible'}
              label={messages['common.company_name_bn']}
              additionalInfo={
                <Tooltip
                  arrow
                  title={
                    messages['job_posting.company_info_name_tooltip'] as string
                  }>
                  <Help
                    sx={{
                      marginLeft: '8px',
                    }}
                  />
                </Tooltip>
              }
              yesLabel={messages['common.show'] as string}
              noLabel={messages['common.hide'] as string}
              register={register}
              defaultChecked={companyInfo?.is_company_name_visible == 1}
              isLoading={false}
              onChange={(value: boolean) => {
                setIsShowCompanyName(!value);
              }}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            {isShowCompanyName && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CustomTextInput
                    required
                    id='company_name'
                    label={messages['common.company_name_bn']}
                    control={control}
                    errorInstance={errors}
                    isLoading={false}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <CustomTextInput
                    required
                    id='company_name_en'
                    label={messages['common.company_name_en']}
                    control={control}
                    errorInstance={errors}
                    isLoading={false}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid item xs={12}>
            <CustomFormSwitch
              required
              id={'is_company_address_visible'}
              label={messages['common.company_address']}
              additionalInfo={
                <Tooltip
                  arrow
                  title={
                    messages[
                      'job_posting.company_info_address_tooltip'
                    ] as string
                  }>
                  <Help
                    sx={{
                      marginLeft: '8px',
                    }}
                  />
                </Tooltip>
              }
              yesLabel={messages['common.show'] as string}
              noLabel={messages['common.hide'] as string}
              register={register}
              defaultChecked={companyInfo?.is_company_address_visible == 1}
              isLoading={false}
            />
          </Grid>
          <Grid item xs={12} md={10}>
            <CustomFormSelect
              required
              id='company_industry_type'
              label={messages['job_posting.company_type']}
              isLoading={isLoadingTrades}
              control={control}
              options={associationTrades || []}
              optionValueProp={'id'}
              optionTitleProp={['title']}
              errorInstance={errors}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CustomFormSwitch
              id={'is_company_business_visible'}
              label={messages['common.company_business']}
              additionalInfo={
                <Tooltip
                  arrow
                  title={
                    messages[
                      'job_posting.company_info_business_tooltip'
                    ] as string
                  }>
                  <Help
                    sx={{
                      marginLeft: '8px',
                    }}
                  />
                </Tooltip>
              }
              yesLabel={messages['common.show'] as string}
              noLabel={messages['common.hide'] as string}
              register={register}
              defaultChecked={companyInfo?.is_company_business_visible == 1}
              isLoading={false}
            />
          </Grid>
        </Grid>

        <Box mt={3} display={'flex'} justifyContent={'space-between'}>
          <Button onClick={onBack} variant={'outlined'} color={'primary'}>
            {messages['common.previous']}
          </Button>
          <Button
            disabled={isSubmitting}
            type={'submit'}
            variant={'contained'}
            color={'primary'}>
            {messages['common.save_and_continue']}
          </Button>
        </Box>
      </form>
    </Box>
  ) : (
    <></>
  );
};

export default CompanyInfoVisibility;
