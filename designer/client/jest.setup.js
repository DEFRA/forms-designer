const { Blob, File } = require('node:buffer')
const { performance } = require('node:perf_hooks')
const { ReadableStream, TransformStream } = require('node:stream/web')
const { clearImmediate, setImmediate } = require('node:timers')
const { TextDecoder, TextEncoder } = require('node:util')

Object.defineProperties(globalThis, {
  clearImmediate: { value: clearImmediate },
  performance: { value: performance },
  setImmediate: { value: setImmediate },
  ReadableStream: { value: ReadableStream },
  TransformStream: { value: TransformStream },
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder }
})

const { fetch, Headers, FormData, Request, Response } = require('undici')

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true },
  Blob: { value: Blob },
  File: { value: File },
  FormData: { value: FormData },
  Headers: { value: Headers },
  Request: { value: Request },
  Response: { value: Response }
})
