import { buildSummaryPage } from '@defra/forms-model/stubs'

import {
  PagePreviewElementsSSR,
  SummaryPreviewSSR
} from '~/src/models/forms/editor-v2/preview/page-preview.js'

describe('page-preview', () => {
  describe('PagePreviewElementsSSR', () => {
    it('should instantiate with page only', () => {
      const page = buildSummaryPage()
      const pagePreview = new PagePreviewElementsSSR(page)

      expect(pagePreview.guidance).toBe('')
    })

    it('should instantiate with page and guidance text', () => {
      const page = buildSummaryPage()
      const guidanceText = 'Some guidance text'
      const pagePreview = new PagePreviewElementsSSR(page, guidanceText)

      expect(pagePreview.guidance).toBe(guidanceText)
    })

    it('should instantiate with undefined page', () => {
      const pagePreview = new PagePreviewElementsSSR(undefined)

      expect(pagePreview.guidance).toBe('')
    })

    it('should instantiate with undefined page and guidance text', () => {
      const guidanceText = 'Some guidance text'
      const pagePreview = new PagePreviewElementsSSR(undefined, guidanceText)

      expect(pagePreview.guidance).toBe(guidanceText)
    })
  })

  describe('SummaryPreviewSSR', () => {
    describe('constructor defaults', () => {
      it('should instantiate with default values', () => {
        const page = buildSummaryPage()
        const declarationText = 'I declare this to be true'
        const summaryPreview = new SummaryPreviewSSR(page, declarationText)

        expect(summaryPreview.declaration).toBe(false)
        expect(summaryPreview.showConfirmationEmail).toBe(true)
        expect(summaryPreview.guidance).toBe(declarationText)
      })

      it('should instantiate with undefined page', () => {
        const declarationText = 'I declare this to be true'
        const summaryPreview = new SummaryPreviewSSR(undefined, declarationText)

        expect(summaryPreview.declaration).toBe(false)
        expect(summaryPreview.showConfirmationEmail).toBe(true)
        expect(summaryPreview.guidance).toBe(declarationText)
      })
    })

    describe('declaration', () => {
      it('should return false when showDeclaration is false', () => {
        const page = buildSummaryPage()
        const declarationText = 'I declare this to be true'
        const summaryPreview = new SummaryPreviewSSR(
          page,
          declarationText,
          false
        )

        expect(summaryPreview.declaration).toBe(false)
      })

      it('should return true when showDeclaration is true', () => {
        const page = buildSummaryPage()
        const declarationText = 'I declare this to be true'
        const summaryPreview = new SummaryPreviewSSR(
          page,
          declarationText,
          true
        )

        expect(summaryPreview.declaration).toBe(true)
      })

      it('should default to false when showDeclaration is not provided', () => {
        const page = buildSummaryPage()
        const declarationText = 'I declare this to be true'
        const summaryPreview = new SummaryPreviewSSR(
          page,
          declarationText,
          undefined
        )

        expect(summaryPreview.declaration).toBe(false)
      })
    })

    describe('showConfirmationEmail', () => {
      it('should return true when showConfirmationEmail is true', () => {
        const page = buildSummaryPage()
        const declarationText = 'I declare this to be true'
        const summaryPreview = new SummaryPreviewSSR(
          page,
          declarationText,
          false,
          true
        )

        expect(summaryPreview.showConfirmationEmail).toBe(true)
      })

      it('should return false when showConfirmationEmail is false', () => {
        const page = buildSummaryPage()
        const declarationText = 'I declare this to be true'
        const summaryPreview = new SummaryPreviewSSR(
          page,
          declarationText,
          false,
          false
        )

        expect(summaryPreview.showConfirmationEmail).toBe(false)
      })

      it('should default to true when showConfirmationEmail is not provided', () => {
        const page = buildSummaryPage()
        const declarationText = 'I declare this to be true'
        const summaryPreview = new SummaryPreviewSSR(
          page,
          declarationText,
          false,
          undefined
        )

        expect(summaryPreview.showConfirmationEmail).toBe(true)
      })

      it('should work independently of declaration setting', () => {
        const page = buildSummaryPage()
        const declarationText = 'I declare this to be true'

        const summaryPreview1 = new SummaryPreviewSSR(
          page,
          declarationText,
          true,
          false
        )
        expect(summaryPreview1.declaration).toBe(true)
        expect(summaryPreview1.showConfirmationEmail).toBe(false)

        const summaryPreview2 = new SummaryPreviewSSR(
          page,
          declarationText,
          false,
          true
        )
        expect(summaryPreview2.declaration).toBe(false)
        expect(summaryPreview2.showConfirmationEmail).toBe(true)
      })
    })

    describe('combined scenarios', () => {
      it('should handle all parameters set to true', () => {
        const page = buildSummaryPage()
        const declarationText = 'I declare this to be true'
        const summaryPreview = new SummaryPreviewSSR(
          page,
          declarationText,
          true,
          true
        )

        expect(summaryPreview.declaration).toBe(true)
        expect(summaryPreview.showConfirmationEmail).toBe(true)
        expect(summaryPreview.guidance).toBe(declarationText)
      })

      it('should handle all parameters set to false', () => {
        const page = buildSummaryPage()
        const declarationText = 'I declare this to be true'
        const summaryPreview = new SummaryPreviewSSR(
          page,
          declarationText,
          false,
          false
        )

        expect(summaryPreview.declaration).toBe(false)
        expect(summaryPreview.showConfirmationEmail).toBe(false)
        expect(summaryPreview.guidance).toBe(declarationText)
      })

      it('should handle empty declaration text with flags set', () => {
        const page = buildSummaryPage()
        const summaryPreview = new SummaryPreviewSSR(page, '', true, false)

        expect(summaryPreview.declaration).toBe(true)
        expect(summaryPreview.showConfirmationEmail).toBe(false)
        expect(summaryPreview.guidance).toBe('')
      })
    })
  })
})
