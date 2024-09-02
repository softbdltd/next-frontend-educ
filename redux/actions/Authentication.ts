import axios from 'axios';
import {Base64} from 'js-base64';
import {NextRouter} from 'next/router';
import {Dispatch} from 'redux';
import {apiGet} from '../../@core/common/api';
import {
  API_SSO_AUTHORIZE_CODE_GRANT,
  API_USERS,
  API_LEARNER_PROFILE,
} from '../../@core/common/apiRoutes';
import {
  getHostUrl,
  getRPLRedirectUrl,
  paramsBuilder,
} from '../../@core/common/SSOConfig';
import {refreshAuthAccessToken} from '../../@core/libs/axiosInstance';
import {
  clearAllCookies,
  getAppAccessTokenFromCookie,
  getAuthAccessTokenFromCookie,
  getAuthRefreshTokenFromCookie,
  getIdTokenFromCookie,
} from '../../@core/libs/cookieHelpers';
import {
  getBrowserCookie,
  removeBrowserCookie,
  setBrowserCookie,
} from '../../@core/libs/cookieInstance';
import UserTypes from '../../@core/utilities/UserTypes';
import {
  COOKIE_KEY_AUTH_ACCESS_TOKEN,
  COOKIE_KEY_AUTH_ACCESS_TOKEN_RPL,
  COOKIE_KEY_AUTH_ID_TOKEN,
  COOKIE_KEY_AUTH_ID_TOKEN_RPL,
  COOKIE_KEY_AUTH_REFRESH_TOKEN,
  COOKIE_KEY_AUTH_REFRESH_TOKEN_RPL,
  COOKIE_KEY_SSO_SESSION_STATE,
  COOKIE_KEY_SSO_SESSION_STATE_RPL,
  COOKIE_KEY_USER_DOMAIN,
  COOKIE_KEY_LEARNER_USER_AS_TRAINER,
} from '../../shared/constants/AppConst';
import {AuthType} from '../../shared/constants/AppEnums';
import {
  TAuthUserSSOResponse,
  TOnSSOSignInCallback,
  TYouthAuthUserSSOResponse,
} from '../../shared/Interface/IAuthentication';
import {AppActions} from '../types';
import {
  SET_AUTH_ACCESS_TOKEN_DATA,
  SIGNOUT_AUTH_SUCCESS,
  UPDATE_AUTH_USER,
} from '../types/actions/Auth.actions';
import {CommonAuthUser, YouthAuthUser} from '../types/models/CommonAuthUser';
import {fetchError, fetchStart, fetchSuccess} from './Common';

type TOnSSOSignInCallbackCode = string;

export const onSSOSignInCallback = (
  code: TOnSSOSignInCallbackCode,
  redirected_from?: string,
  session_state?: string,
  router?: NextRouter,
) => {
  return async (dispatch: Dispatch<AppActions>) => {
    const redirectUrl = new URL(getHostUrl() + '/callback');
    if (redirected_from) {
      redirectUrl.search = paramsBuilder({redirected_from: redirected_from});
    }

    /*
        const apiKey = process.env.NEXT_PUBLIC_BACK_CHANNEL_API_KEY
          ? process.env.NEXT_PUBLIC_BACK_CHANNEL_API_KEY
          : null;
    */

    console.log('urlHost', API_SSO_AUTHORIZE_CODE_GRANT);

    try {
      const {data: tokenData}: {data: TOnSSOSignInCallback} = await axios.post(
        API_SSO_AUTHORIZE_CODE_GRANT,
        {
          code,
          redirect_uri: redirectUrl.toString(),
        },
      );

      console.log('on SSOSignIn Callback', tokenData);

      let expireDate = new Date();
      expireDate.setTime(
        new Date().getTime() + Number(tokenData.expires_in) * 1000,
      );

      await setBrowserCookie(COOKIE_KEY_SSO_SESSION_STATE, session_state);

      await setBrowserCookie(
        COOKIE_KEY_AUTH_ACCESS_TOKEN,
        tokenData?.access_token,
        {expires: expireDate},
      );



      await setBrowserCookie(
        COOKIE_KEY_AUTH_REFRESH_TOKEN,
        tokenData?.refresh_token,
      );

      await setBrowserCookie(COOKIE_KEY_AUTH_ID_TOKEN, tokenData?.id_token, {
        expires: expireDate,
      });


      // setDefaultAuthorizationHeader(tokenData?.access_token);

      let idTokenData = JSON.parse(
        Base64.decode((tokenData.id_token || '..').split('.')[1]),
      );

      /* If mentor or assessor user the redirect to RPL */
      await dispatch(setAuthAccessTokenData(tokenData));
      await loadAuthUser(dispatch, tokenData);
    } catch (err: any) {
      console.log('onSSOSignInCallback - error!!!!', err);
      dispatch(fetchError(err));
    }
  };
};

