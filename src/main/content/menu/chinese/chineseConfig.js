import Chinese from 'main/content/menu/chinese/chineseView';

export const ChineseConfigs = {
  settings: {
    layout: {},
  },

  // auth: ['admin','supervisor'],

  routes: [
    {
      path: '/menu/chinese',
      component: Chinese,
    },
  ],

};
