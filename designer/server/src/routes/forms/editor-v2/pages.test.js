import { ComponentType, ControllerType, Engine } from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

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

describe('Editor v2 pages routes', () => {
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

  test('GET - should check correct formData is rendered in the view with summary page only', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(testForm)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/pages',
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

  test('GET - should migrate to v2 if draft definition is v1', async () => {
    const formId = '661e4ca5039739ef2902b214'
    const v1Definition = buildDefinition({
      ...testFormDefinitionWithSinglePage,
      engine: Engine.V1
    })
    const v2Definition = buildDefinition({
      ...testFormDefinitionWithSinglePage,
      engine: Engine.V2
    })

    const migrateToV2 = jest.mocked(editor.migrateDefinitionToV2)

    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(v1Definition)
    migrateToV2.mockResolvedValueOnce(v2Definition)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/pages',
      auth
    }

    const {
      response: { statusCode }
    } = await renderResponse(server, options)
    expect(statusCode).toBe(StatusCodes.OK)
    expect(migrateToV2).toHaveBeenCalledWith(formId, expect.anything())
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
