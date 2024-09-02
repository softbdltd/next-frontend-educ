import {
  COOKIE_KEY_APP_ACCESS_TOKEN,
  COOKIE_KEY_APP_ACCESS_TOKEN_RPL,
  COOKIE_KEY_AUTH_ACCESS_TOKEN,
  COOKIE_KEY_AUTH_ACCESS_TOKEN_RPL,
  COOKIE_KEY_AUTH_ID_TOKEN,
  COOKIE_KEY_AUTH_ID_TOKEN_RPL,
  COOKIE_KEY_AUTH_REFRESH_TOKEN,
  COOKIE_KEY_AUTH_REFRESH_TOKEN_RPL,
  COOKIE_KEY_SSO_SESSION_STATE,
  COOKIE_KEY_SSO_SESSION_STATE_RPL,
} from '../../shared/constants/AppConst';
import {getBrowserCookie, removeBrowserCookie} from './cookieInstance';

export function getAuthAccessTokenFromCookie() {
  return (
    getBrowserCookie(COOKIE_KEY_AUTH_ACCESS_TOKEN) ||
    getBrowserCookie(COOKIE_KEY_AUTH_ACCESS_TOKEN_RPL)
  );
}

export function getAppAccessTokenFromCookie() {
  return (
    getBrowserCookie(COOKIE_KEY_APP_ACCESS_TOKEN) ||
    getBrowserCookie(COOKIE_KEY_APP_ACCESS_TOKEN_RPL)
  );
}

export function getAuthRefreshTokenFromCookie() {
  return (
    getBrowserCookie(COOKIE_KEY_AUTH_REFRESH_TOKEN) ||
    getBrowserCookie(COOKIE_KEY_AUTH_REFRESH_TOKEN_RPL)
  );
}
export function getIdTokenFromCookie() {
  return (
    getBrowserCookie(COOKIE_KEY_AUTH_ID_TOKEN) ||
    getBrowserCookie(COOKIE_KEY_AUTH_ID_TOKEN_RPL)
  );
}

export function clearAuthCookies() {
  removeBrowserCookie(COOKIE_KEY_AUTH_ACCESS_TOKEN);
  removeBrowserCookie(COOKIE_KEY_AUTH_ACCESS_TOKEN_RPL);
}

export function clearAuthRefreshCookies() {
  removeBrowserCookie(COOKIE_KEY_AUTH_REFRESH_TOKEN_RPL);
  removeBrowserCookie(COOKIE_KEY_AUTH_REFRESH_TOKEN);
}
export function clearAllCookies() {
  removeBrowserCookie(COOKIE_KEY_AUTH_ACCESS_TOKEN);
  removeBrowserCookie(COOKIE_KEY_AUTH_REFRESH_TOKEN);
  removeBrowserCookie(COOKIE_KEY_AUTH_ID_TOKEN);
  removeBrowserCookie(COOKIE_KEY_SSO_SESSION_STATE);

  removeBrowserCookie(COOKIE_KEY_AUTH_ACCESS_TOKEN_RPL);
  removeBrowserCookie(COOKIE_KEY_AUTH_REFRESH_TOKEN_RPL);
  removeBrowserCookie(COOKIE_KEY_AUTH_ID_TOKEN_RPL);
  removeBrowserCookie(COOKIE_KEY_SSO_SESSION_STATE_RPL);
}
