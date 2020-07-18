import loadable from '@loadable/component';
const UserProfile = loadable(() => import('main/content/userManagement/UserProfile/UserProfile'));

export const UserProfileConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth :true,
    routes  : [
        {
            path     : '/userManagement/userProfile',
            component: UserProfile
        }
    ]
};