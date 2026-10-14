import { AuditEventMessageType } from '@defra/forms-model'
import Boom from '@hapi/boom'

import config from '~/src/config.js'
import { getFormHistory } from '~/src/lib/audit.js'
import { getJson } from '~/src/lib/fetch.js'

jest.mock('~/src/lib/fetch.js')

const mockedGetJson = /** @type {jest.MockedFunction<typeof getJson>} */ (
  getJson
)

/**
 * Creates a minimal mock response
 * @param {object} [props]
 * @param {number} [props.statusCode]
 */
function createMockResponse(props = {}) {
  /** @type {any} */
  const response = {
    statusCode: props.statusCode ?? 200,
    headers: {}
  }

  return response
}

/**
 * Creates a mock audit record
 * @param {object} [overrides]
 */
function createMockAuditRecord(overrides = {}) {
  return {
    id: '68948579d5659369f1e634c6',
    messageId: '46bcc5ee-49e7-4eb9-9b2b-02e41faa7ec1',
    category: 'FORM',
    type: AuditEventMessageType.FORM_CREATED,
    schemaVersion: 1,
    source: 'FORMS_MANAGER',
    entityId: '694c11d3c664844dfdaf7719',
    createdAt: new Date('2025-12-24T16:16:19.327Z'),
    createdBy: {
      id: '86758ba9-92e7-4287-9751-7705e449688e',
      displayName: 'Test User'
    },
    data: {
      formId: '694c11d3c664844dfdaf7719',
      slug: 'test-form',
      title: 'Test Form',
      organisation: 'Defra',
      teamName: 'Test Team',
      teamEmail: 'test@example.gov.uk'
    },
    messageCreatedAt: new Date('2025-12-24T16:16:19.335Z'),
    recordCreatedAt: new Date('2025-12-24T16:16:21.878Z'),
    ...overrides
  }
}

/**
 * Creates mock API response with pagination meta
 * @param {object[]} records
 * @param {object} [paginationOverrides]
 */
function createMockApiResponse(records, paginationOverrides = {}) {
  return {
    auditRecords: records,
    meta: {
      pagination: {
        page: 1,
        perPage: 25,
        totalItems: records.length,
        totalPages: 1,
        ...paginationOverrides
      },
      sorting: {
        sortBy: 'createdAt',
        order: 'desc'
      }
    }
  }
}

describe('audit.js', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getFormHistory', () => {
    const formId = '694c11d3c664844dfdaf7719'
    const token = 'someToken'
    const auditEndpoint = new URL('/audit/forms/', config.auditUrl)
    const expectedOptions = {
      headers: { Authorization: `Bearer ${token}` }
    }

    describe('when getJson succeeds', () => {
      it('returns audit records with pagination meta', async () => {
        const mockRecords = [
          createMockAuditRecord(),
          createMockAuditRecord({
            id: '68948579d5659369f1e634c7',
            type: AuditEventMessageType.FORM_UPDATED
          })
        ]
        const mockResponse = createMockApiResponse(mockRecords)

        mockedGetJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: mockResponse
        })

        const requestUrl = new URL(`./${formId}`, auditEndpoint)
        const result = await getFormHistory(formId, token)

        expect(mockedGetJson).toHaveBeenCalledWith(requestUrl, expectedOptions)
        expect(result).toEqual(mockResponse)
      })

      it('handles empty audit records array', async () => {
        const mockResponse = createMockApiResponse([], { totalItems: 0 })

        mockedGetJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: mockResponse
        })

        const result = await getFormHistory(formId, token)

        expect(result.auditRecords).toEqual([])
        expect(result.meta.pagination.totalItems).toBe(0)
      })

      it('passes pagination options as query parameters', async () => {
        const mockResponse = createMockApiResponse([createMockAuditRecord()], {
          page: 2,
          perPage: 10,
          totalItems: 50,
          totalPages: 5
        })

        mockedGetJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: mockResponse
        })

        const result = await getFormHistory(formId, token, {
          page: 2,
          perPage: 10
        })

        const expectedUrl = new URL(`./${formId}`, auditEndpoint)
        expectedUrl.searchParams.append('page', '2')
        expectedUrl.searchParams.append('perPage', '10')

        expect(mockedGetJson).toHaveBeenCalledWith(expectedUrl, expectedOptions)
        expect(result.meta.pagination.page).toBe(2)
        expect(result.meta.pagination.perPage).toBe(10)
      })

      it('omits pagination params when not provided', async () => {
        const mockResponse = createMockApiResponse([createMockAuditRecord()])

        mockedGetJson.mockResolvedValueOnce({
          response: createMockResponse(),
          body: mockResponse
        })

        await getFormHistory(formId, token)

        const expectedUrl = new URL(`./${formId}`, auditEndpoint)
        expect(mockedGetJson).toHaveBeenCalledWith(expectedUrl, expectedOptions)
      })
    })

    describe('when getJson fails', () => {
      it('throws Boom error when API returns error', async () => {
        const boomError = Boom.notFound('Form not found')
        mockedGetJson.mockRejectedValueOnce(boomError)

        await expect(getFormHistory(formId, token)).rejects.toThrow(boomError)
      })

      it('throws network error', async () => {
        const networkError = new Error('Network error')
        mockedGetJson.mockRejectedValueOnce(networkError)

        await expect(getFormHistory(formId, token)).rejects.toThrow(
          'Network error'
        )
      })
    })
  })
})
