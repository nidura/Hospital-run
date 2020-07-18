import loadable from '@loadable/component';
const DocumentAuthorization = loadable(() => import('main/content/userManagement/DocumentAuthorization/DocumentAuthorization'));

export const DocumentAuthorizationConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth :true,
    routes  : [
        {
            path     : '/userManagement/documentAuthorization',
            component: DocumentAuthorization
        }
    ]
};