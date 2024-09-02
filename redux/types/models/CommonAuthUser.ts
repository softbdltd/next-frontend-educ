import {AuthType} from '../../../shared/constants/AppEnums';
import {Gender} from '../../../@core/utilities/Genders';
import {MaritalStatusType} from '../../../@core/utilities/MaritalStatus';
import {FreedomFighterStatusType} from '../../../@core/utilities/FreedomFighterStatus';
import {Religion} from '../../../@core/utilities/Religions';
import {IdentityNumberType} from '../../../@core/utilities/IdentityNumberTypes';
import {EthnicGroupStatusType} from '../../../@core/utilities/EthnicGroupStatus';
import {IOrganization} from '../../../shared/Interface/organization.interface';
import {IInstitute} from '../../../shared/Interface/institute.interface';
import {IRole} from '../../../shared/Interface/userManagement.interface';

export interface AuthUser {
  uid: string;
  userType:
    | 'system'
    | 'institute'
    | 'organization'
    | 'learner'
    | 'Coordinator'
    | 'rpl-trainer';
  displayName?: string;
  email?: string;
  username: string;
  authType: AuthType;
  photoURL?: string;
  isYouthUser: boolean;
  isSystemUser: boolean;
  isInstituteUser: boolean;
  isTrainingCenterUser: boolean;
  isOrganizationUser: boolean;
  isIndustryAssociationUser: boolean;
  isRegisteredTrainingOrganizationUser: boolean;
  isFourIrlUser: boolean;
  isMinistryUser: boolean;
  isCoordinatorUser: boolean;
  isRplTrainerUser: boolean;
}

export interface CommonAuthUser extends AuthUser {
  userId: string | number;
  idp_user_id: string;
  institute_id?: string | number;
  organization_id?: string | number;
  institute?: IInstitute | any;
  organization?: IOrganization | any;
  role: IRole | any;
  permissions: string[];
  mobile?: string;
  institute_user_type?: string;
  training_center_id?: number;
  branch_id?: number;
  profile_pic?: string;
  name?: string;
  industry_association_id?: string | number | undefined;
  industry_association?: any;
  registered_training_organization_id?: string | number | undefined;
  registered_training_organization?: any;
  domain?: string;
  learnerId?: number | string;
  learner_subscriptions?: any[];
}

export interface YouthAuthUser extends AuthUser {
  learnerId: string | number;
  learnerCode?: string;
  first_name: string;
  first_name_en?: string;
  last_name: string;
  last_name_en?: string;
  gender: Gender;
  mobile: string;
  user_name_type: number;
  idp_user_id: string;
  admin_access_type?: any;
  learner_auth_source?: number;
  date_of_birth: string;
  physical_disability_status: number;
  marital_status: MaritalStatusType;
  freedom_fighter_status: FreedomFighterStatusType;
  religion: Religion;
  nationality?: string | number;
  identity_number_type: IdentityNumberType;
  identity_number?: string;
  does_belong_to_ethnic_group?: EthnicGroupStatusType;
  is_freelance_profile: number;
  nurse_status: number | null;
  learner_nurse: any;
  loc_division_id?: string;
  division_title_en?: string;
  division_title?: string;
  loc_district_id?: string;
  district_title_en?: string;
  district_title?: string;
  loc_city_corporation_id: string;
  city_corporation_title?: string;
  city_corporation_title_en?: string;
  loc_union_id: string;
  union_title: string;
  union_title_en: string;
  district_or_city_corporation: string;
  loc_upazila_municipality_type: string;
  village_ward_area: string;
  village_ward_area_en: string;
  loc_upazila_municipality_id: string;
  upazila_municipality_title?: string;
  upazila_municipality_title_en?: string;
  village_or_area?: string;
  village_or_area_en?: string;
  house_n_road?: string;
  house_n_road_en?: string;
  zip_or_postal_code?: string;
  bio?: string;
  bio_en?: string;
  photo?: string;
  cv_path?: string;
  physical_disabilities?: any[];
  languages_proficiencies?: any[];
  skills?: any[];
  educations?: any[];
  job_experiences?: any[];
  certifications?: any[];
  addresses?: any[];
  total_certificates?: number;
  portfolios?: any[];
  profile_completed?: any;
  total_job_experience?: any;
  signature_image_path?: string;
  expected_salary?: any;
  job_level?: any;
  default_cv_template?: any;
  guardians: any[];
  nid_brn_verified_at: string;
  learner_subscriptions?: any[];
  total_passed_rpl_assessments?: number;
}

// @ts-ignore
export interface AllAuthUser extends CommonAuthUser, YouthAuthUser {}
