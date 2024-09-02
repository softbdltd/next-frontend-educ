//import {Base64} from 'js-base64';
import axios from 'axios';
import {Dispatch} from 'redux';
import {apiGet} from '../../@core/common/api';
import {API_LEARNER_EXIST_CHECK} from '../../@core/common/apiRoutes';
import {
  LINK_FRONTEND_LEARNER_FEED,
  LINK_LEARNER_CDAP_SIGNUP_FAILED,
  LINK_LEARNER_SIGNUP_CDAP,
} from '../../@core/common/appLinks';
import {
  API_CDAP_USER_INFO,
  getCDAPLoginUrl,
} from '../../@core/common/CDAPConfig';
import {educDomain, learnerDomain} from '../../@core/common/constants';
import {DistrictOrCityCorporation} from '../../@core/components/AddressFormComponent/addressEnum';
import {setDefaultAuthorizationHeader} from '../../@core/libs/axiosInstance';
import {getAppAccessTokenFromCookie} from '../../@core/libs/cookieHelpers';
import {
  getBrowserCookie,
  removeBrowserCookie,
  setBrowserCookie,
} from '../../@core/libs/cookieInstance';
import Genders from '../../@core/utilities/Genders';
import {objectFilter} from '../../@core/utilities/helpers';
import IdentityNumberTypes from '../../@core/utilities/IdentityNumberTypes';
import PhysicalDisabilityStatus from '../../@core/utilities/PhysicalDisabilityStatus';
import RowStatus from '../../@core/utilities/RowStatus';
import UserNameType from '../../@core/utilities/UserNameType';
import {getAllDistricts} from '../../services/locationManagement/DistrictService';
//import {learnerRegistrationCDAP} from '../../services/learnerManagement/YouthRegistrationService';
import {getAllDivisions} from '../../services/locationManagement/DivisionService';
import {getAllUpazilas} from '../../services/locationManagement/UpazilaService';
import {
  COOKIE_KEY_AUTH_ACCESS_TOKEN,
  COOKIE_KEY_AUTH_ID_TOKEN,
  COOKIE_KEY_AUTH_REFRESH_TOKEN,
  COOKIE_KEY_CDAP_ACCESS_TOKEN,
  COOKIE_KEY_CDAP_ID_TOKEN,
  COOKIE_KEY_CDAP_SESSION_STATE,
  COOKIE_KEY_CDAP_USER_DATA,
  COOKIE_KEY_TEMP_CALLBACK_INFO,
  COOKIE_KEY_TEMP_ID_TOKEN,
} from '../../shared/constants/AppConst';
import {AppActions} from '../types';
//import {getHostUrl, paramsBuilder} from '../../@core/common/SSOConfig';
import {loadAuthUser, setAuthAccessTokenData} from './Authentication';

