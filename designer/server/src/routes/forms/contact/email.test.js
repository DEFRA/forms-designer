import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { allowDelete } from '~/src/models/forms/contact/email.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')

describe('Forms contact email', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  const now = new Date()
  const authorId = 'f50ceeed-b7a4-47cf-a498-094efc99f8bc'
  const authorDisplayName = 'Enrique Chase'
  const emailAddress = 'support@defra.gov.uk'
  const responseTimeText = 'We aim to respond within 2 working days'

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
    contact: {
      email: {
        address: emailAddress,
        responseTime: responseTimeText
      }
    },
    createdAt: now,
    createdBy: author,
    updatedAt: now,
    updatedBy: author
  }

  /**
   * @satisfies {FormDefinition}
   */
  const formDefinition = {
    name: 'Test form',
    pages: [],
    conditions: [],
    sections: [],
    lists: []
  }

  test('GET - should check correct email details are rendered in the view', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(formDefinition)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/edit/contact/email',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $address = container.getByRole('textbox', {
      name: 'Email address',
      description:
        'Enter a dedicated support team email address. Do not enter a named individual. For example, ‘support@defra.gov.uk’'
    })

    expect($address).toHaveValue(emailAddress)

    const $responseTime = container.getByRole('textbox', {
      name: 'Response time',
      description:
        'Enter how long it takes to receive a response, for example, ‘We aim to respond within 2 working days’'
    })

    expect($responseTime).toHaveValue(responseTimeText)
  })

  test('POST - should redirect to overview page after updating email details', async () => {
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
      url: '/library/my-form-slug/edit/contact/email',
      auth,
      payload: {
        address: emailAddress,
        responseTime: responseTimeText
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/my-form-slug')
  })

  test('POST - should redirect to overview page after removing email details', async () => {
    const testMetadata = {
      ...formMetadata,
      contact: {
        ...formMetadata.contact,
        phone: '123'
      }
    }
    jest
      .mocked(forms.get)
      .mockResolvedValueOnce(testMetadata)
      .mockResolvedValueOnce(testMetadata)

    jest.mocked(forms.updateMetadata).mockResolvedValueOnce({
      id: formMetadata.id,
      slug: 'my-form-slug',
      status: 'updated'
    })

    const options = {
      method: 'post',
      url: '/library/my-form-slug/edit/contact/email',
      auth,
      payload: {
        address: emailAddress,
        responseTime: responseTimeText,
        _delete: true
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/my-form-slug')
  })

  test('Allow delete', () => {
    // Allow users to delete the email contact if:
    // - the form is not live OR
    // - the form is live but there's at least 1 other contact

    const phone = '123'
    const online = {
      url: 'https://www.gov.uk/guidance/contact-defra',
      text: 'Online contact form'
    }

    expect(allowDelete(formMetadata)).toBe(true)

    expect(
      allowDelete({
        ...formMetadata,
        contact: {
          ...formMetadata.contact,
          phone
        }
      })
    ).toBe(true)

    expect(
      allowDelete({
        ...formMetadata,
        contact: {
          ...formMetadata.contact,
          online
        }
      })
    ).toBe(true)

    const live = {
      createdAt: now,
      createdBy: author,
      updatedAt: now,
      updatedBy: author
    }

    expect(
      allowDelete({
        ...formMetadata,
        live
      })
    ).toBe(false)

    expect(
      allowDelete({
        ...formMetadata,
        live
      })
    ).toBe(false)

    expect(
      allowDelete({
        ...formMetadata,
        live,
        contact: {
          ...formMetadata.contact,
          phone
        }
      })
    ).toBe(true)

    expect(
      allowDelete({
        ...formMetadata,
        live,
        contact: {
          ...formMetadata.contact,
          online
        }
      })
    ).toBe(true)
  })
})

/**
 * @import { FormDefinition, FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
