import PermissionContextPropsType from './PermissionContextPropsType';

const defaultPermissionConfig: PermissionContextPropsType = {
  permission: {
    canReadAll: false,
    canCreate: false,
    canRead: false,
    canUpdate: false,
    canDelete: false,
  },
  permission_group: {
    canReadAll: false,
    canCreate: false,
    canRead: false,
    canUpdate: false,
    canDelete: false,
  },
// more will added
};

export default defaultPermissionConfig;
