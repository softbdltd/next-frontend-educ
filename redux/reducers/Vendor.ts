import {AppActions} from '../types';
import {
  SET_AUTH_ACCESS_TOKEN_DATA,
  SET_AUTH_TOKEN,
  SIGNOUT_AUTH_SUCCESS,
  UPDATE_AUTH_USER,
  USER_LOADED,
} from '../types/actions/Auth.actions';
import {
  AllAuthUser,
  CommonAuthUser,
  YouthAuthUser,
} from '../types/models/CommonAuthUser';

const INIT_STATE: {
  user: CommonAuthUser | YouthAuthUser | AllAuthUser | null;
  token: string | null;
  authAccessTokenData: string | null;
  loading: boolean;
} = {
  loading: true,
  user: null,
  token: null,
  authAccessTokenData: null,
};

const Auth = (state = INIT_STATE, action: AppActions): any => {
  switch (action.type) {
    case UPDATE_AUTH_USER: {
      return {
        ...state,
        user: action.payload,
      };
    }
    case SIGNOUT_AUTH_SUCCESS: {
      return {
        ...state,
        user: null,
      };
    }
    case USER_LOADED: {
      return {
        ...state,
        loading: false,
      };
    }
    case SET_AUTH_TOKEN: {
      return {
        ...state,
        token: action.payload,
      };
    }
    case SET_AUTH_ACCESS_TOKEN_DATA: {
      return {
        ...state,
        authAccessTokenData: action.payload,
      };
    }
    default:
      return state;
  }
};
export default Auth;
