export const menuItems = [
  'permission',
  'permission_group',
    //...
];

const allPermissionKeys: any = {
  permission: {
    read_all: 'view_any_permission',
    create: 'create_permission',
    read: 'view_single_permission',
    update: 'update_permission',
    delete: 'delete_permission',
  },
  permission_group: {
    read_all: 'view_any_permission_group',
    create: 'create_permission_group',
    read: 'view_single_permission_group',
    update: 'update_permission_group',
    delete: 'delete_permission_group',
  },

//   more will added
};
export default allPermissionKeys;
