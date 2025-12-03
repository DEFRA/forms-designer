import { FormStatus } from '@defra/forms-model'
import {
  buildDefinition,
  buildMarkdownComponent,
  buildQuestionPage,
  buildSummaryPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import {
  DECLARATION_PREVIEW_TITLE,
  DEFAULT_TRUNCATE_LENGTH,
  SUMMARY_CONTROLLER_TEMPLATE,
  buildFormUrl,
  buildPreviewErrorsUrl,
  buildPreviewUrl,
  buildSectionsForPreview,
  enrichPreviewModel,
  getDeclarationInfo,
  getUnassignedPageTitlesForPreview,
  truncateText
} from '~/src/models/forms/editor-v2/preview-helpers.js'

describe('preview-helpers', () => {
  describe('constants', () => {
    it('should export DEFAULT_TRUNCATE_LENGTH as 50', () => {
      expect(DEFAULT_TRUNCATE_LENGTH).toBe(50)
    })

    it('should export DECLARATION_PREVIEW_TITLE', () => {
      expect(DECLARATION_PREVIEW_TITLE).toBe('Preview of Check answers page')
    })

    it('should export SUMMARY_CONTROLLER_TEMPLATE', () => {
      expect(SUMMARY_CONTROLLER_TEMPLATE).toBe('summary-controller.njk')
    })
  })

  describe('truncateText', () => {
    it('should return text unchanged if shorter than max length', () => {
      const text = 'Short text'
      const result = truncateText(text)
      expect(result).toBe(text)
    })

    it('should return text unchanged if equal to max length', () => {
      const text = 'A'.repeat(DEFAULT_TRUNCATE_LENGTH)
      const result = truncateText(text)
      expect(result).toBe(text)
    })

    it('should truncate text longer than default max length', () => {
      const text = 'A'.repeat(DEFAULT_TRUNCATE_LENGTH + 10)
      const result = truncateText(text)
      expect(result).toBe('A'.repeat(DEFAULT_TRUNCATE_LENGTH) + '...')
    })

    it('should truncate text to custom max length', () => {
      const text = 'This is a longer text'
      const result = truncateText(text, 10)
      expect(result).toBe('This is a ...')
    })
  })

  describe('buildFormUrl', () => {
    it('should build form URL with encoded slug', () => {
      const result = buildFormUrl('my-form')
      expect(result).toContain('/form/my-form')
    })
  })

  describe('buildPreviewUrl', () => {
    it('should build preview URL with slug and status', () => {
      const result = buildPreviewUrl('my-form', FormStatus.Draft)
      expect(result).toContain('/form/preview/draft/my-form')
    })
  })

  describe('buildPreviewErrorsUrl', () => {
    it('should build error preview URL with slug', () => {
      const result = buildPreviewErrorsUrl('my-form')
      expect(result).toContain('/error-preview/draft/my-form')
    })
  })

  describe('buildSectionsForPreview', () => {
    it('should return empty array when no sections', () => {
      const definition = buildDefinition({
        pages: [buildQuestionPage({ id: 'p1' })],
        sections: []
      })

      const result = buildSectionsForPreview(definition)
      expect(result).toEqual([])
    })

    it('should build sections with pages', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'p1',
            title: 'Page One',
            section: 'section-1-id'
          }),
          buildQuestionPage({
            id: 'p2',
            title: 'Page Two',
            section: 'section-2-id'
          })
        ],
        sections: [
          { id: 'section-1-id', name: 'section-1', title: 'First Section' },
          { id: 'section-2-id', name: 'section-2', title: 'Second Section' }
        ]
      })

      const result = buildSectionsForPreview(definition)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe('section-1-id')
      expect(result[0].title).toBe('First Section')
      expect(result[1].id).toBe('section-2-id')
      expect(result[1].title).toBe('Second Section')
    })

    it('should exclude guidance-only pages from sections', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'p1',
            title: 'Question page',
            section: 'section-1-id',
            components: [buildTextFieldComponent()]
          }),
          buildQuestionPage({
            id: 'p2',
            title: 'Guidance page',
            section: 'section-1-id',
            components: [buildMarkdownComponent({ content: 'Some guidance' })]
          })
        ],
        sections: [
          { id: 'section-1-id', name: 'section-1', title: 'First Section' }
        ]
      })

      const result = buildSectionsForPreview(definition)

      expect(result).toHaveLength(1)
      expect(result[0].pages).toHaveLength(1)
      expect(result[0].pages[0].title).toBe('Question page')
    })
  })

  describe('getUnassignedPageTitlesForPreview', () => {
    it('should return all pages when none are assigned to sections', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'p1', title: 'Page One' }),
          buildQuestionPage({ id: 'p2', title: 'Page Two' })
        ],
        sections: []
      })

      const result = getUnassignedPageTitlesForPreview(definition)

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({ title: 'Page One' })
    })

    it('should return empty array when all pages are assigned', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'p1',
            title: 'Page One',
            section: 'section-1'
          })
        ],
        sections: [{ name: 'section-1', title: 'Section One' }]
      })

      const result = getUnassignedPageTitlesForPreview(definition)

      expect(result).toEqual([])
    })

    it('should exclude summary pages from unassigned pages', () => {
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({ id: 'p1', title: 'Question page' }),
          buildSummaryPage({ id: 'cya-page', path: '/summary' })
        ],
        sections: []
      })

      const result = getUnassignedPageTitlesForPreview(definition)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Question page')
    })

    it('should exclude guidance-only pages from unassigned pages', () => {
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
          })
        ],
        sections: []
      })

      const result = getUnassignedPageTitlesForPreview(definition)

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Question page')
    })
  })

  describe('getDeclarationInfo', () => {
    it('should return hasDeclaration false when page is undefined', () => {
      const result = getDeclarationInfo(undefined)

      expect(result).toEqual({
        hasDeclaration: false,
        declarationText: ''
      })
    })

    it('should return hasDeclaration false when page has no components', () => {
      const page = buildSummaryPage({ id: 'cya', components: [] })
      const result = getDeclarationInfo(page)

      expect(result).toEqual({
        hasDeclaration: false,
        declarationText: ''
      })
    })

    it('should return hasDeclaration true when first component is markdown', () => {
      const page = buildSummaryPage({
        id: 'cya',
        components: [
          buildMarkdownComponent({ content: 'I agree to the terms' })
        ]
      })
      const result = getDeclarationInfo(page)

      expect(result).toEqual({
        hasDeclaration: true,
        declarationText: 'I agree to the terms'
      })
    })

    it('should return hasDeclaration false when first component is not markdown', () => {
      const page = buildSummaryPage({
        id: 'cya',
        components: [buildTextFieldComponent({ title: 'Question' })]
      })
      const result = getDeclarationInfo(page)

      expect(result).toEqual({
        hasDeclaration: false,
        declarationText: ''
      })
    })
  })

  describe('enrichPreviewModel', () => {
    it('should enrich preview model with sections and declaration', () => {
      const basePreviewModel = {
        needDeclaration: true,
        declarationText: 'I agree to the terms'
      }
      const definition = buildDefinition({
        pages: [
          buildQuestionPage({
            id: 'p1',
            title: 'Page One',
            section: 'section-1'
          })
        ],
        sections: [{ name: 'section-1', title: 'First Section' }]
      })

      const result = enrichPreviewModel(basePreviewModel, definition)

      expect(result.sections).toHaveLength(1)
      expect(result.unassignedPages).toHaveLength(0)
      expect(result.declaration).toEqual({
        hasDeclaration: true,
        declarationText: 'I agree to the terms'
      })
    })

    it('should not mutate the original base model', () => {
      const basePreviewModel = {
        needDeclaration: true,
        declarationText: 'Original text'
      }
      const definition = buildDefinition({
        pages: [],
        sections: []
      })

      enrichPreviewModel(basePreviewModel, definition)

      expect(basePreviewModel).not.toHaveProperty('sections')
      expect(basePreviewModel).not.toHaveProperty('unassignedPages')
      expect(basePreviewModel).not.toHaveProperty('declaration')
    })
  })
})
