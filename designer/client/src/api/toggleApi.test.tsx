import { http, HttpResponse } from 'msw'
import { FeatureToggleApi } from '~/src/api/toggleApi'
import { server, mockedFormHandlers } from '~/test/testServer'

describe('Toggle API', () => {
  const url = '/forms-designer/feature-toggles'

  beforeAll(() => server.listen())
  beforeEach(() => server.resetHandlers(...mockedFormHandlers))
  afterAll(() => server.close())

  test('Should fetch feature toggles', () => {
    const toggle = [{ ff_somevalue: 'false' }]
    server.resetHandlers(
      http.get(url, () => {
        return new Response(JSON.stringify(toggle), {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        })
      })
    )

    const fetchToggle = new FeatureToggleApi().fetch()
    return expect(fetchToggle).resolves.toStrictEqual(toggle)
  })

  test('Should return nothing on server error', () => {
    server.resetHandlers(
      http.get(url, () => {
        return new Response(JSON.stringify('Some error happened'), {
          headers: { 'Content-Type': 'application/json' },
          status: 500
        })
      })
    )

    const fetchToggle = new FeatureToggleApi().fetch()
    return expect(fetchToggle).resolves.toStrictEqual([])
  })

  test('Should return nothing with get exception', () => {
    server.resetHandlers(
      http.get(url, () => {
        return HttpResponse.error()
      })
    )

    const fetchToggle = new FeatureToggleApi().fetch()
    return expect(fetchToggle).resolves.toStrictEqual([])
  })
})