export const onCDAPSignInCallbackV2 = (
  callBackInfo: any,
  router: any,
  redirected_from?: string,
) => {
  return async (dispatch: Dispatch<AppActions>) => {
    console.log('CALLBACK INFO:', callBackInfo);
    const appAccessTokenData = getAppAccessTokenFromCookie();

    try {
      const cdapIdToken = getBrowserCookie(COOKIE_KEY_CDAP_ID_TOKEN);
      const cdapAccessToken = getBrowserCookie(COOKIE_KEY_CDAP_ACCESS_TOKEN);

      let CDAPUserData = null;

      try {
        const {data}: any = await axios.get(API_CDAP_USER_INFO, {
          headers: {
            Authorization: `Bearer ${cdapAccessToken}`,
          },
        });

        if (data?.data) {
          CDAPUserData = data.data;
        } else {
          console.log('Failed to fetch CDAP userinfo');
        }
      } catch (error: any) {
        console.log('CDAP userinfo fetch error -> ', error);
      }

      console.log('CDAPUserData: ', CDAPUserData);

      if (CDAPUserData == null) {
        router.push({
          pathname: educDomain() + LINK_LEARNER_CDAP_SIGNUP_FAILED,
          query: {error: 'user_fetch_error'},
        });
      } else {
        let expireDate = new Date();
        expireDate.setTime(
          new Date().getTime() + Number(callBackInfo?.expires_in) * 1000,
        );

        const {data: userInfo}: {data: any} = await apiGet(
          API_LEARNER_EXIST_CHECK,
          {
            headers: {
              Authorization: 'Bearer ' + appAccessTokenData?.access_token,
              'User-Token': 'Bearer ' + callBackInfo?.access_token,
            },
          },
        );

        await setBrowserCookie(COOKIE_KEY_CDAP_ACCESS_TOKEN, cdapAccessToken, {
          expires: expireDate,
        });
        await setBrowserCookie(COOKIE_KEY_CDAP_ID_TOKEN, cdapIdToken, {
          expires: expireDate,
        });

        if (!userInfo?.data?.learner_exist) {
          await loginAsCDAPUserOrSignup(CDAPUserData, callBackInfo, router);
        } else {
          await setBrowserCookie(
            COOKIE_KEY_CDAP_SESSION_STATE,
            callBackInfo?.session_state,
          );

          await setBrowserCookie(
            COOKIE_KEY_AUTH_ACCESS_TOKEN,
            callBackInfo?.access_token,
            {expires: expireDate},
          );
          if (callBackInfo?.refresh_token) {
            await setBrowserCookie(
              COOKIE_KEY_AUTH_REFRESH_TOKEN,
              callBackInfo?.refresh_token,
            );
          }
          await setBrowserCookie(
            COOKIE_KEY_AUTH_ID_TOKEN,
            callBackInfo?.id_token,
            {
              expires: expireDate,
            },
          );

          removeBrowserCookie(COOKIE_KEY_TEMP_ID_TOKEN);
          removeBrowserCookie(COOKIE_KEY_TEMP_CALLBACK_INFO);
          setDefaultAuthorizationHeader(callBackInfo?.access_token);

          await dispatch(setAuthAccessTokenData(callBackInfo));
          await loadAuthUser(dispatch, callBackInfo);
          await router.push(learnerDomain() + LINK_FRONTEND_LEARNER_FEED);
        }
      }
    } catch (err: any) {
      console.log('onSSOSignInCallback - error!!!!', err);
    }
  };
};

export const onCDAPSSOCallbackV2 = (cdapCallbackInfo: any, router: any) => {
  return async () => {
    try {
      console.log('CDAP SSO CALLBACK INFO V2:', cdapCallbackInfo);

      let expireDate = new Date();
      expireDate.setTime(new Date().getTime() + Number(3600) * 1000);

      await setBrowserCookie(
        COOKIE_KEY_CDAP_ACCESS_TOKEN,
        cdapCallbackInfo?.access_token,
        {expires: expireDate},
      );
      await setBrowserCookie(
        COOKIE_KEY_CDAP_ID_TOKEN,
        cdapCallbackInfo?.id_token,
        {expires: expireDate},
      );

      console.log('CDAP Login Url-> ', getCDAPLoginUrl());

      await router.push(getCDAPLoginUrl());
    } catch (err: any) {
      console.log('onCDAPSSOCallbackV2 - error!!!!', err);
    }
  };
};

const getCDAPGender = (genderText: string) => {
  switch (genderText) {
    case 'Male':
      return Genders.MALE;
    case 'Female':
      return Genders.FEMALE;
    default:
      return Genders.OTHERS;
  }
};

