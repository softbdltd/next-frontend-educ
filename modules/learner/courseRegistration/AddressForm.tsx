import React, {FC, useCallback, useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';
import {useIntl} from 'react-intl';
import CustomTextInput from '../../../@core/elements/input/CustomTextInput/CustomTextInput';
import {
  useFetchCityCorporations,
  useFetchLocalizedDistricts,
  useFetchLocalizedDivisions,
  useFetchLocalizedUnions,
  useFetchLocalizedUpazilasMunicipality,
} from '../../../services/locationManagement/hooks';
import RowStatus from '../../../@core/utilities/RowStatus';
import {
  filterCityCorporationsByDivisionId,
  filterDistrictsByDivisionId,
  filterUnionsByUpazilaId,
  filterUpazilasByDistrictId,
} from '../../../services/locationManagement/locationUtils';
import CustomFilterableFormSelect from '../../../@core/elements/input/CustomFilterableFormSelect';
import {District, Upazila} from '../../../shared/Interface/location.interface';
import FormRadioButtons from '../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import {
  DistrictOrCityCorporation,
  UpazilaOrMunicipality,
} from '../../../@core/components/AddressFormComponent/addressEnum';
import {Box, Typography} from '@mui/material';
import CustomCheckbox from '../../../@core/elements/input/CustomCheckbox/CustomCheckbox';
import {styled} from '@mui/material/styles';

const PREFIX = 'AddressForm';

const classes = {
  visuallyHidden: `${PREFIX}-visuallyHidden`,
};

const StyledBox = styled(Box)(({theme}) => ({
  [`& .${classes.visuallyHidden}`]: {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    width: '1px',
  },
}));

interface AddressFormProps {
  register: any;
  errors: any;
  control: any;
  getValues: any;
  setValue: any;
  stepKey: string;
  onChangeSameAsPresentCheck: (checked: boolean) => void;
}

