import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
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

  test('GET - should check correct radio is rendered in the view', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })
    const $legend = container.getByRole('group')
    const $radios = container.getAllByRole('radio')
    const $actions = container.getAllByRole('button')

    expect($mainHeading).toHaveTextContent('Test form')
    expect($legend).toHaveTextContent('What kind of page do you need?')
    expect($radios[0]).toHaveAccessibleName('Question page')
    expect($radios[1]).toHaveAccessibleName('Guidance page')
    expect($actions).toHaveLength(3)
    expect($actions[2]).toHaveTextContent('Save and continue')
  })

  test('POST - should redirect to question if question selected', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page',
      auth,
      payload: { pageType: 'question' }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/new/question/new/type'
    )
  })

  test('POST - should redirect to quidance if guidance selected', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

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
      '/library/my-form-slug/editor-v2/page/new/guidance/new'
    )
  })

  test('POST - should redirect to actual page id if question selected and a page id exists', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/123456',
      auth,
      payload: { pageType: 'question' }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/123456/question/new/type'
    )
  })

  test('POST - should error if no radio selected', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

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
      new Joi.ValidationError('Select a page type', [], undefined),
      'pageValidationFailure'
    )
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
