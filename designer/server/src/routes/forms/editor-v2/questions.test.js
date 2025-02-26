import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import {
  testFormDefinitionWithNoQuestions,
  testFormDefinitionWithTwoQuestions
} from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import { setPageHeadingAndGuidance } from '~/src/lib/editor.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/forms.js')

describe('Editor v2 questions routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET - should render two questions in the view', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/questions',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mastheadHeading = container.getByText('Test form')
    const $cardTitle = container.getByText('Page 1 overview')
    const $cardHeading = container.getByText('Page 1')
    const $questionNumbers = container.getAllByRole('term')
    const $questionTitles = container.getAllByRole('definition')

    const $actions = container.getAllByRole('button')

    expect($mastheadHeading).toHaveTextContent('Test form')
    expect($mastheadHeading).toHaveClass('govuk-heading-xl')
    expect($cardTitle).toHaveTextContent('Page 1 overview')
    expect($cardTitle).toHaveClass('editor-card-title')
    expect($cardHeading).toHaveTextContent('Page 1')
    expect($cardHeading).toHaveClass('govuk-heading-l')

    expect($questionNumbers[0]).toHaveTextContent('Question 1')
    expect($questionNumbers[1]).toHaveTextContent('Question 2')

    expect($questionTitles[1]).toHaveTextContent('This is your first question')
    expect($questionTitles[3]).toHaveTextContent('This is your second question')

    expect($actions).toHaveLength(4)
    expect($actions[2]).toHaveTextContent('Add another question')
    expect($actions[3]).toHaveTextContent('Save changes')
  })

  test('GET - should render no questions in the view', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithNoQuestions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/questions',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mastheadHeading = container.getByText('Test form')
    const $cardTitle = container.getByText('Page 1 overview')
    const $cardHeading = container.getByText('Page 1')
    const $questionNumbers = container.getAllByRole('term')
    const $questionTitles = container.getAllByRole('definition')

    expect($mastheadHeading).toHaveTextContent('Test form')
    expect($mastheadHeading).toHaveClass('govuk-heading-xl')
    expect($cardTitle).toHaveTextContent('Page 1 overview')
    expect($cardTitle).toHaveClass('editor-card-title')
    expect($cardHeading).toHaveTextContent('Page 1')
    expect($cardHeading).toHaveClass('govuk-heading-l')

    expect($questionNumbers).toHaveLength(1)
    expect($questionTitles).toHaveLength(2)
    expect($questionNumbers[0]).toHaveTextContent('')
    expect($questionTitles[0]).toHaveTextContent('No questions')
  })

  test('POST - should error if missing mandatory fields', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/1/questions',
      auth,
      payload: { pageHeadingAndGuidance: 'true' }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/1/questions'
    )
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      new Joi.ValidationError('Enter a page heading', [], undefined),
      'questionsValidationFailure'
    )
  })

  test('POST - should save and redirect to same page if valid payload', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/1/questions',
      auth,
      payload: {
        pageHeadingAndGuidance: 'true',
        pageHeading: 'New page heading',
        guidanceText: 'New guidance text'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/1/questions'
    )
    expect(setPageHeadingAndGuidance).toHaveBeenCalledWith(
      testFormMetadata.id,
      expect.anything(),
      '1',
      undefined,
      {
        guidanceText: 'New guidance text',
        pageHeading: 'New page heading',
        pageHeadingAndGuidance: 'true'
      }
    )
  })
})

/**
 * @import { FormDefinition, FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
