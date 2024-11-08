import { within } from '@testing-library/dom'
import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')

describe('Forms notification email', () => {
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
    notificationEmail: 'NotificationEmail@defra.gov.uk',
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

  test('GET - should check correct notification email is rendered in the view', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(formDefinition)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/edit/notification-email',
      auth
    }

    const { document } = await renderResponse(server, options)

    const $privacyNoticeUrl = within(document.body).getByRole('textbox', {
      name: 'What email address should submitted forms be sent to?'
    })

    expect($privacyNoticeUrl).toHaveValue('notificationemail@defra.gov.uk')
  })

  test('POST - should redirect to overview page after updating notification email', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
    jest.mocked(forms.updateMetadata).mockResolvedValueOnce({
      id: formMetadata.id,
      slug: 'my-form-slug',
      status: 'updated'
    })

    const options = {
      method: 'post',
      url: '/library/my-form-slug/edit/notification-email',
      auth,
      payload: { notificationEmail: 'updatedNotificationEmail@defra.gov.uk' }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/my-form-slug')
  })

  test('POST - should store notification email in lowercase', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
    jest.mocked(forms.updateMetadata).mockResolvedValueOnce({
      id: formMetadata.id,
      slug: 'my-form-slug',
      status: 'updated'
    })

    const options = {
      method: 'post',
      url: '/library/my-form-slug/edit/notification-email',
      auth,
      payload: { notificationEmail: 'UPDATEDNotificationEmail@defra.gov.uk' }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/my-form-slug')

    // Verify that the email was converted to lowercase before saving
    expect(forms.updateMetadata).toHaveBeenCalledWith(
      formMetadata.id,
      { notificationEmail: 'updatednotificationemail@defra.gov.uk' },
      expect.any(String)
    )
  })
})

/**
 * @import { FormDefinition, FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
