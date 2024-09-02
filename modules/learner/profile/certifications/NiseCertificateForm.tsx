import {Grid} from '@mui/material';
import React, {useCallback, useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {
  DistrictOrCityCorporation,
  UpazilaOrMunicipality,
} from '../../../../@core/components/AddressFormComponent/addressEnum';
import CustomDatePicker from '../../../../@core/elements/input/CustomDatePicker';
import CustomFilterableFormSelect from '../../../../@core/elements/input/CustomFilterableFormSelect';
import CustomFormSelect from '../../../../@core/elements/input/CustomFormSelect/CustomFormSelect';
import FormRadioButtons from '../../../../@core/elements/input/CustomRadioButtonGroup/FormRadioButtons';
import CustomTextInput from '../../../../@core/elements/input/CustomTextInput/CustomTextInput';
import RowStatus from '../../../../@core/utilities/RowStatus';
import {
  useFetchPublicCourses,
  useFetchPublicInstitutes,
  useFetchPublicTrainingCenters,
} from '../../../../services/instituteManagement/hooks';
import {
  useFetchCityCorporations,
  useFetchLocalizedDistricts,
  useFetchLocalizedDivisions,
  useFetchLocalizedUpazilasMunicipality,
} from '../../../../services/locationManagement/hooks';
import {
  filterCityCorporationsByDivisionId,
  filterDistrictsByDivisionId,
  filterUpazilasByDistrictId,
} from '../../../../services/locationManagement/locationUtils';
import {District, Upazila,} from '../../../../shared/Interface/location.interface';
import FileUploadComponent from '../../../filepond/FileUploadComponent';
import CustomCheckbox from "../../../../@core/elements/input/CustomCheckbox/CustomCheckbox";

const EDUCCertificateForm = ({
                               setValue,
                               control,
                               errors,
                               isLoading,
                               itemData,
                               register,
                               isEnlistedCourse,
                               setIsEnlistedCourse
                             }: any) => {
  const {messages} = useIntl();
  const [selectedDistrict, setSelectedDistrict] = useState<number>();
  const [selectedDivision, setSelectedDivision] = useState<number>();
  //Filterd Location
  const [trainingCenterFilters, setTrainingCenterFilters] = useState<any>({});
  const [instituteFilters] = useState({row_status: 1});
  const [courseFilters, setCourseFilters] = useState<any>({});

  const {data: institutes, isLoading: isLoadingInstitutes} =
    useFetchPublicInstitutes(instituteFilters);

  const {data: courses, isLoading: isLoadingCourses} =
    useFetchPublicCourses(courseFilters);

  const {data: trainingCenters} = useFetchPublicTrainingCenters(
    trainingCenterFilters,
  );

  const [districtsList, setDistrictsList] = useState<Array<District> | []>([]);
  const [upazilasList, setUpazilasList] = useState<Array<Upazila> | []>([]);
  const [municipalityList, setMunicipalityList] = useState<Array<Upazila> | []>(
    [],
  );
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
      setValue('loc_upazila_municipality_type', '');

      if (isDistrictOrCityCorporation) {
        setDistrictOrCityCorporation(divisionId, isDistrictOrCityCorporation);
      }

      if (divisionId) {
        setTrainingCenterFilters((prev: any) => {
          const {
            loc_district_id,
            loc_city_corporation_id,
            loc_upazila_municipality_id,
            ...restFilters
          } = prev;
          return {
            ...restFilters,
            loc_division_id: divisionId,
          };
        });
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
    setValue('loc_upazila_municipality_type', '');
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
    setTrainingCenterFilters((prev: any) => {
      const {institute_id, loc_division_id} = prev;
      return {
        institute_id: institute_id,
        loc_division_id: loc_division_id,
      };
    });
  };
  const onDistrictChange = useCallback(
    (districtId: number) => {
      setSelectedDistrict(districtId);
      setValue('loc_upazila_municipality_id', '');
      setValue('loc_upazila_municipality_type', '');
      setValue('loc_union_id', '');

      if (districtId) {
        setTrainingCenterFilters((prev: any) => {
          const {
            loc_city_corporation_id,
            loc_upazila_municipality_id,
            ...restFilters
          } = prev;
          return {
            ...restFilters,
            loc_district_id: districtId,
          };
        });
      }
    },
    [isUpazilaOrMunicipality],
  );

  const onChangeUpazilas = useCallback((upazilaId: number) => {
    if (upazilaId) {
      setTrainingCenterFilters((prev: any) => ({
        ...prev,
        loc_upazila_municipality_id: upazilaId,
      }));
    }
  }, []);
  const onChangeMunicipality = useCallback((municipalityId: number) => {
    if (municipalityId) {
      setTrainingCenterFilters((prev: any) => ({
        ...prev,
        loc_upazila_municipality_id: municipalityId,
      }));
    }
  }, []);

  const onChangeCityCorporation = useCallback((cityCorporationId: number) => {
    if (cityCorporationId) {
      setTrainingCenterFilters((prev: any) => {
        const {loc_district_id, ...restFilters} = prev;
        return {
          ...restFilters,
          loc_city_corporation_id: cityCorporationId,
        };
      });
    }
  }, []);

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

  const handleTrainingCenterChange = (id: number) => {
    setTrainingCenterFilters({institute_id: id});
    setCourseFilters({institute_id: id});
    setValue('loc_division_id', '');
    setValue('loc_district_id', '');
    setValue('loc_city_corporation_id', '');
    setValue('district_or_city_corporation', '');
    setValue('loc_upazila_municipality_id', '');
    setValue('loc_union_id', '');
    const instituteName = institutes?.find((itm: any) => itm.id == id)?.title
    setValue('institute_name', instituteName);
  };

  const handleCouresChange = (id: number) => {
    const courseName = courses?.find((itm: any) => itm.id == id)?.title
    const courseNameBangla = courses?.find((itm: any) => itm.id == id)?.title_en
    setValue('certification_name', courseName);
    setValue('certification_name_en', courseNameBangla);
  };

  useEffect(() => {
    setUpazillaORMunicipality(selectedDistrict, isUpazilaOrMunicipality);
  }, [setUpazillaORMunicipality, isUpazilaOrMunicipality, selectedDistrict]);


  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={6}>
        <CustomFormSelect
          required
          id='institute_id'
          label={messages['common.certificate_institute_department']}
          isLoading={isLoadingInstitutes}
          control={control}
          options={institutes}
          optionValueProp={'id'}
          optionTitleProp={['title']}
          errorInstance={errors}
          onChange={handleTrainingCenterChange}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <CustomFilterableFormSelect
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
        isDistrictOrCityCorporation === DistrictOrCityCorporation.DISTRICT && (
          <>
            <Grid item xs={12} md={6}>
              <CustomFilterableFormSelect
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
              isUpazilaOrMunicipality === UpazilaOrMunicipality.UPAZILA && (
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
                      onChange={onChangeMunicipality}
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
                id='loc_city_corporation_id'
                label={messages['city_corporation.label']}
                isLoading={isCityCorporationLoading}
                control={control}
                options={cityCorporationList}
                optionValueProp={'id'}
                optionTitleProp={['title']}
                errorInstance={errors}
                onChange={onChangeCityCorporation}
              />
            </Grid>
          </>
        )}

      <Grid item xs={6}>
        <CustomFormSelect
          required
          id='training_center_id'
          label={messages['common.training_center']}
          isLoading={false}
          control={control}
          optionValueProp={'id'}
          options={trainingCenters}
          optionTitleProp={['title']}
          errorInstance={errors}
        />
      </Grid>

      <Grid item xs={12} mb={2}>
        <CustomCheckbox
          id='is_enlisted_course'
          label={messages['common.certificate_not_enlisted_course']}
          register={register}
          errorInstance={errors}
          checked={isEnlistedCourse}
          onChange={() => {
            setIsEnlistedCourse((prev: boolean) => !prev);
          }}
          isLoading={false}
        />
      </Grid>

      {
        !isEnlistedCourse && (
          <Grid item xs={6}>
            <CustomFormSelect
              required
              id='course_id'
              label={messages['common.certificate_course_name']}
              isLoading={isLoadingCourses}
              control={control}
              optionValueProp={'id'}
              options={courses}
              optionTitleProp={['title']}
              errorInstance={errors}
              onChange={handleCouresChange}
            />
          </Grid>
        )
      }

      {
        isEnlistedCourse && (
          <Grid item xs={12} md={6}>
            <CustomTextInput
              required
              id='certification_name'
              label={messages['common.certificate_course_name_bn']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
            />
          </Grid>
        )
      }

      {
        isEnlistedCourse && (
          <Grid item xs={12} md={6}>
            <CustomTextInput
              id='certification_name_en'
              label={messages['common.certificate_course_name_en']}
              control={control}
              errorInstance={errors}
              isLoading={isLoading}
            />
          </Grid>
        )
      }


      <Grid item xs={12} md={3}>
        <CustomDatePicker
          required
          id='start_date'
          label={messages['common.certificate_batch_start_date']}
          control={control}
          errorInstance={errors}
          isLoading={isLoading}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <CustomDatePicker
          required
          id='end_date'
          label={messages['common.certificate_batch_end_date']}
          control={control}
          errorInstance={errors}
          isLoading={isLoading}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <CustomTextInput
          required
          id='name'
          label={messages['common.name']}
          control={control}
          errorInstance={errors}
          isLoading={isLoading}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <CustomTextInput
          required
          id='father_name'
          label={messages['common.father_name']}
          control={control}
          errorInstance={errors}
          isLoading={isLoading}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <CustomTextInput
          required
          id='mother_name'
          label={messages['common.mother_name']}
          control={control}
          errorInstance={errors}
          isLoading={isLoading}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <CustomTextInput
          required
          id='identity_number'
          label={messages['common.certificate_nid_birth_no']}
          control={control}
          errorInstance={errors}
          isLoading={isLoading}
        />
      </Grid>


      <Grid item xs={12} md={6}>
        <CustomTextInput
          required
          id='result'
          label={messages['common.certificate_grade']}
          control={control}
          errorInstance={errors}
          isLoading={isLoading}
        />
      </Grid>


      {/*<Grid item xs={12} md={6}>
        <CustomTextInput
          required
          id='location'
          label={messages['common.certificate_location_bn']}
          control={control}
          errorInstance={errors}
          isLoading={isLoading}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <CustomTextInput
          id='location_en'
          label={messages['common.certificate_location_en']}
          control={control}
          errorInstance={errors}
          isLoading={isLoading}
        />
      </Grid>*/}

      <Grid item xs={12} md={6}>
        <CustomTextInput
          required
          id='certificate_number'
          label={messages['common.certificate_number']}
          control={control}
          errorInstance={errors}
          isLoading={isLoading}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FileUploadComponent
          id='certificate_file_path'
          defaultFileUrl={itemData?.certificate_file_path}
          acceptedFileTypes={['image/*', 'application/pdf']}
          errorInstance={errors}
          setValue={setValue}
          register={register}
          label={messages['common.certificate']}
          required={true}
        />
      </Grid>
    </Grid>
  );
};

export default EDUCCertificateForm;
