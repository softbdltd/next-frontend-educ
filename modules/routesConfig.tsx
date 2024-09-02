export interface NavItemProps {
  id: string;
  messageId: string;
  title: string;
  icon?: string;
  exact?: boolean;
  url?: string;
  as?: string;
  type?: string;
  count?: number;
  color?: string;
  auth?: string[];
  permissionKey?: string;
  children?: NavItemProps[] | NavItemProps;
}

const routesConfig: NavItemProps[] = [
  {
    id: 'pages',
    title: 'Pages',
    messageId: 'menu.pages',
    type: 'group',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        messageId: 'menu.dashboard',
        type: 'item',
        icon: 'dashboard',
        url: '/',
      },
      {
        id: 'user_management',
        title: 'User Management',
        messageId: 'menu.user_management',
        type: 'collapse',
        icon: 'people',
        children: [
          {
            id: 'permission',
            title: 'Permission',
            messageId: 'menu.permission',
            permissionKey: 'view_any_permission',
            type: 'item',
            icon: 'person',
            url: '/permissions',
          },
          {
            id: 'permission_group',
            title: 'Permission Group',
            messageId: 'menu.permission_group',
            permissionKey: 'view_any_permission_group',
            type: 'item',
            icon: 'person',
            url: '/permission-groups',
          },
          {
            id: 'permission_sub_group',
            title: 'Permission Group',
            messageId: 'menu.permission_sub_group',
            permissionKey: 'view_any_permission_sub_group',
            type: 'item',
            icon: 'person',
            url: '/permission-sub-groups',
          },
          {
            id: 'roles',
            title: 'Role',
            messageId: 'menu.role',
            permissionKey: 'view_any_role',
            type: 'item',
            icon: 'person',
            url: '/roles',
          },
          {
            id: 'users',
            title: 'User',
            messageId: 'menu.user',
            permissionKey: 'view_any_user',
            type: 'item',
            icon: 'person',
            url: '/users',
          },

        ],
      }]
  },
];
export default routesConfig;
