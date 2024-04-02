import * as AWS from 'aws-sdk'
import { type CredentialsOptions } from 'aws-sdk/lib/credentials.js'
import { configDotenv } from 'dotenv'
import joi from 'joi'

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
  sessionTimeout: number
  sessionCookieTtl?: string
  sessionCookiePassword?: string
  awsCredentials?: CredentialsOptions
  azureClientId?: string
  azureClientSecret?: string
  oidcWellKnownConfigurationUrl?: string
  appBaseUrl: string
  useSingleInstanceCache: boolean
  redisHost: string
  redisUsername: string
  redisPassword: string
  redisKeyPrefix: string
  redisTtl: number
}

// server-side storage expiration - defaults to 20 minutes
const sessionSTimeoutInMilliseconds = 20 * 60 * 1000

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
  lastCommit: joi.string().default('undefined'),
  lastTag: joi.string().default('undefined'),
  sessionTimeout: joi.number().default(sessionSTimeoutInMilliseconds),
  sessionCookieTtl: joi.string().optional(),
  sessionCookiePassword: joi.string().optional(),
  azureClientId: joi.string().optional(),
  azureClientSecret: joi.string().optional(),
  oidcWellKnownConfigurationUrl: joi.string().optional(),
  appBaseUrl: joi.string().optional().default('http://localhost:3000'),
  useSingleInstanceCache: joi.string().optional().default(false),
  redisHost: joi.string(),
  redisUsername: joi.string(),
  redisPassword: joi.string(),
  redisKeyPrefix: joi.string().optional().default('forms-designer'),
  redisTtl: joi.number().optional().default(2419200000), // one day
  serviceName: joi.string()
})

// Build config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  appPathPrefix: process.env.APP_PATH_PREFIX || '/forms-designer',
  previewUrl:
    process.env.PREVIEW_URL || 'http://dev.cdp-int.defra.cloud/forms-runner/', // TODO set this to localhost and pull env vars from CDP
  publishUrl:
    process.env.PUBLISH_URL || 'http://dev.cdp-int.defra.cloud/forms-runner/', // TODO set this to localhost and pull env vars from CDP
  persistentBackend: process.env.PERSISTENT_BACKEND || 'preview',
  serviceName: 'Defra Form Builder',
  s3Bucket: process.env.S3_BUCKET,
  logLevel: process.env.LOG_LEVEL || 'info',
  phase: process.env.PHASE || 'beta',
  footerText: process.env.FOOTER_TEXT,
  lastCommit: process.env.LAST_COMMIT || process.env.LAST_COMMIT_GH,
  lastTag: process.env.LAST_TAG || process.env.LAST_TAG_GH,
  sessionTimeout: process.env.SESSION_TIMEOUT,
  sessionCookiePassword: process.env.SESSION_COOKIE_PASSWORD,
  sessionCookieTtl: process.env.SESSION_COOKIE_TTL,
  azureClientId: process.env.AZURE_CLIENT_ID,
  azureClientSecret: process.env.AZURE_CLIENT_SECRET,
  oidcWellKnownConfigurationUrl: process.env.OIDC_WELL_KNOWN_CONFIGURATION_URL,
  appBaseUrl: process.env.APP_BASE_URL,
  useSingleInstanceCache: process.env.USE_SINGLE_INSTANCE_CACHE,
  redisHost: process.env.REDIS_HOST,
  redisUsername: process.env.REDIS_USERNAME,
  redisPassword: process.env.REDIS_PASSWORD,
  redisKeyPrefix: process.env.REDIS_KEY_PREFIX,
  redisTtl: process.env.REDIS_TTL
}

// Validate config
const result = schema.validate(
  {
    ...config
  },
  { abortEarly: false }
)

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

value.isProduction = value.env === 'production'
value.isDevelopment = !value.isProduction
value.isTest = value.env === 'test'

export default value
