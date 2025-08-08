import Boom from '@hapi/boom'
import { within } from '@testing-library/dom'
import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { formsLibraryPath } from '~/src/models/links.js'
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
    jest
      .mocked(forms.get)
      .mockResolvedValueOnce(metadata)
      .mockResolvedValueOnce(metadata)

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

    jest
      .mocked(forms.get)
      .mockResolvedValueOnce(metadata)
      .mockResolvedValueOnce(metadata)

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

describe('Deleting a form', () => {
  /** @type {Server} */
  let server

  /** @type {Date} */
  let now

  /** @type {FormMetadataAuthor} */
  let author

  /** @type {FormMetadata} */
  let metadata

  /** @type {FormMetadataState} */
  let state

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
      createdAt: now,
      createdBy: author,
      updatedAt: now,
      updatedBy: author
    }

    state = {
      createdAt: now,
      createdBy: author,
      updatedAt: now,
      updatedBy: author
    }
  })

  afterAll(async () => {
    await server.stop()
  })

  test('The confirmation page is shown', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce({
      ...metadata,
      draft: state
    })

    const options = {
      method: 'GET',
      url: '/library/my-form/delete-draft',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $heading = container.getByRole('heading', {
      name: 'My form Are you sure you want to delete this form?', // "My form" is the caption. Ugly but necessary.
      level: 1
    })
    expect($heading).toBeInTheDocument()

    const $warning = container.getByText('You cannot recover deleted forms.')
    expect($warning).toBeInTheDocument()

    const $deleteButton = container.getByRole('button', {
      name: 'Delete form'
    })
    const $cancelButton = container.getByRole('button', {
      name: 'Cancel'
    })
    expect($deleteButton).toBeInTheDocument()
    expect($cancelButton).toBeInTheDocument()
  })

  test('When a form is draft, allow the deletion', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce({
      ...metadata,
      draft: state
    })

    const options = {
      method: 'POST',
      url: '/library/my-form/delete-draft',
      auth
    }

    const { response } = await renderResponse(server, options)

    expect(response.statusCode).toBe(StatusCodes.MOVED_TEMPORARILY)
    expect(response.headers.location).toBe(formsLibraryPath)
  })

  test('Ensure the user is shown an error message when it occurs', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce({
      ...metadata,
      draft: state
    })
    jest
      .mocked(forms.deleteForm)
      .mockRejectedValueOnce(Boom.badRequest('An example error message here'))

    const { container } = await renderResponse(server, {
      url: '/library/my-form/delete-draft',
      method: 'POST',
      auth
    })

    const $errorSummary = container.getByRole('alert')
    const $errorItems = within($errorSummary).getAllByRole('listitem')

    const $heading = within($errorSummary).getByRole('heading', {
      name: 'There is a problem',
      level: 2
    })

    expect($heading).toBeInTheDocument()
    expect($errorItems[0]).toHaveTextContent('An example error message here')
  })
})

/**
 * @import { FormMetadata, FormMetadataAuthor, FormMetadataState } from '@defra/forms-model'
 * @import { Server, ServerInjectResponse } from '@hapi/hapi'
 */
