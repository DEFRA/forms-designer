import { StatusCodes } from 'http-status-codes'

import { testFormDefinitionWithTwoPagesAndQuestions } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import {
  getFlashFromSession,
  setFlashInSession
} from '~/src/lib/session-helper.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/session-helper.js')

describe('Editor v2 pages reorder routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    jest.restoreAllMocks()
    server = await createServer()
    await server.initialize()
  })

  describe('GET', () => {
    test('should check correct formData is rendered in the view with multiple pages', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithTwoPagesAndQuestions)
      jest.mocked(getFlashFromSession).mockReturnValueOnce(undefined)

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/pages-reorder',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $mainHeading = container.getByRole('heading', { level: 1 })

      const $pageTitles = container.getAllByRole('heading', { level: 2 })

      const $actions = container.getAllByRole('button')

      expect($mainHeading).toHaveTextContent('Test form Re-order pages')
      expect($pageTitles[0]).toHaveTextContent('Page 1: Page one')
      expect($pageTitles[1]).toHaveTextContent('Page 2: Page two')
      expect($actions).toHaveLength(7)
      expect($actions[2]).toHaveTextContent('Save changes')
      expect($actions[3]).toHaveTextContent('Up')
      expect($actions[4]).toHaveTextContent('Down')
      expect($actions[5]).toHaveTextContent('Up')
      expect($actions[6]).toHaveTextContent('Down')
    })
  })

  describe('POST', () => {
    test('POST - should alter order and redirect to GET', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithTwoPagesAndQuestions)
      jest.mocked(getFlashFromSession).mockReturnValueOnce('page1|page2|page3')

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/pages-reorder',
        auth,
        payload: { movement: 'up|p2', pageOrder: 'p1,p2,p3' }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe(
        '/library/my-form-slug/editor-v2/pages-reorder?focus=up|p2'
      )
      expect(setFlashInSession).toHaveBeenCalledWith(
        expect.anything(),
        'reorderPages',
        'p2,p1,p3'
      )
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
