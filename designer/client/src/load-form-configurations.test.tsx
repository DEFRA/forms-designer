import { http } from 'msw'
import * as formConfigurationsApi from './load-form-configurations'
import { server } from '../../test/testServer'

describe('Load form configurations', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('Should load configurations when returned', () => {
    const configurations = [{ myProperty: 'myValue' }]
    server.resetHandlers(
      http.get('/forms-designer/api/configurations', () => {
        return new Response(JSON.stringify(configurations), {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        })
      })
    )
    return formConfigurationsApi.loadConfigurations().then((data) => {
      expect(data).toStrictEqual(configurations)
    })
  })

  test('Should return no configurations when an error occurs', () => {
    server.resetHandlers(
      http.get('/forms-designer/api/configurations', () => {
        return new Response(JSON.stringify('Some error happened'), {
          headers: { 'Content-Type': 'application/json' },
          status: 500
        })
      })
    )
    return formConfigurationsApi.loadConfigurations().then((data) => {
      expect(data).toStrictEqual([])
    })
  })
})
