import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import * as file from '~/src/lib/file.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/file.js')

describe('File routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  describe('GET', () => {
    test('should show file download page when response is 200', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce(200)

      const options = {
        method: 'GET',
        url: '/file-download/1234',
        auth
      }

      const { document } = await renderResponse(server, options)

      const html = document.documentElement.innerHTML

      expect(html).toContain('You have a file to download')
      expect(html).toContain('Email address')
    })

    test('should show link expired page when response is 410', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce(410)

      const options = {
        method: 'GET',
        url: '/file-download/1234',
        auth
      }

      const { document } = await renderResponse(server, options)

      const html = document.documentElement.innerHTML

      expect(html).toContain('The link has expired')
    })
  })

  describe('POST', () => {
    test('should return download url', async () => {
      jest
        .mocked(file.createFileLink)
        .mockResolvedValueOnce({ url: '/download-link' })

      const options = {
        method: 'post',
        url: '/file-download/1234',
        auth,
        payload: { email: 'new.email@gov.uk' }
      }

      const {
        response: { headers, statusCode }
      } = await renderResponse(server, options)

      expect(statusCode).toBe(StatusCodes.MOVED_TEMPORARILY)
      expect(headers.location).toBe('/download-link')
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