const AddressForm: FC<AddressFormProps> = ({
  register,
  errors,
  control,
  getValues,
  setValue,
  onChangeSameAsPresentCheck,
  stepKey,
}) => {
  const {messages} = useIntl();
  const [filters] = useState({});
  const {data: divisions, isLoading: isLoadingDivisions}: any =
    useFetchLocalizedDivisions(filters);

  const [districtsFilter] = useState<any>({
    row_status: RowStatus.ACTIVE,
  });
  const {data: districts} = useFetchLocalizedDistricts(districtsFilter);

  const [disabledPermanentAddress, setDisabledPermanentAddress] =
    useState<boolean>(false);
  const [selectedDistrict, setSelectedDistrict] = useState<number>();
  const [selectedDivision, setSelectedDivision] = useState<number>();

  const [districtsList, setDistrictsList] = useState<Array<District> | []>([]);
  const [upazilasList, setUpazilasList] = useState<Array<Upazila> | []>([]);
  const [municipalityList, setMunicipalityList] = useState<Array<Upazila> | []>(
    [],
  );
  const [unionsList, setUnionsList] = useState<Array<any> | []>([]);
  const [cityCorporationList, setCityCorporationList] = useState<
    Array<any> | []
  >([]);
  const [isDistrictOrCityCorporation, setIsDistrictOrCityCorporation] =
    useState<DistrictOrCityCorporation | null>(null);
  const [isUpazilaOrMunicipality, setIsUpazilaOrMunicipality] =
    useState<UpazilaOrMunicipality | null>(null);

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

  const [selectedPermanentDistrict, setSelectedPermanentDistrict] =
    useState<number>();
  const [selectedPermanentDivision, setSelectedPermanentDivision] =
    useState<number>();
  const [
    isPermanentDistrictOrCityCorporation,
    setIsPermanentDistrictOrCityCorporation,
  ] = useState<DistrictOrCityCorporation | null>(null);
  const [permanentUnionsList, setPermanentUnionsList] = useState<
    Array<any> | []
  >([]);
  const [permanentCityCorporationList, setPermanentCityCorporationList] =
    useState<Array<any> | []>([]);
  const [permanentDistrictsList, setPermanentDistrictsList] = useState<
    Array<District> | []
  >([]);
  const [permanentUpazilasList, setPermanentUpazilasList] = useState<
    Array<Upazila> | []
  >([]);
  const [permanentMunicipalityList, setPermanentMunicipalityList] = useState<
    Array<Upazila> | []
  >([]);
  const [
    isPermanentUpazilaOrMunicipality,
    setIsPermanentUpazilaOrMunicipality,
  ] = useState<UpazilaOrMunicipality | null>(null);

  useEffect(() => {
    if (getValues) {
      const presentAddress: any = getValues('present_address');
      const permanentAddress: any = getValues('permanent_address');
      // const isPermanentAddress: any = getValues('is_permanent_address');

      if (presentAddress.loc_division_id) {
        setSelectedDivision(presentAddress.loc_division_id);
      }
      if (presentAddress.district_or_city_corporation) {
        setIsDistrictOrCityCorporation(
          presentAddress.district_or_city_corporation,
        );
      }

      if (presentAddress.loc_district_id) {
        setSelectedDistrict(presentAddress.loc_district_id);
        setDistrictsList(
          filterDistrictsByDivisionId(
            districts,
            presentAddress.loc_division_id,
          ),
        );
      }
      setCityCorporationList(
        filterCityCorporationsByDivisionId(
          city_corporations,
          presentAddress.loc_division_id,
        ),
      );
      if (presentAddress.loc_upazila_municipality_type) {
        setIsUpazilaOrMunicipality(
          presentAddress.loc_upazila_municipality_type,
        );
        setUpazillaORMunicipality(
          presentAddress.loc_district_id,
          presentAddress.loc_upazila_municipality_type,
        );
      }
      setUnionsList(
        filterUnionsByUpazilaId(
          unions,
          presentAddress.loc_upazila_municipality_id,
        ),
      );
      // setDisabledPermanentAddress(isPermanentAddress);

      if (permanentAddress.loc_division_id) {
        setSelectedPermanentDivision(permanentAddress.loc_division_id);
      }
      if (permanentAddress.district_or_city_corporation) {
        setIsPermanentDistrictOrCityCorporation(
          permanentAddress.district_or_city_corporation,
        );
      }
      if (permanentAddress.loc_district_id) {
        setSelectedPermanentDistrict(permanentAddress.loc_district_id);
        setPermanentDistrictsList(
          filterDistrictsByDivisionId(
            districts,
            permanentAddress.loc_division_id,
          ),
        );
      }
      setPermanentCityCorporationList(
        filterCityCorporationsByDivisionId(
          city_corporations,
          permanentAddress.loc_division_id,
        ),
      );
      if (permanentAddress.loc_upazila_municipality_type) {
        setIsPermanentUpazilaOrMunicipality(
          permanentAddress.loc_upazila_municipality_type,
        );

        setPermanentUpazillaORMunicipality(
          permanentAddress.loc_district_id,
          permanentAddress.loc_upazila_municipality_type,
        );
      }
      setPermanentUnionsList(
        filterUnionsByUpazilaId(
          unions,
          permanentAddress.loc_upazila_municipality_id,
        ),
      );
    }
  }, [getValues, districts, upazilas_municipality, unions, city_corporations]);

  /*start of present address*/

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
      setValue('present_address[loc_district_id]', '');
      setValue('present_address[loc_city_corporation_id]', '');
      setValue('present_address[loc_upazila_municipality_id]', '');
      setValue('present_address[loc_upazila_municipality_type]', '');
      setValue('present_address[loc_union_id]', '');

      if (isDistrictOrCityCorporation) {
        setDistrictOrCityCorporation(divisionId, isDistrictOrCityCorporation);
      }
    },
    [districts, isDistrictOrCityCorporation],
  );
  const onDistrictOrCityCorporationChange = (
    value: DistrictOrCityCorporation,
  ) => {
    setValue(`present_address[loc_district_id]`, '');
    setValue('present_address[loc_city_corporation_id]', '');
    setValue('present_address[loc_upazila_municipality_id]', '');
    setValue('present_address[loc_upazila_municipality_type]', '');
    setValue('present_address[loc_union_id]', '');
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
      setValue('present_address[loc_upazila_municipality_id]', '');
      setValue('present_address[loc_union_id]', '');
    },
    [isUpazilaOrMunicipality],
  );

  const setUpazillaORMunicipality = useCallback(
    (districtId: number | undefined, upazilaOrMunicipality: number) => {
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
    setValue('present_address[loc_upazila_municipality_id]', '');
    setValue('present_address[loc_union_id]', '');
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
      let filteredUnions = filterUnionsByUpazilaId(unions, upazilaId);

      setUnionsList(filteredUnions);
    },
    [unions],
  );

  /*end of present address*/

  const setPermanentDistrictOrCityCorporation = useCallback(
    (
      divisionId: number | undefined,
      districtOrCityCorporation: number | undefined,
    ) => {
      if (districtOrCityCorporation === DistrictOrCityCorporation.DISTRICT) {
        let data = filterDistrictsByDivisionId(districts, divisionId);
        setPermanentDistrictsList(data);
      } else {
        let data = filterCityCorporationsByDivisionId(
          city_corporations,
          divisionId,
        );
        setPermanentCityCorporationList(data);
      }
    },
    [districts, city_corporations, DistrictOrCityCorporation],
  );
  const onPermanentDivisionChange = useCallback(
    (divisionId: number) => {
      setSelectedPermanentDivision(divisionId);
      setValue('permanent_address[loc_district_id]', '');
      setValue('permanent_address[loc_city_corporation_id]', '');
      setValue('permanent_address[loc_upazila_municipality_id]', '');
      setValue('permanent_address[loc_upazila_municipality_type]', '');
      setValue('permanent_address[loc_union_id]', '');

      if (isPermanentDistrictOrCityCorporation) {
        setPermanentDistrictOrCityCorporation(
          divisionId,
          isPermanentDistrictOrCityCorporation,
        );
      }
    },
    [districts, isPermanentDistrictOrCityCorporation],
  );
  const onPermanentDistrictOrCityCorporationChange = (
    value: DistrictOrCityCorporation,
  ) => {
    setValue(`permanent_address[loc_district_id]`, '');
    setValue('permanent_address[loc_city_corporation_id]', '');
    setValue('permanent_address[loc_upazila_municipality_id]', '');
    setValue('permanent_address[loc_upazila_municipality_type]', '');
    setValue('permanent_address[loc_union_id]', '');
    if (Number(value) === DistrictOrCityCorporation.DISTRICT) {
      setIsPermanentDistrictOrCityCorporation(Number(value));
      setPermanentDistrictOrCityCorporation(
        selectedPermanentDivision,
        DistrictOrCityCorporation.DISTRICT,
      );
    } else {
      setIsPermanentDistrictOrCityCorporation(Number(value));
      setPermanentDistrictOrCityCorporation(
        selectedPermanentDivision,
        DistrictOrCityCorporation.CITY_CORPORATION,
      );
    }
  };
  const onPermanentDistrictChange = useCallback(
    (districtId: number) => {
      setSelectedPermanentDistrict(districtId);
      setValue('permanent_address[loc_upazila_municipality_id]', '');
      setValue('permanent_address[loc_union_id]', '');
    },
    [isUpazilaOrMunicipality],
  );

  const setPermanentUpazillaORMunicipality = useCallback(
    (districtId: number | undefined, upazilaOrMunicipality: number) => {
      let data = filterUpazilasByDistrictId(
        upazilas_municipality,
        districtId,
        upazilaOrMunicipality,
      );
      if (upazilaOrMunicipality == UpazilaOrMunicipality.UPAZILA) {
        setPermanentUpazilasList(data);
      } else {
        setPermanentMunicipalityList(data);
      }
    },
    [upazilas_municipality],
  );

  const onPermanentUpazilaOrMunicipalityChange = (
    value: UpazilaOrMunicipality,
  ) => {
    setValue('permanent_address[loc_upazila_municipality_id]', '');
    setValue('permanent_address[loc_union_id]', '');
    if (Number(value) === UpazilaOrMunicipality.UPAZILA) {
      setIsPermanentUpazilaOrMunicipality(Number(value));
      setPermanentUpazillaORMunicipality(
        selectedPermanentDistrict,
        UpazilaOrMunicipality.UPAZILA,
      );
    } else {
      setIsPermanentUpazilaOrMunicipality(Number(value));
      setPermanentUpazillaORMunicipality(
        selectedPermanentDistrict,
        UpazilaOrMunicipality.MUNICIPALITY,
      );
    }
  };
  const onChangePermanentUpazilas = useCallback(
    (upazilaId: number) => {
      let filteredUnions = filterUnionsByUpazilaId(unions, upazilaId);

      setPermanentUnionsList(filteredUnions);
    },
    [unions],
  );

  return (
    <StyledBox>
      <span id={stepKey} className={classes.visuallyHidden} tabIndex={0}>{`${
        messages['common.step']
      }${messages['common.' + stepKey]}`}</span>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <CustomFilterableFormSelect
            required
            id='present_address[loc_division_id]'
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
            id='present_address[district_or_city_corporation]'
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
                  id='present_address[loc_district_id]'
                  label={messages['districts.label']}
                  isLoading={false}
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
                  required
                  id='present_address[loc_upazila_municipality_type]'
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
                  errorInstance={errors}
                  onChange={onUpazilaOrMunicipalityChange}
                />
              </Grid>
              {isUpazilaOrMunicipality &&
                isUpazilaOrMunicipality === UpazilaOrMunicipality.UPAZILA && (
                  <>
                    <Grid item xs={12} md={6}>
                      <CustomFilterableFormSelect
                        required
                        id='present_address[loc_upazila_municipality_id]'
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
                        id='present_address[loc_union_id]'
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
                        id='present_address[loc_upazila_municipality_id]'
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
                  id='present_address[loc_city_corporation_id]'
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
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='present_address[village_ward_area]'
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
            id='present_address[village_ward_area_en]'
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
            id='present_address[zip_or_postal_code]'
            label={messages['common.zip_or_postal_code']}
            control={control}
            errorInstance={errors}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant={'h6'}>
            {messages['common.permanent_address']}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <CustomCheckbox
            id='is_permanent_address'
            label={messages['common.same_as_present']}
            register={register}
            errorInstance={errors}
            checked={disabledPermanentAddress}
            onChange={() => {
              onChangeSameAsPresentCheck(!disabledPermanentAddress);
              setDisabledPermanentAddress((prev) => !prev);
            }}
            isLoading={false}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomFilterableFormSelect
            required
            id='permanent_address[loc_division_id]'
            label={messages['divisions.label']}
            isLoading={isLoadingDivisions}
            control={control}
            options={divisions}
            optionValueProp={'id'}
            optionTitleProp={['title']}
            errorInstance={errors}
            onChange={onPermanentDivisionChange}
            isDisabled={disabledPermanentAddress}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormRadioButtons
            required
            id='permanent_address[district_or_city_corporation]'
            label={'label.district_or_city_corporation'}
            radios={[
              {
                key: DistrictOrCityCorporation.DISTRICT,
                label: messages['districts.label'],
                disabled: disabledPermanentAddress,
              },
              {
                key: DistrictOrCityCorporation.CITY_CORPORATION,
                label: messages['city_corporation.label'],
                disabled: disabledPermanentAddress,
              },
            ]}
            control={control}
            isLoading={false}
            onChange={onPermanentDistrictOrCityCorporationChange}
            errorInstance={errors}
          />
        </Grid>
        {isPermanentDistrictOrCityCorporation &&
          isPermanentDistrictOrCityCorporation ===
            DistrictOrCityCorporation.DISTRICT && (
            <>
              <Grid item xs={12} md={6}>
                <CustomFilterableFormSelect
                  required
                  id='permanent_address[loc_district_id]'
                  label={messages['districts.label']}
                  isLoading={false}
                  control={control}
                  options={permanentDistrictsList}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                  onChange={onPermanentDistrictChange}
                  isDisabled={disabledPermanentAddress}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormRadioButtons
                  required
                  id='permanent_address[loc_upazila_municipality_type]'
                  label={'label.upazila_or_municipality'}
                  radios={[
                    {
                      key: UpazilaOrMunicipality.UPAZILA,
                      label: messages['upazilas.label'],
                      disabled: disabledPermanentAddress,
                    },
                    {
                      key: UpazilaOrMunicipality.MUNICIPALITY,
                      label: messages['municipality.label'],
                      disabled: disabledPermanentAddress,
                    },
                  ]}
                  control={control}
                  isLoading={false}
                  onChange={onPermanentUpazilaOrMunicipalityChange}
                />
              </Grid>
              {isPermanentUpazilaOrMunicipality &&
                isPermanentUpazilaOrMunicipality ===
                  UpazilaOrMunicipality.UPAZILA && (
                  <>
                    <Grid item xs={12} md={6}>
                      <CustomFilterableFormSelect
                        required
                        id='permanent_address[loc_upazila_municipality_id]'
                        label={messages['upazilas.label']}
                        isLoading={isUpazilaLoading}
                        control={control}
                        options={permanentUpazilasList}
                        optionValueProp={'id'}
                        optionTitleProp={['title']}
                        errorInstance={errors}
                        onChange={onChangePermanentUpazilas}
                        isDisabled={disabledPermanentAddress}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomFilterableFormSelect
                        id='permanent_address[loc_union_id]'
                        label={messages['union.label']}
                        isLoading={isLoadingUnions}
                        control={control}
                        options={permanentUnionsList}
                        optionValueProp={'id'}
                        optionTitleProp={['title']}
                        errorInstance={errors}
                        isDisabled={disabledPermanentAddress}
                      />
                    </Grid>
                  </>
                )}{' '}
              {isPermanentUpazilaOrMunicipality &&
                isPermanentUpazilaOrMunicipality ===
                  UpazilaOrMunicipality.MUNICIPALITY && (
                  <>
                    <Grid item xs={12} md={6}>
                      <CustomFilterableFormSelect
                        id='permanent_address[loc_upazila_municipality_id]'
                        label={messages['municipality.label']}
                        isLoading={isUpazilaLoading}
                        control={control}
                        options={permanentMunicipalityList}
                        optionValueProp={'id'}
                        optionTitleProp={['title']}
                        errorInstance={errors}
                        isDisabled={disabledPermanentAddress}
                      />
                    </Grid>
                  </>
                )}
            </>
          )}
        {isPermanentDistrictOrCityCorporation &&
          isPermanentDistrictOrCityCorporation ===
            DistrictOrCityCorporation.CITY_CORPORATION && (
            <>
              <Grid item xs={12} md={6}>
                <CustomFilterableFormSelect
                  required
                  id='permanent_address[loc_city_corporation_id]'
                  label={messages['city_corporation.label']}
                  isLoading={isCityCorporationLoading}
                  control={control}
                  options={permanentCityCorporationList}
                  optionValueProp={'id'}
                  optionTitleProp={['title']}
                  errorInstance={errors}
                  isDisabled={disabledPermanentAddress}
                />
              </Grid>
            </>
          )}
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='permanent_address[village_ward_area]'
            label={
              isPermanentDistrictOrCityCorporation ==
              DistrictOrCityCorporation.CITY_CORPORATION
                ? messages['common.ward_moholla']
                : messages['common.village_or_area_bn']
            }
            control={control}
            errorInstance={errors}
            disabled={disabledPermanentAddress}
            inputProps={{
              disabled: disabledPermanentAddress,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='permanent_address[village_ward_area_en]'
            label={
              isPermanentDistrictOrCityCorporation ==
              DistrictOrCityCorporation.CITY_CORPORATION
                ? messages['common.ward_moholla_en']
                : messages['common.village_or_area_en']
            }
            control={control}
            errorInstance={errors}
            disabled={disabledPermanentAddress}
            inputProps={{
              disabled: disabledPermanentAddress,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextInput
            id='permanent_address[zip_or_postal_code]'
            label={messages['common.zip_or_postal_code']}
            control={control}
            errorInstance={errors}
            disabled={disabledPermanentAddress}
            inputProps={{
              disabled: disabledPermanentAddress,
            }}
          />
        </Grid>
      </Grid>
    </StyledBox>
  );
};

export default AddressForm;
