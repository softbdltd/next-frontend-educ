import {
  ICreateUpdateAt,
  IIdHolder,
  IIdTitleCreateUpdateAt,
} from './common.interface';

export interface IInstitute extends IIdTitleCreateUpdateAt {
  institute_id: string | number | null;
  code: string;
  domain: string;
  address: string;
  service_type?: number | string;
  country_id?: number | string;
  google_map_src: string;
  logo: string;
  primary_phone: string;
  phone_numbers: Array<object>;
  occupation_exceptions?: Array<any>;
  job_sector_exceptions: string | number | any;
  primary_mobile: string;
  mobile_numbers: Array<object>;
  email: string;
  config: string;
  row_status?: string;
  deleted_at?: string;
  loc_district_id?: string | number | null;
  loc_division_id?: string | number | null;
  loc_union_id?: string | number | null;
  loc_upazila_municipality_id?: string | number | null;
  district_or_city_corporation: string | number | null;
  loc_upazila_municipality_type?: string | number | null;
  loc_city_corporation_id?: string | number | null;
  is_challan_code_enabled?: number;
  challan_code?: string | null;
  enrollment_managed_by?: string | number | null;
  is_payment_enabled?: any;
}

export interface ISubject extends IIdTitleCreateUpdateAt {
  title: string;
  title_en: string;
}

export interface IQuestionSet extends IIdTitleCreateUpdateAt {
  assessment_id: string | number;
  title: string;
  title_en: string;
  row_status?: string;
}

export interface IProgramme extends IIdTitleCreateUpdateAt {
  institute_id?: string | number;
  industry_association_id?: string | number;
  institute_title_en?: string;
  code?: string;
  logo?: string;
  description?: string;
  description_en?: string;
  row_status?: string;
  deleted_at?: string;
}

export interface ICourse extends IIdTitleCreateUpdateAt {
  code: string;
  organization_id?: number | string;
  institute_id?: number | string;
  industry_association_id?: number | string;
  institute_title?: string;
  institute_title_en?: string;
  branch_id?: number | string;
  branch_title?: string;
  branch_title_en?: string;
  program_id?: number | string;
  program_title?: string;
  program_title_en?: string;
  job_sector_id?: number | string;
  job_sector_title?: string;
  job_sector_title_en?: string;
  occupation_id?: number | string;
  occupation_title?: string;
  occupation_title_en?: string;
  level: number | string;
  language_medium: number | string;
  skills: Array<any>;
  course_fee: number | string;
  admission_fee: number | string;
  payment_type?: string | null;
  duration?: string;
  target_group?: string;
  target_group_en?: string;
  overview?: string;
  overview_en?: string;
  objectives?: string;
  objectives_en?: string;
  training_methodology?: string;
  training_methodology_en?: string;
  evaluation_system?: string;
  evaluation_system_en?: string;
  prerequisite?: string;
  prerequisite_en?: string;
  eligibility?: string;
  eligibility_en?: string;
  cover_image?: string;
  row_status?: string;
  crated_by?: string;
  updated_by?: string;
  deleted_at?: string;
  dynamic_form_field: string | object;
  application_form_settings: string | object;
  course_type?: number;
  age_min?: number | string;
  age_max?: number | string;
  is_entrepreneurship?: number;
}

export interface IMaterial {
  file_path: string;
  apprenticeship_id?: number | string | null;
}

export interface IBranch extends IIdTitleCreateUpdateAt {
  institute_id?: number | string;
  institute_title_en?: string;
  address?: string;
  address_en?: string;
  loc_division_id?: number | string | null;
  loc_district_id?: number | string | null;
  loc_union_id?: number | string | null;
  loc_upazila_municipality_id?: number | string | null;
  district_or_city_corporation: number | string | null;
  loc_upazila_municipality_type?: string | number | null;
  loc_city_corporation_id?: string | number | null;
  village_ward_area?: string | number | null;
  village_ward_area_en?: string | number | null;
  google_map_src?: string;
  row_status?: string;
  deleted_at?: string;
}

export interface ITrainingCenter extends IIdTitleCreateUpdateAt {
  institute_id?: number | string;
  industry_association_id?: number | string;
  branch_id?: number | string;
  loc_division_id?: number | string;
  loc_district_id?: number | string;
  loc_union_id?: number | string;
  loc_upazila_municipality_id?: number | string;
  district_or_city_corporation: number | string;
  loc_upazila_municipality_type?: string | number | null;
  loc_city_corporation_id?: string | number | null;
  village_ward_area?: string | null;
  village_ward_area_en?: string | null;
  location_latitude?: string;
  location_longitude?: string;
  address_en?: string;
  center_location_type?: number | string;
  address?: string;
  google_map_src?: string;
  row_status?: string;
  deleted_at?: string;
  bank_name?: string;
  branch_name?: string;
  routing_number?: string | number;
  account_name?: string;
  account_number?: string | number;
  contact_person_name?: string;
  mobile_number?: string | number;
}

