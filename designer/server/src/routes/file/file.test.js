import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import * as file from '~/src/lib/file.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/file.js')

describe('File routes', () => {
  /** @type {Server} */
  let server
  const fileDownloadUrl = '/file-download/1234'
  const email = 'new.email@gov.uk'

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  describe('GET', () => {
    test('should show file download page with email (from cache) when file status response is 200', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce(StatusCodes.OK)
      jest.spyOn(server.methods.state, 'get').mockResolvedValue(email)

      const options = {
        method: 'GET',
        url: fileDownloadUrl,
        auth
      }

      const { document } = await renderResponse(server, options)

      const html = document.documentElement.innerHTML

      expect(html).toContain('You have a file to download')
      expect(html).toContain('Email address')
      expect(html).toContain('new.email@gov.uk')
    })

    test('should show file download page for user to enter email when file status response is 200', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce(StatusCodes.OK)
      jest.spyOn(server.methods.state, 'get').mockResolvedValue(undefined)

      const options = {
        method: 'GET',
        url: fileDownloadUrl,
        auth
      }

      const { document } = await renderResponse(server, options)

      const html = document.documentElement.innerHTML

      expect(html).toContain('You have a file to download')
      expect(html).toContain('Email address')
      expect(html).not.toContain('new.email@gov.uk')
    })

    test('should show link expired page when response is 410', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce(StatusCodes.GONE)

      const options = {
        method: 'GET',
        url: fileDownloadUrl,
        auth
      }

      const { document } = await renderResponse(server, options)

      const html = document.documentElement.innerHTML

      expect(html).toContain('The link has expired')
    })

    test('should show unauthorized page when user is unauthorized', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce(StatusCodes.OK)

      const options = {
        method: 'GET',
        url: fileDownloadUrl,
        auth: { ...auth, credentials: {} }
      }

      // @ts-expect-error: auth credentials are intentionally empty for this test case
      const { document } = await renderResponse(server, options)

      const html = document.documentElement.innerHTML

      expect(html).toContain(
        'You do not have access to this service - Submit a form to Defra'
      )
    })
  })

  describe('POST', () => {
    test('should show file is downloading page', async () => {
      jest
        .mocked(file.createFileLink)
        .mockResolvedValueOnce({ url: '/download-link' })

      const options = {
        method: 'post',
        url: fileDownloadUrl,
        auth,
        payload: { email }
      }

      const { document } = await renderResponse(server, options)

      const html = document.documentElement.innerHTML

      expect(html).toContain('Your file is downloading')
    })

    test('should show link expired page when download file link response is 410', async () => {
      jest.mocked(file.createFileLink).mockRejectedValue(Boom.resourceGone())

      const options = {
        method: 'post',
        url: fileDownloadUrl,
        auth,
        payload: { email }
      }

      const { document } = await renderResponse(server, options)

      const html = document.documentElement.innerHTML

      expect(html).toContain('The link has expired')
    })

    test('should show error when email is not for download file', async () => {
      jest.mocked(file.createFileLink).mockRejectedValue(Boom.forbidden())

      const options = {
        method: 'post',
        url: fileDownloadUrl,
        auth,
        payload: { email }
      }

      const { document } = await renderResponse(server, options)

      const html = document.documentElement.innerHTML

      expect(html).toContain(
        'This is not the email address the file was sent to'
      )
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
