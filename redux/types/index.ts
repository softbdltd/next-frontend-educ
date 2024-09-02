import {CommonActionTypes} from './actions/Common.action';
import {SettingsActionTypes} from './actions/Settings.action';
import {AuthActions} from './actions/Auth.actions';
import {VendorActions} from './actions/Vendor.actions';

export type AppActions =
  | CommonActionTypes
  | SettingsActionTypes
  | AuthActions
  | VendorActions;
