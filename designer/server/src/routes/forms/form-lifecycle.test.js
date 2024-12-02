import Boom from '@hapi/boom'

import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')

describe('Test form draft and live creation route handlers', () => {
  /** @type {Server} */
  let server

  /** @type {Date} */
  let now

  /** @type {FormMetadataAuthor} */
  let author

  /** @type {FormMetadata} */
  let metadata

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  beforeEach(() => {
    now = new Date()

    author = {
      id: '1234',
      displayName: 'Joe Bloggs'
    }

    metadata = {
      id: '1234',
      slug: 'my-form',
      title: 'My form',
      organisation: 'Defra',
      teamName: 'Forms',
      teamEmail: 'foobar@defra.gov.uk',
      notificationEmail: 'defraforms@defra.gov.uk',
      draft: {
        createdAt: now,
        createdBy: author,
        updatedAt: now,
        updatedBy: author
      },
      createdAt: now,
      createdBy: author,
      updatedAt: now,
      updatedBy: author
    }
  })

  afterAll(async () => {
    await server.stop()
  })

  test('When a draft will be going live and there are no warnings, show the page content', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(metadata)

    const options = {
      method: 'GET',
      url: '/library/my-form/make-draft-live',
      auth
    }

    await renderResponse(server, options)

    const $bodyText = document.querySelector('.govuk-body-l')
    const $warningText = document.querySelector('.govuk-warning-text')

    expect($bodyText).toHaveTextContent(
      'Completed forms will be sent to defraforms@defra.gov.uk.'
    )

    expect($warningText).not.toBeInTheDocument()
  })

  test('When a live form is about to be overwritten, warn the user ahead of time', async () => {
    metadata.live = {
      createdAt: now,
      createdBy: author,
      updatedAt: now,
      updatedBy: author
    }

    jest.mocked(forms.get).mockResolvedValueOnce(metadata)

    const options = {
      method: 'GET',
      url: '/library/my-form/make-draft-live',
      auth
    }

    await renderResponse(server, options)

    const $warningText = document.querySelector('.govuk-warning-text')

    expect($warningText).toHaveTextContent(
      'It will replace the form that is currently live'
    )
  })

  test('When a notificationEmail is missing, hide the body text', async () => {
    const metadataNoNotificationEmail = { ...metadata }
    delete metadataNoNotificationEmail.notificationEmail

    jest.mocked(forms.get).mockResolvedValueOnce(metadataNoNotificationEmail)

    const options = {
      method: 'GET',
      url: '/library/my-form/make-draft-live',
      auth
    }

    await renderResponse(server, options)

    const $bodyText = document.querySelector('.govuk-body-l')

    expect($bodyText).not.toBeInTheDocument()
  })

  test('When a live form is created, it should redirect to the library', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(metadata)

    // @ts-expect-error we don't care about the full response
    jest.mocked(forms.makeDraftFormLive).mockResolvedValueOnce({
      statusCode: 200
    })

    const options = {
      method: 'POST',
      url: '/library/my-form/make-draft-live',
      auth
    }

    const { headers } = /** @type {ServerInjectResponse<string>} */ (
      await server.inject(options)
    )

    expect(headers.location).toBe('/library/my-form')
  })

  test('When a live form creation fails, it should throw an error', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(metadata)
    jest.mocked(forms.makeDraftFormLive).mockRejectedValueOnce(Boom.internal())

    const options = {
      method: 'POST',
      url: '/library/my-form/make-draft-live',
      auth
    }

    const { statusCode } = /** @type {ServerInjectResponse<string>} */ (
      await server.inject(options)
    )

    expect(statusCode).not.toBe(302) // test it isn't redirected. until we have a proper error handler.
  })

  test('When a draft form is created, it should redirect to the library', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(metadata)

    // @ts-expect-error we don't care about the full response
    jest.mocked(forms.createDraft).mockResolvedValueOnce({
      statusCode: 200
    })

    const options = {
      method: 'POST',
      url: '/library/my-form/create-draft-from-live',
      auth
    }

    const { headers } = /** @type {ServerInjectResponse<string>} */ (
      await server.inject(options)
    )

    expect(headers.location).toBe('/library/my-form')
  })

  test('When a draft form creation fails, it should throw an error', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(metadata)
    jest.mocked(forms.createDraft).mockRejectedValueOnce(Boom.internal())

    const options = {
      method: 'POST',
      url: '/library/my-form/create-draft-from-live',
      auth
    }

    const { statusCode } = /** @type {ServerInjectResponse<string>} */ (
      await server.inject(options)
    )

    expect(statusCode).not.toBe(302) // test it isn't redirected. until we have a proper error handler.
  })
})

/**
 * @import { FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 * @import { Server, ServerInjectResponse } from '@hapi/hapi'
 */
