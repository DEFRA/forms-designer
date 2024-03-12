import { http, HttpResponse } from 'msw'
import { FeatureToggleApi } from '../api/toggleApi'
import { server } from '../../test/testServer'

describe('Toggle API', () => {
  const url = '/feature-toggles'

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
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
    return new FeatureToggleApi().fetch().then((data) => {
      expect(data).toStrictEqual(toggle)
    })
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

    return new FeatureToggleApi().fetch().then((data) => {
      expect(data).toStrictEqual([])
    })
  })

  test('Should return nothing with get exception', () => {
    server.resetHandlers(
      http.get(url, () => {
        return HttpResponse.error()
      })
    )

    return new FeatureToggleApi().fetch().then((data) => {
      expect(data).toStrictEqual([])
    })
  })
})
