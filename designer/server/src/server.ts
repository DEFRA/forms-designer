import config from '~/src/config.js'
import { createServer } from '~/src/createServer.js'

export async function listen() {
  const server = await createServer()
  await server.start()

  process.send?.('online')

  server.logger.info('Server started successfully')
  server.logger.info(`Access your frontend on http://localhost:${config.port}`)
}