const loginAsCDAPUserOrSignup = async (
  CDAPUserData: any,
  callbackInfo: any,
  router: any,
) => {
  try {
    let name = CDAPUserData?.name || CDAPUserData?.name_en;
    let nameEn = CDAPUserData?.name_en;

    let data: any = {};

    if (name) {
      let nameAr = name?.split(' ') || [];
      if (nameAr.length == 1) {
        data.first_name = nameAr.pop();
      } else {
        data.last_name = nameAr.pop();
        data.first_name = nameAr.join(' ').trim();
      }
    }

    if (nameEn) {
      let nameEnAr = nameEn?.split(' ') || [];
      if (nameEnAr.length == 1) {
        data.first_name_en = nameEnAr.pop();
      } else {
        data.last_name_en = nameEnAr.pop();
        data.first_name_en = nameEnAr.join(' ').trim();
      }
    }

    if (CDAPUserData?.gender) {
      data.gender = getCDAPGender(CDAPUserData?.gender);
    }

    if (CDAPUserData?.date_of_birth) {
      data.date_of_birth = CDAPUserData.date_of_birth;
    }

    if (CDAPUserData?.mobile) {
      data.mobile =
        String(CDAPUserData?.mobile).length == 10
          ? '0' + CDAPUserData?.mobile
          : CDAPUserData?.mobile;
    }

    data = objectFilter(data);

    console.log('data after basic->', {...data});

    data.user_name_type = UserNameType.MOBILE;
    data.physical_disability_status = PhysicalDisabilityStatus.NO;

    if (CDAPUserData?.email) {
      data.email = CDAPUserData.email.toLowerCase();
    }

    if (CDAPUserData?.nid) {
      data.identity_number_type = IdentityNumberTypes.NID;
      data.identity_number = String(CDAPUserData?.nid);
    }

    let [divisions, districts, upazilas] = await Promise.all([
      getAllDivisions({row_status: RowStatus.ACTIVE}),
      getAllDistricts({row_status: RowStatus.ACTIVE}),
      getAllUpazilas({row_status: RowStatus.ACTIVE}),
    ]);

    if (CDAPUserData?.division && divisions && divisions?.data) {
      let division = divisions.data.find(
        (div: any) =>
          div?.title?.trim() == CDAPUserData.division.trim() ||
          div?.title_en?.trim() == CDAPUserData.division.trim(),
      );
      if (division) {
        data.loc_division_id = division.id;
      }
    }

    if (CDAPUserData?.district && districts && districts?.data) {
      let district = districts.data.find(
        (dist: any) =>
          dist.loc_division_id == data.loc_division_id &&
          (dist?.title?.trim() == CDAPUserData.district.trim() ||
            dist?.title_en?.trim() == CDAPUserData.district.trim()),
      );

      if (district) {
        data.district_or_city_corporation = DistrictOrCityCorporation.DISTRICT;
        data.loc_district_id = district.id;
      }
    }

    if (CDAPUserData?.upazila && upazilas && upazilas?.data) {
      let upazila = upazilas.data.find(
        (dist: any) =>
          dist.loc_district_id == data.loc_district_id &&
          (dist?.title?.trim() == CDAPUserData.upazila.trim() ||
            dist?.title_en?.trim() == CDAPUserData.upazila.trim()),
      );

      if (upazila) {
        data.loc_upazila_municipality_id = upazila.id;
      }
    }

    data.guardian_info = {};
    if (CDAPUserData?.father_name || CDAPUserData?.father_name_en) {
      data.guardian_info.father_name =
        CDAPUserData?.father_name ?? CDAPUserData?.father_name_en;
      data.guardian_info.father_name_en = CDAPUserData?.father_name_en;
    }

    if (CDAPUserData?.mother_name || CDAPUserData?.mother_name_en) {
      data.guardian_info.mother_name =
        CDAPUserData?.mother_name ?? CDAPUserData?.mother_name_en;
      data.guardian_info.mother_name_en = CDAPUserData?.mother_name_en;
    }

    if (Object.keys(data.guardian_info).length == 0) {
      delete data.guardian_info;
    }

    let expireDate = new Date();
    expireDate.setTime(
      new Date().getTime() + Number(callbackInfo?.expires_in) * 10000,
    );

    await setBrowserCookie(COOKIE_KEY_CDAP_USER_DATA, data, {
      expires: expireDate,
    });

    await setBrowserCookie(COOKIE_KEY_TEMP_ID_TOKEN, callbackInfo?.id_token, {
      expires: expireDate,
    });

    delete callbackInfo?.id_token;

    await setBrowserCookie(COOKIE_KEY_TEMP_CALLBACK_INFO, callbackInfo);

    await router.push(educDomain() + LINK_LEARNER_SIGNUP_CDAP);


  } catch (error: any) {
    console.log('Failed to create cdap user', error);
    router.push({
      pathname: educDomain() + LINK_LEARNER_CDAP_SIGNUP_FAILED,
      query: {error: 'user_reg_failed'},
    });
  }
};
