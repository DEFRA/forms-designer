import config from '~/src/config.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')

describe('Forms library routes', () => {
  /** @type {import('@hapi/hapi').Server} */
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

  test('Forms library list page', async () => {
    const { title } = formMetadata

    jest.mocked(forms.list).mockResolvedValueOnce([formMetadata])

    const options = {
      method: 'GET',
      url: '/library',
      auth
    }

    const { document } = await renderResponse(server, options)

    const $heading = document.querySelector('h1')
    expect($heading).toHaveClass('govuk-heading-xl')
    expect($heading).toHaveTextContent('Forms library')

    const $table = document.querySelector('table')
    expect($table).toContainHTML(`<td class="govuk-table__cell">${title}</td>`)
  })

  test('Form editor page', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(formDefinition)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor',
      auth
    }

    const { document } = await renderResponse(server, options)

    const $editor = document.querySelector('.app-form-editor')
    const $metadata = document.querySelector('.app-form-metadata')
    const $definition = document.querySelector('.app-form-definition')

    expect($editor).toHaveAttribute('data-preview-url', config.previewUrl)

    expect(
      $metadata?.textContent && JSON.parse($metadata.textContent)
    ).toMatchObject({
      ...formMetadata,

      draft: {
        ...formMetadata.draft,

        // Dates in JSON are stringified
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    })

    expect(
      $definition?.textContent && JSON.parse($definition.textContent)
    ).toMatchObject(formDefinition)
  })

  test('Form overview has draft buttons in side bar', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce({
      ...formMetadata,

      // Switch draft with live for test
      live: formMetadata.draft,
      draft: undefined
    })

    const options = {
      method: 'get',
      url: '/library/my-form-slug',
      auth
    }

    const { document } = await renderResponse(server, options)

    const $card = document.querySelector('.app-form-card')
    const $buttons = $card?.querySelectorAll('.govuk-button')

    expect($buttons).toHaveLength(1)
    expect($buttons?.[0]).toHaveTextContent('Create draft to edit')
  })

  test('Form overview has live buttons in side bar', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)

    const options = {
      method: 'get',
      url: '/library/my-form-slug',
      auth
    }

    const { document } = await renderResponse(server, options)

    const $card = document.querySelector('.app-form-card')
    const $buttons = $card?.querySelectorAll('.govuk-button')

    expect($buttons).toHaveLength(2)
    expect($buttons?.[0]).toHaveTextContent('Edit draft')
    expect($buttons?.[1]).toHaveTextContent('Make draft live')
  })
})

/**
 * @typedef {import('@defra/forms-model').FormDefinition} FormDefinition
 * @typedef {import('@defra/forms-model').FormMetadata} FormMetadata
 * @typedef {import('@defra/forms-model').FormMetadataAuthor} FormMetadataAuthor
 */
