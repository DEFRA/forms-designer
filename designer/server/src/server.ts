import { createServer } from '~/src/createServer'

export async function listen() {
  const server = await createServer()
  server.start()
  process.send?.('online')
}
