import {combineReducers} from 'redux';
import Settings from './Setting';
import Common from './CommonReducer';
import Auth from './Auth';
import Vendor from './Vendor';

const rootReducer = combineReducers({
  settings: Settings,
  auth: Auth,
  common: Common,
  vendor: Vendor,
});

export default rootReducer;
