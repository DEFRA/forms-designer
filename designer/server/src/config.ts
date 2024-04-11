import { resolve } from 'node:path'
import { cwd } from 'node:process'

import * as AWS from 'aws-sdk'
import { type CredentialsOptions } from 'aws-sdk/lib/credentials.js'
import { configDotenv } from 'dotenv'
import joi from 'joi'
import { Duration } from 'luxon'

configDotenv({
  path: ['../../.env']
})

export interface Config {
  env: 'development' | 'test' | 'production'
  port: number
  appDir: string
  appPathPrefix: string
  clientDir: string
  previewUrl: string
  publishUrl: string
  persistentBackend: 's3' | 'blob' | 'preview'
  serviceName: string
  s3Bucket?: string
  logLevel: 'trace' | 'info' | 'debug' | 'error'
  phase: 'alpha' | 'beta' | 'live'
  footerText?: string
  isProduction: boolean
  isDevelopment: boolean
  isTest: boolean
  lastCommit?: string
  lastTag?: string
  sessionTtl: number
  sessionCookieTtl: number
  sessionCookiePassword: string
  awsCredentials?: CredentialsOptions
  azureClientId?: string
  azureClientSecret?: string
  oidcWellKnownConfigurationUrl?: string
  appBaseUrl: string
  redisHost: string
  redisUsername: string
  redisPassword: string
  redisKeyPrefix: string
}

const appDir =
  process.env.NODE_ENV === 'production'
    ? resolve(cwd()) // npm run build
    : resolve(cwd(), '../dist') // npm run dev

// Define config schema
const schema = joi.object({
  port: joi.number().default(3000),
  env: joi
    .string()
    .valid('development', 'test', 'production')
    .default('development'),
  appDir: joi.string().default(appDir),
  appPathPrefix: joi.string().default('/forms-designer'),
  clientDir: joi.string().default(resolve(appDir, '../../client/dist')),
  previewUrl: joi
    .string()
    .default('http://dev.cdp-int.defra.cloud/forms-runner/'),
  publishUrl: joi
    .string()
    .default('http://dev.cdp-int.defra.cloud/forms-runner/'),
  persistentBackend: joi
    .string()
    .valid('s3', 'blob', 'preview')
    .default('preview'),
  serviceName: joi.string(),
  s3Bucket: joi.string().optional(),
  logLevel: joi
    .string()
    .valid('trace', 'info', 'debug', 'error')
    .default('info'),
  phase: joi.string().valid('alpha', 'beta', 'live').default('beta'),
  footerText: joi.string().optional(),
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
  awsCredentials: joi
    .object()
    .keys({
      accessKeyId: joi.string(),
      secretAccessKey: joi.string(),
      sessionToken: joi.string().optional()
    })
    .optional(),
  azureClientId: joi.string().optional(),
  azureClientSecret: joi.string().optional(),
  oidcWellKnownConfigurationUrl: joi.string().optional(),
  appBaseUrl: joi.string().default('http://localhost:3000'),
  redisHost: joi.string().default('localhost'),
  redisUsername: joi.string().default('default'),
  redisPassword: joi.string().default('my-password'),
  redisKeyPrefix: joi.string().default('forms-designer')
})

// Validate config
const result = schema.validate(
  {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
    appPathPrefix: process.env.APP_PATH_PREFIX,
    previewUrl: process.env.PREVIEW_URL,
    publishUrl: process.env.PUBLISH_URL,
    persistentBackend: process.env.PERSISTENT_BACKEND,
    serviceName: 'Defra Form Builder',
    s3Bucket: process.env.S3_BUCKET,
    logLevel: process.env.LOG_LEVEL,
    phase: process.env.PHASE,
    footerText: process.env.FOOTER_TEXT,
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
    redisKeyPrefix: process.env.REDIS_KEY_PREFIX
  },
  { abortEarly: false }
)

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the joi validated value
const value = result.value as Config

/**
 * TODO:- replace this with a top-level await when upgraded to node 16
 */
async function getAwsConfigCredentials(): Promise<CredentialsOptions | {}> {
  return new Promise(function (resolve, reject) {
    if (value.persistentBackend === 's3') {
      AWS.config.getCredentials(async function (err) {
        if (err) {
          console.error('Error getting AWS credentials', err)
          reject(err)
        } else {
          resolve({
            accessKeyId: AWS.config.credentials.accessKeyId,
            secretAccessKey: AWS.config.credentials.secretAccessKey
          })
        }
      })
    } else {
      resolve({})
    }
  })
}

getAwsConfigCredentials()
  .then((awsConfig) => {
    value.awsCredentials = awsConfig
  })
  .catch((e) => {
    throw e
  })

export default value
