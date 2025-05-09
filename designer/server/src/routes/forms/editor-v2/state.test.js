import { ComponentType } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import { getQuestionSessionState } from '~/src/lib/session-helper.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/session-helper.js')

const simpleSessionWithRadiosField = {
  questionType: ComponentType.RadiosField
}

const badSession = {}

describe('Editor v2 state route', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('POST - should error if missing fields', async () => {
    jest
      .mocked(getQuestionSessionState)
      .mockReturnValue(simpleSessionWithRadiosField)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/state/12345',
      auth,
      payload: {}
    }

    const {
      response: { statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
  })

  test('POST - should error if invalid state', async () => {
    jest.mocked(getQuestionSessionState).mockReturnValue(badSession)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/state/12345',
      auth,
      payload: {
        listItems: []
      }
    }

    const {
      response: { statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
  })

  test('POST - should return 200 if all ok', async () => {
    jest
      .mocked(getQuestionSessionState)
      .mockReturnValue(simpleSessionWithRadiosField)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/state/12345',
      auth,
      payload: {
        listItems: []
      }
    }

    const {
      response: { statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.OK)
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
