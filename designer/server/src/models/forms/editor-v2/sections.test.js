import {
  buildDefinition,
  buildMarkdownComponent,
  buildQuestionPage,
  buildSummaryPage,
  buildTextFieldComponent
} from '~/src/__stubs__/form-definition.js'
import { testFormMetadata } from '~/src/__stubs__/form-metadata.js'
import { sectionsViewModel } from '~/src/models/forms/editor-v2/sections.js'

describe('sections model', () => {
  const baseMetadata = {
    ...testFormMetadata,
    slug: 'test-form'
  }

  describe('sectionsViewModel', () => {
    it('should build view model with no sections', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'p1',
            components: [buildTextFieldComponent()]
          }),
          buildSummaryPage({ id: 'cya-page' })
        ],
        sections: []
      })

      const result = sectionsViewModel(
        baseMetadata,
        definition,
        'cya-page',
        undefined,
        undefined
      )

      expect(result.pageTitle).toBe('Add and organise sections')
      expect(result.cardTitle).toBe('Add and organise sections')
      expect(result.cardCaption).toBe('Check answers')
      expect(result.sections).toEqual([])
      expect(result.unassignedPages).toHaveLength(1)
      expect(result.unassignedPages[0].id).toBe('p1')
    })

    it('should build view model with sections and assigned pages', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'p1',
            title: 'Page one',
            section: 'section-1',
            components: [buildTextFieldComponent()]
          }),
          buildQuestionPage({
            id: 'p2',
            title: 'Page two',
            section: 'section-1',
            components: [buildTextFieldComponent()]
          }),
          buildQuestionPage({
            id: 'p3',
            title: 'Page three',
            section: 'section-2',
            components: [buildTextFieldComponent()]
          }),
          buildSummaryPage({ id: 'cya-page' })
        ],
        sections: [
          { name: 'section-1', title: 'Section One', hideTitle: false },
          { name: 'section-2', title: 'Section Two', hideTitle: true }
        ]
      })

      const result = sectionsViewModel(
        baseMetadata,
        definition,
        'cya-page',
        undefined,
        undefined
      )

      expect(result.sections).toHaveLength(2)
      expect(result.sections[0].name).toBe('section-1')
      expect(result.sections[0].title).toBe('Section One')
      expect(result.sections[0].hideTitle).toBe(false)
      expect(result.sections[0].number).toBe(1)
      expect(result.sections[0].pages).toHaveLength(2)
      expect(result.sections[1].name).toBe('section-2')
      expect(result.sections[1].title).toBe('Section Two')
      expect(result.sections[1].hideTitle).toBe(true)
      expect(result.sections[1].number).toBe(2)
      expect(result.sections[1].pages).toHaveLength(1)
      expect(result.unassignedPages).toHaveLength(0)
    })

    it('should exclude current CYA page from unassigned pages', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'p1',
            title: 'Page one',
            components: [buildTextFieldComponent()]
          }),
          buildSummaryPage({ id: 'cya-page' })
        ],
        sections: []
      })

      const result = sectionsViewModel(
        baseMetadata,
        definition,
        'cya-page',
        undefined,
        undefined
      )

      expect(result.unassignedPages).toHaveLength(1)
      expect(result.unassignedPages[0].id).toBe('p1')
      expect(
        result.unassignedPages.find((p) => p.id === 'cya-page')
      ).toBeUndefined()
    })

    it('should exclude CYA page and guidance pages from preview unassigned pages', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'p1',
            title: 'Question page',
            components: [buildTextFieldComponent()]
          }),
          buildQuestionPage({
            id: 'p2',
            title: 'Guidance page',
            components: [buildMarkdownComponent({ content: 'Some guidance' })]
          }),
          buildSummaryPage({ id: 'cya-page' })
        ],
        sections: []
      })

      const result = sectionsViewModel(
        baseMetadata,
        definition,
        'cya-page',
        undefined,
        undefined
      )

      // CYA page and guidance pages should not appear in preview unassigned pages
      // Only question pages should appear
      expect(result.previewModel.unassignedPages).toHaveLength(1)
      expect(result.previewModel.unassignedPages[0].title).toBe('Question page')
    })

    it('should identify guidance pages', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'p1',
            title: 'Guidance page',
            components: [buildMarkdownComponent({ content: 'Some guidance' })]
          }),
          buildQuestionPage({
            id: 'p2',
            title: 'Question page',
            components: [buildTextFieldComponent()]
          }),
          buildSummaryPage({ id: 'cya-page' })
        ],
        sections: []
      })

      const result = sectionsViewModel(
        baseMetadata,
        definition,
        'cya-page',
        undefined,
        undefined
      )

      expect(result.unassignedPages[0].isGuidance).toBe(true)
      expect(result.unassignedPages[1].isGuidance).toBe(false)
    })

    it('should build correct back link', () => {
      const definition = buildDefinition({
        pages: [buildSummaryPage({ id: 'cya-page' })],
        sections: []
      })

      const result = sectionsViewModel(
        baseMetadata,
        definition,
        'cya-page',
        undefined,
        undefined
      )

      expect(result.backLink.href).toBe(
        '/library/test-form/editor-v2/page/cya-page/check-answers-settings'
      )
      expect(result.backLink.text).toBe('Back to add and edit pages')
    })

    it('should build correct current path', () => {
      const definition = buildDefinition({
        pages: [buildSummaryPage({ id: 'cya-page' })],
        sections: []
      })

      const result = sectionsViewModel(
        baseMetadata,
        definition,
        'cya-page',
        undefined,
        undefined
      )

      expect(result.currentPath).toBe(
        '/library/test-form/editor-v2/page/cya-page/check-answers-settings/sections'
      )
    })

    it('should build preview page URL', () => {
      const definition = buildDefinition({
        pages: [
          buildSummaryPage({
            id: 'cya-page',
            path: '/summary'
          })
        ],
        sections: []
      })

      const result = sectionsViewModel(
        baseMetadata,
        definition,
        'cya-page',
        undefined,
        undefined
      )

      expect(result.previewPageUrl).toContain('/summary?force')
    })

    it('should handle validation errors', () => {
      const definition = buildDefinition({
        pages: [buildSummaryPage({ id: 'cya-page' })],
        sections: []
      })

      const validation =
        /** @type {ValidationFailure<FormEditor>} */
        (
          /** @type {unknown} */ ({
            formErrors: { sectionHeading: { text: 'Enter section heading' } },
            formValues: { sectionHeading: '' }
          })
        )

      const result = sectionsViewModel(
        baseMetadata,
        definition,
        'cya-page',
        validation,
        undefined
      )

      expect(result.formErrors).toEqual(validation.formErrors)
      expect(result.formValues).toEqual(validation.formValues)
      expect(result.errorList).toBeDefined()
    })

    it('should handle notification', () => {
      const definition = buildDefinition({
        pages: [buildSummaryPage({ id: 'cya-page' })],
        sections: []
      })

      const notification = ['Section added']

      const result = sectionsViewModel(
        baseMetadata,
        definition,
        'cya-page',
        undefined,
        notification
      )

      expect(result.notification).toEqual(notification)
    })

    it('should detect declaration from markdown component on CYA page', () => {
      const definition = buildDefinition({
        pages: [
          buildSummaryPage({
            id: 'cya-page',
            components: [
              buildMarkdownComponent({ content: 'I agree to the terms' })
            ]
          })
        ],
        sections: []
      })

      const result = sectionsViewModel(
        baseMetadata,
        definition,
        'cya-page',
        undefined,
        undefined
      )

      expect(result.previewModel.declaration.hasDeclaration).toBe(true)
      expect(result.previewModel.declaration.declarationText).toBe(
        'I agree to the terms'
      )
    })

    it('should detect no declaration when CYA page has no markdown', () => {
      const definition = buildDefinition({
        pages: [buildSummaryPage({ id: 'cya-page', components: [] })],
        sections: []
      })

      const result = sectionsViewModel(
        baseMetadata,
        definition,
        'cya-page',
        undefined,
        undefined
      )

      expect(result.previewModel.declaration.hasDeclaration).toBe(false)
      expect(result.previewModel.declaration.declarationText).toBe('')
    })

    it('should handle pages with missing ids', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: undefined,
            title: 'Page without id',
            components: [buildTextFieldComponent()]
          }),
          buildSummaryPage({ id: 'cya-page' })
        ],
        sections: []
      })

      const result = sectionsViewModel(
        baseMetadata,
        definition,
        'cya-page',
        undefined,
        undefined
      )

      expect(result.unassignedPages[0].id).toBe('')
    })

    it('should use first question title when page has no title', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'p1',
            title: '',
            components: [
              buildTextFieldComponent({ title: 'What is your name?' })
            ]
          }),
          buildSummaryPage({ id: 'cya-page' })
        ],
        sections: []
      })

      const result = sectionsViewModel(
        baseMetadata,
        definition,
        'cya-page',
        undefined,
        undefined
      )

      expect(result.unassignedPages[0].title).toBe('What is your name?')
    })

    it('should handle hideTitle defaulting to false when undefined', () => {
      const definition = buildDefinition({
        pages: [buildSummaryPage({ id: 'cya-page' })],
        sections: [{ name: 'section-1', title: 'Section One' }]
      })

      const result = sectionsViewModel(
        baseMetadata,
        definition,
        'cya-page',
        undefined,
        undefined
      )

      expect(result.sections[0].hideTitle).toBe(false)
    })

    it('should include navigation', () => {
      const definition = buildDefinition({
        pages: [buildSummaryPage({ id: 'cya-page' })],
        sections: []
      })

      const result = sectionsViewModel(
        baseMetadata,
        definition,
        'cya-page',
        undefined,
        undefined
      )

      expect(result.navigation).toBeDefined()
      expect(Array.isArray(result.navigation)).toBe(true)
    })

    it('should handle undefined page', () => {
      const definition = buildDefinition({
        pages: [buildSummaryPage({ id: 'cya-page' })],
        sections: []
      })

      const result = sectionsViewModel(
        baseMetadata,
        definition,
        'non-existent-page',
        undefined,
        undefined
      )

      expect(result.previewModel.declaration.hasDeclaration).toBe(false)
    })

    it('should exclude guidance pages from section preview pages', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'p1',
            title: 'Question page',
            section: 'section-1',
            components: [buildTextFieldComponent()]
          }),
          buildQuestionPage({
            id: 'p2',
            title: 'Guidance page',
            section: 'section-1',
            components: [buildMarkdownComponent({ content: 'Some guidance' })]
          }),
          buildSummaryPage({ id: 'cya-page' })
        ],
        sections: [{ name: 'section-1', title: 'Section One' }]
      })

      const result = sectionsViewModel(
        baseMetadata,
        definition,
        'cya-page',
        undefined,
        undefined
      )

      // Section should still show both pages in the assignment UI
      expect(result.sections[0].pages).toHaveLength(2)
      // But preview should only show question pages (not guidance)
      expect(result.previewModel.sections[0].pages).toHaveLength(1)
      expect(result.previewModel.sections[0].pages[0].title).toBe(
        'Question page'
      )
    })
  })
})

/**
 * @import { FormEditor } from '@defra/forms-model'
 * @import { ValidationFailure } from '~/src/common/helpers/types.js'
 */
