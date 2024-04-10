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
  appPathPrefix: string
  previewUrl: string
  publishUrl: string
  persistentBackend: 's3' | 'blob' | 'preview'
  s3Bucket?: string
  logLevel: 'trace' | 'info' | 'debug' | 'error'
  phase?: 'alpha' | 'beta'
  footerText?: string
  isProduction: boolean
  isDevelopment: boolean
  isTest: boolean
  lastCommit: string
  lastTag: string
  sessionTtl: number
  sessionCookieTtl?: number
  sessionCookiePassword?: string
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

// Define config schema
const schema = joi.object({
  port: joi.number().default(3000),
  env: joi
    .string()
    .valid('development', 'test', 'production')
    .default('development'),
  appPathPrefix: joi.string(),
  previewUrl: joi.string(),
  publishUrl: joi.string(),
  persistentBackend: joi.string().valid('s3', 'blob', 'preview').optional(),
  s3Bucket: joi.string().optional(),
  logLevel: joi
    .string()
    .valid('trace', 'info', 'debug', 'error')
    .default('debug'),
  phase: joi.string().valid('alpha', 'beta').optional(),
  footerText: joi.string().optional(),
  isProduction: joi.boolean().default(false),
  isDevelopment: joi.boolean().default(true),
  isTest: joi.boolean().default(false),
  lastCommit: joi.string().default('undefined'),
  lastTag: joi.string().default('undefined'),
  sessionTtl: joi.number(),
  sessionCookieTtl: joi.number().optional(),
  sessionCookiePassword: joi.string().optional(),
  azureClientId: joi.string().optional(),
  azureClientSecret: joi.string().optional(),
  oidcWellKnownConfigurationUrl: joi.string().optional(),
  appBaseUrl: joi.string().optional().default('http://localhost:3000'),
  redisHost: joi.string(),
  redisUsername: joi.string(),
  redisPassword: joi.string(),
  redisKeyPrefix: joi.string().optional().default('forms-designer'),
  serviceName: joi.string()
})

const {
  APP_BASE_URL,
  APP_PATH_PREFIX = '/forms-designer',
  AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET,
  FOOTER_TEXT,
  LAST_COMMIT,
  LAST_COMMIT_GH,
  LAST_TAG,
  LAST_TAG_GH,
  LOG_LEVEL = 'info',
  NODE_ENV = 'development',
  OIDC_WELL_KNOWN_CONFIGURATION_URL,
  PERSISTENT_BACKEND = 'preview',
  PHASE = 'beta',
  PORT = '3000',
  PREVIEW_URL = 'http://dev.cdp-int.defra.cloud/forms-runner/',
  PUBLISH_URL = 'http://dev.cdp-int.defra.cloud/forms-runner/',
  REDIS_HOST,
  REDIS_KEY_PREFIX,
  REDIS_PASSWORD,
  REDIS_USERNAME,
  SESSION_COOKIE_PASSWORD,
  SESSION_COOKIE_TTL,
  SESSION_TTL,
  S3_BUCKET
} = process.env

// Build config
const config = {
  port: PORT,
  env: NODE_ENV,
  appPathPrefix: APP_PATH_PREFIX,
  previewUrl: PREVIEW_URL,
  publishUrl: PUBLISH_URL,
  persistentBackend: PERSISTENT_BACKEND,
  serviceName: 'Defra Form Builder',
  s3Bucket: S3_BUCKET,
  logLevel: LOG_LEVEL,
  phase: PHASE,
  footerText: FOOTER_TEXT,
  isProduction: NODE_ENV === 'production',
  isDevelopment: !['production', 'test'].includes(NODE_ENV),
  isTest: NODE_ENV === 'test',
  lastCommit: LAST_COMMIT ?? LAST_COMMIT_GH,
  lastTag: LAST_TAG ?? LAST_TAG_GH,
  sessionTtl: SESSION_TTL
    ? parseInt(SESSION_TTL)
    : Duration.fromObject({ days: 1 }).as('milliseconds'),
  sessionCookiePassword: SESSION_COOKIE_PASSWORD,
  sessionCookieTtl: SESSION_COOKIE_TTL
    ? parseInt(SESSION_COOKIE_TTL)
    : Duration.fromObject({ minutes: 30 }).as('milliseconds'),
  azureClientId: AZURE_CLIENT_ID,
  azureClientSecret: AZURE_CLIENT_SECRET,
  oidcWellKnownConfigurationUrl: OIDC_WELL_KNOWN_CONFIGURATION_URL,
  appBaseUrl: APP_BASE_URL,
  redisHost: REDIS_HOST,
  redisUsername: REDIS_USERNAME,
  redisPassword: REDIS_PASSWORD,
  redisKeyPrefix: REDIS_KEY_PREFIX
}

// Validate config
const result = schema.validate(config, { abortEarly: false })

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the joi validated value
const value: Config = result.value

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
