import Cart from 'main/content/cart/cart';

export const CartConfigs = {
    settings: {
        layout: {},
    },

    // auth: ['admin','supervisor'],

    routes: [
        {
            path: '/cart/cartView',
            component: Cart,
        },
    ],

};
