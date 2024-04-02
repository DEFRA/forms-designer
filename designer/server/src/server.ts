import { createServer } from '~/src/createServer.js'

export async function listen() {
  const server = await createServer()
  server.start()
  process.send?.('online')
}
