import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')

describe('Forms terms and conditions', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  const now = new Date()
  const authorId = 'f50ceeed-b7a4-47cf-a498-094efc99f8bc'
  const authorDisplayName = 'Enrique Chase'

  /**
   * @satisfies {FormMetadataAuthor}
   */
  const author = {
    id: authorId,
    displayName: authorDisplayName
  }

  /**
   * @satisfies {FormMetadata}
   */
  const formMetadata = {
    id: '661e4ca5039739ef2902b214',
    slug: 'my-form-slug',
    title: 'Test form',
    organisation: 'Defra',
    teamName: 'Defra Forms',
    teamEmail: 'defraforms@defra.gov.uk',
    termsAndConditionsAgreed: false,
    createdAt: now,
    createdBy: author,
    updatedAt: now,
    updatedBy: author
  }

  test('GET - should check correct terms and conditions checkbox is rendered in the view', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/edit/terms-and-conditions',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $checkbox = container.getByRole('checkbox', {
      name: 'I agree to the data protection terms and conditions'
    })
    expect($checkbox).toBeInTheDocument()
    expect($checkbox).not.toBeChecked()
  })

  test('GET - should check checkbox is checked when termsAndConditionsAgreed is true', async () => {
    const formMetadataWithAgreement = {
      ...formMetadata,
      termsAndConditionsAgreed: true
    }
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadataWithAgreement)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/edit/terms-and-conditions',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $checkbox = container.getByRole('checkbox', {
      name: 'I agree to the data protection terms and conditions'
    })
    expect($checkbox).toBeInTheDocument()
    expect($checkbox).toBeChecked()
  })

  test('POST - should redirect to overview page after accepting terms and conditions', async () => {
    jest
      .mocked(forms.get)
      .mockResolvedValueOnce(formMetadata)
      .mockResolvedValueOnce(formMetadata)
    jest.mocked(forms.updateMetadata).mockResolvedValueOnce({
      id: formMetadata.id,
      slug: 'my-form-slug',
      status: 'updated'
    })

    const options = {
      method: 'post',
      url: '/library/my-form-slug/edit/terms-and-conditions',
      auth,
      payload: {
        termsAndConditionsAgreed: 'true'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/my-form-slug')
    expect(forms.updateMetadata).toHaveBeenCalledWith(
      formMetadata.id,
      { termsAndConditionsAgreed: true },
      expect.any(String)
    )
  })

  test('POST - should redirect back with validation error when checkbox not checked', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/edit/terms-and-conditions',
      auth,
      payload: {}
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/edit/terms-and-conditions'
    )
  })

  test('POST - should redirect back with validation error when invalid value is submitted', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/edit/terms-and-conditions',
      auth,
      payload: {
        termsAndConditionsAgreed: 'false'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/edit/terms-and-conditions'
    )
    expect(forms.updateMetadata).not.toHaveBeenCalled()
  })
})

/**
 * @import { FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
