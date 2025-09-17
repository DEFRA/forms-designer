import Boom from '@hapi/boom'
import { within } from '@testing-library/dom'
import { StatusCodes } from 'http-status-codes'

import * as userSession from '~/src/common/helpers/auth/get-user-session.js'
import { createServer } from '~/src/createServer.js'
import * as file from '~/src/lib/file.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/file.js')
jest.mock('~/src/messaging/publish-base.js')

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
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce({
        statusCode: StatusCodes.OK,
        emailIsCaseSensitive: false,
        filename: 'my-form-file'
      })
      jest.spyOn(server.methods.state, 'get').mockResolvedValue(email)

      const options = {
        method: 'GET',
        url: fileDownloadUrl,
        auth
      }

      const { container } = await renderResponse(server, options)

      const $heading = container.getByRole('heading', {
        name: 'You have a file to download',
        level: 1
      })

      expect($heading).toBeInTheDocument()
      expect($heading).toHaveClass('govuk-heading-l')

      const $input = container.getByRole('textbox', {
        name: 'Email address'
      })

      expect($input).toBeInTheDocument()
      expect($input).toHaveValue('new.email@gov.uk')
    })

    test('should show file download page for user to enter email when file status response is 200', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce({
        statusCode: StatusCodes.OK,
        emailIsCaseSensitive: false,
        filename: 'my-form-file'
      })
      jest.spyOn(server.methods.state, 'get').mockResolvedValue(undefined)

      const options = {
        method: 'GET',
        url: fileDownloadUrl,
        auth
      }

      const { container } = await renderResponse(server, options)

      const $heading = container.getByRole('heading', {
        name: 'You have a file to download',
        level: 1
      })

      expect($heading).toBeInTheDocument()
      expect($heading).toHaveClass('govuk-heading-l')

      const $input = container.getByRole('textbox', {
        name: 'Email address'
      })

      expect($input).toBeInTheDocument()
      expect($input).not.toHaveValue('new.email@gov.uk')
    })

    test('should show link expired page when response is 410', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce({
        statusCode: StatusCodes.GONE,
        emailIsCaseSensitive: false,
        filename: 'my-form-file'
      })

      const options = {
        method: 'GET',
        url: fileDownloadUrl,
        auth
      }

      const { container } = await renderResponse(server, options)

      const $heading = container.getByRole('heading', {
        name: 'The link has expired',
        level: 1
      })

      expect($heading).toBeInTheDocument()
      expect($heading).toHaveClass('govuk-heading-l')
    })

    test('should show unauthorized page when user is unauthorized', async () => {
      const options = {
        method: 'GET',
        url: fileDownloadUrl,
        auth
      }

      jest.spyOn(userSession, 'hasUser').mockReturnValue(false)

      const result = await renderResponse(server, options)

      expect(result.response.statusCode).toBe(401)
    })

    test('should throw Not Found when download not found', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce({
        statusCode: StatusCodes.NOT_FOUND,
        emailIsCaseSensitive: false,
        filename: ''
      })

      const options = {
        method: 'GET',
        url: fileDownloadUrl,
        auth
      }

      const result = await renderResponse(server, options)

      expect(result.response.statusCode).toBe(StatusCodes.NOT_FOUND)
    })

    test('should throw Internal Server Error when download not found', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce({
        statusCode: StatusCodes.CONFLICT,
        emailIsCaseSensitive: false,
        filename: ''
      })

      const options = {
        method: 'GET',
        url: fileDownloadUrl,
        auth
      }

      const result = await renderResponse(server, options)

      expect(result.response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    })
  })

  describe('POST', () => {
    test('should show file is downloading page', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce({
        statusCode: StatusCodes.OK,
        emailIsCaseSensitive: false,
        filename: 'my-form-file'
      })

      jest
        .mocked(file.createFileLink)
        .mockResolvedValueOnce({ url: '/download-link' })

      const options = {
        method: 'post',
        url: fileDownloadUrl,
        auth,
        payload: { email }
      }

      const { container } = await renderResponse(server, options)

      const $heading = container.getByRole('heading', {
        name: 'Your file is downloading',
        level: 1
      })

      expect($heading).toBeInTheDocument()
      expect($heading).toHaveClass('govuk-heading-l')
    })

    test('should show link expired page when download file link response is 410', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce({
        statusCode: StatusCodes.OK,
        emailIsCaseSensitive: false,
        filename: 'my-form-file'
      })

      jest.mocked(file.createFileLink).mockRejectedValue(Boom.resourceGone())

      const options = {
        method: 'post',
        url: fileDownloadUrl,
        auth,
        payload: { email }
      }

      const { container } = await renderResponse(server, options)

      const $heading = container.getByRole('heading', {
        name: 'The link has expired',
        level: 1
      })

      expect($heading).toBeInTheDocument()
      expect($heading).toHaveClass('govuk-heading-l')
    })

    test('should show error when email is not for download file', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce({
        statusCode: StatusCodes.OK,
        emailIsCaseSensitive: false,
        filename: 'my-form-file'
      })

      jest.mocked(file.createFileLink).mockRejectedValue(Boom.forbidden())

      const options = {
        method: 'post',
        url: fileDownloadUrl,
        auth,
        payload: { email }
      }

      const { container } = await renderResponse(server, options)

      const $errorSummary = container.getByRole('alert')
      const $errorItems = within($errorSummary).getAllByRole('listitem')

      const $heading = within($errorSummary).getByRole('heading', {
        name: 'There is a problem',
        level: 2
      })

      expect($heading).toBeInTheDocument()

      expect($errorItems[0]).toHaveTextContent(
        'This is not the email address the file was sent to'
      )
    })

    test('should show unauthorized page when user is unauthorized', async () => {
      const options = {
        method: 'post',
        url: fileDownloadUrl,
        auth,
        payload: { email }
      }

      jest.spyOn(userSession, 'hasUser').mockReturnValue(false)

      const result = await renderResponse(server, options)

      expect(result.response.statusCode).toBe(401)
    })

    test('should not lowercase email when emailIsCaseSensitive is true', async () => {
      const mixedCaseEmail = 'Some.Email@GOV.UK'

      jest.mocked(file.checkFileStatus).mockResolvedValueOnce({
        statusCode: StatusCodes.OK,
        emailIsCaseSensitive: true,
        filename: 'my-form-file'
      })

      jest
        .mocked(file.createFileLink)
        .mockResolvedValueOnce({ url: '/download-link' })

      const options = {
        method: 'post',
        url: fileDownloadUrl,
        auth,
        payload: { email: mixedCaseEmail }
      }

      await renderResponse(server, options)

      expect(file.createFileLink).toHaveBeenCalledWith(
        '1234',
        mixedCaseEmail,
        expect.any(String)
      )
    })

    test('should lowercase email when emailIsCaseSensitive is false', async () => {
      const mixedCaseEmail = 'Some.Email@GOV.UK'

      jest.mocked(file.checkFileStatus).mockResolvedValueOnce({
        statusCode: StatusCodes.OK,
        emailIsCaseSensitive: false,
        filename: 'my-form-file'
      })

      jest
        .mocked(file.createFileLink)
        .mockResolvedValueOnce({ url: '/download-link' })

      const options = {
        method: 'post',
        url: fileDownloadUrl,
        auth,
        payload: { email: mixedCaseEmail }
      }

      await renderResponse(server, options)

      expect(file.createFileLink).toHaveBeenCalledWith(
        '1234',
        mixedCaseEmail.toLowerCase(),
        expect.any(String)
      )
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
