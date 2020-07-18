import DeliveryList from 'main/content/deliveryList/deliveryListView';

export const DeliveryListConfigs = {
    settings: {
        layout: {},
    },

    routes: [
        {
            path: '/deliveries/deliveryList',
            component: DeliveryList,
        },
    ],

};
