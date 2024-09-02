import {useIntl} from 'react-intl';
import useNotiStack from '../../../../@core/hooks/useNotifyStack';
import useSuccessMessage from '../../../../@core/hooks/useSuccessMessage';
import {useFetchYouthAddress} from '../../../../services/learnerManagement/hooks';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import yup from '../../../../@core/libs/yup';
import {SubmitHandler, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {IAddressAddEdit} from '../../../../services/learnerManagement/typing';
import {
  createAddress,
  updateAddress,
} from '../../../../services/learnerManagement/AddressService';
import {processServerSideErrors} from '../../../../@core/utilities/validationErrorHandler';
import {Box, Grid, Zoom} from '@mui/material';
import CustomFilterableFormSelect from '../../../../@core/elements/input/CustomFilterableFormSelect';
import {
  useFetchCityCorporations,
  useFetchLocalizedDistricts,
  useFetchLocalizedDivisions,
  useFetchLocalizedUnions,
  useFetchLocalizedUpazilasMunicipality,
} from '../../../../services/locationManagement/hooks';
import RowStatus from '../../../../@core/utilities/RowStatus';
import CustomHookForm from '../component/CustomHookForm';
import CancelButton from '../../../../@core/elements/button/CancelButton/CancelButton';
import SubmitButton from '../../../../@core/elements/button/SubmitButton/SubmitButton';
import {
  filterCityCorporationsByDivisionId,
  filterDistrictsByDivisionId,
  filterUnionsByUpazilaId,
  filterUpazilasByDistrictId,
} from '../../../../services/locationManagement/locationUtils';
import {
  District,
  Upazila,
} from '../../../../shared/Interface/location.interface';
import CustomTextInput from '../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import FormRadioButtons from '../../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import {
  DistrictOrCityCorporation,
  UpazilaOrMunicipality,
} from '../../../../@core/components/AddressFormComponent/addressEnum';
import {getAllKeysFromErrorObj} from '../../../../@core/utilities/helpers';

interface Porps {
  itemId: number | null;
  onClose: () => void;
}

const initialValues: any = {
  address_type: '',
  loc_division_id: '',
  loc_district_id: '',
  loc_city_corporation_id: '',
  loc_upazila_municipality_id: '',
  district_or_city_corporation: '',
  loc_union_id: '',
  village_ward_area: '',
  village_ward_area_en: '',
  house_n_road: '',
  house_n_road_en: '',
  zip_or_postal_code: '',
};

const AddressAddEditPage = ({
  itemId,
  onClose: closeAddressAddEditPage,
}: Porps) => {
  const {messages} = useIntl();
  const {errorStack} = useNotiStack();
  const {createSuccessMessage, updateSuccessMessage} = useSuccessMessage();
  const [selectedDistrict, setSelectedDistrict] = useState<number>();
  const [selectedDivision, setSelectedDivision] = useState<number>();
  const [selectedUpazilla, setSelectedUpazilla] = useState<number>();
  //Filterd Location

  const [districtsList, setDistrictsList] = useState<Array<District> | []>([]);
  const [upazilasList, setUpazilasList] = useState<Array<Upazila> | []>([]);
  const [municipalityList, setMunicipalityList] = useState<Array<Upazila> | []>(
    [],
  );
  const [unionsList, setUnionsList] = useState<Array<any> | []>([]);
  const [cityCorporationList, setCityCorporationList] = useState<
    Array<any> | []
  >([]);

  //Radio Button Selection
  const [isDistrictOrCityCorporation, setIsDistrictOrCityCorporation] =
    useState<DistrictOrCityCorporation | null>(null);
  const [isUpazilaOrMunicipality, setIsUpazilaOrMunicipality] =
    useState<UpazilaOrMunicipality | null>(null);

  //Fetch Location Data
  const [divisionfilters] = useState({row_status: RowStatus.ACTIVE});
  const {data: divisions, isLoading: isLoadingDivisions}: any =
    useFetchLocalizedDivisions(divisionfilters);

  const [districtsFilter] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const {data: districts, isLoading: isDistrictLoading} =
    useFetchLocalizedDistricts(districtsFilter);

  const [cityCorporationFilter] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const {data: city_corporations, isLoading: isCityCorporationLoading} =
    useFetchCityCorporations(cityCorporationFilter);

  const [upazilasFilter] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const {data: upazilas_municipality, isLoading: isUpazilaLoading} =
    useFetchLocalizedUpazilasMunicipality(upazilasFilter);

  const [unionsFilter] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const {data: unions, isLoading: isLoadingUnions}: any =
    useFetchLocalizedUnions(unionsFilter);

  const addressType = [
    {
      id: 1,
      label: messages['common.present_address'],
    },
    {
      id: 2,
      label: messages['common.permanent_address'],
    },
    {
      id: 3,
      label: messages['common.others'],
    },
  ];

  const {
    data: itemData,
    mutate: addressMutate,
    isLoading,
  } = useFetchYouthAddress(itemId);

  const validationSchema = useMemo(() => {
    return yup.object().shape({
      address_type: yup
        .string()
        .required()
        .label(messages['label.address_type'] as string),
      loc_division_id: yup
        .string()
        .trim()
        .required()
        .label(messages['divisions.label'] as string),
      district_or_city_corporation: yup
        .string()
        .trim()
        .label(messages['label.district_or_city_corporation'] as string)
        .required(),
      loc_district_id: yup
        .string()
        .trim()
        .label(messages['districts.label'] as string)
        .nullable()
        .when('district_or_city_corporation', {
          is: (value: any) => {
            return Number(value) === DistrictOrCityCorporation.DISTRICT;
          },
          then: yup.string().required(),
        }),
      loc_city_corporation_id: yup
        .string()
        .trim()
        .label(messages['city_corporation.label'] as string)
        .nullable()
        .when('district_or_city_corporation', {
          is: (value: any) => {
            return Number(value) === DistrictOrCityCorporation.CITY_CORPORATION;
          },
          then: yup.string().required(),
        }),
      loc_upazila_municipality_id: yup
        .string()
        .label(messages['upazilas.label'] as string)
        .nullable(),
      village_ward_area_en: yup
        .string()
        .title('en', false)
        .label(messages['label.address_type'] as string),
      house_n_road_en: yup
        .string()
        .title('en', false)
        .label(messages['common.house_n_road_en'] as string),
    });
  }, [messages]);

  const {
    control,
    handleSubmit,
    // register,
    reset,
    setError,
    setValue,
    formState: {errors, isSubmitting, submitCount},
  } = useForm<IAddressAddEdit>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    const errorKeysArr = getAllKeysFromErrorObj(errors);
    if (submitCount && errorKeysArr.length > 0) {
      let field = document.getElementsByName(errorKeysArr?.[0]);
      if (field.length > 0) {
        field[0]?.focus();
      }
    }
  }, [errors, submitCount]);

  console.log('Address add/edit errors', errors);
  const onSubmit: SubmitHandler<IAddressAddEdit> = async (data) => {
    delete data.loc_upazila_municipality_type;
    try {
      if (itemId) {
        await updateAddress(itemId, data);
        updateSuccessMessage('address.label');
      } else {
        await createAddress(data);
        createSuccessMessage('address.label');
      }
      addressMutate();
      closeAddressAddEditPage();
    } catch (error: any) {
      processServerSideErrors({error, setError, validationSchema, errorStack});
    }
  };

  const setDistrictOrCityCorporation = useCallback(
    (
      divisionId: number | undefined,
      districtOrCityCorporation: number | undefined,
    ) => {
      if (districtOrCityCorporation === DistrictOrCityCorporation.DISTRICT) {
        let data = filterDistrictsByDivisionId(districts, divisionId);
        setDistrictsList(data);
      } else {
        let data = filterCityCorporationsByDivisionId(
          city_corporations,
          divisionId,
        );
        setCityCorporationList(data);
      }
    },
    [districts, city_corporations, DistrictOrCityCorporation],
  );
  const onDivisionChange = useCallback(
    (divisionId: number) => {
      setSelectedDivision(divisionId);
      setValue('loc_district_id', '');
      setValue('loc_city_corporation_id', '');
      setValue('district_or_city_corporation', '');
      setValue('loc_upazila_municipality_id', '');
      setValue('loc_union_id', '');

      if (isDistrictOrCityCorporation) {
        setDistrictOrCityCorporation(divisionId, isDistrictOrCityCorporation);
      }
    },
    [districts, isDistrictOrCityCorporation],
  );
  const onDistrictOrCityCorporationChange = (
    value: DistrictOrCityCorporation,
  ) => {
    setValue(`loc_district_id`, '');
    setValue('loc_city_corporation_id', '');
    setValue('loc_upazila_municipality_id', '');
    setValue('loc_union_id', '');
    if (Number(value) === DistrictOrCityCorporation.DISTRICT) {
      setIsDistrictOrCityCorporation(Number(value));
      setDistrictOrCityCorporation(
        selectedDivision,
        DistrictOrCityCorporation.DISTRICT,
      );
    } else {
      setIsDistrictOrCityCorporation(Number(value));
      setDistrictOrCityCorporation(
        selectedDivision,
        DistrictOrCityCorporation.CITY_CORPORATION,
      );
    }
  };
  const onDistrictChange = useCallback(
    (districtId: number) => {
      setSelectedDistrict(districtId);
      setValue('loc_upazila_municipality_id', '');
      setValue('loc_upazila_municipality_type', '');
      setValue('loc_union_id', '');
    },
    [isUpazilaOrMunicipality],
  );

  const setUpazillaORMunicipality = useCallback(
    (districtId: number | undefined, upazilaOrMunicipality: number | null) => {
      let data = filterUpazilasByDistrictId(
        upazilas_municipality,
        districtId,
        upazilaOrMunicipality,
      );
      if (upazilaOrMunicipality == UpazilaOrMunicipality.UPAZILA) {
        setUpazilasList(data);
      } else {
        setMunicipalityList(data);
      }
    },
    [upazilas_municipality, UpazilaOrMunicipality],
  );

  const onUpazilaOrMunicipalityChange = (value: UpazilaOrMunicipality) => {
    setValue('loc_upazila_municipality_id', '');
    setValue('loc_union_id', '');
    if (Number(value) === UpazilaOrMunicipality.UPAZILA) {
      setIsUpazilaOrMunicipality(Number(value));
      setUpazillaORMunicipality(
        selectedDistrict,
        UpazilaOrMunicipality.UPAZILA,
      );
    } else {
      setIsUpazilaOrMunicipality(Number(value));
      setUpazillaORMunicipality(
        selectedDistrict,
        UpazilaOrMunicipality.MUNICIPALITY,
      );
    }
  };
  const onChangeUpazilas = useCallback(
    (upazilaId: number) => {
      setSelectedUpazilla(upazilaId);
    },
    [unions],
  );

  useEffect(() => {
    if (itemData) {
      reset({
        address_type: itemData.address_type,
        loc_division_id: itemData?.loc_division_id,
        loc_district_id: itemData?.loc_district_id,
        loc_union_id: itemData?.loc_union_id,
        loc_upazila_municipality_id: itemData?.loc_upazila_municipality_id,
        district_or_city_corporation: itemData?.district_or_city_corporation,
        loc_upazila_municipality_type: itemData?.loc_upazila_municipality_type,
        loc_city_corporation_id: itemData?.loc_city_corporation_id,
        village_ward_area: itemData?.village_ward_area,
        village_ward_area_en: itemData?.village_ward_area_en,
        house_n_road: itemData?.house_n_road,
        house_n_road_en: itemData?.house_n_road_en,
        zip_or_postal_code: itemData?.zip_or_postal_code,
      });

      setSelectedDivision(itemData?.loc_division_id ?? null);
      setSelectedDistrict(itemData?.loc_district_id ?? null);
      setIsDistrictOrCityCorporation(itemData?.district_or_city_corporation);
      setIsUpazilaOrMunicipality(itemData?.loc_upazila_municipality_type);
      setSelectedUpazilla(itemData?.loc_upazila_municipality_id);
    } else {
      reset(initialValues);
    }
  }, [
    itemData,
    // districts,
    // upazilas_municipality,
    // unions,
    // setUpazillaORMunicipality,
  ]);

  useEffect(() => {
    setDistrictsList(filterDistrictsByDivisionId(districts, selectedDivision));
  }, [districts, selectedDivision]);

  useEffect(() => {
    setCityCorporationList(
      filterCityCorporationsByDivisionId(city_corporations, selectedDivision),
    );
  }, [city_corporations, selectedDivision]);

  useEffect(() => {
    setUpazillaORMunicipality(selectedDistrict, isUpazilaOrMunicipality);
  }, [setUpazillaORMunicipality, isUpazilaOrMunicipality, selectedDistrict]);

  useEffect(() => {
    setUnionsList(filterUnionsByUpazilaId(unions, selectedUpazilla));
  }, [unions, selectedUpazilla]);

  return (
    <Zoom in={true}>
      <Box>
        <CustomHookForm
          title={messages['address.label']}
          handleSubmit={handleSubmit(onSubmit)}
          actions={
            <>
              <CancelButton
                onClick={closeAddressAddEditPage}
                isLoading={isLoading}
              />
              <SubmitButton isSubmitting={isSubmitting} isLoading={isLoading} />
            </>
          }
          onClose={closeAddressAddEditPage}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <CustomFilterableFormSelect
                required
                id={`loc_division_id`}
                label={messages['divisions.label']}
                isLoading={isLoadingDivisions}
                control={control}
                options={divisions}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
                onChange={onDivisionChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormRadioButtons
                required
                id='district_or_city_corporation'
                label={'label.district_or_city_corporation'}
                radios={[
                  {
                    key: DistrictOrCityCorporation.DISTRICT,
                    label: messages['districts.label'],
                  },
                  {
                    key: DistrictOrCityCorporation.CITY_CORPORATION,
                    label: messages['city_corporation.label'],
                  },
                ]}
                control={control}
                isLoading={false}
                onChange={onDistrictOrCityCorporationChange}
                errorInstance={errors}
              />
            </Grid>
            {isDistrictOrCityCorporation &&
              isDistrictOrCityCorporation ===
                DistrictOrCityCorporation.DISTRICT && (
                <>
                  <Grid item xs={12} md={6}>
                    <CustomFilterableFormSelect
                      required
                      id='loc_district_id'
                      label={messages['districts.label']}
                      isLoading={isDistrictLoading}
                      control={control}
                      options={districtsList}
                      optionValueProp={'id'}
                      optionTitleProp={['title']}
                      errorInstance={errors}
                      onChange={onDistrictChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormRadioButtons
                      id='loc_upazila_municipality_type'
                      label={'label.upazila_or_municipality'}
                      radios={[
                        {
                          key: UpazilaOrMunicipality.UPAZILA,
                          label: messages['upazilas.label'],
                        },
                        {
                          key: UpazilaOrMunicipality.MUNICIPALITY,
                          label: messages['municipality.label'],
                        },
                      ]}
                      control={control}
                      isLoading={false}
                      onChange={onUpazilaOrMunicipalityChange}
                    />
                  </Grid>
                  {isUpazilaOrMunicipality &&
                    isUpazilaOrMunicipality ===
                      UpazilaOrMunicipality.UPAZILA && (
                      <>
                        <Grid item xs={12} md={6}>
                          <CustomFilterableFormSelect
                            id='loc_upazila_municipality_id'
                            label={messages['upazilas.label']}
                            isLoading={isUpazilaLoading}
                            control={control}
                            options={upazilasList}
                            optionValueProp={'id'}
                            optionTitleProp={['title']}
                            errorInstance={errors}
                            onChange={onChangeUpazilas}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <CustomFilterableFormSelect
                            id='loc_union_id'
                            label={messages['union.label']}
                            isLoading={isLoadingUnions}
                            control={control}
                            options={unionsList}
                            optionValueProp={'id'}
                            optionTitleProp={['title']}
                            errorInstance={errors}
                          />
                        </Grid>
                      </>
                    )}{' '}
                  {isUpazilaOrMunicipality &&
                    isUpazilaOrMunicipality ===
                      UpazilaOrMunicipality.MUNICIPALITY && (
                      <>
                        <Grid item xs={12} md={6}>
                          <CustomFilterableFormSelect
                            id='loc_upazila_municipality_id'
                            label={messages['municipality.label']}
                            isLoading={isUpazilaLoading}
                            control={control}
                            options={municipalityList}
                            optionValueProp={'id'}
                            optionTitleProp={['title']}
                            errorInstance={errors}
                          />
                        </Grid>
                      </>
                    )}
                </>
              )}
            {isDistrictOrCityCorporation &&
              isDistrictOrCityCorporation ===
                DistrictOrCityCorporation.CITY_CORPORATION && (
                <>
                  <Grid item xs={12} md={6}>
                    <CustomFilterableFormSelect
                      required
                      id='loc_city_corporation_id'
                      label={messages['city_corporation.label']}
                      isLoading={isCityCorporationLoading}
                      control={control}
                      options={cityCorporationList}
                      optionValueProp={'id'}
                      optionTitleProp={['title']}
                      errorInstance={errors}
                    />
                  </Grid>
                </>
              )}
            <Grid item xs={6}>
              <CustomFilterableFormSelect
                required
                id='address_type'
                label={messages['label.address_type']}
                isLoading={false}
                control={control}
                options={addressType}
                optionValueProp={'id'}
                optionTitleProp={['label']}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='village_ward_area'
                label={
                  isDistrictOrCityCorporation ==
                  DistrictOrCityCorporation.CITY_CORPORATION
                    ? messages['common.ward_moholla']
                    : messages['common.village_or_area_bn']
                }
                control={control}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='village_ward_area_en'
                label={
                  isDistrictOrCityCorporation ==
                  DistrictOrCityCorporation.CITY_CORPORATION
                    ? messages['common.ward_moholla_en']
                    : messages['common.village_or_area_en']
                }
                control={control}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='house_n_road'
                label={messages['common.house_n_road_bn']}
                control={control}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='house_n_road_en'
                label={messages['common.house_n_road_en']}
                control={control}
                errorInstance={errors}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextInput
                id='zip_or_postal_code'
                label={messages['common.zip_or_postal_code']}
                control={control}
                errorInstance={errors}
              />
            </Grid>
          </Grid>
          {isSubmitting && (
            <div
              role={'alert'}
              aria-live='assertive'
              style={{position: 'absolute', top: '-9999px'}}>
              {messages['common.submitting'] as string}
            </div>
          )}
        </CustomHookForm>
      </Box>
    </Zoom>
  );
};

export default AddressAddEditPage;
