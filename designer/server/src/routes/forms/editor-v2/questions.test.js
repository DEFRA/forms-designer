import { ApiErrorCode } from '@defra/forms-model'
import {
  buildDefinition,
  buildQuestionPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'
import { within } from '@testing-library/dom'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import {
  testFormDefinitionWithNoQuestions,
  testFormDefinitionWithOneQuestionNoPageTitle,
  testFormDefinitionWithTwoQuestions
} from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import { buildBoom409 } from '~/src/lib/__stubs__/editor.js'
import { reorderQuestions, setPageSettings } from '~/src/lib/editor.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/forms.js')

const payload = {
  pageHeadingAndGuidance: 'true',
  pageHeading: 'New page heading',
  guidanceText: 'New guidance text',
  repeater: 'true',
  minItems: 2,
  maxItems: 5,
  questionSetName: 'Cows',
  saveReorder: false
}

describe('Editor v2 questions routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  beforeEach(() => {
    jest.resetAllMocks()
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
    const $tabPanels = container.getAllByRole('tabpanel')

    const $actions = container.getAllByRole('button')
    const $previewPanel = document.getElementById('preview-panel')

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

    expect($actions).toHaveLength(7)
    expect($actions[2]).toHaveTextContent('Preview page')
    expect($actions[3]).toHaveTextContent('Add another question')
    expect($actions[4]).toHaveTextContent('Reorder questions')
    expect($actions[5]).toHaveTextContent('Save changes')
    expect($actions[6]).toHaveTextContent('Manage conditions')
    expect($tabPanels).toHaveLength(1)
    expect($previewPanel?.innerHTML).toContain(
      "setupPageController('p1','661e4ca5039739ef2902b214')"
    )
  })

  test('GET - should render one question in the view', async () => {
    const title = 'Text field title'
    const hint = 'Hint text'
    const componentId = '84aea22e-88c0-4bbe-b3d9-a900298b419f'
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(
      buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'p1',
            path: '/page-one',
            title: '',
            section: 'section',
            components: [
              buildTextFieldComponent({
                id: componentId,
                title,
                hint
              })
            ],
            next: [{ path: '/summary' }]
          })
        ]
      })
    )

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/questions',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $previewPanel = container.getByText('Previews')
    const $headings = container.getAllByRole('heading', { level: 1 })
    const $previewTitle = container.getAllByText(title)
    const $tabPanels = container.getAllByRole('tabpanel')
    const $tablink = within($tabPanels[1]).getByText(
      'Preview error messages in a new tab'
    )

    expect($previewPanel).toHaveTextContent('Previews')
    expect($headings[4]).toHaveTextContent('')
    expect($previewTitle[1]).toHaveTextContent(title)
    expect($previewTitle[1]).toHaveClass('govuk-label govuk-label--l')
    expect(container.queryByText('Page preview')).not.toBeNull()
    expect(container.queryByText('Error messages')).not.toBeNull()
    expect($tabPanels).toHaveLength(2)
    expect($tablink).toHaveAttribute(
      'href',
      expect.stringContaining(
        'error-preview/draft/my-form-slug/page-one/84aea22e-88c0-4bbe-b3d9-a900298b419f'
      )
    )
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

  test('GET - should render reorder view', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/questions?action=reorder',
      auth
    }

    const { container, document } = await renderResponse(server, options)
    const $previewPanel = document.getElementById('preview-panel')
    const [$questionList] = container.getAllByRole('list')
    const $questionListContainer = within($questionList)
    const $questions = $questionListContainer.getAllByRole('listitem')

    expect($questions).toHaveLength(2)

    expect($previewPanel?.innerHTML).toContain(
      "setupReorderQuestionsController('p1','661e4ca5039739ef2902b214')"
    )
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

  test('POST - should handle boom error if boom received from API call', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithNoQuestions)
    jest.mocked(setPageSettings).mockImplementationOnce(() => {
      throw buildBoom409(
        'Duplicate page path',
        ApiErrorCode.DuplicatePagePathPage
      )
    })

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/questions',
      auth,
      payload
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/questions#'
    )
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      new Joi.ValidationError(
        'Page heading already exists in this form',
        [],
        undefined
      ),
      'questionsValidationFailure'
    )
  })

  test('POST - should handle boom error if boom received from API call but not in error message mappings', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithNoQuestions)
    jest.mocked(setPageSettings).mockImplementationOnce(() => {
      throw buildBoom409('Some other error boom message')
    })

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/questions',
      auth,
      payload
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/questions#'
    )
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      new Joi.ValidationError('Some other error boom message', [], undefined),
      'questionsValidationFailure'
    )
  })

  test('POST - should throw if not boom 409 from API', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(setPageSettings).mockImplementationOnce(() => {
      throw new Error('Some other API error')
    })

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/1/questions',
      auth,
      payload
    }

    const {
      response: { statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
  })

  test('POST - should save and redirect to same page if valid payload', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithNoQuestions)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/questions',
      auth,
      payload
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/questions'
    )
    expect(setPageSettings).toHaveBeenCalledWith(
      testFormMetadata.id,
      expect.anything(),
      'p1',
      expect.anything(),
      payload
    )
  })

  test('POST - should 404 if page is not found', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithOneQuestionNoPageTitle)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p3/questions',
      auth,
      payload
    }

    const {
      response: { statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.NOT_FOUND)
  })

  test('POST - should redirect to same page if trying to clear the page heading when there is more than 1 question', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/questions',
      auth,
      payload: {
        pageHeadingAndGuidance: 'false',
        pageHeading: '',
        guidanceText: 'New guidance text'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/questions'
    )
  })

  test('POST - should handle a reorder action', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithNoQuestions)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/questions?action=reorder',
      auth,
      payload: {
        ...structuredClone(payload),
        movement: 'up|q2',
        itemOrder: 'q1,q2,q3,q4'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/questions?action=reorder&focus=up|q2'
    )
    expect(setPageSettings).not.toHaveBeenCalled()
  })

  test('POST - should handle reorder save', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithNoQuestions)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/questions?action=reorder',
      auth,
      payload: {
        ...structuredClone(payload),
        movement: 'up|q2',
        itemOrder: 'q1,q2,q3,q4',
        saveReorder: true
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/questions'
    )
    expect(setPageSettings).not.toHaveBeenCalled()
    expect(reorderQuestions).toHaveBeenCalledWith(
      testFormMetadata.id,
      expect.anything(),
      'p1',
      ['q1', 'q2', 'q3', 'q4']
    )
  })

  test('POST - should handle reorder save even when user presses main save changes, not the reorder save changes', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithNoQuestions)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/questions?action=reorder',
      auth,
      payload: {
        ...structuredClone(payload),
        itemOrder: 'q1,q2,q3,q4',
        saveReorder: false,
        pageHeading: 'Page heading when reordering'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/questions'
    )
    expect(setPageSettings).toHaveBeenCalledWith(
      testFormMetadata.id,
      expect.anything(),
      'p1',
      expect.anything(),
      {
        ...payload,
        pageHeading: 'Page heading when reordering',
        itemOrder: ['q1', 'q2', 'q3', 'q4']
      }
    )
    expect(reorderQuestions).toHaveBeenCalledWith(
      testFormMetadata.id,
      expect.anything(),
      'p1',
      ['q1', 'q2', 'q3', 'q4']
    )
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
