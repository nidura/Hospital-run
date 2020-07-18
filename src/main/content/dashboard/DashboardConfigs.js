import loadable from '@loadable/component';
const Dashboard = loadable(() => import('./Dashboard'));

export const DashboardConfigs = {
    settings: {
        layout: {
            config: {}
        }
    },
   // auth :false,
    routes  : [
        {
            path     : '/dashboard',
            component: Dashboard
        }
    ]
};
