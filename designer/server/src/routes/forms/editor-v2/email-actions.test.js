import Boom from '@hapi/boom'
import { StatusCodes } from 'http-status-codes'

import {
  buildDefinition,
  testFormDefinitionWithMultipleV2Conditions
} from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import { createJoiError } from '~/src/lib/error-boom-helper.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { DUPLICATE_MESSAGE } from '~/src/routes/forms/editor-v2/email-actions.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/error-helper.js')

const conditionId = 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2'

const SERVICE_MESSAGE = 'Email address is not on the allow list'

/**
 * A forms-manager error, shaped the way the fetch helper boomifies them
 * @param {string} message
 */
function buildBoomError(message) {
  return Boom.boomify(new Error(message), {
    statusCode: StatusCodes.BAD_REQUEST,
    data: { message, statusCode: StatusCodes.BAD_REQUEST }
  })
}

/**
 * The session cookie set by the response, so a follow-up request picks up the
 * same session and with it anything flashed to the banner
 * @param {ServerInjectResponse} response
 */
function getCookie(response) {
  const cookies = /** @type {string[]} */ (response.headers['set-cookie'] ?? [])

  return cookies.map((cookie) => cookie.split(';')[0]).join('; ')
}

const metadataWithEmail = {
  ...testFormMetadata,
  notificationEmail: 'notify@defra.gov.uk'
}

/**
 * @param {Output[]} [outputs]
 */
function definitionWith(outputs) {
  return buildDefinition({
    ...testFormDefinitionWithMultipleV2Conditions,
    outputs
  })
}

const unconditionalOutput = /** @type {Output} */ ({
  emailAddress: 'unconditional@defra.gov.uk',
  audience: 'human',
  version: '1'
})

const conditionalOutput = /** @type {Output} */ ({
  emailAddress: 'conditional@defra.gov.uk',
  audience: 'machine',
  version: '1',
  condition: conditionId
})

