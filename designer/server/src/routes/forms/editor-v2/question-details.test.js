import { ComponentType, ControllerType } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { createServer } from '~/src/createServer.js'
import { addPageAndFirstQuestion } from '~/src/lib/editor.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/editor.js')

describe('Editor v2 question details routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  const now = new Date()
  const authorId = 'f50ceeed-b7a4-47cf-a498-094efc99f8bc'
  const authorDisplayName = 'Enrique Chase'

  /**
   * @satisfies {FormMetadataAuthor}
   */
  const author = {
    id: authorId,
    displayName: authorDisplayName
  }

  /**
   * @satisfies {FormMetadata}
   */
  const formMetadata = {
    id: '661e4ca5039739ef2902b214',
    slug: 'my-form-slug',
    title: 'Test form',
    organisation: 'Defra',
    teamName: 'Defra Forms',
    teamEmail: 'defraforms@defra.gov.uk',
    createdAt: now,
    createdBy: author,
    updatedAt: now,
    updatedBy: author,
    draft: {
      createdAt: now,
      createdBy: author,
      updatedAt: now,
      updatedBy: author
    }
  }

  /**
   * @satisfies {FormDefinition}
   */
  const formDefinition = {
    name: 'Test form',
    pages: [
      {
        id: 'p1',
        path: '/page-one',
        title: 'Page one',
        section: 'section',
        components: [
          {
            type: ComponentType.TextField,
            name: 'textField',
            title: 'This is your first field',
            hint: 'Help text',
            options: {},
            schema: {}
          }
        ],
        next: [{ path: '/summary' }]
      },
      {
        title: 'Summary',
        path: '/summary',
        controller: ControllerType.Summary
      }
    ],
    conditions: [],
    sections: [],
    lists: []
  }

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

  test('GET - should render the question fields in the view', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(formDefinition)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/question/1/details',
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
    expect($cardHeading).toHaveClass('govuk-fieldset__heading')

    expect($actions).toHaveLength(3)
    expect($actions[2]).toHaveTextContent('Save and continue')
  })

  test('POST - should error if missing mandatory fields', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)

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
        'Enter a question. Select a short description',
        [],
        undefined
      ),
      'questionDetailsValidationFailure'
    )
  })

  test('POST - should redirect to next page if valid payload', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
    jest.mocked(addPageAndFirstQuestion).mockResolvedValue(page)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/new/question/new/details',
      auth,
      payload: { question: 'Question text', shortDescription: 'Short desc' }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/12345/questions'
    )
  })
})

/**
 * @import { FormMetadata, FormMetadataAuthor, FormDefinition, Page } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
