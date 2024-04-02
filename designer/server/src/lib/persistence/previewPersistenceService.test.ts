import Wreck from '@hapi/wreck'
import config from '~/src/config'

import { PreviewPersistenceService } from '~/src/lib/persistence/previewPersistenceService'

jest.mock('@hapi/wreck')

describe('PreviewPersistenceService', () => {
  const UPLOAD_RESPONSE = { result: 'UPLOAD RESPONSE' }
  const GET_RESPONSE = {
    payload: Buffer.from(JSON.stringify({ values: 'OK' }))
  }

  beforeEach(() => {
    jest.spyOn(Wreck, 'get').mockResolvedValue(GET_RESPONSE)
    jest.spyOn(Wreck, 'post').mockResolvedValue(UPLOAD_RESPONSE)
  })

  test('it uploads configuration', async () => {
    const previewService = new PreviewPersistenceService()
    const id = '123ABC'
    const configuration = 'test'
    const result = await previewService.uploadConfiguration(id, configuration)

    expect(jest.mocked(Wreck.post).mock.calls[0]).toEqual([
      `${config.publishUrl}/publish`,
      {
        payload: JSON.stringify({ id, configuration })
      }
    ])

    expect(result).toBe(UPLOAD_RESPONSE)
  })

  test('it copies configuration', async () => {
    const previewService = new PreviewPersistenceService()
    const configId = '123ABC'
    const newName = 'test'
    const result = await previewService.copyConfiguration(configId, newName)

    expect(jest.mocked(Wreck.get).mock.calls[0]).toEqual([
      `${config.publishUrl}/published/${configId}`
    ])

    expect(jest.mocked(Wreck.post).mock.calls[0]).toEqual([
      `${config.publishUrl}/publish`,
      {
        payload: JSON.stringify({ id: newName, configuration: 'OK' })
      }
    ])

    expect(result).toEqual(UPLOAD_RESPONSE)
  })

  test('it lists all configurations', async () => {
    const previewService = new PreviewPersistenceService()
    const result = await previewService.listAllConfigurations()
    expect(result).toEqual(JSON.parse(GET_RESPONSE.payload.toString()))
  })

  test('it gets a configuration', async () => {
    const id = '123ABC'
    const previewService = new PreviewPersistenceService()
    const result = await previewService.getConfiguration(id)

    expect(jest.mocked(Wreck.get).mock.calls[0]).toEqual([
      `${config.publishUrl}/published/${id}`
    ])

    expect(result).toEqual(GET_RESPONSE.payload.toString())
  })
})
