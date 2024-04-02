import nock from 'nock'

import config from '~/src/config.js'
import { librariesFixture } from '~/src/__fixtures__/libraries.js' // FIXME
import { fetcher } from '~/src/common/helpers/fetch/fetcher.js'

describe('#fetchJson', () => {
  const librariesEndpoint = config.portalBackendApiUrl + '/libraries'
  const librariesEndpointUrl = new URL(librariesEndpoint)

  test('Should provide expected libraries response', async () => {
    nock(librariesEndpointUrl.origin)
      .get(librariesEndpointUrl.pathname)
      .reply(200, librariesFixture)

    const { json: librariesResponse } = await fetcher(librariesEndpoint)

    expect(librariesResponse).toEqual(librariesFixture)
  })

  test('With error, Should throw with expected message', async () => {
    nock(librariesEndpointUrl.origin)
      .get(librariesEndpointUrl.pathname)
      .reply(407, { message: 'Woaaaaaaaaaaaaaaaah calm down!' })

    expect.assertions(2)

    try {
      await fetcher(librariesEndpoint)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Woaaaaaaaaaaaaaaaah calm down!')
    }
  })

  test('With different status code, Should throw with expected message', async () => {
    nock(librariesEndpointUrl.origin)
      .get(librariesEndpointUrl.pathname)
      .reply(410, {})

    expect.assertions(2)

    try {
      await fetcher(librariesEndpoint)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Gone')
    }
  })
})
