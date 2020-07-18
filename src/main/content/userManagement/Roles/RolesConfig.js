import loadable from '@loadable/component';
const Roles = loadable(() => import('main/content/userManagement/Roles/Roles'));

export const RolesConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth :true,
    routes  : [
        {
            path     : '/userManagement/roles',
            component: Roles
        }
    ]
};
