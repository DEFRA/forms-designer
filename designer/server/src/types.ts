/* eslint-disable @typescript-eslint/unified-signatures */

import { type FormMetadataInput } from '@defra/forms-model'
import { type StringLikeMap } from '@hapi/bell'
import { type RequestAuth } from '@hapi/hapi'
import { type Logger } from 'pino'

import { type sessionNames } from '~/src/common/constants/session-names.js'
import { type UserProfile } from '~/src/common/helpers/auth/types.js'
import {
  type ErrorDetailsItem,
  type ValidationFailure
} from '~/src/common/helpers/types.js'

interface SessionCache {
  drop: (key: string) => Promise<void>
  get: (key: string) => Promise<RequestAuth['credentials'] | undefined>
  set: (key: string, credentials: RequestAuth['credentials']) => Promise<void>
}

declare module '@hapi/hapi' {
  // Here we are decorating Hapi interface types with
  // props from plugins which doesn't export @types
  interface Request {
    logger: Logger
  }

  interface Server {
    logger: Logger
    method(name: 'session.drop', method: SessionCache['drop']): void
    method(name: 'session.get', method: SessionCache['get']): void
    method(name: 'session.set', method: SessionCache['set']): void
  }

  interface ServerMethods {
    session: SessionCache
  }

  interface AuthArtifacts {
    token_type: 'Bearer'
    scope: string
    expires_in: number
    ext_expires_in: number
    access_token: string
    refresh_token: string
    id_token: string
  }

  interface AuthCredentials {
    provider: 'azure-oidc'
    query: StringLikeMap
    token: string
    idToken: string
    refreshToken: string
    expiresIn: number
  }

  interface UserCredentials {
    /**
     * User ID
     */
    id: UserProfile['sub']

    /**
     * User email address
     */
    email: UserProfile['email']

    /**
     * User display name
     */
    displayName: string

    /**
     * Session issued time (ISO 8601)
     */
    issuedAt?: string

    /**
     * Session expiry time (ISO 8601)
     */
    expiresAt?: string
  }
}

declare module '@hapi/yar' {
  type CreateKey = (typeof sessionNames)['create']
  type RedirectToKey = (typeof sessionNames)['redirectTo']
  type ValidationKey = (typeof sessionNames)['validationFailure']
  type SuccessNotification = (typeof sessionNames)['successNotification']
  type ErrorListKey = (typeof sessionNames)['errorList']

  interface Yar {
    /**
     * Get temporary redirect path for after sign in
     * (Deleted when read, e.g. after a redirect)
     */
    flash(type: RedirectToKey): string[]

    /**
     * Get temporary error messages from the session
     * (Deleted when read, e.g. after a redirect)
     */
    flash(type: ValidationKey): ValidationFailure<FormMetadataInput>[]

    /**
     * Get temporary error messages relating to the current page.
     */
    flash(type: ErrorListKey): ErrorDetailsItem[]

    /**
     *
     * @param type
     */
    flash(type: SuccessNotification): string[]

    /**
     * Get form metadata from the session
     */
    get(type: CreateKey): Partial<FormMetadataInput> | undefined

    /**
     * Set form metadata on the session
     */
    set<Schema = FormMetadataInput>(
      type: CreateKey,
      metadata: Partial<Schema>
    ): Partial<Schema>
  }
}
