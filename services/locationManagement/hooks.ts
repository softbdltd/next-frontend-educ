import {
  API_CITY_CORPORATION,
  API_COUNTRIES,
  API_DISTRICTS,
  API_DIVISIONS,
  API_UNIONS,
  API_UPAZILAS,
  API_UPAZILAS_MUNICIPALITY,
} from '../../@core/common/apiRoutes';
import {
  useAxiosSWR,
  useDataLocalizationAxiosSWR,
} from '../../@core/hooks/useAxiosSWR';

export function useFetchDivisions(params: any = null) {
  return useAxiosSWR([API_DIVISIONS, params]);
}

export function useFetchLocalizedDivisions(params: any = null) {
  return useDataLocalizationAxiosSWR([API_DIVISIONS, params]);
}

export function useFetchDivision(divisionId: number | null) {
  return useAxiosSWR(divisionId ? API_DIVISIONS + '/' + divisionId : null);
}

export function useFetchDistricts(params: any) {
  return useAxiosSWR([API_DISTRICTS, params]);
}

``;

export function useFetchLocalizedDistricts(params: any) {
  return useDataLocalizationAxiosSWR(params ? [API_DISTRICTS, params] : null);
}

export function useFetchDistrict(districtId: number | null) {
  return useAxiosSWR(districtId ? API_DISTRICTS + '/' + districtId : null);
}

export function useFetchUpazilas(params: any) {
  return useAxiosSWR([API_UPAZILAS, params]);
}

export function useFetchUpazilasMunicipality(params: any) {
  return useAxiosSWR([API_UPAZILAS_MUNICIPALITY, params]);
}

export function useFetchLocalizedUpazilas(params: any) {
  return useDataLocalizationAxiosSWR([API_UPAZILAS, params]);
}

export function useFetchLocalizedUpazilasMunicipality(params: any) {
  return useDataLocalizationAxiosSWR([API_UPAZILAS_MUNICIPALITY, params]);
}

export function useFetchUnions(params: any) {
  return useAxiosSWR([API_UNIONS, params]);
}

export function useFetchLocalizedUnions(params: any) {
  return useDataLocalizationAxiosSWR(params ? [API_UNIONS, params] : null);
}

export function useFetchUpazila(upazilaId: number | null) {
  return useAxiosSWR(upazilaId ? API_UPAZILAS + '/' + upazilaId : null);
}

export function useFetchCountries(params: any) {
  return useDataLocalizationAxiosSWR([API_COUNTRIES, params]);
}

export function useFetchCityCorporations(params: any) {
  return useDataLocalizationAxiosSWR([API_CITY_CORPORATION, params]);
}
