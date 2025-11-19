import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import {
  testFormDefinitionWithExistingSummaryDeclaration,
  testFormDefinitionWithTwoQuestions
} from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import { setCheckAnswersDeclaration } from '~/src/lib/editor.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/forms.js')

describe('Editor v2 check-answers-settings routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET - should render radio group in the view when no declaration', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/check-answers-settings',
      auth
    }

    const { container, document } = await renderResponse(server, options)

    const $mastheadHeading = container.getByText('Test form')
    const $cardHeadings = container.getAllByText('Page settings')
    const $radios = container.getAllByRole('radio')

    const $actions = container.getAllByRole('button')
    const $previewPanel = document.getElementById('preview-panel')

    expect($mastheadHeading).toHaveTextContent('Test form')
    expect($mastheadHeading).toHaveClass('govuk-heading-xl')
    expect($cardHeadings[0]).toHaveTextContent('Page settings')
    expect($cardHeadings[0]).toHaveClass('editor-card-title')
    expect($cardHeadings[1]).toHaveTextContent('Page settings')
    expect($cardHeadings[1]).toHaveClass('govuk-heading-l')

    expect($radios).toHaveLength(2)
    expect($radios[0]).toBeChecked()
    expect($radios[1]).not.toBeChecked()

    expect($actions).toHaveLength(4)
    expect($actions[2]).toHaveTextContent('Save changes')
    expect($previewPanel?.innerHTML).toContain(
      "setupSummaryPageController('661e4ca5039739ef2902b214',"
    )
    expect($previewPanel?.innerHTML).toContain('showConfirmationEmail:')
    expect($previewPanel?.innerHTML).toContain('declarationText:')
    expect($previewPanel?.innerHTML).toContain('needDeclaration:')
  })

  test('GET - should render radio group in the view when declaration text', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithExistingSummaryDeclaration)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p2/check-answers-settings',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mastheadHeading = container.getByText('Test form')
    const $cardHeadings = container.getAllByText('Page settings')
    const $radios = container.getAllByRole('radio')

    const $actions = container.getAllByRole('button')

    expect($mastheadHeading).toHaveTextContent('Test form')
    expect($mastheadHeading).toHaveClass('govuk-heading-xl')
    expect($cardHeadings[0]).toHaveTextContent('Page settings')
    expect($cardHeadings[0]).toHaveClass('editor-card-title')
    expect($cardHeadings[1]).toHaveTextContent('Page settings')
    expect($cardHeadings[1]).toHaveClass('govuk-heading-l')

    expect($radios).toHaveLength(2)
    expect($radios[0]).not.toBeChecked()
    expect($radios[1]).toBeChecked()

    expect($actions).toHaveLength(4)
    expect($actions[2]).toHaveTextContent('Save changes')
  })

  test('POST - should error if missing mandatory fields', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p2/check-answers-settings',
      auth,
      payload: { needDeclaration: 'true' }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p2/check-answers-settings'
    )
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      'checkAnswersSettingsValidationFailure',
      new Joi.ValidationError(
        'Enter the information you need users to declare or agree to',
        [],
        undefined
      )
    )
  })

  test('POST - should save and redirect to same page if valid payload', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithExistingSummaryDeclaration)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p2/check-answers-settings',
      auth,
      payload: {
        needDeclaration: 'true',
        declarationText: 'Declaration text'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/my-form-slug/editor-v2/pages')
    expect(setCheckAnswersDeclaration).toHaveBeenCalledWith(
      testFormMetadata.id,
      expect.anything(),
      'p2',
      testFormDefinitionWithExistingSummaryDeclaration,
      {
        declarationText: 'Declaration text',
        needDeclaration: 'true'
      }
    )
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