/** TODO: This Function should not be here */
export const loadAuthUser = async (
  dispatch: Dispatch<AppActions | any>,
  tokenData: any,
) => {
  console.log('loadAuthUser() - tokenData - ', tokenData);
  dispatch(fetchStart());
  try {
    let ssoTokenData = JSON.parse(
      Base64.decode((tokenData.id_token || '..').split('.')[1]),
    );
    console.log('ssoTokenData: ', ssoTokenData);
    const appAccessTokenData = getAppAccessTokenFromCookie();
    console.log('permission call: appAccessTokenData', appAccessTokenData);
    const isYouthAsTrainerUser = getBrowserCookie(
      COOKIE_KEY_LEARNER_USER_AS_TRAINER,
    );

    let specialCheckForCdap = false;
    if (!ssoTokenData.user_type) {
      const authRefreshToken = getAuthRefreshTokenFromCookie();
      const authAccessToken = getAuthAccessTokenFromCookie();
      if (authRefreshToken && authRefreshToken != 'undefined') {
        await refreshAuthAccessToken();
        let idToken = getIdTokenFromCookie();
        ssoTokenData = JSON.parse(
          Base64.decode((idToken || '..').split('.')[1]),
        );
        tokenData.access_token = getAuthAccessTokenFromCookie();
        console.log('updated ssoTokenData: ', ssoTokenData);
      } else if (authAccessToken && authRefreshToken == 'undefined') {
        specialCheckForCdap = true;
      }
    }

    //TODO: This api will be '/user-profile or /auth-profile'
    const coreResponse =
      specialCheckForCdap ||
      !ssoTokenData.user_type ||
      (ssoTokenData.user_type == UserTypes.LEARNER_USER && !isYouthAsTrainerUser)
        ? await apiGet(API_LEARNER_PROFILE, {
            headers: {
              Authorization: 'Bearer ' + appAccessTokenData?.access_token,
              'User-Token': 'Bearer ' + tokenData.access_token,
            },
          })
        : await apiGet(API_USERS + `/${ssoTokenData.sub}/permissions`, {
            headers: {
              Authorization: 'Bearer ' + appAccessTokenData?.access_token,
              'User-Token': 'Bearer ' + tokenData.access_token,
            },
          });
    console.log(coreResponse);

    const {data} = coreResponse.data;
    dispatch(fetchSuccess());
    dispatch({
      type: UPDATE_AUTH_USER,
      payload:
        specialCheckForCdap ||
        !ssoTokenData.user_type ||
        (ssoTokenData.user_type == UserTypes.LEARNER_USER &&
          !isYouthAsTrainerUser)
          ? getYouthAuthUserObject({...ssoTokenData, ...data})
          : getCommonAuthUserObject({...ssoTokenData, ...data}),
    });

    if (data?.domain) {
      setBrowserCookie(COOKIE_KEY_USER_DOMAIN, data.domain);
    } else {
      removeBrowserCookie(COOKIE_KEY_USER_DOMAIN);
    }
  } catch (err: any) {
    console.log('error!!!!', err);
    dispatch(fetchError(err));
  }
};

export const setAuthAccessTokenData = (
  data: TOnSSOSignInCallback,
): AppActions | any => ({
  type: SET_AUTH_ACCESS_TOKEN_DATA,
  payload: data,
});

export const getCommonAuthUserObject = (
  authUser: TAuthUserSSOResponse,
): CommonAuthUser => {
  return {
    userId: authUser?.user_id,
    isYouthUser: false,
    idp_user_id: authUser?.idp_user_id,
    domain: authUser?.domain,
    isSystemUser: authUser?.isSystemUser,
    isInstituteUser: authUser?.isInstituteUser,
    isTrainingCenterUser:
      authUser?.isInstituteUser && authUser?.training_center_id != null,
    isOrganizationUser: authUser?.isOrganizationUser,
    isIndustryAssociationUser: authUser.isIndustryAssociationUser,
    isRegisteredTrainingOrganizationUser:
      authUser?.isRegisteredTrainingOrganizationUser,
    isFourIrlUser: authUser?.isFourIrlUser,
    isCoordinatorUser: authUser?.isCoordinatorUser,
    isMinistryUser: authUser?.isMinistryUser,
    isRplTrainerUser: authUser?.isRplTrainerUser,
    userType: authUser?.userType,
    institute_id: authUser?.institute_id,
    institute: authUser?.institute,
    organization_id: authUser?.organization_id,
    organization: authUser?.organization,
    authType: AuthType.AUTH2,
    displayName: authUser?.displayName,
    email: authUser?.email,
    mobile: authUser?.mobile,
    role: authUser?.role,
    uid: authUser.sub,
    username: authUser.username,
    permissions: authUser.permissions,
    profile_pic: authUser?.profile_pic,
    name: authUser?.name,
    institute_user_type: authUser?.institute_user_type,
    training_center_id: authUser?.training_center_id,
    branch_id: authUser?.branch_id,
    industry_association_id: authUser?.industry_association_id,
    industry_association: authUser?.industry_association,
    registered_training_organization_id:
      authUser?.registered_training_organization_id,
    registered_training_organization:
      authUser?.registered_training_organization,
  };
};

