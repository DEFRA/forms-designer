import { ComponentType, QuestionTypeSubGroup } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import {
  testFormDefinitionWithNoQuestions,
  testFormDefinitionWithOneQuestionNoPageTitle,
  testFormDefinitionWithSinglePage
} from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import {
  createQuestionSessionState,
  getQuestionSessionState
} from '~/src/lib/session-helper.js'
import { deriveQuestionType } from '~/src/routes/forms/editor-v2/question-type.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/error-helper.js', () => {
  const original = jest.requireActual('~/src/lib/error-helper.js')

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...original,
    addErrorsToSession: jest.fn()
  }
})

jest.mock('~/src/lib/session-helper.js')

const simpleSessionWithTextField = {
  questionType: ComponentType.TextField
}

describe('Editor v2 question routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET - should redirect if no session yet', async () => {
    jest.mocked(getQuestionSessionState).mockReturnValue(undefined)
    jest.mocked(createQuestionSessionState).mockReturnValue('newSessId')
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithSinglePage)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/1/question/1/type',
      auth
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/1/question/1/type/newSessId'
    )
  })

  test('GET - should render the question fields in the view', async () => {
    jest
      .mocked(getQuestionSessionState)
      .mockReturnValue(simpleSessionWithTextField)
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithSinglePage)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/question/c1/type/54321',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mastheadHeading = container.getByText('Test form')
    const $cardTitle = container.getByText('Question 1')
    const $cardCaption = container.getByText('Page 1: question 1')

    const $radios = container.getAllByRole('radio')

    const $actions = container.getAllByRole('button')

    expect($mastheadHeading).toHaveTextContent('Test form')
    expect($mastheadHeading).toHaveClass('govuk-heading-xl')
    expect($cardTitle).toHaveTextContent('Question 1')
    expect($cardTitle).toHaveClass('editor-card-title')
    expect($cardCaption).toHaveTextContent('Page 1: question 1')
    expect($cardCaption).toHaveClass('govuk-caption-l')

    expect($actions).toHaveLength(3)
    expect($actions[2]).toHaveTextContent('Save and continue')

    expect($radios).toHaveLength(19)
    expect($radios[0]).toHaveAccessibleName('Written answer')
    expect($radios[1]).toHaveAccessibleName('Short answer (a single line)')
    expect($radios[2]).toHaveAccessibleName(
      'Long answer (more than a single line)'
    )
    expect($radios[3]).toHaveAccessibleName('Numbers only')
    expect($radios[4]).toHaveAccessibleName('Date')
    expect($radios[5]).toHaveAccessibleName('Day, month and year')
    expect($radios[6]).toHaveAccessibleName('Month and year')
    expect($radios[7]).toHaveAccessibleName('Location')
    expect($radios[8]).toHaveAccessibleName('UK address')
    expect($radios[9]).toHaveAccessibleName('Phone number')
    expect($radios[10]).toHaveAccessibleName('Supporting evidence')
    expect($radios[11]).toHaveAccessibleName('Email address')
    expect($radios[12]).toHaveAccessibleName('Declaration')
    expect($radios[13]).toHaveAccessibleName(
      'A list of options that users can choose from'
    )
    expect($radios[14]).toHaveAccessibleName('Yes or No')
    expect($radios[15]).toHaveAccessibleName('Checkboxes')
    expect($radios[16]).toHaveAccessibleName('Radios')
    expect($radios[17]).toHaveAccessibleName('Autocomplete')
    expect($radios[18]).toHaveAccessibleName('Select')
  })

  test('POST - should error if missing mandatory fields', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/1/question/1/type/54321',
      auth,
      payload: {}
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/1/question/1/type/54321'
    )
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      new Joi.ValidationError(
        'Select the type of information you need from users or ask users to choose from a list',
        [],
        undefined
      ),
      'questionValidationFailure'
    )
  })

  test('POST - should redirect to next page if valid payload', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithNoQuestions)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/question/1/type/54321',
      auth,
      payload: { questionType: 'UkAddressField' }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/question/1/details/54321'
    )
  })

  test('GET - new questions should redirect to page overview with errors if there is no title', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithOneQuestionNoPageTitle)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/question/new/type/54321',
      auth
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/questions'
    )
  })

  test('GET - existing questions should not redirect to page overview with errors if there is no title', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithOneQuestionNoPageTitle)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/question/q1/type/54321',
      auth
    }

    const {
      response: { statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.OK)
  })

  test('POST - new questions should redirect to page overview with errors if there is no title', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithOneQuestionNoPageTitle)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/question/new/type/54321',
      auth,
      payload: { questionType: 'UkAddressField' }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/questions'
    )
  })

  test('POST - existing questions should not redirect to page overview with errors if there is no title', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithOneQuestionNoPageTitle)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/question/q1/type/54321',
      auth,
      payload: { questionType: 'UkAddressField' }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/question/q1/details/54321'
    )
  })

  describe('deriveQuestionType', () => {
    test('gets written answer sub-type', () => {
      expect(
        deriveQuestionType(
          QuestionTypeSubGroup.WrittenAnswerSubGroup,
          'wa-sub',
          'd-sub',
          'loc-sub',
          'l-sub'
        )
      ).toBe('wa-sub')
    })

    test('gets date sub-type', () => {
      expect(
        deriveQuestionType(
          QuestionTypeSubGroup.DateSubGroup,
          'wa-sub',
          'd-sub',
          'loc-sub',
          'l-sub'
        )
      ).toBe('d-sub')
    })

    test('gets list sub-type', () => {
      expect(
        deriveQuestionType(
          QuestionTypeSubGroup.ListSubGroup,
          'wa-sub',
          'd-sub',
          'loc-sub',
          'l-sub'
        )
      ).toBe('l-sub')
    })

    test('gets non-sub type', () => {
      expect(
        deriveQuestionType(
          'standard-type',
          'wa-sub',
          'd-sub',
          'loc-sub',
          'l-sub'
        )
      ).toBe('standard-type')
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
