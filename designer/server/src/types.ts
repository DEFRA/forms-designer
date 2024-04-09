import { type Logger } from 'pino'

import { type PersistenceService } from '~/src/lib/persistence/persistenceService.js'

type Services = () => {
  persistenceService: PersistenceService
}

declare module '@hapi/hapi' {
  // Here we are decorating Hapi interface types with
  // props from plugins which doesn't export @types
  interface Request {
    services: Services // plugin schmervice
    logger: Logger
  }

  interface Server {
    logger: Logger
    services: Services // plugin schmervice
    registerService: (services: unknown[]) => void // plugin schmervice
  }
}
