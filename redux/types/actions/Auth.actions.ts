import {CommonAuthUser} from '../models/CommonAuthUser';

export const UPDATE_AUTH_USER = 'UPDATE_AUTH_USER';
/**
 * @deprecated
 */
export const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
export const SET_AUTH_ACCESS_TOKEN_DATA = 'SET_AUTH_ACCESS_TOKEN_DATA';
export const USER_LOADED = 'USER_LOADED';
export const SIGNOUT_AUTH_SUCCESS = 'SIGNOUT_AUTH_SUCCESS';

/**
 * @deprecated
 */
export interface SetAuthTokenActions {
  type: typeof SET_AUTH_TOKEN;
  payload: string | null;
}

type TSetAuthAccessTokenDataActions = {
  access_token: string; // Inorder to consume api, use access token to authorize.
  expires_in: string | number; // token lifetime in second
  id_token: string; // {Header, payload, signature}
  session_state: string; // I don't know.
};

export interface SetAuthAccessTokenDataActions {
  type: typeof SET_AUTH_ACCESS_TOKEN_DATA;
  payload: TSetAuthAccessTokenDataActions;
}

export interface UpdateAuthUserActions {
  type: typeof UPDATE_AUTH_USER;
  payload: CommonAuthUser | null;
}

export interface UserLoadedActions {
  type: typeof USER_LOADED;
}

export interface SignoutAuthUserActions {
  type: typeof SIGNOUT_AUTH_SUCCESS;
}

export type AuthActions =
  | UpdateAuthUserActions
  | SetAuthTokenActions
  | SetAuthAccessTokenDataActions
  | UserLoadedActions
  | SignoutAuthUserActions;
