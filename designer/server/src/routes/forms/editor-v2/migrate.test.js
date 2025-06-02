import { StatusCodes } from 'http-status-codes'

import { testFormDefinitionWithSinglePage } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import { migrateDefinitionToV2 } from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')
jest.mock('~/src/lib/editor.js')

describe('Editor v2 migrate routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET - should render correct content in the confirmation view', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithSinglePage)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/migrate',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $mainHeading = container.getByRole('heading', { level: 1 })

    const $subHeadings = container.getAllByRole('heading', { level: 2 })

    const $buttons = container.getAllByRole('button')

    expect($mainHeading).toHaveTextContent('Test form')
    expect($subHeadings[0]).toHaveTextContent(
      'Are you sure you want to switch to the new editor?'
    )
    container.getByText(
      "You won't be able to use the old editor for this form after switching."
    )
    expect($buttons[2]).toHaveAccessibleName('Switch to new editor')
    expect($buttons[3]).toHaveAccessibleName('Cancel')
    expect($buttons[3]).toHaveAttribute('href', '/library/my-form-slug')
  })

  test('POST - should migrate form and redirect to pages list', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/migrate',
      auth
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(migrateDefinitionToV2).toHaveBeenCalledWith(
      testFormMetadata.id,
      expect.anything()
    )
    expect(headers.location).toBe('/library/my-form-slug/editor-v2/pages')
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
