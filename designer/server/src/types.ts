/* eslint-disable @typescript-eslint/unified-signatures */

import { type Logger } from 'pino'

import { type PersistenceService } from '~/src/lib/persistence/persistenceService.js'

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

declare module '@hapipal/schmervice' {
  interface RegisteredServices {
    persistenceService: PersistenceService
  }

  interface SchmerviceDecorator {
    (all?: boolean): RegisteredServices
    (namespace?: string[]): RegisteredServices
  }
}
