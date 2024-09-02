import React from 'react';
import PermissionContextPropsType from './PermissionContextPropsType';
import defaultPermissionConfig from './defaultPermissionConfig';

export default React.createContext<PermissionContextPropsType>(
  defaultPermissionConfig,
);
