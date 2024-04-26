import { http } from 'msw'
// eslint-disable-next-line import/no-unresolved
import { setupServer } from 'msw/node'

export { http } from 'msw'

/**
 * @satisfies {HttpHandler[]}
 */
export const mockedFormHandlers = [
  http.get('*', ({ request }) => {
    console.error(`Please add request handler for ${request.url}`)
    return new Response(JSON.stringify('You must add request handler.'), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  })
]

export const server = setupServer(...mockedFormHandlers)

/**
 * @typedef {import('@defra/forms-model').FormConfiguration} FormConfiguration
 * @typedef {import('msw').HttpHandler} HttpHandler
 */
