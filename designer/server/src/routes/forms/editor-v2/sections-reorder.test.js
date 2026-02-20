import { StatusCodes } from 'http-status-codes'

import { testFormDefinitionWithSections } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as editor from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import {
  getFlashFromSession,
  setFlashInSession
} from '~/src/lib/session-helper.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/session-helper.js')
jest.mock('~/src/lib/editor.js')

describe('Editor v2 sections reorder routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    jest.restoreAllMocks()
    server = await createServer()
    await server.initialize()
  })

  describe('GET', () => {
    test('should check correct formData is rendered in the view with multiple sections', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithSections)
      jest.mocked(getFlashFromSession).mockReturnValueOnce(undefined)

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/sections-reorder',
        auth
      }

      const { container } = await renderResponse(server, options)

      const $mainHeading = container.getByRole('heading', { level: 1 })

      const $pageTitles = container.getAllByRole('heading', { level: 2 })

      const $actions = container.getAllByRole('button')

      expect($mainHeading).toHaveTextContent('Test form Re-order sections')
      expect($pageTitles[0]).toHaveTextContent('Section 1: Section one')
      expect($pageTitles[1]).toHaveTextContent('Section 2: Section two')
      expect($pageTitles[2]).toHaveTextContent('Section 3: Section three')
      expect($actions).toHaveLength(9)
      expect($actions[2]).toHaveTextContent('Save changes')
      expect($actions[3]).toHaveTextContent('Up')
      expect($actions[4]).toHaveTextContent('Down')
      expect($actions[5]).toHaveTextContent('Up')
      expect($actions[6]).toHaveTextContent('Down')
      expect($actions[7]).toHaveTextContent('Up')
      expect($actions[8]).toHaveTextContent('Down')
    })
  })

  describe('POST', () => {
    test('POST - should alter order and redirect to GET', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithSections)
      jest
        .mocked(getFlashFromSession)
        .mockReturnValueOnce('section1|section2|section3')

      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/sections-reorder',
        auth,
        payload: { movement: 'up|s2', itemOrder: 's1,s2,s3' }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe(
        '/library/my-form-slug/editor-v2/sections-reorder?focus=up|s2'
      )
      expect(setFlashInSession).toHaveBeenCalledWith(
        expect.anything(),
        'reorderSections',
        's2,s1,s3'
      )
    })

    test('POST - should save changes and redirect to', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      const options = {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/sections-reorder',
        auth,
        payload: { saveChanges: 'true', itemOrder: 'abc-123,def-456,ghi-789' }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe(
        '/library/my-form-slug/editor-v2/page/c2/check-answers-settings/sections'
      )
      expect(editor.reorderSections).toHaveBeenCalledWith(
        '661e4ca5039739ef2902b214',
        expect.anything(),
        ['abc-123', 'def-456', 'ghi-789']
      )
    })
  })

  test('POST - should handle form validation failure and redirect', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/sections-reorder',
      auth,
      payload: { itemOrder: 'invalid-format' }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/sections-reorder'
    )
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
