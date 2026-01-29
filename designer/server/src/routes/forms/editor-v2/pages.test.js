import {
  ComponentType,
  ControllerType,
  Engine,
  SchemaVersion
} from '@defra/forms-model'
import { StatusCodes } from 'http-status-codes'

import {
  buildDefinition,
  testFormDefinitionWithMultipleV2Conditions,
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
    schema: SchemaVersion.V2,
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
    expect($pageTitles[0]).toHaveTextContent('')
    expect($pageTitles[1]).toHaveTextContent('End pages')

    expect($actions).toHaveLength(6)
    expect($actions[2]).toHaveTextContent('Add new page')
    expect($actions[3]).toHaveTextContent('Manage conditions')
    expect($actions[4]).toHaveTextContent('Upload a form')
    expect($actions[5]).toHaveTextContent('Download this form')
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
          id: 'p2',
          path: '/page-two',
          title: 'Page two',
          section: 'section',
          components: [
            {
              id: 'c2',
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
          id: 'p3',
          title: 'Summary',
          path: '/summary',
          controller: ControllerType.Summary
        }
      ],
      engine: Engine.V2,
      schema: SchemaVersion.V2
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
    const $cardTitles = container.getAllByRole('heading', { level: 3 })
    const $actions = container.getAllByRole('button')

    expect($mainHeading).toHaveTextContent('Add and edit pages')

    expect($pageTitles[0]).toHaveTextContent('2 pages')
    expect($pageTitles[1]).toHaveTextContent('End pages')
    expect($cardTitles[0]).toHaveTextContent('Page 1: Page one')
    expect($cardTitles[1]).toHaveTextContent('Page 2: Page two')

    expect($actions).toHaveLength(7)
    expect($actions[2]).toHaveTextContent('Add new page')
    expect($actions[3]).toHaveTextContent('Re-order pages')
    expect($actions[4]).toHaveTextContent('Manage conditions')
    expect($actions[5]).toHaveTextContent('Upload a form')
    expect($actions[6]).toHaveTextContent('Download this form')
  })

  test('GET - should redirect to migration to v2 if draft definition schema is v1', async () => {
    const v1Definition = buildDefinition({
      ...testFormDefinitionWithSinglePage,
      engine: Engine.V2,
      schema: SchemaVersion.V1
    })
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(v1Definition)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/pages',
      auth
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/my-form-slug/editor-v2/migrate')
  })

  test('GET - should filter pages based on selected conditions', async () => {
    const definition = buildDefinition({
      ...testFormDefinitionWithMultipleV2Conditions,
      engine: Engine.V2,
      schema: SchemaVersion.V2
    })
    definition.pages[2].condition = '4a82930a-b8f5-498c-adae-6158bb2aeeb5'

    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce(definition)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/pages?filter=4a82930a-b8f5-498c-adae-6158bb2aeeb5',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })
    const $pageTitles = container.getAllByRole('heading', { level: 2 })
    const $cardTitles = container.getAllByRole('heading', { level: 3 })

    expect($mainHeading).toHaveTextContent('Add and edit pages')

    expect($pageTitles[0]).toHaveTextContent('Filter pages by condition')
    expect($pageTitles[1]).toHaveTextContent('1 page')
    expect($pageTitles[2]).toHaveTextContent('End pages')
    expect($cardTitles[0]).toHaveTextContent('Applied filters:')
    expect($cardTitles[1]).toHaveTextContent('Conditions not applied to pages')
    expect($cardTitles[2]).toHaveTextContent('Fave animal')
    expect($cardTitles[3]).toHaveTextContent('Check your answers')
  })

  test('POST - should create filter based on selected conditions', async () => {
    const payload = {
      conditionsFilter: ['cond1', 'cond2']
    }
    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/pages',
      auth,
      payload
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/pages?filter=cond1,cond2'
    )
  })

  test('POST - should create empty filter', async () => {
    const payload = {
      conditionsFilter: undefined
    }
    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/pages',
      auth,
      payload
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe('/library/my-form-slug/editor-v2/pages')
  })

  test('POST - should create single entry filter', async () => {
    const payload = {
      conditionsFilter: 'singleCondition'
    }
    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/pages',
      auth,
      payload
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/pages?filter=singleCondition'
    )
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
