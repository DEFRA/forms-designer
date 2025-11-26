import { Engine } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import {
  buildDefinition,
  buildQuestionPage,
  buildSummaryPage,
  buildTextFieldComponent
} from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import {
  addSection,
  assignPageToSection,
  removeSection,
  unassignPageFromSection,
  updateSectionSettings
} from '~/src/lib/editor.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { SECTION_NAME_ALREADY_EXISTS } from '~/src/models/forms/editor-v2/common.js'
import {
  ROUTE_PATH_SECTIONS,
  handleSectionOperation
} from '~/src/routes/forms/editor-v2/sections.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/error-helper.js')

describe('Editor v2 sections routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const testDefinition = buildDefinition({
    pages: [
      buildQuestionPage({
        id: 'p1',
        title: 'Page one',
        components: [buildTextFieldComponent()]
      }),
      buildSummaryPage({ id: 'cya-page' })
    ],
    sections: [{ name: 'section-1', title: 'Section One', hideTitle: false }],
    engine: Engine.V2
  })

  describe('GET /sections', () => {
    test('should render sections page', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testDefinition)

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/page/cya-page/check-answers-settings/sections',
        auth
      }

      const { container, response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.OK)
      const $mainHeadings = container.getAllByRole('heading', { level: 1 })
      expect($mainHeadings[0]).toHaveTextContent('Test form')
    })

    test('should render sections page with validation errors from session', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testDefinition)

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/page/cya-page/check-answers-settings/sections',
        auth
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.OK)
    })
  })

  describe('POST /sections - add section', () => {
    test('should add section and redirect with success notification', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(addSection).mockResolvedValueOnce(testDefinition)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/page/cya-page/check-answers-settings/sections',
        auth,
        payload: {
          operation: 'add-section',
          sectionHeading: 'New Section'
        }
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(response.headers.location).toBe(
        '/library/my-form-slug/editor-v2/page/cya-page/check-answers-settings/sections'
      )
      expect(addSection).toHaveBeenCalledWith(
        testFormMetadata.id,
        expect.anything(),
        'New Section'
      )
    })

    test('should error if section heading is missing', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/page/cya-page/check-answers-settings/sections',
        auth,
        payload: {
          operation: 'add-section',
          sectionHeading: ''
        }
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(addErrorsToSession).toHaveBeenCalledWith(
        expect.anything(),
        'sectionsValidationFailure',
        expect.any(Joi.ValidationError)
      )
    })

    test('should handle section name already exists error', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(addSection)
        .mockRejectedValueOnce(new Error(SECTION_NAME_ALREADY_EXISTS))

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/page/cya-page/check-answers-settings/sections',
        auth,
        payload: {
          operation: 'add-section',
          sectionHeading: 'Section One'
        }
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
    })

    test('should rethrow other errors', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(addSection).mockRejectedValueOnce(new Error('Other error'))

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/page/cya-page/check-answers-settings/sections',
        auth,
        payload: {
          operation: 'add-section',
          sectionHeading: 'New Section'
        }
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })

  describe('POST /sections - remove section', () => {
    test('should remove section and redirect with success notification', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(removeSection).mockResolvedValueOnce(testDefinition)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/page/cya-page/check-answers-settings/sections',
        auth,
        payload: {
          operation: 'remove-section',
          sectionId: 'section-1'
        }
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(removeSection).toHaveBeenCalledWith(
        testFormMetadata.id,
        expect.anything(),
        'section-1'
      )
    })

    test('should error if sectionId is missing for remove operation', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/page/cya-page/check-answers-settings/sections',
        auth,
        payload: {
          operation: 'remove-section'
        }
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(addErrorsToSession).toHaveBeenCalled()
    })
  })

  describe('POST /sections - assign page', () => {
    test('should assign page to section and redirect with success notification', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(assignPageToSection).mockResolvedValueOnce(testDefinition)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/page/cya-page/check-answers-settings/sections',
        auth,
        payload: {
          operation: 'assign-page',
          sectionId: 'section-1',
          pageId: 'p1'
        }
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(assignPageToSection).toHaveBeenCalledWith(
        testFormMetadata.id,
        expect.anything(),
        'p1',
        'section-1'
      )
    })

    test('should error if pageId is missing for assign operation', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/page/cya-page/check-answers-settings/sections',
        auth,
        payload: {
          operation: 'assign-page',
          sectionId: 'section-1'
        }
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(addErrorsToSession).toHaveBeenCalled()
    })
  })

  describe('POST /sections - unassign page', () => {
    test('should unassign page from section and redirect with success notification', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(unassignPageFromSection).mockResolvedValueOnce(testDefinition)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/page/cya-page/check-answers-settings/sections',
        auth,
        payload: {
          operation: 'unassign-page',
          pageId: 'p1'
        }
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(unassignPageFromSection).toHaveBeenCalledWith(
        testFormMetadata.id,
        expect.anything(),
        'p1'
      )
    })

    test('should error if pageId is missing for unassign operation', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/page/cya-page/check-answers-settings/sections',
        auth,
        payload: {
          operation: 'unassign-page'
        }
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(addErrorsToSession).toHaveBeenCalled()
    })
  })

  describe('POST /sections - save settings', () => {
    test('should update section settings with hideTitle true', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(updateSectionSettings).mockResolvedValueOnce(testDefinition)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/page/cya-page/check-answers-settings/sections',
        auth,
        payload: {
          operation: 'save-settings',
          sectionId: 'section-1',
          hideTitle: 'true'
        }
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(updateSectionSettings).toHaveBeenCalledWith(
        testFormMetadata.id,
        expect.anything(),
        'section-1',
        { hideTitle: true }
      )
    })

    test('should update section settings with hideTitle false', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(updateSectionSettings).mockResolvedValueOnce(testDefinition)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/page/cya-page/check-answers-settings/sections',
        auth,
        payload: {
          operation: 'save-settings',
          sectionId: 'section-1',
          hideTitle: 'false'
        }
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(updateSectionSettings).toHaveBeenCalledWith(
        testFormMetadata.id,
        expect.anything(),
        'section-1',
        { hideTitle: false }
      )
    })
  })

  describe('POST /sections - invalid operation', () => {
    test('should error for invalid operation', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/page/cya-page/check-answers-settings/sections',
        auth,
        payload: {
          operation: 'invalid-operation'
        }
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(addErrorsToSession).toHaveBeenCalled()
    })
  })

  describe('handleSectionOperation', () => {
    const formId = '661e4ca5039739ef2902b214'
    const token = 'test-token'

    test('should handle add-section operation', async () => {
      jest.mocked(addSection).mockResolvedValueOnce(testDefinition)

      const result = await handleSectionOperation(
        'add-section',
        { operation: 'add-section', sectionHeading: 'Test' },
        formId,
        token
      )

      expect(result).toBe('Section added')
      expect(addSection).toHaveBeenCalledWith(formId, token, 'Test')
    })

    test('should handle add-section with empty heading', async () => {
      jest.mocked(addSection).mockResolvedValueOnce(testDefinition)

      const result = await handleSectionOperation(
        'add-section',
        { operation: 'add-section' },
        formId,
        token
      )

      expect(result).toBe('Section added')
      expect(addSection).toHaveBeenCalledWith(formId, token, '')
    })

    test('should handle remove-section operation', async () => {
      jest.mocked(removeSection).mockResolvedValueOnce(testDefinition)

      const result = await handleSectionOperation(
        'remove-section',
        { operation: 'remove-section', sectionId: 'section-1' },
        formId,
        token
      )

      expect(result).toBe('Section removed')
      expect(removeSection).toHaveBeenCalledWith(formId, token, 'section-1')
    })

    test('should handle remove-section with empty sectionId', async () => {
      jest.mocked(removeSection).mockResolvedValueOnce(testDefinition)

      const result = await handleSectionOperation(
        'remove-section',
        { operation: 'remove-section' },
        formId,
        token
      )

      expect(result).toBe('Section removed')
      expect(removeSection).toHaveBeenCalledWith(formId, token, '')
    })

    test('should handle assign-page operation', async () => {
      jest.mocked(assignPageToSection).mockResolvedValueOnce(testDefinition)

      const result = await handleSectionOperation(
        'assign-page',
        { operation: 'assign-page', pageId: 'p1', sectionId: 'section-1' },
        formId,
        token
      )

      expect(result).toBe('Page assigned to section')
      expect(assignPageToSection).toHaveBeenCalledWith(
        formId,
        token,
        'p1',
        'section-1'
      )
    })

    test('should handle assign-page with empty values', async () => {
      jest.mocked(assignPageToSection).mockResolvedValueOnce(testDefinition)

      const result = await handleSectionOperation(
        'assign-page',
        { operation: 'assign-page' },
        formId,
        token
      )

      expect(result).toBe('Page assigned to section')
      expect(assignPageToSection).toHaveBeenCalledWith(formId, token, '', '')
    })

    test('should handle unassign-page operation', async () => {
      jest.mocked(unassignPageFromSection).mockResolvedValueOnce(testDefinition)

      const result = await handleSectionOperation(
        'unassign-page',
        { operation: 'unassign-page', pageId: 'p1' },
        formId,
        token
      )

      expect(result).toBe('Page unassigned from section')
      expect(unassignPageFromSection).toHaveBeenCalledWith(formId, token, 'p1')
    })

    test('should handle unassign-page with empty pageId', async () => {
      jest.mocked(unassignPageFromSection).mockResolvedValueOnce(testDefinition)

      const result = await handleSectionOperation(
        'unassign-page',
        { operation: 'unassign-page' },
        formId,
        token
      )

      expect(result).toBe('Page unassigned from section')
      expect(unassignPageFromSection).toHaveBeenCalledWith(formId, token, '')
    })

    test('should handle save-settings operation with hideTitle true', async () => {
      jest.mocked(updateSectionSettings).mockResolvedValueOnce(testDefinition)

      const result = await handleSectionOperation(
        'save-settings',
        { operation: 'save-settings', sectionId: 'section-1', hideTitle: true },
        formId,
        token
      )

      expect(result).toBe('Changes saved successfully')
      expect(updateSectionSettings).toHaveBeenCalledWith(
        formId,
        token,
        'section-1',
        { hideTitle: true }
      )
    })

    test('should handle save-settings operation with hideTitle false', async () => {
      jest.mocked(updateSectionSettings).mockResolvedValueOnce(testDefinition)

      const result = await handleSectionOperation(
        'save-settings',
        {
          operation: 'save-settings',
          sectionId: 'section-1',
          hideTitle: false
        },
        formId,
        token
      )

      expect(result).toBe('Changes saved successfully')
      expect(updateSectionSettings).toHaveBeenCalledWith(
        formId,
        token,
        'section-1',
        { hideTitle: false }
      )
    })

    test('should handle save-settings with empty sectionId', async () => {
      jest.mocked(updateSectionSettings).mockResolvedValueOnce(testDefinition)

      const result = await handleSectionOperation(
        'save-settings',
        { operation: 'save-settings' },
        formId,
        token
      )

      expect(result).toBe('Changes saved successfully')
      expect(updateSectionSettings).toHaveBeenCalledWith(formId, token, '', {
        hideTitle: false
      })
    })

    test('should return null for unknown operation', async () => {
      const result = await handleSectionOperation(
        'unknown',
        { operation: 'unknown' },
        formId,
        token
      )

      expect(result).toBeNull()
    })
  })

  describe('ROUTE_PATH_SECTIONS', () => {
    test('should export correct route path', () => {
      expect(ROUTE_PATH_SECTIONS).toBe(
        '/library/{slug}/editor-v2/page/{pageId}/check-answers-settings/sections'
      )
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
