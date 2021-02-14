const HOST = 'https://bbusyzb87h.execute-api.eu-west-3.amazonaws.com/prod';

export const CONSTANST = {
    permissions: {},
    routes: {
        authorization: {
            login: HOST + '/api/auth/login',
            logout: HOST + '/api/auth/logout'
        },
        product: {
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
