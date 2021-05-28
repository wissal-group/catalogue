// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  host : 'https://u9v7cu8i98.execute-api.eu-west-3.amazonaws.com',
  loginUrl: 'https://service-user-pool-domain-prod-wi-keys.auth.eu-west-3.amazoncognito.com/login?response_type=token&client_id=4mabv454844p2bubih20si3fjk&redirect_uri=http://www.wi-keys.com.s3-website.eu-west-3.amazonaws.com/login',
};
