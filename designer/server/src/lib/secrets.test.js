import { ComponentType } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import config from '~/src/config.js'
import {
  baseOptions,
  createMockResponse,
  mockedGetJson,
  mockedPostJson,
  token
} from '~/src/lib/__stubs__/editor.js'
import {
  MASKED_KEY,
  existsSecret,
  getPaymentSecretsMasked,
  savePaymentSecret,
  savePaymentSecrets,
  validateApiKey
} from '~/src/lib/secrets.js'

jest.mock('~/src/lib/fetch.js')
jest.mock('~/src/config.ts')

const managerEndpoint = new URL(config.managerUrl)

describe('secrets.js', () => {
  beforeEach(() => {
    jest.mocked(config).managerUrl = 'http://localhost:3001'
    jest.mocked(config).testingBypassValidationForPaymentApiKeys = false
  })
  const formId = '98dbfb6c-93b7-41dc-86e7-02c7abe4ba38'
  const secretName = 'my-new-secret'

  const baseRequestUrl = new URL(
    `/forms/${formId}/secrets/${secretName}`,
    managerEndpoint
  )

  describe('existsSecret', () => {
    it('should check existence of the secret', async () => {
      mockedGetJson.mockResolvedValueOnce({
        response: createMockResponse(),
        body: { exists: true }
      })
      const requestUrl = new URL('/exists', baseRequestUrl)
      const result = await existsSecret(formId, secretName, token)
      expect(result.exists).toBe(true)

      expect(mockedGetJson).toHaveBeenCalledWith(requestUrl, {
        ...baseOptions
      })
    })
  })

  describe('getPaymentSecretsMasked', () => {
    it('should get masked version of secrets', async () => {
      mockedGetJson
        .mockResolvedValueOnce({
          response: createMockResponse(),
          body: { exists: true }
        })
        .mockResolvedValueOnce({
          response: createMockResponse(),
          body: { exists: false }
        })
      const result = await getPaymentSecretsMasked(formId, token)
      expect(result.testKey.maskedKey).toBe(MASKED_KEY)
      expect(result.testKey.exists).toBe(true)
      expect(result.liveKey.maskedKey).toBe('')
      expect(result.liveKey.exists).toBe(false)
    })
  })

  describe('savePaymentSecret', () => {
    it('should save the secret', async () => {
      mockedPostJson.mockResolvedValueOnce({
        response: createMockResponse({ statusCode: StatusCodes.OK }),
        body: {}
      })
      const requestUrl = new URL('', baseRequestUrl)
      await savePaymentSecret(formId, secretName, true, token)

      expect(mockedPostJson).toHaveBeenCalledWith(requestUrl, {
        payload: {
          secretValue: 'my-new-secret'
        },
        ...baseOptions
      })
    })

    it('should throw if error', async () => {
      mockedPostJson.mockResolvedValueOnce({
        response: createMockResponse({
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR
        }),
        body: {}
      })
      await expect(() =>
        savePaymentSecret(formId, secretName, true, token)
      ).rejects.toThrow('Failed to save LIVE Payment API key')
    })
  })

  describe('savePaymentSecrets', () => {
    it('should save test secret but not live secret', async () => {
      mockedPostJson
        .mockResolvedValueOnce({
          response: createMockResponse({ statusCode: StatusCodes.OK }),
          body: {}
        })
        .mockResolvedValueOnce({
          response: createMockResponse({ statusCode: StatusCodes.OK }),
          body: {}
        })

      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        paymentTestApiKey: 'Some new secret',
        paymentLiveApiKey: ''
      })

      await savePaymentSecrets(
        ComponentType.PaymentField,
        formId,
        payload,
        token,
        false
      )

      expect(mockedPostJson).toHaveBeenCalledTimes(1)
      expect(mockedPostJson).toHaveBeenCalledWith(expect.anything(), {
        payload: {
          secretValue: 'Some new secret'
        },
        ...baseOptions
      })
    })

    it('should save live secret but not test secret', async () => {
      mockedPostJson
        .mockResolvedValueOnce({
          response: createMockResponse({ statusCode: StatusCodes.OK }),
          body: {}
        })
        .mockResolvedValueOnce({
          response: createMockResponse({ statusCode: StatusCodes.OK }),
          body: {}
        })

      const payload = /** @type {FormEditorInputQuestionDetails} */ ({
        paymentTestApiKey: '',
        paymentLiveApiKey: 'Some new live secret'
      })

      await savePaymentSecrets(
        ComponentType.PaymentField,
        formId,
        payload,
        token,
        false
      )

      expect(mockedPostJson).toHaveBeenCalledTimes(1)
      expect(mockedPostJson).toHaveBeenCalledWith(expect.anything(), {
        payload: {
          secretValue: 'Some new live secret'
        },
        ...baseOptions
      })
    })
  })

  describe('validateApiKey', () => {
    it('should return true if validation bypassed', async () => {
      jest.mocked(config).testingBypassValidationForPaymentApiKeys = true
      const result = await validateApiKey(
        'invalid-key-but-validation-bypassed',
        false
      )
      expect(result).toBe(true)
    })
    it('should return true if valid key', async () => {
      /* eslint-disable  @typescript-eslint/only-throw-error */
      mockedGetJson.mockImplementationOnce(() => {
        throw { output: { statusCode: StatusCodes.NOT_FOUND } }
      })
      const result = await validateApiKey('key-name', false)
      expect(result).toBe(true)
    })
    it('should throw if invalid key', async () => {
      /* eslint-disable  @typescript-eslint/only-throw-error */
      mockedGetJson.mockImplementationOnce(() => {
        throw { output: { statusCode: StatusCodes.UNAUTHORIZED } }
      })
      await expect(() => validateApiKey('key-name', false)).rejects.toThrow(
        'Invalid API key'
      )
    })
    it('should throw if other error', async () => {
      /* eslint-disable  @typescript-eslint/only-throw-error */
      mockedGetJson.mockImplementationOnce(() => {
        throw {
          output: { statusCode: StatusCodes.INTERNAL_SERVER_ERROR },
          message: 'API error'
        }
      })
      await expect(() => validateApiKey('key-name', false)).rejects.toThrow(
        'Error calling GovUk Pay: API error'
      )
    })
    it('should return false if no exception - should never happen', async () => {
      mockedGetJson.mockResolvedValueOnce({
        response: createMockResponse({ statusCode: StatusCodes.OK }),
        body: {}
      })
      const result = await validateApiKey('key-name', false)
      expect(result).toBe(false)
    })
  })
})

/**
 * @import { FormEditorInputQuestionDetails } from '@defra/forms-model'
 */
