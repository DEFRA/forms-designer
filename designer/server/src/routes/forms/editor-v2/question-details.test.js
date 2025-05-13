import {
  ApiErrorCode,
  ComponentType,
  ControllerType,
  hasComponents
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import {
  buildAutoCompleteComponent,
  buildDefinition,
  buildList,
  buildListItem,
  buildQuestionPage,
  testFormDefinitionWithFileUploadPage,
  testFormDefinitionWithRadioQuestionAndList,
  testFormDefinitionWithSinglePage
} from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import { buildBoom409 } from '~/src/lib/__stubs__/editor.js'
import {
  addPageAndFirstQuestion,
  addQuestion,
  updateQuestion
} from '~/src/lib/editor.js'
import {
  addErrorsToSession,
  getValidationErrorsFromSession
} from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { upsertList } from '~/src/lib/list.js'
import {
  buildQuestionSessionState,
  createQuestionSessionState,
  getQuestionSessionState,
  setQuestionSessionState
} from '~/src/lib/session-helper.js'
import { handleEnhancedActionOnGet } from '~/src/routes/forms/editor-v2/question-details-helper.js'
import {
  getListItems,
  saveList
} from '~/src/routes/forms/editor-v2/question-details.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/session-helper.js')
jest.mock('~/src/lib/list.js')
jest.mock('~/src/routes/forms/editor-v2/question-details-helper.js')

