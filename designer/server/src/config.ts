import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import joi from 'joi'
import { Duration } from 'luxon'

const configPath = fileURLToPath(import.meta.url)

export interface Config {
  env: 'development' | 'test' | 'production'
  port: number
  appDir: string
  clientDir: string
  previewUrl: string
  managerUrl: string
  serviceName: string
  logLevel: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent'
  phase: 'alpha' | 'beta' | 'live'
  isProduction: boolean
  isDevelopment: boolean
  isTest: boolean
  lastCommit?: string
  lastTag?: string
  sessionTtl: number
  sessionCookieTtl: number
  sessionCookiePassword: string
  azureClientId?: string
  azureClientSecret?: string
  oidcWellKnownConfigurationUrl?: string
  appBaseUrl: string
  redisHost: string
  redisUsername: string
  redisPassword: string
  redisKeyPrefix: string,
  formsEditorAdGroupName: string
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
    .default(resolve(dirname(configPath), '../../client/dist')),
  managerUrl: joi
    .string()
    .default('http://forms-manager.dev.cdp-int.defra.cloud/'),
  previewUrl: joi
    .string()
    .default('http://forms-runner.dev.cdp-int.defra.cloud/'),
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
  phase: joi.string().valid('alpha', 'beta', 'live').default('beta'),
  isProduction: joi.boolean().default(false),
  isDevelopment: joi.boolean().default(true),
  isTest: joi.boolean().default(false),
  lastCommit: joi.string().optional(),
  lastTag: joi.string().optional(),
  sessionTtl: joi
    .number()
    .default(Duration.fromObject({ days: 1 }).as('milliseconds')),
  sessionCookieTtl: joi
    .number()
    .default(Duration.fromObject({ minutes: 30 }).as('milliseconds')),
  sessionCookiePassword: joi.string().allow('').default(''),
  azureClientId: joi.string().optional(),
  azureClientSecret: joi.string().optional(),
  oidcWellKnownConfigurationUrl: joi.string().optional(),
  appBaseUrl: joi.string().default('http://localhost:3000'),
  redisHost: joi.string().default('localhost'),
  redisUsername: joi.string().default('default'),
  redisPassword: joi.string().default('my-password'),
  redisKeyPrefix: joi.string().default('forms-designer'),
  formsEditorAdGroupName: joi.string().default('AG-APP-CDP-FORMS')
})

// Validate config
const result = schema.validate(
  {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    managerUrl: process.env.MANAGER_URL,
    previewUrl: process.env.PREVIEW_URL,
    serviceName: 'Submit a form to Defra',
    logLevel: process.env.LOG_LEVEL,
    phase: process.env.PHASE,
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: !['production', 'test'].includes(`${process.env.NODE_ENV}`),
    isTest: process.env.NODE_ENV === 'test',
    lastCommit: process.env.LAST_COMMIT ?? process.env.LAST_COMMIT_GH,
    lastTag: process.env.LAST_TAG ?? process.env.LAST_TAG_GH,
    sessionTtl: process.env.SESSION_TTL,
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
    formsEditorAdGroupName: process.env.FORMS_EDITOR_AD_GROUP_NAME
  },
  { abortEarly: false }
)

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the joi validated value
export default result.value
