import { ComponentType, ControllerType } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import {
  testFormDefinitionWithFileUploadPage,
  testFormDefinitionWithSinglePage
} from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import { addPageAndFirstQuestion, addQuestion } from '~/src/lib/editor.js'
import {
  addErrorsToSession,
  getValidationErrorsFromSession
} from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import {
  buildQuestionSessionState,
  getQuestionSessionState
} from '~/src/lib/session-helper.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/session-helper.js')
jest.mock('~/src/routes/forms/editor-v2/question-details-helper.js')

describe('Editor v2 question details routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    jest.clearAllMocks()
    server = await createServer()
    await server.initialize()
  })

  /**
   * @satisfies {Page}
   */
  const page = {
    id: '12345',
    title: 'page title',
    path: '/',
    controller: ControllerType.Page,
    next: [],
    components: []
  }

  const simpleSessionTextField = {
    questionType: ComponentType.TextField
  }

  const simpleSessionFileUpload = {
    questionType: ComponentType.FileUploadField
  }

  test('GET - should render the question fields in the view', async () => {
    jest
      .mocked(getQuestionSessionState)
      .mockReturnValueOnce(simpleSessionTextField)
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithSinglePage)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/question/c1/details/54321',
      auth
    }

    const { container, document } = await renderResponse(server, options)

    const $mastheadHeading = container.getByText('Test form')
    const $cardTitle = container.getByText('Question 1')
    const $cardCaption = container.getByText('Page 1')
    const $cardHeading = container.getByText('Edit question 1')

    const $actions = container.getAllByRole('button')

    expect($mastheadHeading).toHaveTextContent('Test form')
    expect($mastheadHeading).toHaveClass('govuk-heading-xl')
    expect($cardTitle).toHaveTextContent('Question 1')
    expect($cardTitle).toHaveClass('editor-card-title')
    expect($cardCaption).toHaveTextContent('Page 1')
    expect($cardCaption).toHaveClass('govuk-caption-l')
    expect($cardHeading).toHaveTextContent('Edit question 1')
    expect($cardHeading).toHaveClass('govuk-heading-l')

    expect($actions).toHaveLength(4)
    expect($actions[2]).toHaveTextContent('Preview page')
    expect($actions[3]).toHaveTextContent('Save and continue')

    const $fields = container.getAllByRole('textbox')
    expect($fields[0].id).toBe('question')
    expect($fields[1].id).toBe('hintText')
    expect($fields[2].id).toBe('shortDescription')
    expect($fields[3].id).toBe('minLength')

    const $details = document.getElementsByClassName('govuk-details')
    expect($details[0].hasAttribute('open')).toBeFalsy()
  })

  test('GET - should render the optional question fields in the view and keep optional section expanded', async () => {
    jest
      .mocked(getQuestionSessionState)
      .mockReturnValueOnce(simpleSessionTextField)
    jest
      .mocked(buildQuestionSessionState)
      .mockReturnValueOnce(simpleSessionTextField)
    jest.mocked(getValidationErrorsFromSession).mockReturnValue(
      /** @type {ValidationFailure<FormEditor>} */ ({
        formValues: {
          question: 'What is your name?',
          shortDescription: 'your name',
          minLength: '10'
        },
        formErrors: {}
      })
    )
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithSinglePage)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/question/c1/details/54321',
      auth
    }

    const { container, document } = await renderResponse(server, options)

    const $mastheadHeading = container.getByText('Test form')
    const $cardTitle = container.getByText('Question 1')
    const $cardCaption = container.getByText('Page 1')
    const $cardHeading = container.getByText('Edit question 1')

    const $actions = container.getAllByRole('button')

    expect($mastheadHeading).toHaveTextContent('Test form')
    expect($mastheadHeading).toHaveClass('govuk-heading-xl')
    expect($cardTitle).toHaveTextContent('Question 1')
    expect($cardTitle).toHaveClass('editor-card-title')
    expect($cardCaption).toHaveTextContent('Page 1')
    expect($cardCaption).toHaveClass('govuk-caption-l')
    expect($cardHeading).toHaveTextContent('Edit question 1')
    expect($cardHeading).toHaveClass('govuk-heading-l')

    expect($actions).toHaveLength(4)
    expect($actions[2]).toHaveTextContent('Preview page')
    expect($actions[3]).toHaveTextContent('Save and continue')

    const $fields = container.getAllByRole('textbox')
    expect($fields[3].id).toBe('minLength')
    expect($fields[4].id).toBe('maxLength')
    expect($fields[5].id).toBe('regex')
    expect($fields[6].id).toBe('classes')

    const $details = document.getElementsByClassName('govuk-details')
    expect($details[0].hasAttribute('open')).toBeTruthy()
  })

  test('GET - should render the file upload fields in the base view', async () => {
    jest
      .mocked(getQuestionSessionState)
      .mockReturnValue(simpleSessionFileUpload)
    jest
      .mocked(buildQuestionSessionState)
      .mockReturnValue(simpleSessionFileUpload)
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithFileUploadPage)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/question/q1/details/54321',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mastheadHeading = container.getByText('Test form')

    const $cardTitle = container.getByText('Question 1')
    const $cardCaption = container.getByText('Page 1')
    const $cardHeading = container.getByText('Edit question 1')

    const $actions = container.getAllByRole('button')

    expect($mastheadHeading).toHaveTextContent('Test form')
    expect($mastheadHeading).toHaveClass('govuk-heading-xl')
    expect($cardTitle).toHaveTextContent('Question 1')
    expect($cardTitle).toHaveClass('editor-card-title')
    expect($cardCaption).toHaveTextContent('Page 1')
    expect($cardCaption).toHaveClass('govuk-caption-l')
    expect($cardHeading).toHaveTextContent('Edit question 1')
    expect($cardHeading).toHaveClass('govuk-heading-l')

    expect($actions).toHaveLength(4)
    expect($actions[2]).toHaveTextContent('Preview page')
    expect($actions[3]).toHaveTextContent('Save and continue')

    const $fields = container.getAllByRole('textbox')
    expect($fields[3].id).toBe('minFiles')
    expect($fields[4].id).toBe('maxFiles')
    expect($fields[5].id).toBe('exactFiles')

    const $checkboxes = /** @type {HTMLInputElement[]} */ (
      container.getAllByRole('checkbox')
    )
    expect($checkboxes[0].id).toBe('questionOptional')
    expect($checkboxes[1].id).toBe('fileTypes')
    expect($checkboxes[2].value).toBe('pdf')
    expect($checkboxes[3].value).toBe('doc')
    expect($checkboxes[4].value).toBe('docx')
    expect($checkboxes[5].value).toBe('odt')
    expect($checkboxes[6].value).toBe('txt')
    expect($checkboxes[7].value).toBe('images')
    expect($checkboxes[8].value).toBe('jpg')
    expect($checkboxes[9].value).toBe('png')
    expect($checkboxes[10].value).toBe('tabular-data')
    expect($checkboxes[11].value).toBe('xls')
    expect($checkboxes[12].value).toBe('xlsx')
    expect($checkboxes[13].value).toBe('csv')
    expect($checkboxes[14].value).toBe('ods')
  })

  test('POST - should error if missing mandatory fields', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/1/question/1/details',
      auth,
      payload: {}
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/1/question/1/details'
    )
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      new Joi.ValidationError(
        '"name" is required. The question type is missing. Enter a question. Enter a short description',
        [],
        undefined
      ),
      'questionDetailsValidationFailure'
    )
  })

  test('POST - should error if invalid optional fields', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/1/question/1/details',
      auth,
      payload: {
        name: '12345',
        question: 'Question text',
        shortDescription: 'Short desc',
        questionType: 'TextField',
        minLength: 'a'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/1/question/1/details'
    )
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      new Joi.ValidationError(
        'Minimum length must be a positive whole number',
        [],
        undefined
      ),
      'questionDetailsValidationFailure'
    )
  })

  test('POST - should error if minLength greater than maxLength', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/1/question/1/details',
      auth,
      payload: {
        name: '12345',
        question: 'Question text',
        shortDescription: 'Short desc',
        questionType: 'TextField',
        minLength: '5',
        maxLength: '3'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/1/question/1/details'
    )
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      new Joi.ValidationError(
        'Minimum length must be less than or equal to maximum length',
        [],
        undefined
      ),
      'questionDetailsValidationFailure'
    )
  })

  test('POST - should redirect to next page if valid payload with new question', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(addPageAndFirstQuestion).mockResolvedValue(page)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/new/question/new/details',
      auth,
      payload: {
        name: '12345',
        question: 'Question text',
        shortDescription: 'Short desc',
        questionType: 'TextField'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/12345/questions'
    )
  })

  test('POST - should redirect to next page if valid payload with existing question', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(addPageAndFirstQuestion).mockResolvedValue(page)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/123456/question/456/details',
      auth,
      payload: {
        name: '12345',
        question: 'Question text',
        shortDescription: 'Short desc',
        questionType: 'TextField'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/123456/questions'
    )
  })

  test('POST - should add question if new question on existing page', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(addQuestion).mockResolvedValue(page)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/123456/question/new/details',
      auth,
      payload: {
        name: '12345',
        question: 'Question text',
        shortDescription: 'Short desc',
        questionType: 'TextField'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/123456/questions'
    )
  })
})

/**
 * @import { FormEditor, Page } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
