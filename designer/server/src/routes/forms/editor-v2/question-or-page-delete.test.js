import {
  ConditionType,
  FormDefinitionError,
  FormDefinitionErrorType,
  OperatorName
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import {
  testFormDefinitionWithAGuidancePage,
  testFormDefinitionWithNoQuestions,
  testFormDefinitionWithSinglePage,
  testFormDefinitionWithTwoPagesAndQuestions,
  testFormDefinitionWithTwoQuestions
} from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import { buildInvalidFormDefinitionError } from '~/src/lib/__stubs__/editor.js'
import { deletePage, deleteQuestion } from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/editor.js')

describe('Editor v2 question delete routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('GET - should render correct content in the view when deleting a page', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithSinglePage)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/delete',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })

    const $subHeadings = container.getAllByRole('heading', { level: 2 })

    const $buttons = container.getAllByRole('button')

    expect($mainHeading).toHaveTextContent('Test form')
    expect($subHeadings[0]).toHaveTextContent(
      'Are you sure you want to delete this page?'
    )
    expect($buttons[2]).toHaveAccessibleName('Delete page')
    expect($buttons[3]).toHaveAccessibleName('Cancel')
    expect($buttons[3]).toHaveAttribute(
      'href',
      '/library/my-form-slug/editor-v2/page/p1/questions'
    )
  })

  test('GET - should render correct content in the view when deleting a question', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithTwoQuestions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/delete/q1',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })

    const $subHeadings = container.getAllByRole('heading', { level: 2 })

    const $buttons = container.getAllByRole('button')

    expect($mainHeading).toHaveTextContent('Test form')
    expect($subHeadings[0]).toHaveTextContent(
      'Are you sure you want to delete this question?'
    )
    expect($buttons[2]).toHaveAccessibleName('Delete question')
    expect($buttons[3]).toHaveAccessibleName('Cancel')
    expect($buttons[3]).toHaveAttribute(
      'href',
      '/library/my-form-slug/editor-v2/page/p1/question/q1/details'
    )
  })

  test('GET - should render correct content in the view when deleting the only question on a page', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithSinglePage)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/delete/c1',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })

    const $subHeadings = container.getAllByRole('heading', { level: 2 })

    const $buttons = container.getAllByRole('button')

    expect($mainHeading).toHaveTextContent('Test form')
    expect($subHeadings[0]).toHaveTextContent(
      'Are you sure you want to delete this page?'
    )
    expect($buttons[2]).toHaveAccessibleName('Delete page')
    expect($buttons[3]).toHaveAccessibleName('Cancel')
    expect($buttons[3]).toHaveAttribute(
      'href',
      '/library/my-form-slug/editor-v2/page/p1/question/c1/details'
    )
  })

  test('GET - should render correct content in the view when deleting a guidance page', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithAGuidancePage)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/delete/c1',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })

    const $subHeadings = container.getAllByRole('heading', { level: 2 })

    const $buttons = container.getAllByRole('button')

    expect($mainHeading).toHaveTextContent('Test form')
    expect($subHeadings[0]).toHaveTextContent(
      'Are you sure you want to delete this page?'
    )
    expect($buttons[2]).toHaveAccessibleName('Delete page')
    expect($buttons[3]).toHaveAccessibleName('Cancel')
    expect($buttons[3]).toHaveAttribute(
      'href',
      '/library/my-form-slug/editor-v2/page/p1/guidance/c1'
    )
  })

  test('GET - should render correct content in the view when a page has no components', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    const definition = structuredClone(testFormDefinitionWithNoQuestions)
    delete definition.pages[0].next
    jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(definition)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/delete',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })

    const $subHeadings = container.getAllByRole('heading', { level: 2 })

    const $buttons = container.getAllByRole('button')

    expect($mainHeading).toHaveTextContent('Test form')
    expect($subHeadings[0]).toHaveTextContent(
      'Are you sure you want to delete this page?'
    )
    expect($buttons[2]).toHaveAccessibleName('Delete page')
    expect($buttons[3]).toHaveAccessibleName('Cancel')
    expect($buttons[3]).toHaveAttribute(
      'href',
      '/library/my-form-slug/editor-v2/page/p1/questions'
    )
  })

  test('POST - should delete page and redirect to pages list', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithSinglePage)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/delete',
      auth
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(deletePage).toHaveBeenCalledWith(
      testFormMetadata.id,
      expect.anything(),
      'p1',
      testFormDefinitionWithSinglePage
    )
    expect(headers.location).toBe('/library/my-form-slug/editor-v2/pages')
  })

  test('POST - should delete question and redirect to pages list', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    const definition = structuredClone(
      testFormDefinitionWithTwoPagesAndQuestions
    )
    jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(definition)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/delete/q1',
      auth
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(deleteQuestion).toHaveBeenCalledWith(
      testFormMetadata.id,
      expect.anything(),
      'p1',
      'q1',
      definition
    )
    expect(headers.location).toBe('/library/my-form-slug/editor-v2/pages')
  })

  test('POST - should show an error when deleting a page with condition dependencies', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    const definition = structuredClone(testFormDefinitionWithTwoQuestions)
    const conditionDisplayName = 'When first question is yes'
    /** @type {import('@defra/forms-model').ConditionWrapperV2[]} */
    const conditions = [
      {
        id: 'condition-1',
        displayName: conditionDisplayName,
        items: [
          {
            id: 'condition-item-1',
            componentId: 'q1',
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: 'yes'
          }
        ]
      }
    ]
    // @ts-expect-error - Test definition has conditions as never[]
    definition.conditions = conditions
    jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(definition)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/delete',
      auth
    }

    const { container, response } = await renderResponse(server, options)

    expect(response.statusCode).toBe(StatusCodes.OK)
    expect(deletePage).not.toHaveBeenCalled()
    expect(deleteQuestion).not.toHaveBeenCalled()
    const expectedMessage =
      'The question \'This is your first question\' is used in the condition "When first question is yes", so this page cannot be deleted. Update or delete that condition first.'
    expect(container.getByText(expectedMessage)).toBeInTheDocument()
  })

  test('POST - should show an error when deleting a question with condition dependencies', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    const definition = structuredClone(testFormDefinitionWithTwoQuestions)
    const conditionDisplayName = 'When first question is yes'
    /** @type {import('@defra/forms-model').ConditionWrapperV2[]} */
    const conditions = [
      {
        id: 'condition-1',
        displayName: conditionDisplayName,
        items: [
          {
            id: 'condition-item-1',
            componentId: 'q1',
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: 'yes'
          }
        ]
      }
    ]
    // @ts-expect-error - Test definition has conditions as never[]
    definition.conditions = conditions
    jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(definition)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/delete/q1',
      auth
    }

    const { container, response } = await renderResponse(server, options)

    expect(response.statusCode).toBe(StatusCodes.OK)
    expect(deletePage).not.toHaveBeenCalled()
    expect(deleteQuestion).not.toHaveBeenCalled()
    const expectedMessage =
      'The question \'This is your first question\' cannot be deleted because it is used in the condition "When first question is yes". Update or delete that condition first.'
    expect(container.getByText(expectedMessage)).toBeInTheDocument()
  })

  test('POST - should surface backend condition dependency errors gracefully', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    const initialDefinition = structuredClone(
      testFormDefinitionWithTwoQuestions
    )
    initialDefinition.conditions = []
    const latestDefinition = structuredClone(testFormDefinitionWithTwoQuestions)
    /** @type {import('@defra/forms-model').ConditionWrapperV2[]} */
    const latestConditions = [
      {
        id: 'condition-2',
        displayName: 'Condition added elsewhere',
        items: [
          {
            id: 'condition-item-2',
            componentId: 'q1',
            operator: OperatorName.Is,
            type: ConditionType.StringValue,
            value: 'yes'
          }
        ]
      }
    ]
    // @ts-expect-error - Test definition has conditions as never[]
    latestDefinition.conditions = latestConditions

    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(initialDefinition)
      .mockResolvedValueOnce(latestDefinition)

    jest.mocked(deletePage).mockImplementationOnce(() => {
      throw buildInvalidFormDefinitionError(
        '"conditions[0].items[0].componentId" must be [ref:root:pages]',
        [
          {
            id: FormDefinitionError.RefConditionComponentId,
            message:
              '"conditions[0].items[0].componentId" must be [ref:root:pages]',
            type: FormDefinitionErrorType.Ref,
            detail: {
              path: ['conditions', 0, 'items', 0, 'componentId']
            }
          }
        ]
      )
    })

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/delete',
      auth
    }

    const { container, response } = await renderResponse(server, options)

    expect(response.statusCode).toBe(StatusCodes.OK)
    expect(deletePage).toHaveBeenCalledTimes(1)
    expect(deleteQuestion).not.toHaveBeenCalled()
    expect(forms.getDraftFormDefinition).toHaveBeenCalledTimes(2)
    const expectedMessage =
      'The question \'This is your first question\' is used in the condition "Condition added elsewhere", so this page cannot be deleted. Update or delete that condition first.'
    expect(container.getByText(expectedMessage)).toBeInTheDocument()
  })

  test('POST - should delete whole page if only a single question and redirect to pages list', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    const definition = structuredClone(testFormDefinitionWithSinglePage)
    jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(definition)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/delete/c1',
      auth
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(deleteQuestion).not.toHaveBeenCalled()
    expect(deletePage).toHaveBeenCalledWith(
      testFormMetadata.id,
      expect.anything(),
      'p1',
      definition
    )
    expect(headers.location).toBe('/library/my-form-slug/editor-v2/pages')
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
