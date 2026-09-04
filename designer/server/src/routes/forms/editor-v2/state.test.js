import { ComponentType, ExtensionType } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import {
  getQuestionSessionState,
  setQuestionSessionState
} from '~/src/lib/session-helper.js'
import { mergeExtensions } from '~/src/routes/forms/editor-v2/state.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/session-helper.js')

const simpleSessionWithRadiosField = {
  questionType: ComponentType.RadiosField
}

const simpleSessionWithCheckboxesField = {
  questionType: ComponentType.CheckboxesField
}

const badSession = {}

/** @type {Extension[]} */
const exclusiveExtensions = [{ type: ExtensionType.Exclusive }]

const idOne = '4d7c8e2a-1f3b-4a5c-9d6e-7f8a9b0c1d2e'
const idTwo = '4d7c8e2a-1f3b-4a5c-9d6e-7f8a9b0c1d2f'

describe('Editor v2 state route', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
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

  test('POST - should keep extensions posted by the page', async () => {
    jest
      .mocked(getQuestionSessionState)
      .mockReturnValue(simpleSessionWithCheckboxesField)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/state/12345',
      auth,
      payload: {
        listItems: [
          { id: idOne, text: 'Option one', value: 'one' },
          {
            id: idTwo,
            text: 'None of the above',
            value: 'none',
            extensions: exclusiveExtensions
          }
        ]
      }
    }

    const {
      response: { statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.OK)
    expect(jest.mocked(setQuestionSessionState)).toHaveBeenCalledWith(
      expect.anything(),
      '12345',
      expect.objectContaining({
        listItems: [
          { id: idOne, text: 'Option one', value: 'one' },
          {
            id: idTwo,
            text: 'None of the above',
            value: 'none',
            extensions: exclusiveExtensions
          }
        ]
      })
    )
  })
})

describe('mergeExtensions', () => {
  test('should use the incoming extensions when the page sends them', () => {
    const incoming = [
      { id: idOne, text: 'None of the above', extensions: exclusiveExtensions }
    ]

    expect(
      mergeExtensions([{ id: idOne, text: 'None of the above' }], incoming)
    ).toEqual(incoming)
  })

  test('should fall back to session state when the page omits them', () => {
    const result = mergeExtensions(
      [
        { id: idOne, text: 'Option one' },
        {
          id: idTwo,
          text: 'None of the above',
          extensions: exclusiveExtensions
        }
      ],
      [
        { id: idTwo, text: 'None of the above' },
        { id: idOne, text: 'Option one' }
      ]
    )

    expect(result).toEqual([
      {
        id: idTwo,
        text: 'None of the above',
        extensions: exclusiveExtensions
      },
      { id: idOne, text: 'Option one' }
    ])
  })

  test('should honour an explicitly emptied extensions list', () => {
    const result = mergeExtensions(
      [
        {
          id: idOne,
          text: 'None of the above',
          extensions: exclusiveExtensions
        }
      ],
      [{ id: idOne, text: 'None of the above', extensions: [] }]
    )

    expect(result).toEqual([
      { id: idOne, text: 'None of the above', extensions: [] }
    ])
  })

  test('should leave items alone when there is no session state', () => {
    const incoming = [{ id: idOne, text: 'Option one' }]

    expect(mergeExtensions(undefined, incoming)).toEqual(incoming)
  })

  test('should not match items without an id', () => {
    const result = mergeExtensions(
      [{ text: 'None of the above', extensions: exclusiveExtensions }],
      [{ text: 'None of the above' }]
    )

    expect(result).toEqual([{ text: 'None of the above' }])
  })
})

/**
 * @import { Extension } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
