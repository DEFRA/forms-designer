import {
  buildDefinition,
  buildMarkdownComponent,
  buildQuestionPage,
  buildSummaryPage
} from '@defra/forms-model/stubs'

import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { checkAnswersOverviewViewModel } from '~/src/models/forms/editor-v2/check-answers-overview.js'
import { SUMMARY_CONTROLLER_TEMPLATE } from '~/src/models/forms/editor-v2/preview-helpers.js'
import { PAGE_OVERVIEW_TITLE } from '~/src/models/forms/editor-v2/tab-config.js'

describe('check-answers-overview model', () => {
  const baseMetadata = {
    ...testFormMetadata,
    slug: 'test-form'
  }

  describe('checkAnswersOverviewViewModel', () => {
    it('should build view model with correct page title', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'p1' }),
          buildSummaryPage({ id: 'cya-page', path: '/summary' })
        ],
        sections: []
      })

      const result = checkAnswersOverviewViewModel(
        baseMetadata,
        definition,
        'cya-page'
      )

      expect(result.pageTitle).toBe('Check answers page overview')
      expect(result.cardTitle).toBe(PAGE_OVERVIEW_TITLE)
      expect(result.cardCaption).toBe('Check answers')
    })

    it('should include tabConfig with Page overview as active', () => {
      const definition = buildDefinition({
        pages: [buildSummaryPage({ id: 'cya-page', path: '/summary' })],
        sections: []
      })

      const result = checkAnswersOverviewViewModel(
        baseMetadata,
        definition,
        'cya-page'
      )

      expect(result.tabConfig).toHaveLength(4)
      expect(result.tabConfig[0].isActive).toBe(true)
      expect(result.tabConfig[0].title).toBe(PAGE_OVERVIEW_TITLE)
    })

    it('should detect declaration when CYA page has markdown component', () => {
      const definition = buildDefinition({
        pages: [
          buildSummaryPage({
            id: 'cya-page',
            path: '/summary',
            components: [
              buildMarkdownComponent({ content: 'I agree to the terms' })
            ]
          })
        ],
        sections: []
      })

      const result = checkAnswersOverviewViewModel(
        baseMetadata,
        definition,
        'cya-page'
      )

      expect(result.declaration.hasDeclaration).toBe(true)
      expect(result.declaration.text).toBe('I agree to the terms')
    })

    it('should not detect declaration when CYA page has no markdown', () => {
      const definition = buildDefinition({
        pages: [
          buildSummaryPage({
            id: 'cya-page',
            path: '/summary',
            components: []
          })
        ],
        sections: []
      })

      const result = checkAnswersOverviewViewModel(
        baseMetadata,
        definition,
        'cya-page'
      )

      expect(result.declaration.hasDeclaration).toBe(false)
      expect(result.declaration.text).toBeNull()
    })

    it('should truncate long declaration text', () => {
      const longText = 'A'.repeat(100)
      const definition = buildDefinition({
        pages: [
          buildSummaryPage({
            id: 'cya-page',
            path: '/summary',
            components: [buildMarkdownComponent({ content: longText })]
          })
        ],
        sections: []
      })

      const result = checkAnswersOverviewViewModel(
        baseMetadata,
        definition,
        'cya-page'
      )

      expect(result.declaration.hasDeclaration).toBe(true)
      expect(result.declaration.text).toBe('A'.repeat(50) + '...')
    })

    it('should build sections summary', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'p1', section: 'section-1' }),
          buildQuestionPage({ id: 'p2', section: 'section-2' }),
          buildSummaryPage({ id: 'cya-page', path: '/summary' })
        ],
        sections: [
          { name: 'section-1', title: 'First Section' },
          { name: 'section-2', title: 'Second Section' }
        ]
      })

      const result = checkAnswersOverviewViewModel(
        baseMetadata,
        definition,
        'cya-page'
      )

      expect(result.sections.count).toBe(2)
      expect(result.sections.titles).toEqual([
        'First Section',
        'Second Section'
      ])
    })

    it('should build preview model with sections', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'p1',
            title: 'Page One',
            section: 'section-1'
          }),
          buildSummaryPage({ id: 'cya-page', path: '/summary' })
        ],
        sections: [{ name: 'section-1', title: 'First Section' }]
      })

      const result = checkAnswersOverviewViewModel(
        baseMetadata,
        definition,
        'cya-page'
      )

      expect(result.previewModel.sections).toHaveLength(1)
      expect(result.previewModel.sections[0].title).toBe('First Section')
      expect(result.previewModel.sections[0].pages).toHaveLength(1)
    })

    it('should build preview model with unassigned pages', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'p1', title: 'Unassigned Page' }),
          buildSummaryPage({ id: 'cya-page', path: '/summary' })
        ],
        sections: []
      })

      const result = checkAnswersOverviewViewModel(
        baseMetadata,
        definition,
        'cya-page'
      )

      expect(result.previewModel.unassignedPages).toHaveLength(2)
    })

    it('should include required preview model properties for right panel', () => {
      const definition = buildDefinition({
        pages: [
          buildSummaryPage({
            id: 'cya-page',
            path: '/summary',
            components: [
              buildMarkdownComponent({ content: 'Declaration text' })
            ]
          })
        ],
        sections: []
      })

      const result = checkAnswersOverviewViewModel(
        baseMetadata,
        definition,
        'cya-page'
      )

      expect(result.previewModel).toHaveProperty('showConfirmationEmail')
      expect(result.previewModel).toHaveProperty('declarationText')
      expect(result.previewModel).toHaveProperty('needDeclaration')
      expect(result.previewModel).toHaveProperty(
        'isConfirmationEmailSettingsPanel'
      )
      expect(result.previewModel.isConfirmationEmailSettingsPanel).toBe(false)
    })

    it('should build correct back link', () => {
      const definition = buildDefinition({
        pages: [buildSummaryPage({ id: 'cya-page', path: '/summary' })],
        sections: []
      })

      const result = checkAnswersOverviewViewModel(
        baseMetadata,
        definition,
        'cya-page'
      )

      expect(result.backLink.href).toBe('/library/test-form/editor-v2/pages')
      expect(result.backLink.text).toBe('Back to add and edit pages')
    })

    it('should build correct preview page URL', () => {
      const definition = buildDefinition({
        pages: [
          buildSummaryPage({
            id: 'cya-page',
            path: '/summary'
          })
        ],
        sections: []
      })

      const result = checkAnswersOverviewViewModel(
        baseMetadata,
        definition,
        'cya-page'
      )

      expect(result.previewPageUrl).toContain('/summary?force')
    })

    it('should include preview config', () => {
      const definition = buildDefinition({
        pages: [buildSummaryPage({ id: 'cya-page', path: '/summary' })],
        sections: []
      })

      const result = checkAnswersOverviewViewModel(
        baseMetadata,
        definition,
        'cya-page'
      )

      expect(result.preview.pageId).toBe('cya-page')
      expect(result.preview.definitionId).toBe(baseMetadata.id)
      expect(result.preview.pageTemplate).toBe(SUMMARY_CONTROLLER_TEMPLATE)
    })

    it('should include navigation', () => {
      const definition = buildDefinition({
        pages: [buildSummaryPage({ id: 'cya-page', path: '/summary' })],
        sections: []
      })

      const result = checkAnswersOverviewViewModel(
        baseMetadata,
        definition,
        'cya-page'
      )

      expect(result.navigation).toBeDefined()
      expect(Array.isArray(result.navigation)).toBe(true)
    })

    it('should include declaration link for editing', () => {
      const definition = buildDefinition({
        pages: [buildSummaryPage({ id: 'cya-page', path: '/summary' })],
        sections: []
      })

      const result = checkAnswersOverviewViewModel(
        baseMetadata,
        definition,
        'cya-page'
      )

      expect(result.declaration.link).toBe(
        '/library/test-form/editor-v2/page/cya-page/check-answers-settings/declaration'
      )
    })

    it('should include sections link for editing', () => {
      const definition = buildDefinition({
        pages: [buildSummaryPage({ id: 'cya-page', path: '/summary' })],
        sections: []
      })

      const result = checkAnswersOverviewViewModel(
        baseMetadata,
        definition,
        'cya-page'
      )

      expect(result.sections.link).toBe(
        '/library/test-form/editor-v2/page/cya-page/check-answers-settings/sections'
      )
    })
  })
})
