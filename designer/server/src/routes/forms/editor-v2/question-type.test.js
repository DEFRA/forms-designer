import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { testFormDefinitionWithSinglePage } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import {
  QUESTION_TYPE_DATE_GROUP,
  QUESTION_TYPE_WRITTEN_ANSWER_GROUP
} from '~/src/common/constants/editor.js'
import { createServer } from '~/src/createServer.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { deriveQuestionType } from '~/src/routes/forms/editor-v2/question-type.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/error-helper.js')

describe('Editor v2 question routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET - should render the question fields in the view', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithSinglePage)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/question/c1',
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

    expect($radios).toHaveLength(11)
    expect($radios[0]).toHaveAccessibleName('Written answer')
    expect($radios[1]).toHaveAccessibleName('Short answer (a single line)')
    expect($radios[2]).toHaveAccessibleName(
      'Long answer (more than a single line)'
    )
    expect($radios[3]).toHaveAccessibleName('Numbers only')
    expect($radios[4]).toHaveAccessibleName('Date')
    expect($radios[5]).toHaveAccessibleName('Day, month and year')
    expect($radios[6]).toHaveAccessibleName('Month and year')
    expect($radios[7]).toHaveAccessibleName('UK address')
    expect($radios[8]).toHaveAccessibleName('Phone number')
    expect($radios[9]).toHaveAccessibleName('Email address')
    expect($radios[10]).toHaveAccessibleName(
      'A list of options that users can choose from'
    )
  })

  test('POST - should error if missing mandatory fields', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/1/question/1',
      auth,
      payload: {}
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/1/question/1'
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

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/1/question/1',
      auth,
      payload: { questionType: 'UkAddressField' }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/1/question/1/details'
    )
  })

  describe('deriveQuestionType', () => {
    test('gets written answer sub-type', () => {
      expect(
        deriveQuestionType(
          QUESTION_TYPE_WRITTEN_ANSWER_GROUP,
          'wa-sub',
          'd-sub'
        )
      ).toBe('wa-sub')
    })

    test('gets date sub-type', () => {
      expect(
        deriveQuestionType(QUESTION_TYPE_DATE_GROUP, 'wa-sub', 'd-sub')
      ).toBe('d-sub')
    })

    test('gets non-sub type', () => {
      expect(deriveQuestionType('standard-type', 'wa-sub', 'd-sub')).toBe(
        'standard-type'
      )
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
