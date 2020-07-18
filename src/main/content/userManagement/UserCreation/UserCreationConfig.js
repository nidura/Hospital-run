import loadable from '@loadable/component';
const UserCreation = loadable(() => import('main/content/userManagement/UserCreation/UserCreation'));

export const UserCreationConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth :true,
    routes  : [
        {
            path     : '/userManagement/userCreation',
            component: UserCreation
        }
    ]
};