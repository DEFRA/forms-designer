import { http } from 'msw'
// eslint-disable-next-line import/no-unresolved
import { setupServer } from 'msw/node'

const mockedFormConfigurations = [
  {
    Key: 'Not-a-feedback-form',
    DisplayName: 'Not a feedback form',
    feedbackForm: false
  },
  {
    Key: 'My-feedback-form',
    DisplayName: 'My feedback form',
    feedbackForm: true
  }
]

const server = setupServer(
  http.get('/forms-designer/api/configurations', () => {
    return new Response(JSON.stringify(mockedFormConfigurations), {
      headers: { 'Content-Type': 'application/json' }
    })
  }),

  http.get('*', ({ request }) => {
    console.error(`Please add request handler for ${request.url}`)
    return new Response(JSON.stringify('You must add request handler.'), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  })
)

export { server, http, mockedFormConfigurations }
