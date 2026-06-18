import { FormStatus } from '@defra/forms-engine-plugin/types'
import { ComponentType, ControllerType, Engine } from '@defra/forms-model'
import Boom from '@hapi/boom'
import { within } from '@testing-library/dom'
import { StatusCodes } from 'http-status-codes'

import * as userSession from '~/src/common/helpers/auth/get-user-session.js'
import { createServer } from '~/src/createServer.js'
import * as file from '~/src/lib/file.js'
import { getFormDefinitionForSubmission } from '~/src/lib/forms.js'
import { getSubmissionRecord } from '~/src/services/formSubmissionService.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/file.js')
jest.mock('~/src/messaging/publish-base.js')
jest.mock('~/src/services/formSubmissionService.js')
jest.mock('~/src/lib/forms.js')

describe('File routes', () => {
  /** @type {Server} */
  let server
  const referenceNumber = 'PDT-UC2-M3A'
  const firstFileId = '8cfaa958-06c3-45e4-9c31-8a5388b22d98'
  const fileDownloadUrl = '/file-download/1234'
  const filesDownloadUrl = `/files-download/${referenceNumber}`
  const email = 'new.email@gov.uk'
  const submissionRecord = {
    meta: {
      schemaVersion: 1,
      timestamp: new Date('2026-05-18T11:24:20.592Z'),
      referenceNumber,
      formName: 'File upload',
      formId: '69cbf817dfb03f22b7e03242',
      formSlug: 'file-upload',
      status: FormStatus.Draft,
      isPreview: true,
      notificationEmail: 'enrique.chase@defra.gov.uk',
      custom: {
        userConfirmationEmail: 'enrique.chase@defra.gov.uk'
      }
    },
    data: {
      main: {},
      repeaters: {},
      files: {
        BcwfYm: [
          {
            fileId: firstFileId,
            fileName: 'Screenshot from 2026-05-15 17-55-01.png',
            userDownloadLink: `http://localhost:3000/file-download/${firstFileId}`
          }
        ]
      }
    },
    result: {
      files: {
        main: '669a60c2-a594-416a-95a8-a13f4ec780d9',
        repeaters: {}
      }
    },
    recordCreatedAt: new Date('2026-05-18T11:24:54.128Z'),
    expireAt: new Date('2027-02-18T11:24:54.128Z')
  }
  /** @type {import('@defra/forms-model').FormDefinition} */
  const formDefinition = {
    name: 'File upload',
    engine: Engine.V2,
    schema: 2,
    startPage: '/summary',
    pages: [
      {
        controller: ControllerType.FileUpload,
        title: '',
        path: '/your-supporting-evidence',
        components: [
          {
            type: ComponentType.FileUploadField,
            title: 'Your supporting evidence',
            name: 'BcwfYm',
            shortDescription: 'Supporting evidence',
            hint: '',
            options: {
              required: true,
              accept: 'application/pdf,image/jpeg,image/png'
            },
            schema: {},
            id: 'f1b3df67-586c-4b14-96c1-0d241e2daf71'
          }
        ],
        next: [],
        id: 'bec60f78-5b06-4b99-a678-1c55a25341a0'
      },
      {
        id: '449a45f6-4541-4a46-91bd-8b8931b07b50',
        title: '',
        path: '/summary',
        controller: ControllerType.SummaryWithConfirmationEmail
      }
    ],
    conditions: [],
    sections: [],
    lists: []
  }

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  describe('GET', () => {
    test('should show file download page with email (from cache) when file status response is 200', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce({
        statusCode: StatusCodes.OK,
        emailIsCaseSensitive: false,
        filename: 'my-form-file1'
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
        filename: 'my-form-file2'
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
        filename: 'my-form-file3'
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

    test('should show files download page', async () => {
      jest.mocked(getSubmissionRecord).mockResolvedValueOnce(submissionRecord)
      jest
        .mocked(getFormDefinitionForSubmission)
        .mockResolvedValueOnce(formDefinition)
      jest
        .spyOn(server.methods.state, 'get')
        .mockResolvedValue('enrique.chase@defra.gov.uk')

      const options = {
        method: 'GET',
        url: filesDownloadUrl,
        auth
      }

      const { container } = await renderResponse(server, options)

      const $heading = container.getByRole('heading', {
        name: 'Download attached files',
        level: 1
      })

      expect($heading).toBeInTheDocument()
      expect($heading).toHaveClass('govuk-heading-l')
    })

    test('should redirect to the email entry page when not stored in state', async () => {
      jest.mocked(getSubmissionRecord).mockResolvedValueOnce(submissionRecord)
      jest
        .mocked(getFormDefinitionForSubmission)
        .mockResolvedValueOnce(formDefinition)
      jest.spyOn(server.methods.state, 'get').mockResolvedValue(undefined)

      const options = {
        method: 'GET',
        url: filesDownloadUrl,
        auth
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.MOVED_TEMPORARILY)
      expect(response.headers.location).toBe(
        `/file-download/${firstFileId}?referenceNumber=${referenceNumber}`
      )
    })

    test('should show unauthorized page when user is unauthorized for download all files', async () => {
      const options = {
        method: 'GET',
        url: filesDownloadUrl,
        auth
      }

      jest.spyOn(userSession, 'hasUser').mockReturnValue(false)

      const result = await renderResponse(server, options)

      expect(result.response.statusCode).toBe(401)
    })
  })

  describe('POST', () => {
    test('should show file is downloading page', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce({
        statusCode: StatusCodes.OK,
        emailIsCaseSensitive: false,
        filename: 'my-form-file6'
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
        filename: 'my-form-file7'
      })

      jest
        .mocked(file.createFileLink)
        .mockRejectedValueOnce(Boom.resourceGone())

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
        filename: 'my-form-file8'
      })

      jest.mocked(file.createFileLink).mockRejectedValueOnce(Boom.forbidden())

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

    test('should throw error when other exception', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce({
        statusCode: StatusCodes.OK,
        emailIsCaseSensitive: false,
        filename: 'my-form-file9'
      })

      jest.mocked(file.createFileLink).mockRejectedValueOnce(Boom.badData())

      const options = {
        method: 'post',
        url: fileDownloadUrl,
        auth,
        payload: { email }
      }

      const result = await renderResponse(server, options)

      expect(result.response.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY)
    })

    test('should show error when invalid payload', async () => {
      const options = {
        method: 'post',
        url: fileDownloadUrl,
        auth,
        payload: {}
      }

      const result = await renderResponse(server, options)

      expect(result.response.statusCode).toBe(StatusCodes.SEE_OTHER)
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
        filename: 'my-form-file11'
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
        filename: 'my-form-file12'
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

    test('should redirect to download all files if the reference number is passed in the query', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce({
        statusCode: StatusCodes.OK,
        emailIsCaseSensitive: false,
        filename: 'my-form-file6'
      })

      jest
        .mocked(file.createFileLink)
        .mockResolvedValueOnce({ url: '/download-link' })

      const options = {
        method: 'post',
        url: `${fileDownloadUrl}?referenceNumber=${referenceNumber}`,
        auth,
        payload: { email }
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.MOVED_TEMPORARILY)
      expect(response.headers.location).toBe(
        `/files-download/${referenceNumber}`
      )
    })

    test('should return json when invoked with accept application/json header', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce({
        statusCode: StatusCodes.OK,
        emailIsCaseSensitive: false,
        filename: 'my-form-file6'
      })

      jest
        .mocked(file.createFileLink)
        .mockResolvedValueOnce({ url: '/download-link' })

      const options = {
        method: 'post',
        url: `${fileDownloadUrl}?referenceNumber=${referenceNumber}`,
        auth,
        payload: { email },
        headers: {
          accept: 'application/json'
        }
      }

      const { response } = await renderResponse(server, options)

      expect(response.payload).toBe(
        JSON.stringify({ url: '/download-link', fileName: 'my-form-file6' })
      )
    })

    test('should return json when invoked with accept application/json header when response is GONE', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce({
        statusCode: StatusCodes.GONE,
        emailIsCaseSensitive: false,
        filename: 'my-form-file3'
      })

      jest
        .mocked(file.createFileLink)
        .mockRejectedValueOnce(Boom.resourceGone())

      const options = {
        method: 'post',
        url: `${fileDownloadUrl}?referenceNumber=${referenceNumber}`,
        auth,
        payload: { email },
        headers: {
          accept: 'application/json'
        }
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.GONE)
      expect(response.payload).toBe(
        JSON.stringify({ error: 'The link has expired' })
      )
    })

    test('should return json when invoked with accept application/json header when response is FORBIDDEN', async () => {
      jest.mocked(file.checkFileStatus).mockResolvedValueOnce({
        statusCode: StatusCodes.OK,
        emailIsCaseSensitive: false,
        filename: 'my-form-file8'
      })

      jest.mocked(file.createFileLink).mockRejectedValueOnce(Boom.forbidden())

      const options = {
        method: 'post',
        url: `${fileDownloadUrl}?referenceNumber=${referenceNumber}`,
        auth,
        payload: { email },
        headers: {
          accept: 'application/json'
        }
      }

      const { response } = await renderResponse(server, options)

      expect(response.statusCode).toBe(StatusCodes.FORBIDDEN)
      expect(response.payload).toBe(
        JSON.stringify({
          error:
            'This is not the email address the file was sent to. To confirm the file was meant for your team, enter the email address the file was sent to.'
        })
      )
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
