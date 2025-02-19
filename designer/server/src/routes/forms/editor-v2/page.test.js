import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { createServer } from '~/src/createServer.js'
import { addPage } from '~/src/lib/editor.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/editor.js')

describe('Editor v2 page routes', () => {
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
   * @satisfies {Page}
   */
  const newPage = {
    id: 'new-page-id',
    title: 'Page one',
    path: '/path',
    controller: undefined,
    next: [],
    components: []
  }

  test('GET - should check correct radio is rendered in the view', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })

    const $radios = container.getAllByRole('radio')

    const $actions = container.getAllByRole('button')

    expect($mainHeading).toHaveTextContent(
      'Test form What kind of page do you need?'
    )
    expect($radios[0]).toHaveAccessibleName('Question page')
    expect($radios[1]).toHaveAccessibleName('Guidance page')
    expect($actions).toHaveLength(3)
    expect($actions[2]).toHaveTextContent('Save and continue')
  })

  test('POST - should redirect to question if question selected', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
    jest.mocked(addPage).mockResolvedValue(newPage)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/new-page-id',
      auth,
      payload: { pageType: 'question' }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/new-page-id/question'
    )
  })

  test('POST - should redirect to quidance if guidance selected', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
    jest.mocked(addPage).mockResolvedValue(newPage)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page',
      auth,
      payload: { pageType: 'guidance' }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/new-page-id/guidance'
    )
  })

  test('POST - should error if no radio selected', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page',
      auth,
      payload: { pageType: '' }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/my-form-slug/editor-v2/page')
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      new Joi.ValidationError('Choose a Page Type', [], undefined),
      'pageValidationFailure'
    )
  })
})

/**
 * @import { FormMetadata, FormMetadataAuthor, Page } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
