import {
  buildList,
  buildListItem,
  buildMarkdownComponent,
  buildRadiosComponent,
  buildTextFieldComponent
} from '~/src/__stubs__/components.js'
import { buildDefinition } from '~/src/__stubs__/form-definition.js'
import { buildQuestionPage } from '~/src/__stubs__/pages.js'
import { ComponentType } from '~/src/components/enums.js'
import { PageRendererStub } from '~/src/form/form-editor/__stubs__/preview.js'
import {
  PagePreviewElements,
  PreviewPageController
} from '~/src/form/form-editor/preview/controller/page-controller.js'

describe('page-controller', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('PagePreviewElements', () => {
    it('should map a page to PagePreviewElements', () => {
      const pageQuestion = buildQuestionPage({
        title: 'Page title',
        components: []
      })
      const pagePreviewElements = new PagePreviewElements(pageQuestion)
      expect(pagePreviewElements.heading).toBe('Page title')
      expect(pagePreviewElements.guidance).toBe('')
    })
    it('should map a page  with guidance to PagePreviewElements', () => {
      const pageQuestion = buildQuestionPage({
        title: 'Page title',
        components: [
          buildMarkdownComponent({
            content: '# This is a heading'
          })
        ]
      })
      const pagePreviewElements = new PagePreviewElements(pageQuestion)
      expect(pagePreviewElements.heading).toBe('Page title')
      expect(pagePreviewElements.guidance).toBe('# This is a heading')
    })
  })
  describe('PreviewPageController', () => {
    const pageRenderMock = jest.fn()
    const renderer = new PageRendererStub(pageRenderMock)
    const textFieldComponent = buildTextFieldComponent({
      title: 'Question title',
      hint: 'Choose one adventure that best suits you.'
    })
    const listId = '41638c11-690f-43e0-bf3e-4257353889c2'
    const list = buildList({
      id: listId,
      items: [
        buildListItem({
          text: 'List item 1',
          value: 'list-item-1'
        })
      ]
    })
    const listComponent = buildRadiosComponent({
      title: 'List component',
      list: listId
    })
    const pageTitle = 'Page title'
    const page = buildQuestionPage({
      title: pageTitle,
      components: [textFieldComponent, listComponent]
    })
    const formDefinition = buildDefinition({ pages: [page], lists: [list] })
    /**
     *
     * @param {{
     *    definition?: FormDefinition,
     *    components?: ComponentDef[],
     *    currentPage?: Page
     * }} partialElements
     * @returns {{
     *  pageElements: PagePreviewElements,
     *  pageRenderMock: jest.Mock,
     *  pageController: PreviewPageController
     * }}
     */
    const buildController = ({
      currentPage = page,
      definition = formDefinition,
      components = [textFieldComponent, listComponent]
    } = {}) => {
      const pageRenderMock = jest.fn()
      const renderer = new PageRendererStub(pageRenderMock)
      const pageElements = new PagePreviewElements(currentPage)

      const pageController = new PreviewPageController(
        components,
        pageElements,
        definition,
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
      const expectedListComponent = {
        model: {
          id: 'listInput',
          name: 'listInputField',
          fieldset: {
            legend: {
              classes: 'govuk-fieldset__legend--l',
              text: 'List component'
            }
          },
          hint: {
            classes: '',
            text: ''
          },
          items: [
            {
              hint: undefined,
              id: '',
              label: {
                classes: '',
                text: 'List item 1'
              },
              text: 'List item 1',
              value: 'list-item-1'
            }
          ]
        },
        questionType: ComponentType.RadiosField
      }
      expect(pageController.pageTitle).toEqual({
        text: pageTitle,
        classes: ''
      })
      expect(pageController.components).toEqual([
        expectedPageComponent,
        expectedListComponent
      ])
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
        [textFieldComponent],
        new PagePreviewElements(buildQuestionPage({ title: '' })),
        buildDefinition({
          pages: [buildQuestionPage({ components: [textFieldComponent] })]
        }),
        renderer
      )

      expect(pageController.pageTitle).toEqual({
        text: 'Question title',
        classes: ''
      })
    })
  })
})

/**
 * @import { FormDefinition, Page } from '~/src/form/form-definition/types.js'
 * @import { ComponentDef } from '~/src/components/types.js'
 */
