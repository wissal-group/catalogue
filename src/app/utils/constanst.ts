const HOST = ' https://10xisq4pdi.execute-api.eu-west-3.amazonaws.com';

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
      get: HOST + '/products/:id'
    },
    user: {}
  },
  lang: {},
  session: {},
  parameters: {}
};
