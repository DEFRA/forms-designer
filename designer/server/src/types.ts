/* eslint-disable @typescript-eslint/unified-signatures */

import { type FormMetadataInput } from '@defra/forms-model'
import { type RequestAuth } from '@hapi/hapi'
import { type Logger } from 'pino'

import { type sessionNames } from '~/src/common/constants/session-names.js'
import { type ValidationFailure } from '~/src/common/helpers/build-error-details.js'

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
}

declare module '@hapi/yar' {
  type CreateKey = (typeof sessionNames)['create']
  type ReferrerKey = (typeof sessionNames)['referrer']
  type ValidationKey = (typeof sessionNames)['validationFailure']

  interface Yar {
    /**
     * Get temporary redirect path for after sign in
     * (Deleted when read, e.g. after a redirect)
     */
    flash(type: ReferrerKey): string

    /**
     * Get temporary error messages from the session
     * (Deleted when read, e.g. after a redirect)
     */
    flash(type: ValidationKey): ValidationFailure<FormMetadataInput>[]

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
