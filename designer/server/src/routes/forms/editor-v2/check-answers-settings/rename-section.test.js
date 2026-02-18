import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { testFormDefinitionWithSections } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import { renameSectionTitle } from '~/src/lib/editor.js'
import { addErrorsToSession } from '~/src/lib/error-helper.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/error-helper.js')
jest.mock('~/src/lib/forms.js')

describe('Editor v2 rename section routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET - should render single textbox in view', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithSections)

    const options = {
      method: 'get',
      url: '/library/my-form-slug/editor-v2/page/p1/rename-section/section2Id',
      auth
    }

    const { container } = await renderResponse(server, options)

    const $backLink = container.getByRole('link', { name: 'Back to sections' })
    expect($backLink).toBeInTheDocument()
    const $fieldLabel = container.getByText('Enter a new name for your section')
    expect($fieldLabel).toBeInTheDocument()
    const $textfield = container.getByRole('textbox', {
      name: 'Enter a new name for your section'
    })
    expect(/** @type {HTMLInputElement} */ ($textfield).value).toBe(
      'Section two'
    )

    const $actions = container.getAllByRole('button')
    expect($actions).toHaveLength(3)
    expect($actions[2]).toHaveTextContent('Save changes')
  })

  test('POST - should error if empty field', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/rename-section/section2Id',
      auth,
      payload: { sectionTitle: '' }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/rename-section/section2Id'
    )
    expect(addErrorsToSession).toHaveBeenCalledWith(
      expect.anything(),
      'renameSectionValidationFailure',
      new Joi.ValidationError('Enter a section title', [], undefined)
    )
  })

  test('POST - should save and redirect to same page if valid payload', async () => {
    jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
    jest
      .mocked(forms.getDraftFormDefinition)
      .mockResolvedValueOnce(testFormDefinitionWithSections)

    const options = {
      method: 'post',
      url: '/library/my-form-slug/editor-v2/page/p1/rename-section/section2Id',
      auth,
      payload: {
        sectionTitle: 'My new section title'
      }
    }

    const {
      response: { headers, statusCode }
    } = await renderResponse(server, options)

    expect(statusCode).toBe(StatusCodes.SEE_OTHER)
    expect(headers.location).toBe(
      '/library/my-form-slug/editor-v2/page/p1/check-answers-settings/sections'
    )
    expect(renameSectionTitle).toHaveBeenCalledWith(
      testFormMetadata.id,
      expect.anything(),
      'section2Id',
      'My new section title'
    )
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