describe('Editor v2 question details routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    jest.clearAllMocks()
    server = await createServer()
    await server.initialize()
  })

  beforeEach(() => {
    jest.clearAllMocks()
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

  const simpleSessionAutocomplete = {
    questionType: ComponentType.AutocompleteField
  }

  const simpleSessionRadiosField = {
    questionType: ComponentType.RadiosField
  }

  test('GET - should redirect if no session yet', async () => {
    jest.mocked(getQuestionSessionState).mockReturnValue(undefined)
    jest.mocked(createQuestionSessionState).mockReturnValue('newSessId')
    jest.mocked(forms.get).mockResolvedValue(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValue(testFormDefinitionWithSinglePage)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/question/c1/details',
      auth
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/question/c1/details/newSessId'
    )
  })

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

    expect($actions).toHaveLength(5)
    expect($actions[2]).toHaveTextContent('Preview error messages')
    expect($actions[3]).toHaveTextContent('Preview page')
    expect($actions[4]).toHaveTextContent('Save and continue')

    const $fields = container.getAllByRole('textbox')
    expect($fields[0].id).toBe('question')
    expect($fields[1].id).toBe('hintText')
    expect($fields[2].id).toBe('shortDescription')
    expect($fields[3].id).toBe('minLength')

    const $details = document.getElementsByClassName('govuk-details')
    expect($details[0].hasAttribute('open')).toBeFalsy()
  })

  test('GET - should hide preview error message button and preview page button if question not saved yet', async () => {
    jest
      .mocked(getQuestionSessionState)
      .mockReturnValueOnce(simpleSessionTextField)
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    // Force a component id to be 'new' as if not yet saved, for the purpose of this test
    const definition = /** @type {FormDefinition} */ (
      structuredClone(testFormDefinitionWithSinglePage)
    )
    if (hasComponents(definition.pages[0])) {
      definition.pages[0].components[0].id = 'new'
    }

    jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(definition)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/question/new/details/54321',
      auth
    }

    const { container, document } = await renderResponse(server, options)

    const $mastheadHeading = container.getByText('Test form')
    const $cardTitle = container.getByText('Question 2')
    const $cardCaption = container.getByText('Page 1')
    const $cardHeading = container.getByText('Edit question 2')

    const $actions = container.getAllByRole('button')

    expect($mastheadHeading).toHaveTextContent('Test form')
    expect($mastheadHeading).toHaveClass('govuk-heading-xl')
    expect($cardTitle).toHaveTextContent('Question 2')
    expect($cardTitle).toHaveClass('editor-card-title')
    expect($cardCaption).toHaveTextContent('Page 1')
    expect($cardCaption).toHaveClass('govuk-caption-l')
    expect($cardHeading).toHaveTextContent('Edit question 2')
    expect($cardHeading).toHaveClass('govuk-heading-l')

    expect($actions).toHaveLength(3)
    expect($actions[2]).toHaveTextContent('Save and continue')

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

    expect($actions).toHaveLength(5)
    expect($actions[2]).toHaveTextContent('Preview error messages')
    expect($actions[3]).toHaveTextContent('Preview page')
    expect($actions[4]).toHaveTextContent('Save and continue')

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

    const $cardCaption = container.getByText('Page 1')

    const $actions = container.getAllByRole('button')

    expect($mastheadHeading).toHaveTextContent('Test form')
    expect($mastheadHeading).toHaveClass('govuk-heading-xl')
    expect($cardCaption).toHaveTextContent('Page 1')
    expect($cardCaption).toHaveClass('govuk-caption-l')

    expect($actions[2]).toHaveTextContent('Preview error messages')
    expect($actions[3]).toHaveTextContent('Preview page')
    expect($actions[4]).toHaveTextContent('Save and continue')

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

  test('GET - should render the autocomplete options field in the base view', async () => {
    const listName = 'AutoCompleteList'
    const listId = '3b016ee4-6484-4b0f-a02a-4e0e37de066b'
    jest
      .mocked(getQuestionSessionState)
      .mockReturnValue(simpleSessionAutocomplete)
    jest
      .mocked(buildQuestionSessionState)
      .mockReturnValue(simpleSessionAutocomplete)
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    const def = buildDefinition({
      name: 'Test form',
      pages: [
        buildQuestionPage({
          id: 'p1',
          path: '/autocomplete',
          title: 'Which country do you live in?',
          components: [
            buildAutoCompleteComponent({
              id: 'c1',
              name: 'autoComplete',
              title: 'Which country do you live in?',
              list: listName
            })
          ]
        })
      ],
      lists: [
        buildList({
          id: listId,
          name: listName,
          items: [
            buildListItem({
              text: 'England',
              value: 'england'
            }),
            buildListItem({
              text: 'Wales',
              value: 'wales'
            }),
            buildListItem({
              text: 'Scotland',
              value: 'scotland'
            }),
            buildListItem({
              text: 'Northern Ireland',
              value: 'northern-ireland'
            })
          ]
        })
      ]
    })
    jest.mocked(forms.getDraftFormDefinition).mockResolvedValue(def)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/question/c1/details/54321',
      auth
    }

    const { container } = await renderResponse(server, options)

    container.getByText('Test form')

    const [, , autoCompleteField] = container.getAllByRole('textbox')
    expect(autoCompleteField.id).toBe('autoCompleteOptions')
    expect(/** @type {HTMLInputElement} */ (autoCompleteField).value).toMatch(
      'England:england'
    )
    expect(/** @type {HTMLInputElement} */ (autoCompleteField).value).toMatch(
      'Northern Ireland:northern-ireland'
    )
  })

  test('GET - should redirect if enhanced action supplied', async () => {
    jest.mocked(getQuestionSessionState).mockReturnValue(simpleSessionTextField)
    jest
      .mocked(buildQuestionSessionState)
      .mockReturnValue(simpleSessionRadiosField)
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(handleEnhancedActionOnGet).mockReturnValueOnce('#new-anchor')
    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/new/question/new/details/newSessId?action=delete&id=123',
      auth
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/new/question/new/details/newSessId#new-anchor'
    )
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
      '/library/my-form-slug/editor-v2/page/1/question/1/details#'
    )
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      new Joi.ValidationError(
        'name is required. The question type is missing. Enter a question. Enter a short description',
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
      '/library/my-form-slug/editor-v2/page/1/question/1/details#'
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
      '/library/my-form-slug/editor-v2/page/1/question/1/details#'
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

  test('POST - should error if too few items on radio question', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(getQuestionSessionState)
      .mockReturnValue(simpleSessionRadiosField)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/1/question/1/details',
      auth,
      payload: {
        name: '12345',
        question: 'Question text',
        shortDescription: 'Short desc',
        questionType: 'RadiosField'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/1/question/1/details#'
    )
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      new Joi.ValidationError(
        'At least 2 items are required for a list',
        [],
        undefined
      ),
      'questionDetailsValidationFailure'
    )
  })

  test('POST - should error if boom error from API', async () => {
    jest.mocked(getQuestionSessionState).mockReturnValue(simpleSessionTextField)
    jest
      .mocked(buildQuestionSessionState)
      .mockReturnValue(simpleSessionTextField)
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(updateQuestion).mockImplementationOnce(() => {
      throw buildBoom409(
        'Duplicate page path',
        ApiErrorCode.DuplicatePagePathComponent
      )
    })

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/1/question/1/details',
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
      '/library/my-form-slug/editor-v2/page/1/question/1/details#'
    )
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      new Joi.ValidationError(
        'Question or page heading already exists in this form',
        [],
        undefined
      ),
      'questionDetailsValidationFailure'
    )
  })

  test('POST - should error if boom error from API even if not in error message lookups', async () => {
    jest.mocked(getQuestionSessionState).mockReturnValue(simpleSessionTextField)
    jest
      .mocked(buildQuestionSessionState)
      .mockReturnValue(simpleSessionTextField)
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(updateQuestion).mockImplementationOnce(() => {
      throw buildBoom409('Some other boom error')
    })

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/1/question/1/details',
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
      '/library/my-form-slug/editor-v2/page/1/question/1/details#'
    )
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      new Joi.ValidationError('Some other boom error', [], undefined),
      'questionDetailsValidationFailure'
    )
  })

  test('POST - should error if not 409 boom error from API', async () => {
    jest.mocked(getQuestionSessionState).mockReturnValue(simpleSessionTextField)
    jest
      .mocked(buildQuestionSessionState)
      .mockReturnValue(simpleSessionTextField)
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(updateQuestion).mockImplementationOnce(() => {
      throw new Error('Some other API error')
    })

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/1/question/1/details',
      auth,
      payload: {
        name: '12345',
        question: 'Question text',
        shortDescription: 'Short desc',
        questionType: 'TextField'
      }
    }

    const {
      response: { statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
  })

  test('POST - should retain radios state if error with JS enabled', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    jest.mocked(getQuestionSessionState).mockReturnValueOnce({
      ...simpleSessionRadiosField,
      listItems: [
        {
          text: 'option 1',
          hint: { text: 'option 1 hint' },
          value: 'option 1 val'
        },
        {
          text: 'option 2',
          hint: { text: 'option 2 hint' },
          value: 'option 2 val'
        }
      ]
    })

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/1/question/1/details/77889',
      auth,
      payload: {
        name: '12345',
        question: 'Question text',
        shortDescription: '',
        questionType: 'RadiosField',
        jsEnabled: 'true'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/1/question/1/details/77889#'
    )
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      new Joi.ValidationError('Enter a short description', [], undefined),
      'questionDetailsValidationFailure'
    )
    expect(setQuestionSessionState).toHaveBeenCalledWith(
      expect.anything(),
      '77889',
      {
        editRow: {
          expanded: false
        },
        listItems: [],
        questionType: 'RadiosField'
      }
    )
  })

  test('POST - should redirect to next page if valid payload with new question', async () => {
    jest.mocked(getQuestionSessionState).mockReturnValue(simpleSessionTextField)
    jest
      .mocked(buildQuestionSessionState)
      .mockReturnValue(simpleSessionTextField)
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

  test('POST - should create a list on autocomplete question', async () => {
    const listId = '3d7e14af-0674-40dc-aca5-a6439f45b782'
    const name = 'atvNgE'
    const list = buildList({
      id: listId,
      name,
      items: [
        { text: 'English', value: 'en-gb' },
        { text: 'French', value: 'fr-Fr' }
      ]
    })
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(upsertList).mockResolvedValue({
      id: listId,
      list,
      status: 'created'
    })
    const addQuestionMock = jest.mocked(addQuestion).mockResolvedValue(page)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/123456/question/new/details',
      auth,
      payload: {
        name,
        question: 'Autocomplete',
        hintText: '',
        autoCompleteOptions: 'English:en-gb\r\nFrench:fr-Fr',
        shortDescription: 'autocomplete',
        questionType: 'AutocompleteField'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/123456/questions'
    )
    const [, , , question] = addQuestionMock.mock.calls[0]
    // TODO: When forms runner is updated move to id
    expect(question).toMatchObject({ list: name })
  })

  describe('saveList', () => {
    const listId = '3d7e14af-0674-40dc-aca5-a6439f45b782'
    const listName = 'atvNgE'
    const list = buildList({
      id: listId,
      name: listName,
      items: [
        { text: 'English', value: 'en-gb' },
        { text: 'French', value: 'fr-Fr' }
      ]
    })
    jest.mocked(upsertList).mockResolvedValue({
      id: listId,
      list,
      status: 'created'
    })

    test('should return undefined if question type undefined', async () => {
      const res = await saveList(
        '12345',
        testFormDefinitionWithSinglePage,
        'token',
        { type: undefined },
        []
      )
      expect(res).toBeUndefined()
    })

    test('should return undefined if question type not needing a list', async () => {
      const res = await saveList(
        '12345',
        testFormDefinitionWithSinglePage,
        'token',
        { type: ComponentType.TextField },
        []
      )
      expect(res).toBeUndefined()
    })

    test('should return list name if list saved', async () => {
      const res = await saveList(
        '12345',
        testFormDefinitionWithRadioQuestionAndList,
        'token',
        { type: ComponentType.RadiosField },
        []
      )
      expect(res).toBe(listName)
    })

    test('should return list name if list saved, even if no entries', async () => {
      const res = await saveList(
        '12345',
        testFormDefinitionWithRadioQuestionAndList,
        'token',
        { type: ComponentType.RadiosField },
        undefined
      )
      expect(res).toBe(listName)
    })

    test('should return undefined if failed to save', async () => {
      jest.mocked(upsertList).mockResolvedValue({
        id: listId,
        list,
        status: 'updated'
      })
      const res = await saveList(
        '12345',
        testFormDefinitionWithRadioQuestionAndList,
        'token',
        { type: ComponentType.RadiosField },
        []
      )
      expect(res).toBeUndefined()
    })
  })

  describe('getListItems', () => {
    test('should parse list items if supplied', () => {
      const payload =
        /** @type {FormEditorInputQuestionDetails} */
        ({
          listItemsData:
            '[{ "text": "Option 1", "value": "val1" }, { "text": "Option 2", "value": "val2" }]'
        })
      const res = getListItems(payload, undefined)
      expect(res).toEqual([
        { text: 'Option 1', value: 'val1' },
        { text: 'Option 2', value: 'val2' }
      ])
    })
  })
})

/**
 * @import { FormDefinition, FormEditor, FormEditorInputQuestionDetails, Page } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
