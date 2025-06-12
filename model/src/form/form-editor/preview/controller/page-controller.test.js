import { ComponentType } from '~/src/components/enums.js'
import {
  PagePreviewElements,
  PageRendererStub,
  buildPreviewShortAnswer
} from '~/src/form/form-editor/__stubs__/preview.js'
import { PreviewPageController } from '~/src/form/form-editor/preview/controller/page-controller.js'

describe('page-controller', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  describe('PreviewPageController', () => {
    const pageRenderMock = jest.fn()
    const renderer = new PageRendererStub(pageRenderMock)
    const question = buildPreviewShortAnswer(
      {
        question: 'Question title'
      },
      jest.fn()
    )
    const pageTitle = 'Page title'

    /**
     *
     * @param {{ heading?: string; guidance?: string }} partialElements
     * @returns {{pageElements: PagePreviewElements, pageRenderMock: jest.Mock, pageController: PreviewPageController}}
     */
    const buildController = ({ heading = pageTitle, guidance = '' } = {}) => {
      const pageRenderMock = jest.fn()
      const renderer = new PageRendererStub(pageRenderMock)
      const pageElements = new PagePreviewElements(heading, guidance)

      const pageController = new PreviewPageController(
        [question],
        pageElements,
        renderer
      )

      return {
        pageController,
        pageRenderMock,
        pageElements
      }
    }

    it('should return the page title should one exist', () => {
      const { pageController } = buildController()
      const expectedPageComponent = {
        model: {
          id: 'inputField',
          name: 'inputField',
          label: {
            classes: 'govuk-label--l',
            text: 'Question title'
          },
          hint: {
            text: 'Choose one adventure that best suits you.',
            classes: ''
          }
        },
        questionType: ComponentType.TextField
      }
      expect(pageController.pageTitle).toEqual({
        text: pageTitle,
        classes: ''
      })
      expect(pageController.components).toEqual([expectedPageComponent])
    })

    it('should render if you change the title', () => {
      const newPageTitle = 'New page title'
      const { pageController, pageRenderMock } = buildController()
      pageController.highlightTitle()
      pageController.title = newPageTitle
      expect(pageController.pageTitle).toEqual({
        text: newPageTitle,
        classes: 'highlight'
      })
      pageController.clearHighlight()
      expect(pageController.pageTitle.classes).toBe('')
      expect(pageRenderMock).toHaveBeenCalledTimes(3)
    })

    it('should render if you change the guidance', () => {
      const newGuidance = 'Updated Guidance'
      const { pageController, pageRenderMock } = buildController()
      pageController.highlightGuidance()
      pageController.guidanceText = newGuidance
      expect(pageController.guidanceText).toBe(newGuidance)
      expect(pageController.guidance).toEqual({
        text: newGuidance,
        classes: 'highlight'
      })
      pageController.clearHighlight()
      expect(pageController.guidance.classes).toBe('')
      expect(pageRenderMock).toHaveBeenCalledTimes(3)
    })

    it('should return the title of the first component should one not exist', () => {
      const pageController = new PreviewPageController(
        [question],
        new PagePreviewElements(''),
        renderer
      )

      expect(pageController.pageTitle).toEqual({
        text: 'Question title',
        classes: ''
      })
    })
  })
})
