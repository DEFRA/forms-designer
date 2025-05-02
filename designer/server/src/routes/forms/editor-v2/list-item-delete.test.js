import { StatusCodes } from 'http-status-codes'

import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import {
  getQuestionSessionState,
  setQuestionSessionState
} from '~/src/lib/session-helper.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/session-helper.js')

const mockState = {
  listItems: [
    { id: '1', text: 'text1', hint: { text: 'hint1' }, value: 'value1' },
    { id: '2', text: 'text2', hint: { text: 'hint2' }, value: 'value2' },
    { id: '3', text: 'text3', hint: { text: 'hint3' }, value: 'value3' }
  ]
}

describe('Editor v2 list item delete routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET - should render correct content in the view when deleting a list item', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(getQuestionSessionState).mockReturnValueOnce(mockState)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/question/q1/details/12345/delete-list-item/2',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })

    const $subHeadings = container.getAllByRole('heading', { level: 2 })

    const $buttons = container.getAllByRole('button')

    expect($mainHeading).toHaveTextContent('Test form')
    expect($subHeadings[0]).toHaveTextContent(
      'Are you sure you want to delete this item?'
    )
    expect($buttons[2]).toHaveAccessibleName('Delete item')
    expect($buttons[3]).toHaveAccessibleName('Cancel')
    expect($buttons[3]).toHaveAttribute(
      'href',
      '/library/my-form-slug/editor-v2/page/p1/question/q1/details/12345#list-items'
    )
  })

  test('POST - should delete item and redirect to item list in question page', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(getQuestionSessionState).mockReturnValueOnce(mockState)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/question/q1/details/12345/delete-list-item/2',
      auth
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(setQuestionSessionState).toHaveBeenCalledWith(
      expect.anything(),
      '12345',
      {
        listItems: [
          { hint: { text: 'hint1' }, id: '1', text: 'text1', value: 'value1' },
          { hint: { text: 'hint3' }, id: '3', text: 'text3', value: 'value3' }
        ]
      }
    )
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/question/q1/details/12345#list-items'
    )
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
