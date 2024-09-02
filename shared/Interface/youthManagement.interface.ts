import {ICreateUpdateAt, IIdHolder, IIdTitles} from './common.interface';
import {TYouthAuthUserSSOResponse} from './IAuthentication';

export interface IYouthJobExperience extends IIdHolder {
  learner_id?: number;
  company_name: string;
  company_name_en?: string;
  employment_type_id: number | string;
  position: string;
  position_en?: string;
  start_date: string;
  end_date?: string;
  location: string;
  location_en?: string;
  job_responsibilities?: string;
  job_responsibilities_en?: string;
  is_currently_working?: number;
}

export interface IYouthPersonalInfoCV extends TYouthAuthUserSSOResponse {
  learner_addresses: any[] | undefined;
}

export interface IYouthEducation extends IIdHolder {
  education_level_id: string | number;
  education_level_title?: string;
  education_level_title_en?: string;
  exam_degree_id?: string | number;
  exam_degree_title?: string;
  exam_degree_title_en?: string;
  exam_degree_name?: string;
  exam_degree_name_en?: string;
  major_or_concentration?: string;
  major_or_concentration_en?: string;
  edu_board_id?: string | number;
  board_title?: string;
  board_title_en?: string;
  edu_group_id?: string | number;
  edu_group_title?: string;
  edu_group_title_en?: string;
  institute_name: string;
  institute_name_en?: string;
  is_foreign_institute: number;
  foreign_institute_country_id?: string | number;
  result: {
    id: number;
    code: string;
    title: string;
    title_en: string;
  };
  marks_in_percentage?: string | number;
  cgpa_scale?: string | number;
  cgpa?: string | number;
  year_of_passing?: string | number;
  expected_year_of_passing?: string | number;
  duration?: string | number;
  achievements?: string;
  achievements_en?: string;
}

export interface IYouthReference extends IIdHolder {
  learner_id?: number;
  referrer_first_name_en?: string;
  referrer_first_name: string;
  referrer_last_name_en?: string;
  referrer_last_name: string;
  referrer_organization_name_en?: string;
  referrer_organization_name: string;
  referrer_designation_en?: string;
  referrer_designation: string;
  referrer_address_en?: string;
  referrer_address: string;
  referrer_email: string;
  referrer_mobile: string;
  referrer_relation_en?: string;
  referrer_relation: string;
}

export interface IYouthCertificate extends IIdHolder {
  learner_id?: number;
  certification_name: string;
  certification_name_en?: string;
  company_name_en?: string;
  institute_name: string;
  institute_name_en?: string;
  location: string;
  location_en?: string;
  start_date?: string;
  end_date?: string;
  certificate_file_path: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface IYouthLanguageProficiency extends IIdHolder {
  learner_id?: number;
  language_id: number | string;
  language_title?: string;
  language_title_en?: string;
  lang_code?: string;
  reading_proficiency_level: number | string;
  writing_proficiency_level: number | string;
  speaking_proficiency_level: number | string;
  understand_proficiency_level: number | string;
}

export interface IYouthPortfolio extends IIdTitles {
  learner_id?: number;
  description?: string;
  description_en?: string;
  file_path?: string;
}

export interface IGuardian extends IIdHolder, ICreateUpdateAt {
  learner_id: string;
  name: string;
  name_en?: string;
  nid?: string;
  mobile?: string;
  date_of_birth?: string;
  relationship_type: any;
  relationship_title?: string;
  relationship_title_en?: string;
  deleted_at?: string;
}
