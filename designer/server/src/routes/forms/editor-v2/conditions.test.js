import { Engine } from '@defra/forms-model'

import {
  buildDefinition,
  testFormDefinitionWithMultipleV2Conditions,
  testFormDefinitionWithSummaryOnly
} from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
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

  test('GET - should check correct data is rendered in the view with multiple V2 conditions', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithMultipleV2Conditions)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/conditions',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })
    const $cardHeadings = container.getAllByText('All conditions')

    expect($mainHeading).toHaveTextContent('Manage conditions')
    expect($cardHeadings[0]).toHaveTextContent('All conditions')

    const $rows = container.getAllByRole('row')
    expect($rows).toHaveLength(4)
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