export const getYouthAuthUserObject = (
  authUser: TYouthAuthUserSSOResponse,
): YouthAuthUser => {
  return {
    isYouthUser: true,
    userType: authUser?.userType,
    authType: AuthType.AUTH2,
    displayName: authUser?.displayName,
    isSystemUser: false,
    isInstituteUser: false,
    isTrainingCenterUser: false,
    isRplTrainerUser: false,
    isOrganizationUser: false,
    isIndustryAssociationUser: false,
    isRegisteredTrainingOrganizationUser: false,
    isFourIrlUser: false,
    isCoordinatorUser: false,
    isMinistryUser: false,
    email: authUser?.email,
    idp_user_id: authUser?.idp_user_id,
    uid: authUser?.sub,
    learnerId: authUser?.id,
    learnerCode: authUser?.code,
    admin_access_type: authUser?.admin_access_type,
    learner_auth_source: authUser?.learner_auth_source,
    username: authUser?.username,
    date_of_birth: authUser?.date_of_birth,
    first_name: authUser?.first_name,
    gender: authUser?.gender,
    freedom_fighter_status: authUser?.freedom_fighter_status,
    identity_number_type: authUser?.identity_number_type,
    identity_number: authUser?.identity_number,
    marital_status: authUser?.marital_status,
    religion: authUser?.religion,
    nationality: authUser?.nationality,
    does_belong_to_ethnic_group: authUser?.does_belong_to_ethnic_group,
    is_freelance_profile: authUser?.is_freelance_profile,
    nurse_status: authUser?.nurse_status,
    learner_nurse: authUser?.learner_nurse,
    last_name: authUser?.last_name,
    last_name_en: authUser?.last_name_en,
    mobile: authUser?.mobile,
    user_name_type: authUser?.user_name_type,
    first_name_en: authUser?.first_name_en,
    physical_disability_status: authUser?.physical_disability_status,
    loc_division_id: authUser?.loc_division_id,
    division_title_en: authUser?.division_title_en,
    division_title: authUser?.division_title,
    loc_district_id: authUser?.loc_district_id,
    district_title_en: authUser?.district_title_en,
    district_title: authUser?.district_title,
    loc_city_corporation_id: authUser?.loc_city_corporation_id,
    city_corporation_title: authUser?.city_corporation_title,
    city_corporation_title_en: authUser?.city_corporation_title_en,
    loc_union_id: authUser?.loc_union_id,
    union_title: authUser?.union_title,
    union_title_en: authUser?.union_title_en,
    district_or_city_corporation: authUser?.district_or_city_corporation,
    loc_upazila_municipality_type: authUser?.loc_upazila_municipality_type,
    village_ward_area: authUser?.village_ward_area,
    village_ward_area_en: authUser?.village_ward_area_en,
    loc_upazila_municipality_id: authUser?.loc_upazila_municipality_id,
    upazila_municipality_title: authUser?.upazila_municipality_title,
    upazila_municipality_title_en: authUser?.upazila_municipality_title_en,
    village_or_area: authUser?.village_or_area,
    village_or_area_en: authUser?.village_or_area_en,
    house_n_road: authUser?.house_n_road,
    house_n_road_en: authUser?.house_n_road_en,
    zip_or_postal_code: authUser?.zip_or_postal_code,
    bio: authUser?.bio,
    bio_en: authUser?.bio_en,
    photo: authUser?.photo,
    signature_image_path: authUser?.signature_image_path,
    cv_path: authUser?.cv_path,
    physical_disabilities: authUser?.physical_disabilities,
    skills: authUser?.skills,
    total_certificates: authUser?.learner_certifications?.length,
    certifications: authUser?.learner_certifications,
    educations: authUser?.learner_educations,
    portfolios: authUser?.learner_portfolios,
    languages_proficiencies: authUser?.learner_languages_proficiencies,
    profile_completed: authUser?.profile_completed,
    total_job_experience: authUser?.total_job_experience,
    addresses: authUser?.learner_addresses,
    expected_salary: authUser?.expected_salary,
    job_level: authUser?.job_level,
    default_cv_template: authUser?.default_cv_template,
    guardians: authUser?.learner_guardians,
    //nid_brn_verified_at: authUser?.nid_brn_verified_at,// TODO:: Temporary disabled on 19-10-2023
    nid_brn_verified_at: '2023-10-12T12:19:07',
    learner_subscriptions: authUser?.learner_subscriptions,
    total_passed_rpl_assessments: authUser?.total_passed_rpl_assessments,
  };
};

export const signOut = () => {
  return (dispatch: Dispatch<AppActions | any>) => {
    dispatch(fetchStart());
    dispatch({type: SIGNOUT_AUTH_SUCCESS});
    clearAllCookies();
    dispatch(fetchSuccess());
    console.log('logged out.');
  };
};

/**
 * @deprecated use Signout() instead
 */
export const onJWTAuthSignout = () => {
  return signOut();
};
