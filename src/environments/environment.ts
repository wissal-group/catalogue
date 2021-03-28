// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  host : 'https://m0jlzcd6b8.execute-api.eu-west-3.amazonaws.com',
  loginUrl: 'service-user-pool-domain-dev-wi-keys.auth.eu-west-3.amazoncognito.com/login?response_type=token&client_id=3ft6b5gd9uc3eooh4aa79999ul&redirect_uri=http://localhost:4200/login',
};
