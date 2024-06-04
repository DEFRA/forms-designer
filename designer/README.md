# Defra forms designer

A hapi-based application providing a visual designer for [forms-runner](https://github.com/DEFRA/forms-runner) applications.

### Clone and build

Clone this repo

`$ git clone https://github.com/DEFRA/forms-designer`

`$ cd designer/`

Launch the developer environment: `$ docker compose up`

Build and launch the app:

```sh
nvm use
npm ci
npm run dev
```

Open your browser at

`https://localhost:3000`

# Environment variables

If there is a .env file present, these will be loaded in first for local development. In a deployed environment, env vars are used.

Base URLs should should include protocol, hostname, port number, e.g. `http://localhost:3000`.

| name                              | description                                                                             | required | default | valid                       |
| --------------------------------- | --------------------------------------------------------------------------------------- | :------- | ------- | :-------------------------- |
| APP_BASE_URL                      | Base URL for each request.                                                              | yes      |         |                             |
| AZURE_CLIENT_ID                   | Client ID of the Azure app registration.                                                | yes      |         |                             |
| AZURE_CLIENT_SECRET               | Client secret of the Azure app registration.                                            | yes      |         |                             |
| LOG_LEVEL                         | Log level                                                                               | yes      | info    | trace,debug,info,error      |
| MANAGER_URL                       | Base URL of the forms-manager API.                                                      | yes      |         |                             |
| NODE_ENV                          | Node environment                                                                        | yes      |         | development,test,production |
| OIDC_WELL_KNOWN_CONFIGURATION_URL | OIDC Well known configuration URL for the Azure tenant containing the app registration. | yes      |         |                             |
| PORT                              | Port number                                                                             | yes      | 3000    |                             |
| PREVIEW_URL                       | Base URL for links to preview forms in user's web browser (forms-runner).               | yes      |         |                             |
| REACT_LOG_LEVEL                   | Log level for client-side designer logging                                              | yes      | debug   | trace,debug,info,warn,error |
| SESSION_COOKIE_PASSWORD           | at least 32 char long string for session cookie encryption                              | yes      |         |                             |
| SESSION_COOKIE_TTL                | server-side storage expiration time for sessions - in milliseconds                      | yes      |         |                             |
| SESSION_TTL                       | server-side storage expiration time - in milliseconds                                   | yes      |         |                             |
| USE_SINGLE_INSTANCE_CACHE         | If true, disables the redis cluster connection and uses a single node.                  | yes      |         |                             |

## Local development .env file

All values assume you are using the docker compose setup.

```
APP_BASE_URL=http://localhost:3000
AZURE_CLIENT_ID="<OBTAIN VALUE FROM DEV TEAM>"
AZURE_CLIENT_SECRET="<OBTAIN VALUE FROM DEV TEAM>"
MANAGER_URL=http://localhost:3001
NODE_ENV=development
OIDC_WELL_KNOWN_CONFIGURATION_URL="<OBTAIN VALUE FROM DEV TEAM>"
PREVIEW_URL=http://localhost:3009
REACT_LOG_LEVEL=info
REDIS_PASSWORD=my-password
REDIS_USERNAME=default
REDIS_HOST=localhost
REDIS_KEY_PREFIX=forms-designer
ROLE_EDITOR_GROUP_ID="<OBTAIN VALUE FROM DEV TEAM>"
SESSION_COOKIE_PASSWORD="948ltmkivpetvv9j673i38c81rlc8nu5"
SESSION_COOKIE_TTL=2419200000
SESSION_TTL=86400000
USE_SINGLE_INSTANCE_CACHE=true
```

## Unit tests

This project currently has a combination of tests written with Hapi helpers and tests written in Testing Library, the aim is to have all component tests written in Testing Library so please aim to do that if you come accorss any Hapi tests.

To watch the tests:

```sh
npm run test --watch
```

## License

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the license

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
