/* eslint-disable @typescript-eslint/unified-signatures */

import { type FormMetadataInput } from '@defra/forms-model'
import { type Logger } from 'pino'

import { type sessionNames } from '~/src/common/constants/session-names.js'
import { type ValidationFailure } from '~/src/common/helpers/build-error-details.js'

declare module '@hapi/hapi' {
  // Here we are decorating Hapi interface types with
  // props from plugins which doesn't export @types
  interface Request {
    logger: Logger
  }

  interface Server {
    logger: Logger
  }
}

declare module '@hapi/yar' {
  type CreateKey = (typeof sessionNames)['create']
  type ValidationKey = (typeof sessionNames)['validationFailure']

  interface Yar {
    /**
     * Get temporary error messages from the session
     * (Deleted when read, e.g. after a redirect)
     */
    flash(type: ValidationKey): ValidationFailure<FormMetadataInput>[]

    /**
     * Get form metadata from the session
     */
    get(type: CreateKey): Partial<FormMetadataInput> | undefined
  }
}
