import {environment} from '~environments';

const HOST = environment.host;

export const CONSTANST = {
  permissions: {},
  routes: {
    authorization: {
      login: HOST + '/api/auth/login',
      logout: HOST + '/api/auth/logout'
    },
    product: {
      category: HOST + '/products/category',
      list: HOST + '/products/size',
      delete: HOST + '/products/:id',
      save: HOST + '/products',
      update: HOST + 'products/:id',
      get: HOST + '/products/:id',
      search: HOST + '/products/search/'
    },
    user: {}
  },
  lang: {},
  session: {},
  parameters: {}
};
