import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')

describe('Test form draft and live creation route handlers', () => {
  /** @type {import('@hapi/hapi').Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  test('When a live form is about to be overwritten, warn the user ahead of time', async () => {
    const dummyForm = getDummyForm()
    dummyForm.live = {
      createdAt: new Date(),
      createdBy: {
        displayName: 'Joe Bloggs',
        id: '1234'
      },
      updatedAt: new Date(),
      updatedBy: {
        displayName: 'Joe Bloggs',
        id: '1234'
      }
    }

    jest.mocked(forms.get).mockResolvedValueOnce(dummyForm)

    const options = {
      method: 'GET',
      url: '/library/my-form/make-draft-live',
      auth
    }

    const { document } = await renderResponse(server, options)

    const $warningText = document.querySelector('.govuk-warning-text')

    expect($warningText).toHaveTextContent(
      'It will replace the form that is currently live'
    )
  })

  test("When a live form is not about to be overwritten, don't warn thh user", async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(getDummyForm())

    const options = {
      method: 'GET',
      url: '/library/my-form/make-draft-live',
      auth
    }

    const { document } = await renderResponse(server, options)

    const $warningText = document.querySelector('.govuk-warning-text')

    expect($warningText).toBeNull()
  })

  test('When a live form is created, it should redirect to the library', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(getDummyForm())

    // @ts-expect-error we don't care about the full response
    jest.mocked(forms.makeDraftFormLive).mockResolvedValueOnce({
      statusCode: 200
    })

    const options = {
      method: 'POST',
      url: '/library/my-form/make-draft-live',
      auth
    }

    const { headers } = /** @type {ServerInjectResponse} */ (
      await server.inject(options)
    )

    expect(headers.location).toBe('/library/my-form')
  })

  test('When a live form creation fails, it should throw an error', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(getDummyForm())

    // @ts-expect-error we don't care about the full response
    jest.mocked(forms.makeDraftFormLive).mockResolvedValueOnce({
      statusCode: 500
    })

    const options = {
      method: 'POST',
      url: '/library/my-form/make-draft-live',
      auth
    }

    const { statusCode } = /** @type {ServerInjectResponse} */ (
      await server.inject(options)
    )

    expect(statusCode).toBe(500) // until we have a proper error handler
  })

  test('When a draft form is created, it should redirect to the library', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(getDummyForm())

    // @ts-expect-error we don't care about the full response
    jest.mocked(forms.createDraft).mockResolvedValueOnce({
      statusCode: 200
    })

    const options = {
      method: 'POST',
      url: '/library/my-form/create-draft-from-live',
      auth
    }

    const { headers } = /** @type {ServerInjectResponse} */ (
      await server.inject(options)
    )

    expect(headers.location).toBe('/library/my-form')
  })

  test('When a draft form creation fails, it should throw an error', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(getDummyForm())

    // @ts-expect-error we don't care about the full response
    jest.mocked(forms.createDraft).mockResolvedValueOnce({
      statusCode: 500
    })

    const options = {
      method: 'POST',
      url: '/library/my-form/create-draft-from-live',
      auth
    }

    const { statusCode } = /** @type {ServerInjectResponse} */ (
      await server.inject(options)
    )

    expect(statusCode).toBe(500) // until we have a proper error handler
  })
})

/**
 * @returns {import('@defra/forms-model').FormMetadata}
 */
function getDummyForm() {
  return {
    id: '1234',
    slug: 'my-form',
    title: 'My form',
    organisation: 'Defra',
    teamName: 'Forms',
    teamEmail: 'defraforms@defra.gov.uk',
    draft: {
      createdAt: new Date(),
      createdBy: {
        displayName: 'Joe Bloggs',
        id: '1234'
      },
      updatedAt: new Date(),
      updatedBy: {
        displayName: 'Joe Bloggs',
        id: '1234'
      }
    }
  }
}

/**
 * @typedef {import('@hapi/hapi').Server} Server
 * @typedef {import('@hapi/hapi').ServerInjectOptions} ServerInjectOptions
 * @typedef {import('@hapi/hapi').ServerInjectResponse<string>} ServerInjectResponse
 */