describe('Editor v2 email actions routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('GET /library/{slug}/editor-v2/email-actions', () => {
    test('should render the default email address and the add form', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWith())

      const { container, document } = await renderResponse(server, {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/email-actions',
        auth
      })

      expect(container.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Email actions'
      )
      expect(
        container.getByRole('link', { name: 'Back to advanced settings' })
      ).toHaveAttribute(
        'href',
        '/library/my-form-slug/editor-v2/advanced-settings'
      )

      expect(document.body).toHaveTextContent('notify@defra.gov.uk')
      expect(document.body).toHaveTextContent('Human-readable')
      expect(document.body).toHaveTextContent(
        'If a submission is not delivered to another email address'
      )

      expect(
        container.getByRole('button', { name: 'Save new email address' })
      ).toBeInTheDocument()
    })

    test('should link the default email change to the metadata edit page', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWith())

      const { container } = await renderResponse(server, {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/email-actions',
        auth
      })

      expect(
        container.getByRole('link', { name: /Change.*Default email address/ })
      ).toHaveAttribute('href', '/library/my-form-slug/edit/notification-email')
    })

    test('should list additional email addresses with their conditions', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(
          definitionWith([unconditionalOutput, conditionalOutput])
        )

      const { document } = await renderResponse(server, {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/email-actions',
        auth
      })

      expect(document.body).toHaveTextContent('unconditional@defra.gov.uk')
      expect(document.body).toHaveTextContent('Every submission (no condition)')
      expect(document.body).toHaveTextContent('conditional@defra.gov.uk')
      expect(document.body).toHaveTextContent('isBobV2')
      expect(document.body).toHaveTextContent('Machine-readable (version 1)')
    })
  })

  describe('GET /library/{slug}/editor-v2/email-actions/{index}', () => {
    test('should pre-populate the form with the address being amended', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(
          definitionWith([unconditionalOutput, conditionalOutput])
        )

      const { container, document } = await renderResponse(server, {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/email-actions/1',
        auth
      })

      expect(
        /** @type {HTMLInputElement} */ (
          document.querySelector('#emailAddress')
        ).value
      ).toBe('conditional@defra.gov.uk')
      expect(
        container.getByRole('button', { name: 'Save changes' })
      ).toBeInTheDocument()
      expect(container.getByRole('link', { name: 'Cancel' })).toHaveAttribute(
        'href',
        '/library/my-form-slug/editor-v2/email-actions'
      )
    })

    test('should redirect to the list when the address does not exist', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWith([unconditionalOutput]))

      const response = await server.inject({
        method: 'get',
        url: '/library/my-form-slug/editor-v2/email-actions/9',
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(response.headers.location).toBe(
        '/library/my-form-slug/editor-v2/email-actions'
      )
    })
  })

  describe('POST /library/{slug}/editor-v2/email-actions', () => {
    test('should add an unconditional human-readable address', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWith())

      const response = await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions',
        auth,
        payload: {
          condition: '',
          emailAddress: 'New.Inbox@defra.gov.uk',
          audience: 'human'
        }
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(response.headers.location).toBe(
        '/library/my-form-slug/editor-v2/email-actions'
      )

      const [, definition] = jest.mocked(forms.updateDraftFormDefinition).mock
        .calls[0]

      expect(definition.outputs).toEqual([
        {
          emailAddress: 'new.inbox@defra.gov.uk',
          audience: 'human',
          version: '2'
        }
      ])
    })

    test('should add a conditional machine-readable address', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWith([unconditionalOutput]))

      await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions',
        auth,
        payload: {
          condition: conditionId,
          emailAddress: 'robot@defra.gov.uk',
          audience: 'machine',
          machineVersion: '1'
        }
      })

      const [, definition] = jest.mocked(forms.updateDraftFormDefinition).mock
        .calls[0]

      expect(definition.outputs).toEqual([
        unconditionalOutput,
        {
          emailAddress: 'robot@defra.gov.uk',
          audience: 'machine',
          version: '1',
          condition: conditionId
        }
      ])
    })

    test('should reject an empty email address', async () => {
      const response = await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions',
        auth,
        payload: { condition: '', emailAddress: '', audience: 'human' }
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(forms.updateDraftFormDefinition).not.toHaveBeenCalled()
    })

    test('should reject a malformed email address', async () => {
      const response = await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions',
        auth,
        payload: { condition: '', emailAddress: 'nope', audience: 'human' }
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(forms.updateDraftFormDefinition).not.toHaveBeenCalled()
    })

    test('should surface a validation error from the service', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWith())
      jest
        .mocked(forms.updateDraftFormDefinition)
        .mockRejectedValue(buildBoomError(SERVICE_MESSAGE))

      const response = await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions',
        auth,
        payload: {
          condition: '',
          emailAddress: 'new.inbox@defra.gov.uk',
          audience: 'human'
        }
      })

      expect(forms.updateDraftFormDefinition).toHaveBeenCalledTimes(1)
      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(response.headers.location).toBe(
        '/library/my-form-slug/editor-v2/email-actions#email-address-form'
      )
      expect(addErrorsToSession).toHaveBeenCalledWith(
        expect.anything(),
        'emailActionsValidationFailure',
        createJoiError('emailAddress', SERVICE_MESSAGE)
      )
    })

    test('should reject an address already receiving the same submissions', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWith([conditionalOutput]))

      const response = await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions',
        auth,
        payload: {
          condition: conditionId,
          emailAddress: 'Conditional@Defra.gov.uk',
          audience: 'machine',
          machineVersion: '1'
        }
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(response.headers.location).toBe(
        '/library/my-form-slug/editor-v2/email-actions#email-address-form'
      )
      expect(forms.updateDraftFormDefinition).not.toHaveBeenCalled()
      expect(addErrorsToSession).toHaveBeenCalledWith(
        expect.anything(),
        'emailActionsValidationFailure',
        createJoiError('emailAddress', DUPLICATE_MESSAGE)
      )
    })

    test('should allow the same address under a different condition', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWith([conditionalOutput]))

      await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions',
        auth,
        payload: {
          condition: '',
          emailAddress: 'conditional@defra.gov.uk',
          audience: 'machine',
          machineVersion: '1'
        }
      })

      const [, definition] = jest.mocked(forms.updateDraftFormDefinition).mock
        .calls[0]

      expect(definition.outputs).toEqual([
        conditionalOutput,
        {
          emailAddress: 'conditional@defra.gov.uk',
          audience: 'machine',
          version: '1'
        }
      ])
    })

    test('should not add beyond the maximum', async () => {
      const outputs = Array.from({ length: 20 }, (_ignore, index) => ({
        ...unconditionalOutput,
        emailAddress: `inbox-${index}@defra.gov.uk`
      }))

      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWith(outputs))

      const response = await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions',
        auth,
        payload: {
          condition: '',
          emailAddress: 'one-too-many@defra.gov.uk',
          audience: 'human'
        }
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(forms.updateDraftFormDefinition).not.toHaveBeenCalled()
    })
  })

  describe('POST /library/{slug}/editor-v2/email-actions/{index}', () => {
    test('should amend the address in place', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(
          definitionWith([unconditionalOutput, conditionalOutput])
        )

      const response = await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions/1',
        auth,
        payload: {
          condition: '',
          emailAddress: 'amended@defra.gov.uk',
          audience: 'human'
        }
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)

      const [, definition] = jest.mocked(forms.updateDraftFormDefinition).mock
        .calls[0]

      expect(definition.outputs).toEqual([
        unconditionalOutput,
        {
          emailAddress: 'amended@defra.gov.uk',
          audience: 'human',
          version: '2'
        }
      ])
    })

    test('should allow an amend that leaves the address unchanged', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(
          definitionWith([unconditionalOutput, conditionalOutput])
        )

      await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions/1',
        auth,
        payload: {
          condition: conditionId,
          emailAddress: 'conditional@defra.gov.uk',
          audience: 'machine',
          machineVersion: '1'
        }
      })

      const [, definition] = jest.mocked(forms.updateDraftFormDefinition).mock
        .calls[0]

      expect(definition.outputs).toEqual([
        unconditionalOutput,
        conditionalOutput
      ])
    })

    test('should reject an amend onto another address receiving the same submissions', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(
          definitionWith([unconditionalOutput, conditionalOutput])
        )

      const response = await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions/0',
        auth,
        payload: {
          condition: conditionId,
          emailAddress: 'conditional@defra.gov.uk',
          audience: 'machine',
          machineVersion: '1'
        }
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(response.headers.location).toBe(
        '/library/my-form-slug/editor-v2/email-actions/0#email-address-form'
      )
      expect(forms.updateDraftFormDefinition).not.toHaveBeenCalled()
      expect(addErrorsToSession).toHaveBeenCalledWith(
        expect.anything(),
        'emailActionsValidationFailure',
        createJoiError('emailAddress', DUPLICATE_MESSAGE)
      )
    })

    test('should ignore an amend of an address that does not exist', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWith([unconditionalOutput]))

      const response = await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions/9',
        auth,
        payload: {
          condition: '',
          emailAddress: 'amended@defra.gov.uk',
          audience: 'human'
        }
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(forms.updateDraftFormDefinition).not.toHaveBeenCalled()
    })
  })

  describe('POST /library/{slug}/editor-v2/email-actions/{index}/remove', () => {
    test('should remove the address', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(
          definitionWith([unconditionalOutput, conditionalOutput])
        )

      const response = await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions/0/remove',
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(response.headers.location).toBe(
        '/library/my-form-slug/editor-v2/email-actions'
      )

      const [, definition] = jest.mocked(forms.updateDraftFormDefinition).mock
        .calls[0]

      expect(definition.outputs).toEqual([conditionalOutput])
    })

    test('should report what was removed on the page it returns to', async () => {
      jest
        .mocked(forms.get)
        .mockResolvedValueOnce(metadataWithEmail)
        .mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(
          definitionWith([unconditionalOutput, conditionalOutput])
        )
        .mockResolvedValueOnce(definitionWith([unconditionalOutput]))

      const response = await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions/1/remove',
        auth
      })

      // The banner is shown on the page the removal redirects to
      const { document } = await renderResponse(server, {
        method: 'get',
        url: /** @type {string} */ (response.headers.location),
        auth,
        headers: { cookie: getCookie(response) }
      })

      const $banner = /** @type {HTMLElement} */ (
        document.querySelector('.govuk-notification-banner')
      )

      expect($banner).toHaveTextContent('Changes saved successfully')
      expect($banner).toHaveTextContent(
        'Removed email: conditional@defra.gov.uk in Machine-readable (version 1) format, sent: isBobV2.'
      )
    })

    test('should ignore a remove of an address that does not exist', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWith([unconditionalOutput]))

      const response = await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions/9/remove',
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(forms.updateDraftFormDefinition).not.toHaveBeenCalled()
    })
  })

  describe('GET /library/{slug}/editor-v2/email-actions/remove-all', () => {
    test('should ask for confirmation and list the addresses', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(
          definitionWith([unconditionalOutput, conditionalOutput])
        )

      const { container, document } = await renderResponse(server, {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/email-actions/remove-all',
        auth
      })

      expect(container.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Remove all additional email addresses'
      )
      expect(document.body).toHaveTextContent(
        'Are you sure you want to remove all additional email addresses?'
      )
      expect(document.body).toHaveTextContent('You cannot undo this action.')
      expect(document.body).toHaveTextContent('unconditional@defra.gov.uk')
      expect(document.body).toHaveTextContent('conditional@defra.gov.uk')

      expect(
        container.getByRole('button', { name: 'Remove all email addresses' })
      ).toBeInTheDocument()
      expect(container.getByRole('button', { name: 'Cancel' })).toHaveAttribute(
        'href',
        '/library/my-form-slug/editor-v2/email-actions'
      )
    })

    test('should redirect to the list when there is nothing to remove', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWith())

      const response = await server.inject({
        method: 'get',
        url: '/library/my-form-slug/editor-v2/email-actions/remove-all',
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(response.headers.location).toBe(
        '/library/my-form-slug/editor-v2/email-actions'
      )
    })
  })

  describe('POST /library/{slug}/editor-v2/email-actions/remove-all', () => {
    test('should remove every address', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(
          definitionWith([unconditionalOutput, conditionalOutput])
        )

      const response = await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions/remove-all',
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(response.headers.location).toBe(
        '/library/my-form-slug/editor-v2/email-actions'
      )

      const [, definition] = jest.mocked(forms.updateDraftFormDefinition).mock
        .calls[0]

      expect(definition.outputs).toEqual([])
    })

    test('should report how many were removed on the page it returns to', async () => {
      jest
        .mocked(forms.get)
        .mockResolvedValueOnce(metadataWithEmail)
        .mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(
          definitionWith([unconditionalOutput, conditionalOutput])
        )
        .mockResolvedValueOnce(definitionWith())

      const response = await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions/remove-all',
        auth
      })

      const { document } = await renderResponse(server, {
        method: 'get',
        url: /** @type {string} */ (response.headers.location),
        auth,
        headers: { cookie: getCookie(response) }
      })

      const $banner = /** @type {HTMLElement} */ (
        document.querySelector('.govuk-notification-banner')
      )

      expect($banner).toHaveTextContent('Changes saved successfully')
      expect($banner).toHaveTextContent(
        'Removed all 2 additional email addresses.'
      )
    })

    test('should do nothing when there are no addresses', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWith())

      const response = await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions/remove-all',
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(forms.updateDraftFormDefinition).not.toHaveBeenCalled()
    })

    test('should surface a failure from the service', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWith([unconditionalOutput]))
      jest
        .mocked(forms.updateDraftFormDefinition)
        .mockRejectedValue(buildBoomError(SERVICE_MESSAGE))

      const response = await server.inject({
        method: 'post',
        url: '/library/my-form-slug/editor-v2/email-actions/remove-all',
        auth
      })

      expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(response.headers.location).toBe(
        '/library/my-form-slug/editor-v2/email-actions'
      )
      expect(addErrorsToSession).toHaveBeenCalledWith(
        expect.anything(),
        'emailActionsValidationFailure',
        createJoiError('emailAddress', SERVICE_MESSAGE)
      )
    })
  })

  describe('remove all link', () => {
    test('should be offered once there is an address to remove', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWith([unconditionalOutput]))

      const { container } = await renderResponse(server, {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/email-actions',
        auth
      })

      expect(
        container.getByRole('link', {
          name: 'Remove all additional email addresses'
        })
      ).toHaveAttribute(
        'href',
        '/library/my-form-slug/editor-v2/email-actions/remove-all'
      )
    })

    test('should not be offered when there are no addresses', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(metadataWithEmail)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(definitionWith())

      const { container } = await renderResponse(server, {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/email-actions',
        auth
      })

      expect(
        container.queryByRole('link', {
          name: 'Remove all additional email addresses'
        })
      ).toBeNull()
    })
  })
})

/**
 * @import { Output } from '@defra/forms-model'
 * @import { Server, ServerInjectResponse } from '@hapi/hapi'
 */
