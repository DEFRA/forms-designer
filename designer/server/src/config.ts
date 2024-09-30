import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import joi from 'joi'

const configPath = fileURLToPath(import.meta.url)

export interface Config {
  env: 'development' | 'test' | 'production'
  port: number
  appDir: string
  clientDir: string
  previewUrl: string
  managerUrl: string
  submissionUrl: string
  serviceName: string
  logLevel: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent'
  phase?: 'alpha' | 'beta' | 'live'
  isProduction: boolean
  isDevelopment: boolean
  isTest: boolean
  sessionTtl: number
  fileDownloadPasswordTtl: number
  sessionCookieTtl: number
  sessionCookiePassword: string
  azureClientId: string
  azureClientSecret: string
  oidcWellKnownConfigurationUrl: string
  appBaseUrl: string
  redisHost: string
  redisUsername: string
  redisPassword: string
  redisKeyPrefix: string
  roleEditorGroupId: string
}

// Define config schema
const schema = joi.object<Config>({
  port: joi.number().default(3000),
  env: joi
    .string()
    .valid('development', 'test', 'production')
    .default('development'),
  appDir: joi.string().default(dirname(configPath)),
  clientDir: joi
    .string()
    .default(resolve(dirname(configPath), '../../client/dist'))
    .when('env', {
      is: 'test',
      then: joi
        .string()
        .default(resolve(dirname(configPath), '../../client/test/fixtures'))
    }),
  managerUrl: joi.string().required(),
  submissionUrl: joi.string().required(),
  previewUrl: joi.string().required(),
  serviceName: joi.string().required(),
  logLevel: joi
    .string()
    .default('info')
    .when('env', {
      is: 'development',
      then: joi.string().default('error')
    })
    .when('env', {
      is: 'test',
      then: joi.string().default('silent')
    })
    .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'),
  phase: joi.string().valid('alpha', 'beta', 'live').optional(),
  isProduction: joi.boolean().default(false),
  isDevelopment: joi.boolean().default(true),
  isTest: joi.boolean().default(false),
  sessionTtl: joi.number().required(),
  fileDownloadPasswordTtl: joi.number().required(),
  sessionCookieTtl: joi.number().required(),
  sessionCookiePassword: joi.string().required(),
  azureClientId: joi.string().required(),
  azureClientSecret: joi.string().required(),
  oidcWellKnownConfigurationUrl: joi.string().required(),
  appBaseUrl: joi.string().required(),
  redisHost: joi.string().required(),
  redisUsername: joi.string().required(),
  redisPassword: joi.string().required(),
  redisKeyPrefix: joi.string().required(),
  roleEditorGroupId: joi.string().required()
})

// Validate config
const result = schema.validate(
  {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    managerUrl: process.env.MANAGER_URL,
    submissionUrl: process.env.SUBMISSION_URL,
    previewUrl: process.env.PREVIEW_URL,
    serviceName: 'Submit a form to Defra',
    logLevel: process.env.LOG_LEVEL,
    phase: process.env.PHASE,
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: !['production', 'test'].includes(`${process.env.NODE_ENV}`),
    isTest: process.env.NODE_ENV === 'test',
    sessionTtl: process.env.SESSION_TTL,
    fileDownloadPasswordTtl: process.env.FILE_DOWNLOAD_PASSWORD_TTL,
    sessionCookiePassword: process.env.SESSION_COOKIE_PASSWORD,
    sessionCookieTtl: process.env.SESSION_COOKIE_TTL,
    azureClientId: process.env.AZURE_CLIENT_ID,
    azureClientSecret: process.env.AZURE_CLIENT_SECRET,
    oidcWellKnownConfigurationUrl:
      process.env.OIDC_WELL_KNOWN_CONFIGURATION_URL,
    appBaseUrl: process.env.APP_BASE_URL,
    redisHost: process.env.REDIS_HOST,
    redisUsername: process.env.REDIS_USERNAME,
    redisPassword: process.env.REDIS_PASSWORD,
    redisKeyPrefix: process.env.REDIS_KEY_PREFIX,
    roleEditorGroupId: process.env.ROLE_EDITOR_GROUP_ID
  },
  { abortEarly: false }
)

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the joi validated value
export default result.value
