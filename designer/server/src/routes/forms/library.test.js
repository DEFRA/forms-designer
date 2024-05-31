import { beforeAll, describe, expect, jest, test } from '@jest/globals'

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

  test('Forms library list page', async () => {
    const title = 'My form slug'

    // Mock the api call to forms-manager
    jest.mocked(forms.list).mockResolvedValueOnce([
      {
        id: '661e4ca5039739ef2902b214',
        title,
        slug: 'my-form-slug',
        organisation: 'Defra',
        teamName: 'Forms',
        teamEmail: 'defraforms@defra.gov.uk',
        draft: {
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    ])

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
    const id = '661e4ca5039739ef2902b214'
    const slug = 'my-form-slug'

    // Mock the api call to forms-manager
    jest.mocked(forms.get).mockResolvedValueOnce({
      id,
      slug,
      title: 'My form slug',
      organisation: 'Defra',
      teamName: 'Forms',
      teamEmail: 'defraforms@defra.gov.uk',
      draft: {
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor',
      auth
    }

    const { document } = await renderResponse(server, options)

    const $editor = document.querySelector('.app-editor')
    expect($editor).toHaveAttribute('data-id', id)
    expect($editor).toHaveAttribute('data-slug', slug)
    expect($editor).toHaveAttribute('data-preview-url', config.previewUrl)
  })

  test('Form overview has draft buttons in side bar', async () => {
    const id = '661e4ca5039739ef2902b214'
    const slug = 'my-form-slug'

    // Mock the api call to forms-manager
    jest.mocked(forms.get).mockResolvedValueOnce({
      id,
      slug,
      title: 'My form slug',
      organisation: 'Defra',
      teamName: 'Forms',
      teamEmail: 'defraforms@defra.gov.uk',
      live: {
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
    const id = '661e4ca5039739ef2902b214'
    const slug = 'my-form-slug'

    // Mock the api call to forms-manager
    jest.mocked(forms.get).mockResolvedValueOnce({
      id,
      slug,
      title: 'My form slug',
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
    })

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
