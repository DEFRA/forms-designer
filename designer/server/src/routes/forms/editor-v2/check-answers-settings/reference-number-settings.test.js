import { StatusCodes } from 'http-status-codes'

import {
  testFormDefinitionWithExistingSummaryDeclaration,
  testFormDefinitionWithTwoQuestions
} from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import {
  setConfirmationEmailSettings,
  setFormOption
} from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/forms.js')

describe('Editor v2 reference-number-settings routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET - should render checkbox in the view when reference number is enabled', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/check-answers-settings/reference-number',
      auth
    }

    const { container, document } = await renderResponse(server, options)

    const $mastheadHeading = container.getByText('Test form')
    const $cardHeadings = container.getAllByText('Reference number')
    const $checkboxes = container.getAllByRole('checkbox')

    const $actions = container.getAllByRole('button')
    const $previewPanel = document.getElementById('preview-panel')

    expect($mastheadHeading).toHaveTextContent('Test form')
    expect($mastheadHeading).toHaveClass('govuk-heading-xl')
    expect($cardHeadings[0]).toHaveTextContent('Reference number')
    expect($cardHeadings[0]).toHaveClass('editor-card-title')
    expect($cardHeadings[1]).toHaveTextContent('Reference number')
    expect($cardHeadings[1]).toHaveClass('govuk-heading-l')

    expect($checkboxes).toHaveLength(1)
    expect($checkboxes[0]).not.toBeChecked()

    expect($actions).toHaveLength(4)
    expect($actions[2]).toHaveTextContent('Save changes')
    expect($previewPanel?.innerHTML).toContain(
      "setupSummaryPageController('661e4ca5039739ef2902b214',"
    )
    expect($previewPanel?.innerHTML).toContain('showConfirmationEmail:')
    expect($previewPanel?.innerHTML).toContain('declarationText:')
    expect($previewPanel?.innerHTML).toContain('needDeclaration:')
  })

  test('GET - should render checkbox in the view when confirmation email is disabled', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithExistingSummaryDeclaration)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p2/check-answers-settings/confirmation-email',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mastheadHeading = container.getByText('Test form')
    const $cardHeadings = container.getAllByText('Confirmation email')
    const $checkboxes = container.getAllByRole('checkbox')

    const $actions = container.getAllByRole('button')

    expect($mastheadHeading).toHaveTextContent('Test form')
    expect($mastheadHeading).toHaveClass('govuk-heading-xl')
    expect($cardHeadings[0]).toHaveTextContent('Confirmation email')
    expect($cardHeadings[0]).toHaveClass('editor-card-title')
    expect($cardHeadings[1]).toHaveTextContent('Confirmation email')
    expect($cardHeadings[1]).toHaveClass('govuk-heading-l')

    expect($checkboxes).toHaveLength(1)
    expect($checkboxes[0]).toBeChecked()

    expect($actions).toHaveLength(4)
    expect($actions[2]).toHaveTextContent('Save changes')
  })

  test('POST - should save and redirect to pages list when enabling confirmation emails', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithExistingSummaryDeclaration)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p2/check-answers-settings/confirmation-email',
      auth,
      payload: {
        // Checkbox unchecked - field is omitted
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/my-form-slug/editor-v2/pages')
    expect(setConfirmationEmailSettings).toHaveBeenCalledWith(
      testFormMetadata.id,
      expect.anything(),
      'p2',
      expect.objectContaining({})
    )
  })

  test('POST - should save and redirect to pages list when disabling confirmation emails', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/check-answers-settings/confirmation-email',
      auth,
      payload: {
        disableConfirmationEmail: 'true' // Checkbox checked sends string 'true'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/my-form-slug/editor-v2/pages')
    expect(setConfirmationEmailSettings).toHaveBeenCalledWith(
      testFormMetadata.id,
      expect.anything(),
      'p1',
      {
        disableConfirmationEmail: true // Schema converts string to boolean
      }
    )
  })

  test('POST - should save and redirect to pages list when disabling reference number', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithExistingSummaryDeclaration)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p2/check-answers-settings/reference-number',
      auth,
      payload: {
        // Checkbox unchecked - field is omitted
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/my-form-slug/editor-v2/pages')
    expect(setFormOption).toHaveBeenCalledWith(
      testFormMetadata.id,
      expect.anything(),
      'showReferenceNumber',
      'false'
    )
  })

  test('POST - should save and redirect to pages list when enabling reference number', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/check-answers-settings/reference-number',
      auth,
      payload: {
        enableReferenceNumber: 'true' // Checkbox checked sends string 'true'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/my-form-slug/editor-v2/pages')
    expect(setFormOption).toHaveBeenCalledWith(
      testFormMetadata.id,
      expect.anything(),
      'showReferenceNumber',
      'true'
    )
  })

  test('POST - should show error when enabling reference number with bad payload', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/check-answers-settings/reference-number',
      auth,
      payload: {
        enableBadOption: 'true' // Checkbox checked sends string 'true'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/check-answers-settings/reference-number'
    )
    expect(setFormOption).not.toHaveBeenCalled()
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
