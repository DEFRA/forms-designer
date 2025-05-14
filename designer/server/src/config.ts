import { resolve } from 'node:path'

import joi from 'joi'
import { type LevelWithSilent } from 'pino'

export interface Config {
  port: number
  cdpEnvironment:
    | 'local'
    | 'infra-dev'
    | 'management'
    | 'dev'
    | 'test'
    | 'perf-test'
    | 'ext-test'
    | 'prod'
  env: 'development' | 'test' | 'production'
  appDir: string
  clientV2Views: string
  clientDir: string
  clientSrc: string
  previewUrl: string
  managerUrl: string
  submissionUrl: string
  serviceName: string
  serviceVersion?: string
  log: {
    enabled: boolean
    level: LevelWithSilent
    format: 'ecs' | 'pino-pretty'
    redact: string[]
  }
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
  tracing: {
    header: string
  }
}

// Define config schema
const schema = joi.object<Config>({
  port: joi.number().default(3000),
  cdpEnvironment: joi
    .string()
    .valid(
      'local',
      'infra-dev',
      'management',
      'dev',
      'test',
      'perf-test',
      'ext-test',
      'prod'
    )
    .default('local'),
  env: joi
    .string()
    .valid('development', 'test', 'production')
    .default('development'),
  appDir: joi.string().default(import.meta.dirname),
  clientSrc: joi.string().when('env', {
    is: 'development',
    then: joi
      .string()
      .default(resolve(import.meta.dirname, '../../client/src')),
    otherwise: joi
      .string()
      .default(resolve(import.meta.dirname, '../../client/dist'))
  }),
  clientDir: joi.string().when('env', {
    is: 'test',
    then: joi
      .string()
      .default(resolve(import.meta.dirname, '../../client/test/fixtures')),
    otherwise: joi
      .string()
      .default(resolve(import.meta.dirname, '../../client/dist'))
  }),
  managerUrl: joi.string().required(),
  submissionUrl: joi.string().required(),
  previewUrl: joi.string().required(),
  serviceName: joi.string().required(),
  serviceVersion: joi.string().optional(),
  log: joi.object({
    enabled: joi.boolean().when('...env', {
      is: 'test',
      then: joi.boolean().default(false),
      otherwise: joi.boolean().default(true)
    }),
    level: joi
      .string()
      .when('...env', {
        is: 'development',
        then: joi.string().default('error'),
        otherwise: joi.string().default('info')
      })
      .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'),
    format: joi
      .string()
      .when('...env', {
        is: 'development',
        then: joi.string().default('pino-pretty'),
        otherwise: joi.string().default('ecs')
      })
      .valid('ecs', 'pino-pretty'),
    redact: joi
      .array()
      .items(joi.string())
      .when('...env', {
        is: 'development',
        then: joi
          .array()
          .items(joi.string())
          .default(['req', 'res', 'responseTime']),
        otherwise: joi
          .array()
          .items(joi.string())
          .default([
            'req.headers.authorization',
            'req.headers.cookie',
            'res.headers'
          ])
      })
  }),
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
  roleEditorGroupId: joi.string().required(),
  tracing: joi.object({
    header: joi.string().default('x-cdp-request-id')
  })
})

// Validate config
const result = schema.validate(
  {
    port: process.env.PORT,
    cdpEnvironment: process.env.ENVIRONMENT,
    env: process.env.NODE_ENV,
    managerUrl: process.env.MANAGER_URL,
    submissionUrl: process.env.SUBMISSION_URL,
    previewUrl: process.env.PREVIEW_URL,
    serviceName: 'Forms designer',
    serviceVersion: process.env.SERVICE_VERSION,
    log: {
      enabled: process.env.LOG_ENABLED,
      level: process.env.LOG_LEVEL,
      format: process.env.LOG_FORMAT
    },
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
    roleEditorGroupId: process.env.ROLE_EDITOR_GROUP_ID,
    tracing: {
      header: process.env.TRACING_HEADER
    }
  },
  { abortEarly: false }
)

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the joi validated value
export default result.value
