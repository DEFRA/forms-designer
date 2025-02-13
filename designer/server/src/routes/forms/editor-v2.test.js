import { ComponentType, ControllerType } from '@defra/forms-model'

import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')

describe('Forms library v2 routes', () => {
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
    createdAt: now,
    createdBy: author,
    updatedAt: now,
    updatedBy: author,
    draft: {
      createdAt: now,
      createdBy: author,
      updatedAt: now,
      updatedBy: author
    }
  }

  /**
   * @satisfies {FormDefinition}
   */
  const formDefinition = {
    name: 'Test form',
    pages: [
      {
        path: '/page-one',
        title: 'Page one',
        section: 'section',
        components: [
          {
            type: ComponentType.TextField,
            name: 'textField',
            title: 'This is your first field',
            hint: 'Help text',
            options: {},
            schema: {}
          }
        ],
        next: [{ path: '/summary' }]
      },
      {
        title: 'Summary',
        path: '/summary',
        controller: ControllerType.Summary
      }
    ],
    conditions: [],
    sections: [],
    lists: []
  }

  /**
   * @satisfies {FormDefinition}
   */
  const formDefinitionWithSummaryOnly = {
    name: 'Test form',
    pages: [
      {
        title: 'Summary',
        path: '/summary',
        controller: ControllerType.Summary
      }
    ],
    conditions: [],
    sections: [],
    lists: []
  }

  test('GET - should check correct formData is rendered in the view with summary page only', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(formDefinitionWithSummaryOnly)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })

    const $pageTitles = container.getAllByRole('heading', { level: 2 })

    const $actions = container.getAllByRole('button')

    expect($mainHeading).toHaveTextContent('Add and edit pages')
    expect($pageTitles[0]).toHaveTextContent('End pages')
    expect($pageTitles[1]).toHaveTextContent('Check your answers')
    expect($actions).toHaveLength(3)
    expect($actions[2]).toHaveTextContent('Add new page')
  })

  test('GET - should check correct formData is rendered in the view with multiple pages', async () => {
    const formDefinitionMultiplePages = { ...formDefinition }
    formDefinitionMultiplePages.pages = [
      {
        path: '/page-one',
        title: 'Page one',
        section: 'section',
        components: [
          {
            type: ComponentType.TextField,
            name: 'textField',
            title: 'This is your first field',
            hint: 'Help text',
            options: {},
            schema: {}
          }
        ],
        next: [{ path: '/page-two' }]
      },
      {
        path: '/page-two',
        title: 'Page two',
        section: 'section',
        components: [
          {
            type: ComponentType.TextField,
            name: 'textField',
            title: 'This is your second field',
            hint: 'Help text',
            options: {},
            schema: {}
          }
        ],
        next: [{ path: '/summary' }]
      },
      {
        title: 'Summary',
        path: '/summary',
        controller: ControllerType.Summary
      }
    ]

    jest.mocked(forms.get).mockResolvedValueOnce(formMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(formDefinitionMultiplePages)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })

    const $pageTitles = container.getAllByRole('heading', { level: 2 })

    const $actions = container.getAllByRole('button')

    expect($mainHeading).toHaveTextContent('Add and edit pages')
    expect($pageTitles[0]).toHaveTextContent('Page 1: Page one')
    expect($pageTitles[1]).toHaveTextContent('Page 2: Page two')
    expect($pageTitles[2]).toHaveTextContent('End pages')
    expect($pageTitles[3]).toHaveTextContent('Check your answers')
    expect($actions).toHaveLength(4)
    expect($actions[2]).toHaveTextContent('Add new page')
    expect($actions[3]).toHaveTextContent('Re-order pages')
  })
})

/**
 * @import { FormDefinition, FormMetadata, FormMetadataAuthor } from '@defra/forms-model'
 * @import { Server } from '@hapi/hapi'
 */
