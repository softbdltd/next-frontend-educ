import CourseConfigKeys from '../../../@core/utilities/CourseConfigKeys';
import FreedomFighterStatus from '../../../@core/utilities/FreedomFighterStatus';
import Genders from '../../../@core/utilities/Genders';
import {getMomentDateFormat} from '../../../@core/utilities/helpers';
import MaritalStatus from '../../../@core/utilities/MaritalStatus';
import PhysicalDisabilityStatus from '../../../@core/utilities/PhysicalDisabilityStatus';
import Religions from '../../../@core/utilities/Religions';
import {AddressTypeId} from '../profile/utilities/AddressType';
import {EducationLevelId} from '../profile/utilities/EducationEnums';

export const initialValuesOfCourseEnrollment = {
  first_name: '',
  first_name_en: '',
  last_name: '',
  last_name_en: '',
  date_of_birth: null,
  signature_image_path: '',
  passport_photo_path: '',
  physical_disability_status: PhysicalDisabilityStatus.NO,
  physical_disabilities: [],
  gender: Genders.MALE,
  marital_status: MaritalStatus.SINGLE,
  freedom_fighter_status: FreedomFighterStatus.NO,
  religion: Religions.ISLAM,
  nationality: '',
  training_center_id: '',
  preferred_training_center_id: '',
  does_belong_to_ethnic_group: false,
  present_address: {
    loc_division_id: '',
    loc_district_id: '',
    loc_union_id: '',
    loc_upazila_municipality_id: '',
    district_or_city_corporation: '',
    loc_city_corporation_id: '',
    village_ward_area: '',
    village_ward_area_en: '',
  },
  is_permanent_address: false,
  permanent_address: {
    loc_division_id: '',
    loc_district_id: '',
    loc_union_id: '',
    loc_upazila_municipality_id: '',
    district_or_city_corporation: '',
    loc_city_corporation_id: '',
    village_ward_area: '',
    village_ward_area_en: '',
  },
  professional_info: {
    main_profession: '',
    monthly_income: '',
    is_currently_employed: false,
    years_of_experiences: '',
  },
  guardian_info: {
    father_name: '',
    mother_name: '',
    local_guardian_name: '',
  },
  miscellaneous_info: {
    has_own_family_home: '1',
    has_own_family_land: '1',
    number_of_siblings: '0',
    recommended_by_any_organization: '1',
  },
  psc_info: {
    exam_degree_id: '',
    edu_board_id: '',
    institute_name: '',
    institute_name_en: '',
    is_foreign_institute: false,
    foreign_institute_country_id: '',
    result: '',
    marks_in_percentage: '',
    cgpa_scale: '',
    cgpa: '',
    year_of_passing: '',
    expected_year_of_passing: '',
    certificate_file_path: '',
    other: '',
    other_en: '',
  },
  jsc_info: {
    exam_degree_id: '',
    edu_board_id: '',
    institute_name: '',
    institute_name_en: '',
    is_foreign_institute: false,
    foreign_institute_country_id: '',
    result: '',
    marks_in_percentage: '',
    cgpa_scale: '',
    cgpa: '',
    year_of_passing: '',
    expected_year_of_passing: '',
    certificate_file_path: '',
    other: '',
    other_en: '',
  },
  ssc_info: {
    exam_degree_id: '',
    edu_board_id: '',
    edu_group_id: '',
    institute_name: '',
    institute_name_en: '',
    is_foreign_institute: false,
    foreign_institute_country_id: '',
    result: '',
    marks_in_percentage: '',
    cgpa_scale: '',
    cgpa: '',
    year_of_passing: '',
    expected_year_of_passing: '',
    certificate_file_path: '',
    other: '',
    other_en: '',
  },
  hsc_info: {
    exam_degree_id: '',
    edu_board_id: '',
    edu_group_id: '',
    institute_name: '',
    institute_name_en: '',
    is_foreign_institute: false,
    foreign_institute_country_id: '',
    result: '',
    marks_in_percentage: '',
    cgpa_scale: '',
    cgpa: '',
    year_of_passing: '',
    expected_year_of_passing: '',
    certificate_file_path: '',
    other: '',
    other_en: '',
  },
  diploma_info: {
    exam_degree_id: '',
    major_or_concentration: '',
    major_or_concentration_en: '',
    institute_name: '',
    institute_name_en: '',
    is_foreign_institute: false,
    foreign_institute_country_id: '',
    result: '',
    marks_in_percentage: '',
    cgpa_scale: '',
    cgpa: '',
    year_of_passing: '',
    expected_year_of_passing: '',
    certificate_file_path: '',
    other: '',
    other_en: '',
  },
  honours_info: {
    exam_degree_id: '',
    major_or_concentration: '',
    major_or_concentration_en: '',
    institute_name: '',
    institute_name_en: '',
    is_foreign_institute: false,
    foreign_institute_country_id: '',
    result: '',
    marks_in_percentage: '',
    cgpa_scale: '',
    cgpa: '',
    year_of_passing: '',
    expected_year_of_passing: '',
    certificate_file_path: '',
    other: '',
    other_en: '',
  },
  masters_info: {
    exam_degree_id: '',
    major_or_concentration: '',
    major_or_concentration_en: '',
    institute_name: '',
    institute_name_en: '',
    is_foreign_institute: false,
    foreign_institute_country_id: '',
    result: '',
    marks_in_percentage: '',
    cgpa_scale: '',
    cgpa: '',
    year_of_passing: '',
    expected_year_of_passing: '',
    certificate_file_path: '',
    other: '',
    other_en: '',
  },
  phd_info: {
    exam_degree_name: '',
    exam_degree_name_en: '',
    major_or_concentration: '',
    major_or_concentration_en: '',
    institute_name: '',
    institute_name_en: '',
    is_foreign_institute: false,
    foreign_institute_country_id: '',
    result: '',
    marks_in_percentage: '',
    cgpa_scale: '',
    cgpa: '',
    year_of_passing: '',
    expected_year_of_passing: '',
    certificate_file_path: '',
  },
};

