import { sessionNames } from '~/src/common/constants/session-names.js'
import { handleBadRequest } from '~/src/plugins/error-pages/form-errors.js'

describe('handleBadRequest', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockRequest: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockH: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockResponse: any

  beforeEach(() => {
    mockRequest = {
      headers: {},
      yar: {
        flash: jest.fn()
      }
    }
    mockH = {
      redirect: jest.fn()
    }
    mockResponse = {
      data: undefined
    }
  })

  it('should set error details and redirect if response is a Boom with form definition errors and referer header exists', () => {
    mockRequest.headers.referer = '/previous-page'
    mockResponse.data = {
      error: 'InvalidFormDefinitionError',
      cause: [
        { id: 'unique_page_id', message: 'Duplicate page id' },
        { id: 'other', message: 'Some other error' }
      ]
    }

    handleBadRequest(mockRequest, mockH, mockResponse)

    expect(mockRequest.yar.flash).toHaveBeenCalledWith(
      sessionNames.badRequestErrorList,
      [
        {
          text: 'Each page must have a unique ID. Change the page ID to one that is not already used.'
        },
        {
          text: 'There is a problem with the form definition. Check your changes and try again.'
        }
      ]
    )
    expect(mockH.redirect).toHaveBeenCalledWith('/previous-page')
  })

  it('should set error details and return null if referer header does not exist', () => {
    mockResponse.data = {
      error: 'InvalidFormDefinitionError',
      cause: [
        { id: 'unique_section_title', message: 'Duplicate section title' }
      ]
    }

    const result = handleBadRequest(mockRequest, mockH, mockResponse)

    expect(mockRequest.yar.flash).toHaveBeenCalledWith(
      sessionNames.badRequestErrorList,
      [
        {
          text: 'Each section must have a unique title. Change the section title to one that is not already used.'
        }
      ]
    )
    expect(mockH.redirect).not.toHaveBeenCalled()
    expect(result).toBeNull()
  })

  it('should return null and not set error details if response.data is missing', () => {
    mockResponse.data = undefined

    const result = handleBadRequest(mockRequest, mockH, mockResponse)

    expect(mockRequest.yar.flash).not.toHaveBeenCalled()
    expect(mockH.redirect).not.toHaveBeenCalled()
    expect(result).toBeNull()
  })

  it('should return null and not set error details if response.data.error is not InvalidFormDefinitionError', () => {
    mockResponse.data = {
      error: 'SomeOtherError',
      cause: []
    }

    const result = handleBadRequest(mockRequest, mockH, mockResponse)

    expect(mockRequest.yar.flash).not.toHaveBeenCalled()
    expect(mockH.redirect).not.toHaveBeenCalled()
    expect(result).toBeNull()
  })

  it('should handle unknown error ids', () => {
    mockRequest.headers.referer = '/somewhere'
    mockResponse.data = {
      error: 'InvalidFormDefinitionError',
      cause: [{ id: 'unknown_error_id', message: 'Something went wrong' }]
    }

    handleBadRequest(mockRequest, mockH, mockResponse)

    expect(mockRequest.yar.flash).toHaveBeenCalledWith(
      sessionNames.badRequestErrorList,
      [
        {
          text: 'Unknown error: Something went wrong (unknown_error_id)'
        }
      ]
    )
    expect(mockH.redirect).toHaveBeenCalledWith('/somewhere')
  })
})
