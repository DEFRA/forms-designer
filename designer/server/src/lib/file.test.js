import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'

import config from '~/src/config.js'
import { getJson, postJson } from '~/src/lib/fetch.js'
import { checkFileStatus, createFileLink } from '~/src/lib/file.js'

jest.mock('~/src/lib/fetch.js')

const mockedGetJson = jest.mocked(getJson)
const mockedPostJson = jest.mocked(postJson)

describe('file.js', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('checkFileStatus', () => {
    const fieldId = 'someFieldId'
    const submissionEndpoint = new URL('/file/', config.submissionUrl)
    const requestUrl = new URL(`./${fieldId}`, submissionEndpoint)

    describe('when getJson succeeds', () => {
      test('returns status code and emailIsCaseSensitive', async () => {
        const mockResponse = {
          response: { statusCode: StatusCodes.OK },
          body: { retrievalKeyIsCaseSensitive: true }
        }
        mockedGetJson.mockResolvedValueOnce(mockResponse)

        const result = await checkFileStatus(fieldId)

        expect(mockedGetJson).toHaveBeenCalledWith(requestUrl, {})
        expect(result).toEqual({
          statusCode: StatusCodes.OK,
          emailIsCaseSensitive: true
        })
      })
    })

    describe('when response statusCode is missing', () => {
      test('defaults statusCode to INTERNAL_SERVER_ERROR', async () => {
        const mockResponse = {
          response: {},
          body: { retrievalKeyIsCaseSensitive: false }
        }
        mockedGetJson.mockResolvedValueOnce(mockResponse)

        const result = await checkFileStatus(fieldId)

        expect(result).toEqual({
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          emailIsCaseSensitive: false
        })
      })
    })

    describe('when Boom error is thrown', () => {
      test('returns Boom error status code and emailIsCaseSensitive as false', async () => {
        const boomError = Boom.notFound()
        mockedGetJson.mockRejectedValueOnce(boomError)

        const result = await checkFileStatus(fieldId)

        expect(result).toEqual({
          statusCode: boomError.output.statusCode,
          emailIsCaseSensitive: false
        })
      })
    })

    describe('when non-Boom error is thrown', () => {
      test('throws the error', async () => {
        const testError = new Error('Network error')
        mockedGetJson.mockRejectedValueOnce(testError)

        await expect(checkFileStatus(fieldId)).rejects.toThrow(testError)
      })
    })
  })

  describe('createFileLink', () => {
    const fileId = 'someFileId'
    const retrievalKey = 'someRetrievalKey'
    const token = 'someToken'
    const submissionEndpoint = new URL('/file/', config.submissionUrl)
    const requestUrl = new URL('link', submissionEndpoint)
    const expectedOptions = {
      payload: { fileId, retrievalKey },
      headers: { Authorization: `Bearer ${token}` }
    }

    describe('when postJson succeeds', () => {
      test('returns response body', async () => {
        const mockResponse = { body: { url: '/download-link' } }
        mockedPostJson.mockResolvedValueOnce(mockResponse)

        const result = await createFileLink(fileId, retrievalKey, token)

        expect(mockedPostJson).toHaveBeenCalledWith(requestUrl, expectedOptions)
        expect(result).toEqual(mockResponse.body)
      })
    })

    describe('when postJson fails', () => {
      test('throws the error', async () => {
        const testError = new Error('Network error')
        mockedPostJson.mockRejectedValueOnce(testError)

        await expect(
          createFileLink(fileId, retrievalKey, token)
        ).rejects.toThrow(testError)
      })
    })
  })
})
