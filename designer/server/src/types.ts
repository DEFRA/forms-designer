/* eslint-disable @typescript-eslint/unified-signatures */

import { type Logger } from 'pino'

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
