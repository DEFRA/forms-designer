import { StatusCodes } from 'http-status-codes'

import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { auth, authFormCreator } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')

describe('Forms library routes', () => {
  /** @type {Server} */
  let server

  const changeFormNameDeniedHeading = 'You cannot change the form name'
  const titleEditUrl = '/library/my-form-slug/edit/title'
  const titleFieldLabel = 'Enter a name for your form'
  const liveTitleFieldLabel = 'Change the name of the live form'

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

  test('GET - should check correct formData is rendered in the view', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(formDefinition)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/edit/team',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $teamName = container.getByRole('textbox', {
      name: 'Name of team',
      description:
        'Enter the name of the policy team or business area responsible for this form'
    })

    const $teamEmail = container.getByRole('textbox', {
      name: 'Shared team email address',
      description:
        'Used to contact the form subject matter expert (SME) or key stakeholder. Must be a UK email address, like name@example.gov.uk'
    })

    expect($teamName).toHaveValue('Defra Forms')
    expect($teamEmail).toHaveValue('defraforms@defra.gov.uk')
  })

  test('POST - should redirect to overview page after updating team details', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(formDefinition)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/edit/team',
      auth,
      payload: { teamName: 'new team', teamEmail: 'new.email@gov.uk' }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/my-form-slug')
  })

  test('GET - should check correct title is rendered in the view', async () => {
    jest
      .mocked(forms.get)
      .mockResolvedValueOnce(formMetadata)
      .mockResolvedValueOnce(formMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(formDefinition)

    const options = {
      method: 'get',
      url: titleEditUrl,
      auth
    }

    const { container } = await renderResponse(server, options)

    const $title = container.getByRole('textbox', {
      name: titleFieldLabel
    })

    expect($title).toHaveValue('Test form')
  })

  test('POST - should redirect to overview page after updating title', async () => {
    jest
      .mocked(forms.get)
      .mockResolvedValueOnce(formMetadata)
      .mockResolvedValueOnce(formMetadata)
    jest.mocked(forms.updateMetadata).mockResolvedValueOnce({
      id: formMetadata.id,
      slug: 'new-title',
      status: 'updated'
    })

    const options = {
      method: 'post',
      url: titleEditUrl,
      auth,
      payload: { title: 'new title' }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/new-title')
  })

  test('GET - should render the shared title edit page with the live hint when form is live', async () => {
    const liveFormMetadata = {
      ...formMetadata,
      live: {
        createdAt: now,
        createdBy: author,
        updatedAt: now,
        updatedBy: author
      }
    }

    jest
      .mocked(forms.get)
      .mockResolvedValueOnce(liveFormMetadata)
      .mockResolvedValueOnce(liveFormMetadata)

    const options = {
      method: 'get',
      url: titleEditUrl,
      auth
    }

    const { container } = await renderResponse(server, options)

    const $title = container.getByRole('textbox', {
      name: liveTitleFieldLabel,
      description: 'Changing the name of live form will not change its url'
    })

    expect($title).toHaveValue('Test form')
    expect(
      container.getByRole('heading', {
        name: liveTitleFieldLabel
      })
    ).toBeInTheDocument()
  })

  test('GET - should show error page for live title edit when user lacks form-publish scope', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce({
      ...formMetadata,
      live: {
        createdAt: now,
        createdBy: author,
        updatedAt: now,
        updatedBy: author
      }
    })

    const options = {
      method: 'get',
      url: titleEditUrl,
      auth: authFormCreator
    }

    const { container } = await renderResponse(server, options)

    expect(
      container.getByRole('heading', {
        level: 1,
        name: changeFormNameDeniedHeading
      })
    ).toBeInTheDocument()
    expect(
      container.getByText(
        'Contact the Defra Forms team to change the name of a live form.'
      )
    ).toBeInTheDocument()
  })

  test('POST - should show error page for live title edit when user lacks form-publish scope', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce({
      ...formMetadata,
      live: {
        createdAt: now,
        createdBy: author,
        updatedAt: now,
        updatedBy: author
      }
    })

    const options = {
      method: 'post',
      url: titleEditUrl,
      auth: authFormCreator,
      payload: { title: 'new live title' }
    }

    const { container } = await renderResponse(server, options)

    expect(
      container.getByRole('heading', {
        level: 1,
        name: changeFormNameDeniedHeading
      })
    ).toBeInTheDocument()
    expect(
      container.getByText(
        'Contact the Defra Forms team to change the name of a live form.'
      )
    ).toBeInTheDocument()
  })
})

/**
 * @import { FormDefinition, FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
