import {yupResolver} from '@hookform/resolvers/yup';
import {
  Box,
  Divider,
  FormLabel,
  Grid,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Typography,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import _ from 'lodash';
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useIntl} from 'react-intl';
import {FILE_SERVER_FILE_VIEW_ENDPOINT} from '../../../@core/common/apiRoutes';
import {
  EMAIL_REGEX,
  MOBILE_NUMBER_REGEX,
} from '../../../@core/common/patternRegex';
import PermissionContext from '../../../@core/contexts/PermissionContext';
import PermissionContextPropsType from '../../../@core/contexts/PermissionContextPropsType';
import SubmitButton from '../../../@core/elements/button/SubmitButton/SubmitButton';
import {H3} from '../../../@core/elements/common';
import CustomCheckbox from '../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import FormRadioButtons from '../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import useNotiStack from '../../../@core/hooks/useNotifyStack';
import useSuccessMessage from '../../../@core/hooks/useSuccessMessage';
import yup from '../../../@core/libs/yup';
import {getLocalizeYearsRange} from '../../../@core/utilities/helpers';
import {processServerSideErrors} from '../../../@core/utilities/validationErrorHandler';
import {useFetchLocalizedDivisions} from '../../../services/locationManagement/hooks';
import {createProductFair} from '../../../services/organaizationManagement/OrganizationService';
import FileUploadComponent from '../../filepond/FileUploadComponent';
import {Gender} from '../../industry/enrollment/constants/GenderEnums';

const PREFIX = 'DivisionSmeProductFair';

const classes = {
  PaperBox: `${PREFIX}-PaperBox`,
  totalEmployeeFields: `${PREFIX}-totalEmployeeFields`,
  topSelect: `${PREFIX}-topSelect`,
};

const CustomContainer = styled(Box)(({theme}) => ({
  [`& .${classes.PaperBox}`]: {
    margin: '10px auto',
  },
  [`& .${classes.totalEmployeeFields}`]: {
    paddingTop: '0 !important',
  },
  [`& .${classes.topSelect}`]: {
    textAlign: 'center',
    height: 40,
    width: 110,
  },
}));

interface DivisionFairComponentProps {
  productFairData: any;
  isLoadingProductFairData: boolean;
  mutateProductFairData?: () => void;
  setProductFairFilters?: any;
  detailsPage?: boolean;
}

const initialValues = {
  title: '',
  title_en: '',
  address: '',
  entrepreneur_name: '',
  entrepreneur_name_en: '',
  entrepreneur_mobile: '',
  entrepreneur_website: '',
  entrepreneur_email: '',
  date_of_establishment: '',
  current_total_asset: null,
  main_product_name: '',
  total_worker_male: '',
  total_worker_female: '',
  total_worker_other: '',
  total_product_export_amount: null,
  chamber_or_association_name: '',
  chamber_or_association_name_en: '',
  stall_count: null,
  stall_rent: '',
  sme_application_form: '',
  signature: '',
  photo: '',
  total_worker: '',
  signature_name: '',
};

