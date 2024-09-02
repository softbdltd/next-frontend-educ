import React, {useEffect, useState} from 'react';
import {useAuthUser} from '../../@core/utility/AppHooks';
import {CommonAuthUser} from '../../redux/types/models/CommonAuthUser';
import allPermissionKeys, {menuItems} from './AllPermissionKeys';
import defaultPermissionConfig from './defaultPermissionConfig';
import PermissionContext from './PermissionContext';
import PermissionContextPropsType from './PermissionContextPropsType';

const PermissionProvider: React.FC<React.ReactNode> = ({children}) => {
  const [userPermissions] =
    useState<PermissionContextPropsType>(defaultPermissionConfig);

  const authUser = useAuthUser<CommonAuthUser>();


  useEffect(() => {
    if (authUser && !authUser.isYouthUser) {
      let permissionObject: any = {};
      let permissions: any = {...userPermissions};

      (authUser.permissions || []).map((key) => (permissionObject[key] = 1));

      menuItems.map((item) => {
        let itemKeys = allPermissionKeys[item];

        permissions[item]['canReadAll'] = !!permissionObject[itemKeys.read_all];
        permissions[item]['canCreate'] = !!permissionObject[itemKeys.create];
        permissions[item]['canRead'] = !!permissionObject[itemKeys.read];
        permissions[item]['canUpdate'] = !!permissionObject[itemKeys.update];
        permissions[item]['canDelete'] = !!permissionObject[itemKeys.delete];

      })
    }
  }, [authUser]);

  return (
    <PermissionContext.Provider
      value={{
        ...userPermissions,
      }}>
      {children}
    </PermissionContext.Provider>
  );
};

export default PermissionProvider;
