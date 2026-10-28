import { StatusCodes } from 'http-status-codes'

import { testFormDefinitionWithSummaryOnly } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import { setFormOption } from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/forms.js')

describe('Editor v2 reuse previous answers routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  describe('GET /library/{slug}/editor-v2/reuse-previous-answers', () => {
    test('should render the reuse previous answers page', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithSummaryOnly)

      const { container, document } = await renderResponse(server, {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/reuse-previous-answers',
        auth
      })

      const $mainHeading = container.getByRole('heading', { level: 1 })
      const $backLink = container.getByRole('link', {
        name: 'Back to advanced settings'
      })
      const $radios = container.getAllByRole('radio')
      const $button = container.getByRole('button', {
        name: 'Save and continue'
      })

      expect($mainHeading).toHaveTextContent(
        'Can people reuse answers from a previous submission?'
      )
      expect($mainHeading).toHaveTextContent('Test form')
      expect($backLink).toHaveAttribute(
        'href',
        '/library/my-form-slug/editor-v2/advanced-settings'
      )
      expect($radios).toHaveLength(2)
      expect($radios[0]).toHaveAccessibleName('Yes')
      expect($radios[0]).not.toBeChecked()
      expect($radios[1]).toHaveAccessibleName('No')
      expect($radios[1]).toBeChecked()
      expect($button).toBeInTheDocument()
      expect(document.body).toHaveTextContent(
        'Use when people often submit this form more than once with similar answers.'
      )
      expect(document.body).toHaveTextContent(
        'If people can reuse answers from a previous submission, the confirmation email and reference number will be switched on automatically.'
      )
      expect(document.body).toHaveTextContent('What your choice means')
      expect(document.body).toHaveTextContent(
        'After submitting, they can start again with answers from their last submission already filled in. They can change anything before sending the new form.'
      )
      expect(document.body).toHaveTextContent(
        'Each time they use the form, they enter all answers from scratch.'
      )
    })
  })

  describe('POST /library/{slug}/editor-v2/reuse-previous-answers', () => {
    test.each(['true', 'false'])(
      'should save allowCopy and redirect to advanced settings when %s is selected',
      async (reusePreviousAnswers) => {
        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)

        const {
          response: { headers, statusCode }
        } = await renderResponse(server, {
          method: 'post',
          url: '/library/my-form-slug/editor-v2/reuse-previous-answers',
          auth,
          payload: { reusePreviousAnswers }
        })

        expect(statusCode).toBe(StatusCodes.SEE_OTHER)
        expect(headers.location).toBe(
          '/library/my-form-slug/editor-v2/advanced-settings'
        )
        expect(setFormOption).toHaveBeenCalledWith(
          testFormMetadata.id,
          expect.anything(),
          'allowCopy',
          reusePreviousAnswers
        )
      }
    )

    test('should redirect back to the page with errors when nothing is selected', async () => {
      const {
        response: { headers, statusCode }
      } = await renderResponse(server, {
        method: 'post',
        url: '/library/my-form-slug/editor-v2/reuse-previous-answers',
        auth,
        payload: {}
      })

      expect(statusCode).toBe(StatusCodes.SEE_OTHER)
      expect(headers.location).toBe(
        '/library/my-form-slug/editor-v2/reuse-previous-answers'
      )
      expect(setFormOption).not.toHaveBeenCalled()
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
