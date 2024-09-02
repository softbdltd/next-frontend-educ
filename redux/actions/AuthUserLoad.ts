import {Base64} from 'js-base64';
import {Dispatch} from 'redux';
import {apiGet} from '../../@core/common/api';
import {API_USERS, API_LEARNER_PROFILE} from '../../@core/common/apiRoutes';
import {LINK_FRONTEND_LEARNER_FEED} from '../../@core/common/appLinks';
import {adminDomain, learnerDomain} from '../../@core/common/constants';
import {
  getAppAccessTokenFromCookie,
  getAuthAccessTokenFromCookie,
  getIdTokenFromCookie,
} from '../../@core/libs/cookieHelpers';
import {
  removeBrowserCookie,
  setBrowserCookie,
} from '../../@core/libs/cookieInstance';
import {
  COOKIE_KEY_USER_DOMAIN,
  COOKIE_KEY_LEARNER_USER_AS_TRAINER,
} from '../../shared/constants/AppConst';
import {AppActions} from '../types';
import {UPDATE_AUTH_USER} from '../types/actions/Auth.actions';
import {
  getCommonAuthUserObject,
  getYouthAuthUserObject,
} from './Authentication';
import {fetchError, fetchStart, fetchSuccess} from './Common';

export const loadAuthenticateUser = async (
  dispatch: Dispatch<AppActions | any>,
  loadYouth: boolean,
) => {
  dispatch(fetchStart());
  try {
    const accessToken = getAuthAccessTokenFromCookie();

    const id_token = getIdTokenFromCookie();
    if (loadYouth) {
      removeBrowserCookie(COOKIE_KEY_LEARNER_USER_AS_TRAINER);
    } else {
      setBrowserCookie(COOKIE_KEY_LEARNER_USER_AS_TRAINER, 1);
    }

    const ssoTokenData = JSON.parse(
      Base64.decode((id_token || '..').split('.')[1]),
    );

    const appAccessTokenData = getAppAccessTokenFromCookie();

    const coreResponse = loadYouth
      ? await apiGet(API_LEARNER_PROFILE, {
          headers: {
            Authorization: 'Bearer ' + appAccessTokenData?.access_token,
            'User-Token': 'Bearer ' + accessToken,
          },
        })
      : await apiGet(API_USERS + `/${ssoTokenData.sub}/permissions`, {
          headers: {
            Authorization: 'Bearer ' + appAccessTokenData?.access_token,
            'User-Token': 'Bearer ' + accessToken,
          },
        });
    //console.log(coreResponse);

    const {data} = coreResponse.data;
    dispatch(fetchSuccess());
    dispatch({
      type: UPDATE_AUTH_USER,
      payload: loadYouth
        ? getYouthAuthUserObject({...ssoTokenData, ...data})
        : getCommonAuthUserObject({...ssoTokenData, ...data}),
    });
    if (data?.domain) {
      setBrowserCookie(COOKIE_KEY_USER_DOMAIN, data.domain);
    } else {
      removeBrowserCookie(COOKIE_KEY_USER_DOMAIN);
    }

    window.location.href = loadYouth
      ? learnerDomain() + LINK_FRONTEND_LEARNER_FEED
      : adminDomain();
  } catch (err: any) {
    console.log('error!!!!', err);
    dispatch(fetchError(err));
  }
};
