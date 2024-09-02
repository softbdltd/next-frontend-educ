import {UpazilaOrMunicipality} from '../../@core/components/AddressFormComponent/addressEnum';
import {District, Upazila} from '../../shared/Interface/location.interface';

export function filterDistrictsByDivisionId(
  districts: Array<District>,
  divisionId: number | string | null | undefined,
) {
  if (districts && divisionId) {
    return districts.filter(
      (district) => district.loc_division_id == divisionId,
    );
  } else {
    return [];
  }
}

export function filterCityCorporationsByDivisionId(
  city_corporations: Array<any>,
  divisionId: number | string | null | undefined,
) {
  if (city_corporations && divisionId) {
    return city_corporations.filter(
      (city_corporation) => city_corporation.loc_division_id == divisionId,
    );
  } else {
    return [];
  }
}

export function filterUpazilasByDistrictId(
  upazilas: Array<Upazila>,
  districtId: number | string | null | undefined,
  upazilaOrMunicipality?: UpazilaOrMunicipality | undefined | null,
) {
  if (upazilas && districtId) {
    const filteredUpazilas = upazilas.filter(
      (upazila) => upazila.loc_district_id == districtId,
    );
    if (upazilaOrMunicipality === UpazilaOrMunicipality.UPAZILA) {
      return filteredUpazilas.filter((up) => {
        return up.type_of === UpazilaOrMunicipality.UPAZILA;
      });
    } else if (upazilaOrMunicipality === UpazilaOrMunicipality.MUNICIPALITY) {
      return filteredUpazilas.filter((up) => {
        return up.type_of === UpazilaOrMunicipality.MUNICIPALITY;
      });
    } else {
      return filteredUpazilas;
    }
  } else {
    return [];
  }
}

export function filterUnionsByUpazilaId(
  unions: Array<Upazila>,
  upazilaId: number | string | null | undefined,
) {
  if (unions && upazilaId) {
    return unions.filter((union: any) => {
      return union.loc_upazila_municipality_id == upazilaId;
    });
  } else {
    return [];
  }
}
