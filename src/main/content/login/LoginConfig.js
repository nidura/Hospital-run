import loadable from '@loadable/component';
const Login = loadable(() => import('./Login'));

export const LoginConfig = {
    settings: {
        layout: {
            config: {
                navbar        : {
                    display: false
                },
                toolbar       : {
                    display: false
                },
                footer        : {
                    display: false
                },
                leftSidePanel : {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        }
    },
    auth    : false,
    routes  : [
        {
            path     : '/login',
            component: Login
        }
    ]
};