const DivisionFairComponent: FC<DivisionFairComponentProps> = ({
  productFairData,
  isLoadingProductFairData,
  mutateProductFairData = () => {},
  setProductFairFilters,
  detailsPage = false,
}) => {
  const {messages, locale} = useIntl();
  const [divisionCheckboxArray, setDivisionCheckboxArray] = useState<any>([]);
  const [selectedYear, setSelectedYear] = useState<any>(2023);
  const {createSuccessMessage} = useSuccessMessage();
  const {errorStack} = useNotiStack();
  const [maleWorker, setMaleWorker] = useState<any>(0);
  const [femaleWorker, setFemaleWorker] = useState<any>(0);
  const [otherWorker, setOtherWorker] = useState<any>(0);
  const [divisionArray, setDivisionArray] = useState<any>([]);
  const [_uploadedPhoto, setUploadedPhoto] = useState<any>(null);

  const {sme_fair_application: sme_fair_application_permission} =
    useContext<PermissionContextPropsType>(PermissionContext);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      division_ids: yup
        .array()
        .of(yup.boolean())
        .test(
          'division_ids_validation',
          messages['sme_application_form.fair_must_be_ticked'] as string,
          (value: any) => value?.length > 0 && value.includes(true),
        )
        .label(
          messages[
            'sme_application_form.tick_the_fair_you_want_to_participate_in'
          ] as string,
        ),
      title: yup
        .string()
        .trim()
        .title('bn', true)
        .required()
        .label(messages['common.institute_name_bn'] as string),
      title_en: yup
        .string()
        .trim()
        .nullable()
        .title('en', false)
        .label(messages['common.institute_name_en'] as string),
      showroom_address: yup
        .string()
        .trim()
        .required()
        .label(messages['common.address_info'] as string),
      entrepreneur_name: yup
        .string()
        .trim()
        .required()
        .title('bn', true)
        .label(messages['sme_application_form.entrepreneur_name'] as string),
      entrepreneur_name_en: yup
        .string()
        .trim()
        .title('en', false)
        .label(messages['sme_application_form.entrepreneur_name_en'] as string),
      entrepreneur_mobile: yup
        .string()
        .trim()
        .required()
        .matches(MOBILE_NUMBER_REGEX)
        .label(messages['common.mobile_en'] as string),
      entrepreneur_gender: yup
        .string()
        .trim()
        .required()
        .label(messages['common.gender'] as string),
      entrepreneur_website: yup
        .string()
        .trim()
        .label(messages['sme_application_form.website'] as string),
      entrepreneur_email: yup
        .string()
        .trim()
        .nullable()
        .matches(EMAIL_REGEX)
        .label(messages['common.email'] as string),
      date_of_establishment: yup
        .string()
        .trim()
        .label(
          messages['sme_application_form.year_of_establishment'] as string,
        ),
      main_product_name: yup
        .string()
        .trim()
        .required()
        .label(
          messages['sme_application_form.product_service_name_type'] as string,
        ),
      total_product_export_amount: yup
        .string()
        .nullable()
        .label(
          messages[
            'sme_application_form.if_the_product_is_exported_the_amount_is_bdt'
          ] as string,
        ),
      chamber_or_association_name: yup
        .string()
        .trim()
        .title('bn', true)
        .label(
          messages[
            'sme_application_form.name_of_chamber_or_association'
          ] as string,
        ),
      chamber_or_association_name_en: yup
        .string()
        .trim()
        .title('en', false)
        .label(
          messages[
            'sme_application_form.name_of_chamber_or_association_en'
          ] as string,
        ),
      stall_count: yup
        .string()
        .nullable()
        .required()
        .label(messages['sme_application_form.stall_count'] as string),
      signature: yup
        .string()
        .trim()
        .required()
        .label(messages['sme_application_form.signature_photo'] as string),
      photo: yup
        .string()
        .trim()
        .required()
        .label(messages['common.passport_size_photo'] as string),
      signature_name: yup
        .string()
        .required()
        .trim()
        .label(messages['sme_application_form.signature_name'] as string),
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
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
  });

  const {data: divisions, isLoading: isLoadingDivisions} =
    useFetchLocalizedDivisions();

  useEffect(() => {
    if (productFairData) {
      const commonData = {
        entrepreneur_name: productFairData?.entrepreneur_name,
        entrepreneur_name_en: productFairData?.entrepreneur_name_en,
        entrepreneur_gender: productFairData?.entrepreneur_gender,
        entrepreneur_mobile: productFairData?.entrepreneur_mobile,
        entrepreneur_email: productFairData?.entrepreneur_email,
        current_total_asset: productFairData?.current_total_asset ?? null,
        main_product_name: productFairData?.main_product_name,
        title: productFairData?.title,
        title_en: productFairData?.title_en,
        showroom_address: productFairData?.showroom_address,
      };

      const registrationData = {
        title: productFairData?.title,
        title_en: productFairData?.title_en,
        entrepreneur_website: productFairData?.entrepreneur_website,
        date_of_establishment: productFairData?.date_of_establishment,
        total_product_export_amount:
          productFairData?.total_product_export_amount ?? null,
        chamber_or_association_name:
          productFairData?.chamber_or_association_name,
        chamber_or_association_name_en:
          productFairData?.chamber_or_association_name_en,
        stall_count: productFairData?.stall_count ?? null,
        stall_rent: productFairData?.stall_rent,
        total_worker_male: productFairData?.total_worker_male,
        total_worker_female: productFairData?.total_worker_female,
        total_worker_other: productFairData?.total_worker_other,
        sme_application_form: productFairData?.sme_application_form,
        signature: productFairData?.signature,
        photo: productFairData?.photo,
        signature_name: productFairData?.signature_name,
      };

      if (divisions?.length > 0) {
        let divisionsArr: any[] = [];
        divisionsArr = [...divisions];
        setDivisionArray(divisionsArr);
      }

      if (productFairData?.can_register) {
        reset({...initialValues, ...commonData});
        setDivisionCheckboxArray([]);
        setMaleWorker(0);
        setFemaleWorker(0);
        setOtherWorker(0);
        return;
      } else {
        reset({...commonData, ...registrationData});
        let divisionIds = productFairData?.division_ids;
        // Cause details api doesn't have division_ids field
        if (productFairData?.locations) {
          divisionIds = productFairData?.locations?.map((item: any) => {
            return item.division_id;
          });
        }
        setDivisionCheckboxArray(divisionIds);
        setValue(
          'total_worker',
          productFairData?.total_worker_male +
            productFairData?.total_worker_female +
            productFairData?.total_worker_other,
        );
        return;
      }
    }
  }, [productFairData, divisions]);

  const years = getLocalizeYearsRange(2018, locale);

  const yearChangeHandler = useCallback((event: any) => {
    setSelectedYear(event.target.value);
    setProductFairFilters({
      year: event.target.value,
    });
  }, []);

  console.log('errors', errors);

  const onSubmit: SubmitHandler<any> = async (data: any) => {
    let formData = _.cloneDeep(data);

    formData.division_ids = divisionCheckboxArray;
    formData.year = selectedYear.toString();

    if (productFairData?.title) {
      formData.institute_name = productFairData?.title;
    }
    if (productFairData?.title_en) {
      formData.institute_name_en = productFairData?.title_en;
    } else {
      formData.institute_name_en = formData?.title_en;
    }
    console.log('data', formData);
    try {
      await createProductFair(formData);
      createSuccessMessage('sme_application_form.division_sme_product');
      mutateProductFairData();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  const fileUrlUpdate = useCallback((filePath: any) => {
    setTimeout(() => {
      setUploadedPhoto(filePath);
    }, 200);
  }, []);

  return (
    <CustomContainer>
      {/* Layout */}
      <Paper sx={{px: 4, py: 2, mb: 2}} className={classes.PaperBox}>
        <Grid container py={3}>
          {!detailsPage && (
            <>
              <Grid item xs={12} mt={-2} mb={1}>
                <Grid container>
                  <Grid item sx={{display: 'flex', mr: 1}}>
                    <Typography variant={'h6'} sx={{my: 'auto'}}>
                      {messages['dashboard.Year']}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Box>
                      <Select
                        id='year'
                        autoWidth
                        defaultValue={selectedYear}
                        variant='outlined'
                        className={classes.topSelect}
                        onChange={yearChangeHandler}>
                        {(years || []).map((year, index) => (
                          <MenuItem key={index} value={year.id}>
                            {year.year}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} mb={2}>
                <Divider />
              </Grid>
            </>
          )}

          {/*<Grid item xs={4}>*/}
          {/*  <Typography variant={'h6'} component={'div'}>*/}
          {/*    {messages['sme_application_form.division_sme_product']}*/}
          {/*  </Typography>*/}

          {/*  <Grid container>*/}
          {/*    <Grid item>*/}
          {/*      <img*/}
          {/*        src={'/images/dashboard/sme_fair_logo.png'}*/}
          {/*        alt={'Sme fair logo'}*/}
          {/*        style={{width: '190px', height: '100%'}}*/}
          {/*      />*/}
          {/*    </Grid>*/}
          {/*    <Grid item pt={4}>*/}
          {/*      <Typography variant={'h6'}>*/}
          {/*        {localizedNumbers(*/}
          {/*          detailsPage ? productFairData?.year : selectedYear,*/}
          {/*          locale,*/}
          {/*        )}*/}
          {/*      </Typography>*/}
          {/*    </Grid>*/}
          {/*  </Grid>*/}
          {/*</Grid>*/}
          {/*Middle Title Section*/}
          {/*<Grid item xs={4}>*/}
          {/*  <H3 centered={true}>*/}
          {/*    <IntlMessages*/}
          {/*      id={'sme_application_form.division_sme_application_form_title'}*/}
          {/*      values={{*/}
          {/*        subject: localizedNumbers(*/}
          {/*          detailsPage ? productFairData?.year : selectedYear,*/}
          {/*          locale,*/}
          {/*        ),*/}
          {/*      }}*/}
          {/*    />*/}
          {/*  </H3>*/}

          {/*  <H5*/}
          {/*    centered={true}*/}
          {/*    sx={{*/}
          {/*      border: '2px dashed #495057',*/}
          {/*      width: 'fit-content',*/}
          {/*      mx: 'auto',*/}
          {/*      p: 1,*/}
          {/*      mt: 2,*/}
          {/*      fontWeight: '600',*/}
          {/*    }}>*/}
          {/*    {messages['common.application_form']}*/}
          {/*  </H5>*/}
          {/*</Grid>*/}

          {/*  photo section */}
          {/*  <Grid*/}
          {/*    item*/}
          {/*    xs={4}*/}
          {/*    sx={{*/}
          {/*      display: 'flex',*/}
          {/*      justifyContent: 'flex-end',*/}
          {/*      alignItems: 'center',*/}
          {/*    }}>*/}
          {/*    <Box*/}
          {/*      width={'155px'}*/}
          {/*      height={'180px'}*/}
          {/*      sx={{*/}
          {/*        border: '2px solid #495057',*/}
          {/*        display: 'flex',*/}
          {/*        justifyContent: 'center',*/}
          {/*        alignItems: 'center',*/}
          {/*      }}>*/}
          {/*      {uploadedPhoto ?? productFairData?.photo ? (*/}
          {/*        <img*/}
          {/*          src={`${FILE_SERVER_FILE_VIEW_ENDPOINT}${*/}
          {/*            uploadedPhoto ?? productFairData?.photo*/}
          {/*          }`}*/}
          {/*          alt={'photo'}*/}
          {/*          style={{objectFit: 'cover', width: '100%', height: '100%'}}*/}
          {/*        />*/}
          {/*      ) : (*/}
          {/*        <Box>*/}
          {/*          <p*/}
          {/*            style={{*/}
          {/*              textAlign: 'center',*/}
          {/*              margin: 0,*/}
          {/*              fontSize: '1.3rem',*/}
          {/*            }}>*/}
          {/*            {messages['common.photo']}*/}
          {/*          </p>*/}
          {/*          <p style={{textAlign: 'center', margin: 0}}>*/}
          {/*            {messages['sme_application_form.passport_size']}*/}
          {/*          </p>*/}
          {/*        </Box>*/}
          {/*      )}*/}
          {/*    </Box>*/}
          {/*  </Grid>*/}

          <Grid item xs={12}>
            <H3 centered={true}>
              {
                messages[
                  'sme_application_form.division_sme_application_form_title'
                ]
              }
            </H3>
          </Grid>
        </Grid>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} m={0}>
              <FormLabel>
                {
                  messages[
                    'sme_application_form.tick_the_fair_you_want_to_participate_in'
                  ]
                }
              </FormLabel>
            </Grid>
            <Grid container item px={3} mt={-2}>
              {!isLoadingDivisions ? (
                divisionArray?.map((item: any, index: number) => (
                  <Grid item key={index}>
                    <CustomCheckbox
                      id={`division_ids[${index}]`}
                      label={item?.title}
                      register={register}
                      errorInstance={errors}
                      isDisabled={!productFairData?.can_register}
                      isLoading={isLoadingDivisions}
                      checked={(divisionCheckboxArray || []).includes(
                        Number(item.id),
                      )}
                      onChange={(event) => {
                        if (
                          !(divisionCheckboxArray || []).includes(
                            Number(item.id),
                          )
                        ) {
                          let arr = [...divisionCheckboxArray];
                          arr?.push(item.id);
                          setDivisionCheckboxArray(arr);
                        } else {
                          setDivisionCheckboxArray((prev: any) =>
                            (prev || []).filter(
                              (divisionId: any) => divisionId !== item.id,
                            ),
                          );
                        }
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Skeleton variant='rectangular' height={40} width={'100%'} />
              )}
            </Grid>
            {errors['division_ids'] && (
              <Grid item xs={12} mt={-4} mb={-2}>
                <p style={{color: '#d32f2f'}}>
                  {errors['division_ids']?.message}
                </p>
              </Grid>
            )}
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                id='title'
                required
                disabled={!!productFairData?.title}
                label={messages['common.institute_name_bn']}
                control={control}
                errorInstance={errors}
                isLoading={isLoadingProductFairData}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                id='title_en'
                disabled={!!productFairData?.title_en}
                label={messages['common.institute_name_en']}
                control={control}
                errorInstance={errors}
                isLoading={isLoadingProductFairData}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
              <CustomTextInput
                id='showroom_address'
                required
                disabled={!!productFairData?.showroom_address}
                label={messages['common.address_info']}
                control={control}
                errorInstance={errors}
                isLoading={isLoadingProductFairData}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                id='entrepreneur_name'
                required
                disabled={!!productFairData?.entrepreneur_name}
                label={messages['sme_application_form.entrepreneur_name']}
                control={control}
                errorInstance={errors}
                isLoading={isLoadingProductFairData}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                id='entrepreneur_name_en'
                disabled={!!productFairData?.entrepreneur_name_en}
                label={messages['sme_application_form.entrepreneur_name_en']}
                control={control}
                errorInstance={errors}
                isLoading={isLoadingProductFairData}
              />
            </Grid>

            <Grid item xs={6}>
              <CustomTextInput
                id='entrepreneur_mobile'
                disabled={!!productFairData?.entrepreneur_mobile}
                label={messages['common.mobile_en']}
                required
                control={control}
                errorInstance={errors}
                isLoading={isLoadingProductFairData}
                placeholder='017XXXXXXXX'
              />
            </Grid>

            <Grid item xs={6}>
              <FormRadioButtons
                id={'entrepreneur_gender'}
                radios={[
                  {
                    key: Gender.MALE,
                    label: messages['common.male'],
                  },
                  {
                    key: Gender.FEMALE,
                    label: messages['common.female'],
                  },
                ]}
                defaultValue={productFairData?.entrepreneur_gender}
                isDisabled={!!productFairData?.entrepreneur_gender}
                control={control}
                required={true}
                label={'common.gender'}
                errorInstance={errors}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                id='entrepreneur_website'
                disabled={!!productFairData?.entrepreneur_website}
                label={messages['sme_application_form.website']}
                control={control}
                errorInstance={errors}
                isLoading={isLoadingProductFairData}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                id='entrepreneur_email'
                disabled={!!productFairData?.entrepreneur_email}
                label={messages['common.email']}
                control={control}
                errorInstance={errors}
                isLoading={isLoadingProductFairData}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <CustomTextInput
                id='date_of_establishment'
                disabled={!!productFairData?.date_of_establishment}
                label={messages['sme_application_form.year_of_establishment']}
                control={control}
                errorInstance={errors}
                isLoading={isLoadingProductFairData}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6}>
              <CustomTextInput
                id='current_total_asset'
                disabled={!!productFairData?.current_total_asset}
                label={
                  messages['sme_application_form.total_asset_value_in_bdt']
                }
                type={'number'}
                control={control}
                errorInstance={errors}
                isLoading={isLoadingProductFairData}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <CustomTextInput
                id='main_product_name'
                required={true}
                disabled={!!productFairData?.main_product_name}
                label={
                  messages['sme_application_form.product_service_name_type']
                }
                control={control}
                errorInstance={errors}
                isLoading={isLoadingProductFairData}
              />
            </Grid>

            <Grid item xs={6}>
              <Grid container columnSpacing={2}>
                <Grid item xs={12} mb={2}>
                  <FormLabel sx={{fontWeight: '600'}}>
                    {messages['institute.total_employee']}
                  </FormLabel>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={3}>
                      <CustomTextInput
                        id='total_worker'
                        defaultValue={'0'}
                        disabled={true}
                        label={messages['sme_application_form.total_manpower']}
                        control={control}
                        errorInstance={errors}
                        isLoading={isLoadingProductFairData}
                        type={'number'}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <CustomTextInput
                        id='total_worker_male'
                        disabled={!!productFairData?.total_worker_male}
                        label={messages['common.male']}
                        control={control}
                        errorInstance={errors}
                        isLoading={isLoadingProductFairData}
                        type={'number'}
                        onInput={(value: any) => {
                          setMaleWorker(Number(value));
                          setValue(
                            'total_worker',
                            Number(value) + femaleWorker + otherWorker,
                          );
                        }}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <CustomTextInput
                        id='total_worker_female'
                        disabled={!!productFairData?.total_worker_female}
                        label={messages['common.female']}
                        control={control}
                        errorInstance={errors}
                        isLoading={isLoadingProductFairData}
                        type={'number'}
                        onInput={(value: any) => {
                          setFemaleWorker(Number(value));
                          setValue(
                            'total_worker',
                            Number(value) + maleWorker + otherWorker,
                          );
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <CustomTextInput
                        id='total_worker_other'
                        disabled={!!productFairData?.total_worker_other}
                        label={messages['smef_dashboard.3rd_gender']}
                        control={control}
                        errorInstance={errors}
                        isLoading={isLoadingProductFairData}
                        type={'number'}
                        onInput={(value: any) => {
                          setOtherWorker(Number(value));
                          setValue(
                            'total_worker',
                            Number(value) + femaleWorker + maleWorker,
                          );
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={12} md={6} mt={5}>
              <CustomTextInput
                id='total_product_export_amount'
                disabled={!!productFairData?.total_product_export_amount}
                label={
                  messages[
                    'sme_application_form.if_the_product_is_exported_the_amount_is_bdt'
                  ]
                }
                type={'number'}
                control={control}
                errorInstance={errors}
                isLoading={isLoadingProductFairData}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6}>
              <CustomTextInput
                id='chamber_or_association_name'
                required
                disabled={!!productFairData?.chamber_or_association_name}
                label={
                  messages[
                    'sme_application_form.name_of_chamber_or_association'
                  ]
                }
                control={control}
                errorInstance={errors}
                isLoading={isLoadingProductFairData}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <CustomTextInput
                id='chamber_or_association_name_en'
                disabled={!!productFairData?.chamber_or_association_name_en}
                label={
                  messages[
                    'sme_application_form.name_of_chamber_or_association_en'
                  ]
                }
                control={control}
                errorInstance={errors}
                isLoading={isLoadingProductFairData}
              />
            </Grid>

            <Grid item xs={6}>
              <p
                style={{
                  color: '#74788d',
                  lineHeight: '1.4375em',
                  letterSpacing: '0.00938em',
                  fontSize: '1.125rem',
                  margin: '0px',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}>
                {messages['sme_application_form.stall_fare']}
                <span
                  style={{
                    fontWeight: '400',
                    marginLeft: '10px',
                    fontStyle: 'italic',
                  }}>
                  {messages['sme_application_form.sqft_stall_fare']}
                </span>
              </p>
              <CustomTextInput
                id='stall_count'
                required
                disabled={!!productFairData?.stall_count}
                label={messages['sme_application_form.stall_count']}
                control={control}
                errorInstance={errors}
                isLoading={isLoadingProductFairData}
                onInput={(value: any) => setValue('stall_rent', value * 3000)}
              />
            </Grid>
            <Grid item xs={6} mt={4}>
              <CustomTextInput
                id='stall_rent'
                label={messages['sme_application_form.total_amount']}
                disabled={true}
                type={'number'}
                control={control}
                errorInstance={errors}
                isLoading={isLoadingProductFairData}
              />
            </Grid>

            {productFairData?.can_register && (
              <>
                <Grid item xs={12} md={6}>
                  <FileUploadComponent
                    id='signature'
                    required
                    defaultFileUrl={productFairData?.signature}
                    errorInstance={errors}
                    setValue={setValue}
                    register={register}
                    label={messages['sme_application_form.signature_photo']}
                    height={'80'}
                    width={'300'}
                    acceptedFileTypes={['image/*']}
                    sizeLimitText={'60KB'}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FileUploadComponent
                    id='photo'
                    required
                    defaultFileUrl={productFairData?.photo}
                    errorInstance={errors}
                    setValue={setValue}
                    register={register}
                    label={messages['common.passport_size_photo']}
                    width={'300'}
                    height={'375'}
                    acceptedFileTypes={['image/*']}
                    sizeLimitText={'150KB'}
                    onFileUpload={fileUrlUpdate}
                  />
                </Grid>
              </>
            )}
            {!productFairData?.can_register && (
              <Grid item xs={12} sm={12} md={6}>
                <Grid item xs={12} m={0}>
                  <FormLabel>
                    {messages['common.passport_size_photo']}
                  </FormLabel>
                </Grid>
                <Grid item>
                  <img
                    src={`${FILE_SERVER_FILE_VIEW_ENDPOINT}${productFairData?.photo}`}
                    alt={'signature'}
                    style={{
                      objectFit: 'contain',
                      width: '50%',
                      height: '100%',
                      margin: 0,
                    }}
                  />
                </Grid>
              </Grid>
            )}
            {!productFairData?.can_register && (
              <Grid item xs={12} sm={12} md={6}>
                <Grid item xs={12} m={0}>
                  <FormLabel>
                    {messages['sme_application_form.signature_photo']}
                  </FormLabel>
                </Grid>
                <Grid item>
                  <img
                    src={`${FILE_SERVER_FILE_VIEW_ENDPOINT}${productFairData?.signature}`}
                    alt={'signature'}
                    style={{
                      objectFit: 'contain',
                      width: '50%',
                      height: '100%',
                      margin: 0,
                    }}
                  />
                </Grid>
              </Grid>
            )}

            <Grid item xs={12} sm={12} md={6} mt={3.3}>
              <CustomTextInput
                id='signature_name'
                required
                disabled={!!productFairData?.signature_name}
                label={messages['sme_application_form.signature_name']}
                control={control}
                errorInstance={errors}
                isLoading={isLoadingProductFairData}
              />
            </Grid>
            {productFairData?.can_register &&
              sme_fair_application_permission?.canCreate && (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  sx={{display: 'flex', justifyContent: 'center'}}>
                  <SubmitButton
                    isSubmitting={isSubmitting}
                    isLoading={isLoadingProductFairData}
                  />
                </Grid>
              )}
          </Grid>
        </form>
      </Paper>
    </CustomContainer>
  );
};

export default DivisionFairComponent;