export enum RelationshipType {
  FATHER = '1',
  MOTHER = '2',
  LOCAL_GUARDIAN = '7',
}

export const intialFormKeyConfig = {
  psc_passing_info: {required: false, visible: false, dataExist: false},
  jsc_passing_info: {required: false, visible: false, dataExist: false},
  ssc_passing_info: {required: false, visible: false, dataExist: false},
  hsc_passing_info: {required: false, visible: false, dataExist: false},
  diploma_passing_info: {required: false, visible: false, dataExist: false},
  honors_passing_info: {required: false, visible: false, dataExist: false},
  masters_passing_info: {required: false, visible: false, dataExist: false},
  phd_passing_info: {required: false, visible: false, dataExist: false},
  guardian_info: {
    required: false,
    visible: false,
    dataExist: false,
    localRequired: false,
    localVisible: false,
    localDataExist: false,
  },
  occupation_info: {required: false, visible: false, dataExist: false},
  miscellaneous_info: {required: false, visible: false, dataExist: false},
};

export const tabKeys = [
  CourseConfigKeys.EDUCATION_KEY.toString(),
  CourseConfigKeys.OCCUPATION_KEY.toString(),
  CourseConfigKeys.GUARDIAN_KEY.toString(),
  CourseConfigKeys.MISCELLANEOUS_KEY.toString(),
];

