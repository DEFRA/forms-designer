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

| name                              | description                                                                                                               | required | default | valid                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | :------- | ------- | :-------------------------- |
| APP_BASE_URL                      | Base URL for each request.                                                                                                | yes      |         |                             |
| AZURE_CLIENT_ID                   | Client ID of the Azure app registration.                                                                                  | yes      |         |                             |
| AZURE_CLIENT_SECRET               | Client secret of the Azure app registration.                                                                              | yes      |         |                             |
| LOG_LEVEL                         | Log level                                                                                                                 | yes      | info    | trace,debug,info,error      |
| MANAGER_URL                       | Base URL of the forms-manager API.                                                                                        | yes      |         |                             |
| NODE_ENV                          | Node environment                                                                                                          | yes      |         | development,test,production |
| OIDC_WELL_KNOWN_CONFIGURATION_URL | OIDC Well known configuration URL for the Azure tenant containing the app registration.                                   | yes      |         |                             |
| PORT                              | Port number                                                                                                               | yes      | 3000    |                             |
| PREVIEW_URL                       | Base URL for links to preview forms in user's web browser (forms-runner).                                                 | yes      |         |                             |
| REACT_LOG_LEVEL                   | Log level for client-side designer logging                                                                                | yes      | debug   | trace,debug,info,warn,error |
| SESSION_COOKIE_PASSWORD           | at least 32 char long string for session cookie encryption                                                                | yes      |         |                             |
| SESSION_COOKIE_TTL                | server-side storage expiration time for sessions - in milliseconds                                                        | yes      |         |                             |
| SESSION_TTL                       | server-side storage expiration time - in milliseconds                                                                     | yes      |         |                             |
| SNS_ENDPOINT                      | Url of SNS endpoint                                                                                                       | yes      |         |                             |
| SNS_TOPIC_ARN                     | Amazon Resource Name (ARN) of SNS topic. The typical format is "arn:aws:sns:eu-west-2:000000000000:forms_designer_events" | yes      |         |                             |
| USE_SINGLE_INSTANCE_CACHE         | If true, disables the redis cluster connection and uses a single node.                                                    | yes      |         |                             |
| HTTP_PROXY                        | HTTP proxy to use, e.g. the one from CDP. Currently used for Hapi Wreck.                                                  | no       |         |                             |
| HTTPS_PROXY                       | HTTPS proxy to use, e.g. the one from CDP. Currently used for Hapi Wreck.                                                 | no       |         |                             |
| NO_PROXY                          | HTTP proxy to use, e.g. the one from CDP. Currently used for Hapi Wreck.                                                  | no       |         |                             |
| FEATURE_FLAG_USE_ENTITLEMENT_API  | Feature flag to enable fetching roles from entitlement API and user management features                                   | no       | false   | true,false                  |

For proxy options, see https://www.npmjs.com/package/proxy-from-env which is used by https://github.com/TooTallNate/proxy-agents/tree/main/packages/proxy-agent.

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
SESSION_COOKIE_TTL=86400000
SESSION_TTL=2419200000
FILE_DOWNLOAD_PASSWORD_TTL=86400000
USE_SINGLE_INSTANCE_CACHE=true
SNS_ENDPOINT="http://localhost:4566"
SNS_TOPIC_ARN="arn:aws:sns:eu-west-2:000000000000:forms_designer_events"
AWS_ACCESS_KEY_ID=dummy
AWS_SECRET_ACCESS_KEY=dummy
```

## Unit tests

This project currently has a combination of tests written with Hapi helpers and tests written in Testing Library, the aim is to have all component tests written in Testing Library so please aim to do that if you come accorss any Hapi tests.

To watch the tests:

```sh
npm run test:watch
```

To check the coverage of the tests for new changes, there are the following options (available from the project root directory):

```sh
# The coverage of the files that have changed versus origin/main
npm run test:changed

# The coverage of the files that have changed since a specific commit hash
npm run test:since <commit-hash>

# The coverage of the files that have changed since the last commit
npm run test:uncommitted
```

## License

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the license

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.

# Forms Model Changes

If you make changes to the `@defra/forms-model` package (in the `model/` dir), or pull in model changes after rebasing with main, you'll need to:

```sh
npm run build --workspace=model
```

2. Restart your terminal/command prompt

3. In VS Code, press `Cmd + Shift + P` (Mac) or `Ctrl + Shift + P` (Windows/Linux) and search for "Developer: Reload Window"

This might be needed as the model package needs to be rebuilt to generate new TypeScript type definitions and compiled JavaScript files. Without these steps, you may see TS errors about missing types, especially after rebasing with main.
