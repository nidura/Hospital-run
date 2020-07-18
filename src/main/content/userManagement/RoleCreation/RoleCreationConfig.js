import loadable from '@loadable/component';
const RoleCreation = loadable(() => import('main/content/userManagement/RoleCreation/RoleCreation'));

export const RoleCreationConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth :true,
    routes  : [
        {
            path     : '/userManagement/roleCreation',
            component: RoleCreation
        }
    ]
};