export const getEducationDataByLevel = (education: any) => {
  switch (Number(education?.education_level_id)) {
    case EducationLevelId.PSC:
      return {
        cgpa: education.cgpa,
        cgpa_scale: education?.cgpa_scale,
        edu_board_id: education?.edu_board_id,
        exam_degree_id: education?.exam_degree_id,
        other: education?.other,
        other_en: education?.other_en,
        expected_year_of_passing: String(
          String(education?.expected_year_of_passing),
        ),
        foreign_institute_country_id: education?.foreign_institute_country_id,
        institute_name: education?.institute_name,
        institute_name_en: education?.institute_name_en,
        is_foreign_institute: education?.is_foreign_institute,
        marks_in_percentage: education?.marks_in_percentage,
        result: education?.result?.id,
        year_of_passing: String(education?.year_of_passing),
        certificate_file_path: education?.certificate_file_path,
      };
    case EducationLevelId.JSC:
      return {
        cgpa: education.cgpa,
        cgpa_scale: education?.cgpa_scale,
        edu_board_id: education?.edu_board_id,
        exam_degree_id: education?.exam_degree_id,
        other: education?.other,
        other_en: education?.other_en,
        expected_year_of_passing: String(education?.expected_year_of_passing),
        foreign_institute_country_id: education?.foreign_institute_country_id,
        institute_name: education?.institute_name,
        institute_name_en: education?.institute_name_en,
        is_foreign_institute: education?.is_foreign_institute,
        marks_in_percentage: education?.marks_in_percentage,
        result: education?.result?.id,
        year_of_passing: String(education?.year_of_passing),
        certificate_file_path: education?.certificate_file_path,
      };
    case EducationLevelId.SSC:
      return {
        cgpa: education.cgpa,
        cgpa_scale: education?.cgpa_scale,
        edu_board_id: education?.edu_board_id,
        edu_group_id: education?.edu_group_id,
        exam_degree_id: education?.exam_degree_id,
        other: education?.other,
        other_en: education?.other_en,
        expected_year_of_passing: String(education?.expected_year_of_passing),
        foreign_institute_country_id: education?.foreign_institute_country_id,
        institute_name: education?.institute_name,
        institute_name_en: education?.institute_name_en,
        is_foreign_institute: education?.is_foreign_institute,
        marks_in_percentage: education?.marks_in_percentage,
        result: education?.result?.id,
        year_of_passing: String(education?.year_of_passing),
        certificate_file_path: education?.certificate_file_path,
      };
    case EducationLevelId.HSC:
      return {
        cgpa: education.cgpa,
        cgpa_scale: education?.cgpa_scale,
        edu_board_id: education?.edu_board_id,
        edu_group_id: education?.edu_group_id,
        exam_degree_id: education?.exam_degree_id,
        other: education?.other,
        other_en: education?.other_en,
        expected_year_of_passing: String(education?.expected_year_of_passing),
        foreign_institute_country_id: education?.foreign_institute_country_id,
        institute_name: education?.institute_name,
        institute_name_en: education?.institute_name_en,
        is_foreign_institute: education?.is_foreign_institute,
        marks_in_percentage: education?.marks_in_percentage,
        result: education?.result?.id,
        year_of_passing: String(education?.year_of_passing),
        certificate_file_path: education?.certificate_file_path,
      };
    case EducationLevelId.DIPLOMA:
      return {
        major_or_concentration: education?.major_or_concentration,
        major_or_concentration_en: education?.major_or_concentration_en,
        cgpa: education.cgpa,
        cgpa_scale: education?.cgpa_scale,
        exam_degree_id: education?.exam_degree_id,
        other: education?.other,
        other_en: education?.other_en,
        expected_year_of_passing: String(education?.expected_year_of_passing),
        foreign_institute_country_id: education?.foreign_institute_country_id,
        institute_name: education?.institute_name,
        institute_name_en: education?.institute_name_en,
        is_foreign_institute: education?.is_foreign_institute,
        marks_in_percentage: education?.marks_in_percentage,
        result: education?.result?.id,
        year_of_passing: String(education?.year_of_passing),
        certificate_file_path: education?.certificate_file_path,
      };
    case EducationLevelId.HONOURS:
      return {
        major_or_concentration: education?.major_or_concentration,
        major_or_concentration_en: education?.major_or_concentration_en,
        cgpa: education.cgpa,
        cgpa_scale: education?.cgpa_scale,
        exam_degree_id: education?.exam_degree_id,
        other: education?.other,
        other_en: education?.other_en,
        expected_year_of_passing: String(education?.expected_year_of_passing),
        foreign_institute_country_id: education?.foreign_institute_country_id,
        institute_name: education?.institute_name,
        institute_name_en: education?.institute_name_en,
        is_foreign_institute: education?.is_foreign_institute,
        marks_in_percentage: education?.marks_in_percentage,
        result: education?.result?.id,
        year_of_passing: String(education?.year_of_passing),
        certificate_file_path: education?.certificate_file_path,
      };
    case EducationLevelId.MASTERS:
      return {
        major_or_concentration: education?.major_or_concentration,
        major_or_concentration_en: education?.major_or_concentration_en,
        cgpa: education.cgpa,
        cgpa_scale: education?.cgpa_scale,
        exam_degree_id: education?.exam_degree_id,
        other: education?.other,
        other_en: education?.other_en,
        expected_year_of_passing: String(education?.expected_year_of_passing),
        foreign_institute_country_id: education?.foreign_institute_country_id,
        institute_name: education?.institute_name,
        institute_name_en: education?.institute_name_en,
        is_foreign_institute: education?.is_foreign_institute,
        marks_in_percentage: education?.marks_in_percentage,
        result: education?.result?.id,
        year_of_passing: String(education?.year_of_passing),
        certificate_file_path: education?.certificate_file_path,
      };
    case EducationLevelId.PHD:
      return {
        exam_degree_name: education?.exam_degree_name,
        exam_degree_name_en: education?.exam_degree_name_en,
        major_or_concentration: education?.major_or_concentration,
        major_or_concentration_en: education?.major_or_concentration_en,
        cgpa: education.cgpa,
        cgpa_scale: education?.cgpa_scale,
        expected_year_of_passing: String(education?.expected_year_of_passing),
        foreign_institute_country_id: education?.foreign_institute_country_id,
        institute_name: education?.institute_name,
        institute_name_en: education?.institute_name_en,
        is_foreign_institute: education?.is_foreign_institute,
        marks_in_percentage: education?.marks_in_percentage,
        result: education?.result?.id,
        year_of_passing: String(education?.year_of_passing),
        certificate_file_path: education?.certificate_file_path,
      };
    default:
      return {};
  }
};