export interface ITrainer extends IIdHolder, ICreateUpdateAt {
  institute_id?: number | string;
  industry_association_id?: number | string;
  trainer_first_name_en?: string;
  trainer_first_name: string;
  trainer_last_name_en?: string;
  trainer_last_name: string;
  branch_id?: number | string;
  role_id: number | string;
  training_center_id?: number | string;
  trainer_registration_number: number | string;
  email: string;
  mobile: string;
  date_of_birth: string | null;
  about_me?: string;
  about_me_en?: string;
  gender: number | string;
  marital_status: number | string;
  religion?: number | string;
  nationality: string;
  nid?: string;
  passport_number?: string;
  present_address_division_id?: string | number;
  present_address_district_or_city_corporation?: string;
  present_address_district_id?: string | number;
  present_address_upazila_municipality_id?: string | number;
  present_address_city_corporation_id?: string | number;
  present_address_union_id?: string | number;
  present_address_village_ward_area?: string;
  present_address_village_ward_area_en?: string;
  permanent_address_division_id?: string | number;
  permanent_address_district_or_city_corporation?: string;
  permanent_address_district_id?: string | number;
  permanent_address_upazila_municipality_id?: string | number;
  permanent_address_city_corporation_id?: string | number;
  permanent_address_union_id?: string | number;
  permanent_address_village_ward_area?: string;
  permanent_address_village_ward_area_en?: string;
  educational_qualification?: string;
  educational_qualification_en?: string;
  photo?: string;
  signature?: string;
  skills?: Array<any>;
  subject: string;
  subject_en?: string;
  row_status?: string;
  is_same_as_present_address?: boolean | number;
}

export interface IBatch extends IIdTitleCreateUpdateAt {
  institute_id?: number | string;
  industry_association_id?: number | string;
  course_id: number | string;
  training_center_id?: number | string;
  branch_id?: number | string;
  number_of_seats: number | string;
  available_seats: number | string;
  registration_start_date: string;
  registration_end_date: string;
  batch_start_date: string;
  batch_end_date: string;
  row_status?: string;
  certificate_id?: number;
  certificate_templates?: Array<any>;
  trainers?: Array<number>;
  crated_by?: string;
  updated_by?: string;
  deleted_at?: string;
}

export interface ICourseEmployment extends IIdTitleCreateUpdateAt {
  employment_status?: number | string;
  course_enrollment_id?: number | string;
}

export interface IApprenticeshipBatch extends IIdTitleCreateUpdateAt {
  organization_id?: number | string;
  course_id: number | string;
  number_of_seats: number | string;
  available_seats: number | string;
  registration_start_date: string;
  registration_end_date: string;
  batch_start_date: string;
  batch_end_date: string;
  row_status?: string;
  crated_by?: string;
  updated_by?: string;
  deleted_at?: string;
}

export interface IBatchCertificateTemplates {
  certificate_template_id: number;
  batch_id: number;
}

export interface IBatchCertificateTemplatesView
  extends IBatchCertificateTemplates {
  certificate_templates: any;
}

export interface IApplication extends IIdHolder, ICreateUpdateAt {
  Gender: string;
  full_name: string;
  course_name: string;
  username: string;
  user_name_type: number;
  first_name: string;
  last_name: string;
  gender: number;
  email: string;
  mobile: string;
  date_of_birth: string;
  physical_disability_status: number;
  loc_division_id: number;
  loc_district_id: number;
  row_status?: number;
  approval_status: string;
  accepted: number;
  rejected: number;
}

export interface IApprenticeshipReport {
  organization_id: number | string;
  year?: number | string;
  month?: number | string;
  name_of_best_student?: string;
  best_workplace_name?: string;
  class_material_learned_from?: string;
  total_class?: number | string;
  attendance_rate?: number | string;
  total_drop_out?: number | string;
}

export interface IPermissionSubGroupAssignInstitute {
  permission_sub_group_id: number | string | null;
}

export interface IExamSubject extends IIdTitleCreateUpdateAt {
  title: string;
  accessor_type?: string;
  accessor_id?: number | string;
  row_status?: number | string;
}
