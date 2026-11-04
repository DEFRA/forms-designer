import { testFormDefinitionWithSummaryOnly } from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import config from '~/src/config.js'
import { createServer } from '~/src/createServer.js'
import * as forms from '~/src/lib/forms.js'
import { auth } from '~/test/fixtures/auth.js'
import { renderResponse } from '~/test/helpers/component-helpers.js'

jest.mock('~/src/lib/forms.js')

describe('Editor v2 advanced settings routes', () => {
  /** @type {Server} */
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  describe('GET /library/{slug}/editor-v2/advanced-settings', () => {
    test('should render the advanced settings page', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithSummaryOnly)

      const options = {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/advanced-settings',
        auth
      }

      const { container, document } = await renderResponse(server, options)

      const $mainHeading = container.getByRole('heading', { level: 1 })
      const $backLink = container.getByRole('link', { name: 'Back to pages' })

      expect($mainHeading).toHaveTextContent('Advanced settings')
      expect($backLink).toHaveAttribute(
        'href',
        '/library/my-form-slug/editor-v2/pages'
      )
      expect(
        document.querySelector('.govuk-notification-banner')
      ).not.toBeInTheDocument()
    })

    test('should show the email actions row linking to the email actions page', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithSummaryOnly)

      const { container, document } = await renderResponse(server, {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/advanced-settings',
        auth
      })

      expect(document.body).toHaveTextContent('Email actions')
      expect(document.body).toHaveTextContent(
        'Configure email recipients of this submitted form'
      )
      expect(
        container.getByRole('link', { name: /Change.*email actions/ })
      ).toHaveAttribute('href', '/library/my-form-slug/editor-v2/email-actions')
    })

    test('should show the reuse previous answers row linking to the reuse previous answers page', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest
        .mocked(forms.getDraftFormDefinition)
        .mockResolvedValueOnce(testFormDefinitionWithSummaryOnly)

      const { container, document } = await renderResponse(server, {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/advanced-settings',
        auth
      })

      expect(document.body).toHaveTextContent('Reuse previous answers')
      expect(document.body).toHaveTextContent(
        'Start each new form with blank answers'
      )
      expect(
        container.getByRole('link', { name: /Change.*reuse previous answers/ })
      ).toHaveAttribute(
        'href',
        '/library/my-form-slug/editor-v2/reuse-previous-answers'
      )
    })

    test('should describe reuse previous answers as enabled when allowCopy is on', async () => {
      jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
      jest.mocked(forms.getDraftFormDefinition).mockResolvedValueOnce({
        ...testFormDefinitionWithSummaryOnly,
        metadata: { options: { allowCopy: true } }
      })

      const { document } = await renderResponse(server, {
        method: 'get',
        url: '/library/my-form-slug/editor-v2/advanced-settings',
        auth
      })

      expect(document.body).toHaveTextContent(
        'Reuse answers from a previous submission'
      )
      expect(document.body).not.toHaveTextContent(
        'Start each new form with blank answers'
      )
    })

    describe('when the copy answers feature flag is off', () => {
      beforeEach(() => {
        config.featureFlagAllowCopyAnswers = false
      })

      afterEach(() => {
        config.featureFlagAllowCopyAnswers = true
      })

      test('should hide the reuse previous answers row', async () => {
        jest.mocked(forms.get).mockResolvedValueOnce(testFormMetadata)
        jest
          .mocked(forms.getDraftFormDefinition)
          .mockResolvedValueOnce(testFormDefinitionWithSummaryOnly)

        const { container, document } = await renderResponse(server, {
          method: 'get',
          url: '/library/my-form-slug/editor-v2/advanced-settings',
          auth
        })

        expect(document.body).not.toHaveTextContent('Reuse previous answers')
        expect(
          container.getByRole('link', { name: /Change.*email actions/ })
        ).toBeInTheDocument()
      })
    })
  })
})

/**
 * @import { Server } from '@hapi/hapi'
 */
