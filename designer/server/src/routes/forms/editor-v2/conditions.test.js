import { ComponentType, ControllerType, Engine } from '@defra/forms-model'

import {
  buildDefinition,
  testFormDefinitionWithSinglePage,
  testFormDefinitionWithSummaryOnly
} from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import * as editor from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/editor.js')

describe('Editor v2 conditions routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  const testForm = buildDefinition({
    ...testFormDefinitionWithSummaryOnly,
    engine: Engine.V2
  })

  test('GET - should check correct data is rendered in the view with no conditions', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(testForm)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/conditions',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })
    const $cardHeadings = container.getAllByText('All conditions')
    const $noConditionsFallbackText = container.getAllByText(
      'No conditions available to use. Create a new condition.'
    )

    expect($mainHeading).toHaveTextContent('Manage conditions')
    expect($cardHeadings[0]).toHaveTextContent('All conditions')
    expect($cardHeadings).toHaveLength(1)
    expect($noConditionsFallbackText[0]).toHaveTextContent(
      'No conditions available to use. Create a new condition.'
    )
    expect($noConditionsFallbackText).toHaveLength(1)
  })

  test('GET - should check correct formData is rendered in the view with multiple pages', async () => {
    const formDefinitionMultiplePages = buildDefinition({
      ...testFormDefinitionWithSinglePage,
      pages: [
        {
          id: 'p1',
          path: '/page-one',
          title: 'Page one',
          section: 'section',
          components: [
            {
              id: 'c1',
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
          id: 'p1',
          path: '/page-two',
          title: 'Page two',
          section: 'section',
          components: [
            {
              id: 'c1',
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
          id: 'c2',
          title: 'Summary',
          path: '/summary',
          controller: ControllerType.Summary
        }
      ],
      engine: Engine.V2
    })

    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(formDefinitionMultiplePages)
    const migrateToV2 = jest.mocked(editor.migrateDefinitionToV2)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/pages',
      auth
    }

    const { container } = await renderResponse(server, options)

    expect(migrateToV2).not.toHaveBeenCalled()

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
 * @import { Server } from '@hapi/hapi'
 */