export const getAddressDataByLevel = (address: any) => {
  if (address.address_type == AddressTypeId.PRESENT) {
    return {
      loc_division_id: address?.loc_division_id,
      loc_district_id: address?.loc_district_id,
      loc_union_id: address?.loc_union_id,
      loc_upazila_municipality_id: address?.loc_upazila_municipality_id,
      district_or_city_corporation: address?.district_or_city_corporation,
      loc_upazila_municipality_type: address?.loc_upazila_municipality_type,
      loc_city_corporation_id: address?.loc_city_corporation_id,
      village_ward_area: address?.village_ward_area,
      village_ward_area_en: address?.village_ward_area_en,
      zip_or_postal_code: address?.zip_or_postal_code,
    };
  } else if (address.address_type == AddressTypeId.PERMANENT) {
    return {
      loc_division_id: address?.loc_division_id,
      loc_district_id: address?.loc_district_id,
      loc_union_id: address?.loc_union_id,
      loc_upazila_municipality_id: address?.loc_upazila_municipality_id,
      district_or_city_corporation: address?.district_or_city_corporation,
      loc_upazila_municipality_type: address?.loc_upazila_municipality_type,
      loc_city_corporation_id: address?.loc_city_corporation_id,
      village_ward_area: address?.village_ward_area,
      village_ward_area_en: address?.village_ward_area_en,
      zip_or_postal_code: address?.zip_or_postal_code,
    };
  }
};

export const getGuardiansInfo = (guardian: any) => {
  let guardianData: any = {};
  let guardianDataExist = {
    father_info: false,
    mother_info: false,
    local_guardian_info: false,
  };

  guardian.forEach((guardian: any) => {
    if (guardian.relationship_type == RelationshipType.FATHER) {
      guardianDataExist.father_info = true;
      guardianData.father_name = guardian.name ?? '';
      guardianData.father_name_en = guardian.name_en ?? '';
      guardianData.father_mobile = guardian.mobile ?? '';
      guardianData.father_date_of_birth = guardian?.date_of_birth
        ? getMomentDateFormat(guardian.date_of_birth, 'YYYY-MM-DD')
        : '';
      guardianData.father_nid = guardian.nid ?? '';
    } else if (guardian.relationship_type == RelationshipType.MOTHER) {
      guardianDataExist.mother_info = true;
      guardianData.mother_name = guardian.name ?? '';
      guardianData.mother_name_en = guardian.name_en ?? '';
      guardianData.mother_mobile = guardian.mobile ?? '';
      guardianData.mother_date_of_birth = guardian?.date_of_birth
        ? getMomentDateFormat(guardian.date_of_birth, 'YYYY-MM-DD')
        : '';
      guardianData.mother_nid = guardian.nid ?? '';
    } else if (guardian.relationship_type == RelationshipType.LOCAL_GUARDIAN) {
      guardianDataExist.local_guardian_info = true;
      guardianData.local_guardian_name = guardian.name ?? '';
      guardianData.local_guardian_name_en = guardian.name_en ?? '';
      guardianData.local_guardian_mobile = guardian.mobile ?? '';
      guardianData.local_guardian_date_of_birth = guardian?.date_of_birth
        ? getMomentDateFormat(guardian.date_of_birth, 'YYYY-MM-DD')
        : '';
      guardianData.local_guardian_nid = guardian.nid ?? '';
      guardianData.local_guardian_relationship_title =
        guardian.relationship_title ?? '';
      guardianData.local_guardian_relationship_title_en =
        guardian.relationship_title_en ?? '';
    }
  });

  return {
    data: guardianData,
    dataExist: guardianDataExist.father_info && guardianDataExist.mother_info,
    localDataExist: guardianDataExist.local_guardian_info,
  };
};
