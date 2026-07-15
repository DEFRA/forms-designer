import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import xlsx from 'xlsx'

import { testFormDefinitionWithTwoQuestions } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { validateFileSelected } from '~/src/routes/forms/editor-v2/translations.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/forms.js')

describe('Translations routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  test('GET - should render english/welsh fields in the view', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/welsh',
      auth
    }

    const { container, document } = await renderResponse(server, options)

    const $mastheadHeadings = container.getAllByText('Test form')
    const $cardTitle = container.getByText(
      'Add Welsh translations for your form'
    )
    const $captions = document.getElementsByClassName('govuk-table__caption')

    const $actions = container.getAllByRole('button')

    expect($mastheadHeadings[0]).toHaveTextContent('Test form')
    expect($mastheadHeadings[0]).toHaveClass('govuk-caption-l')
    expect($cardTitle).toHaveTextContent('Add Welsh translations for your form')
    expect($cardTitle).toHaveClass('app-masthead__heading govuk-heading-xl')

    expect($captions).toHaveLength(7)
    expect($captions[0]).toHaveTextContent('Form name')
    expect($captions[1]).toHaveTextContent('Contact details for support')
    expect($captions[2]).toHaveTextContent('Email address and response time')
    expect($captions[3]).toHaveTextContent('Contact link for support')
    expect($captions[4]).toHaveTextContent('Phone number and opening times')
    expect($captions[5]).toHaveTextContent(
      'Information about what happens next'
    )
    expect($captions[6]).toHaveTextContent(
      'Privacy information for this form (uses inline content)'
    )

    expect($actions).toHaveLength(4)
    expect($actions[2]).toHaveTextContent('Save changes')
    expect($actions[3]).toHaveTextContent('Preview form in Welsh')
  })

  test('POST - should show validation errors', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/welsh',
      auth,
      payload: {
        'form.contact.email.address': 'invalid-email'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/my-form-slug/editor-v2/welsh')
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      'translationsValidationFailure',
      new Joi.ValidationError('The email format is invalid', [], undefined)
    )
  })

  test('POST - should save successfully with valid payload', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/welsh',
      auth,
      payload: {
        'form.contact.email.address': 'my-email@server.com'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/my-form-slug/editor-v2/pages')
    expect(addErrorsToSession).not.toHaveBeenCalled()
    expect(forms.updateDraftFormDefinition).toHaveBeenCalled()
  })

  test('GET - should render confirmation page for delete operation', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/welsh/delete',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mastheadHeadings = container.getAllByText('Test form')
    const $cardTitle = container.getByText(
      'Are you sure you want to delete your Welsh translations?'
    )
    const $actions = container.getAllByRole('button')

    expect($mastheadHeadings[0]).toHaveTextContent('Test form')
    expect($mastheadHeadings[0]).toHaveClass('govuk-caption-l')
    expect($cardTitle).toHaveTextContent(
      'Are you sure you want to delete your Welsh translations?'
    )
    expect($cardTitle).toHaveClass('app-masthead__heading govuk-heading-xl')

    expect($actions).toHaveLength(4)
    expect($actions[2]).toHaveTextContent('Delete Welsh translations')
    expect($actions[3]).toHaveTextContent('Cancel')
  })

  test('POST - should delete translations successfully', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/welsh/delete',
      auth
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/my-form-slug/editor-v2/pages')
    expect(addErrorsToSession).not.toHaveBeenCalled()
    expect(forms.updateDraftFormDefinition).toHaveBeenCalled()
  })

  test('GET - should perform download operation', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/welsh/download',
      auth
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.OK)
    expect(headers['content-type']).toBe(
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    const filename = headers['content-disposition']
    expect(
      filename?.startsWith('attachment; filename="translations-my-form-slug')
    ).toBe(true)
    expect(filename?.endsWith('.xlsx"')).toBe(true)
  })

  test('GET - should render upload page', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/welsh/upload',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mastheadHeadings = container.getAllByText('Test form')
    const $cardTitle = container.getByText('Upload Welsh translations')
    const $actions = container.getAllByRole('button')

    expect($mastheadHeadings[0]).toHaveTextContent('Test form')
    expect($mastheadHeadings[0]).toHaveClass('govuk-caption-l')
    expect($cardTitle).toBeInTheDocument()

    expect($actions).toHaveLength(4)
    expect($actions[2]).toHaveTextContent('Upload translations')
    expect($actions[3]).toHaveTextContent('Cancel')
  })

  test('POST - upload should redirect with error when no file is selected (empty object)', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/welsh/upload',
      auth,
      payload: {
        translations: {} // Empty object when no file selected
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/welsh/upload'
    )
  })

  test('POST - upload should redirect with error when no translations in payload', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/welsh/upload',
      auth,
      payload: {} // Missing formDefinition entirely
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/welsh/upload'
    )
  })

  test('POST - upload should redirect with error when file is invalid', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const invalidFile = {
      notAnXlsxFile: true,
      someOtherData: 'value'
    }

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/welsh/upload',
      auth,
      payload: {
        translations: invalidFile
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/welsh/upload'
    )
  })

  test('POST - upload should be successful and redirect when file is valid', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    // @ts-expect-error - dynamic rows
    function createWorkbook(rows) {
      const workbook = xlsx.utils.book_new()
      const worksheet = xlsx.utils.aoa_to_sheet(rows)
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Translations')
      return workbook
    }

    const validWorkbook = createWorkbook([
      [
        'Data reference (do not edit)',
        'Position in form',
        'English content',
        'Welsh content',
        'Notes'
      ],
      [
        'components.123e4567-e89b-12d3-a456-426614174000.title',
        'Page 1 title',
        'Hello',
        'Helo',
        ''
      ]
    ])

    const validFile = xlsx.write(validWorkbook, {
      bookType: 'xlsx',
      type: 'base64'
    })

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/welsh/upload',
      auth,
      payload: {
        translations: validFile
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/my-form-slug/editor-v2/welsh')
  })

  test('validateFileSelected returns translation workbook error for invalid workbook bytes', () => {
    const buffer = Buffer.from('invalid')
    const mockHelpers = {
      error: jest.fn((type) => ({ type, isJoiError: true }))
    }

    const result = validateFileSelected(buffer, mockHelpers)

    expect(mockHelpers.error).toHaveBeenCalledWith(
      'custom.invalidTranslationWorkbook',
      {
        reason: 'Too few columns (expected 5, got 1)'
      }
    )
    expect(result).toEqual({
      type: 'custom.invalidTranslationWorkbook',
      isJoiError: true
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
