import { StatusCodes } from 'http-status-codes'

import { testFormDefinitionWithSummaryOnly } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { createServer } from '~/src/createServer.js'
import { setFormOption } from '~/src/lib/editor.js'
import * as forms from '~/src/lib/forms.js'
import {
  REUSE_PREVIOUS_ANSWERS_DISABLED,
  REUSE_PREVIOUS_ANSWERS_ENABLED
} from '~/src/routes/forms/editor-v2/reuse-previous-answers.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/editor.js')
jest.mock('~/src/lib/forms.js')

/**
 * The session cookie set by the response, so a follow-up request picks up the
 * same session and with it anything flashed to the banner
 * @param {ServerInjectResponse} response
 */
function getCookie(response) {
  const cookies = /** @type {string[]} */ (response.headers['set-cookie'] ?? [])

  return cookies.map((cookie) => cookie.split(';')[0]).join('; ')
}

/**
 * @param {boolean} [allowCopy] - leave out for a form that has never set it
 */
function definitionWithAllowCopy(allowCopy) {
  return allowCopy === undefined
    ? testFormDefinitionWithSummaryOnly
    : {
        ...testFormDefinitionWithSummaryOnly,
        metadata: { options: { allowCopy } }
      }
}

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
    test.each([
      {
        saved: undefined,
        reusePreviousAnswers: 'true',
        message: REUSE_PREVIOUS_ANSWERS_ENABLED
      },
      {
        saved: false,
        reusePreviousAnswers: 'true',
        message: REUSE_PREVIOUS_ANSWERS_ENABLED
      },
      {
        saved: true,
        reusePreviousAnswers: 'false',
        message: REUSE_PREVIOUS_ANSWERS_DISABLED
      }
    ])(
      'should save allowCopy $reusePreviousAnswers when the saved value is $saved and show "$message" on advanced settings',
      async ({ saved, reusePreviousAnswers, message }) => {
        jest
          .mocked(forms.get)
          .mockResolvedValueOnce(testFormMetadata)
          .mockResolvedValueOnce(testFormMetadata)
        jest
          .mocked(forms.getDraftFormDefinition)
          .mockResolvedValueOnce(definitionWithAllowCopy(saved))
          .mockResolvedValueOnce(
            definitionWithAllowCopy(reusePreviousAnswers === 'true')
          )

        const response = await server.inject({
          method: 'post',
          url: '/library/my-form-slug/editor-v2/reuse-previous-answers',
          auth,
          payload: { reusePreviousAnswers }
        })

        expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
        expect(response.headers.location).toBe(
          '/library/my-form-slug/editor-v2/advanced-settings'
        )
        expect(setFormOption).toHaveBeenCalledWith(
          testFormMetadata.id,
          expect.anything(),
          'allowCopy',
          reusePreviousAnswers
        )

        const { document } = await renderResponse(server, {
          method: 'get',
          url: /** @type {string} */ (response.headers.location),
          auth,
          headers: { cookie: getCookie(response) }
        })

        const $banner = document.querySelector('.govuk-notification-banner')

        expect($banner).toHaveClass('govuk-notification-banner--success')
        expect(
          $banner?.querySelector('.govuk-notification-banner__title')
        ).toHaveTextContent('Success')
        expect(
          $banner?.querySelector('.govuk-notification-banner__heading')
        ).toHaveTextContent(message)
      }
    )

    test.each([
      { saved: undefined, reusePreviousAnswers: 'false' },
      { saved: false, reusePreviousAnswers: 'false' },
      { saved: true, reusePreviousAnswers: 'true' }
    ])(
      'should not save or show a banner when $reusePreviousAnswers matches the saved value $saved',
      async ({ saved, reusePreviousAnswers }) => {
        jest
          .mocked(forms.get)
          .mockResolvedValueOnce(testFormMetadata)
          .mockResolvedValueOnce(testFormMetadata)
        jest
          .mocked(forms.getDraftFormDefinition)
          .mockResolvedValueOnce(definitionWithAllowCopy(saved))
          .mockResolvedValueOnce(definitionWithAllowCopy(saved))

        const response = await server.inject({
          method: 'post',
          url: '/library/my-form-slug/editor-v2/reuse-previous-answers',
          auth,
          payload: { reusePreviousAnswers }
        })

        expect(response.statusCode).toBe(StatusCodes.SEE_OTHER)
        expect(response.headers.location).toBe(
          '/library/my-form-slug/editor-v2/advanced-settings'
        )
        expect(setFormOption).not.toHaveBeenCalled()

        const { document } = await renderResponse(server, {
          method: 'get',
          url: /** @type {string} */ (response.headers.location),
          auth,
          headers: { cookie: getCookie(response) }
        })

        expect(
          document.querySelector('.govuk-notification-banner')
        ).not.toBeInTheDocument()
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
 * @import { Server, ServerInjectResponse } from '@hapi/hapi'
 */
