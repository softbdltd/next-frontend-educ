interface CRUDPermission {
  canReadAll: boolean;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}



export default interface PermissionContextPropsType {
  permission: CRUDPermission;
  permission_group: CRUDPermission;
}
