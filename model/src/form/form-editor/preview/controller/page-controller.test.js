import {
  buildDateComponent,
  buildList,
  buildListItem,
  buildMarkdownComponent,
  buildRadiosComponent,
  buildSelectFieldComponent,
  buildTextFieldComponent
} from '~/src/__stubs__/components.js'
import { buildDefinition } from '~/src/__stubs__/form-definition.js'
import { buildQuestionPage, buildRepeaterPage } from '~/src/__stubs__/pages.js'
import { ComponentType } from '~/src/components/enums.js'
import { PageRendererStub } from '~/src/form/form-editor/__stubs__/preview.js'
import {
  PagePreviewElements,
  PreviewPageController
} from '~/src/form/form-editor/preview/controller/page-controller.js'

/**
 * Overrides the default to
 */
class PagePreviewElementsWithHeading extends PagePreviewElements {
  /**
   * @type {boolean}
   * @private
   */
  _addHeading

  /**
   * @param {Page} page
   * @param {boolean} addHeading
   */
  constructor(page, addHeading) {
    super(page)
    this._addHeading = addHeading
  }

  get addHeading() {
    return this._addHeading
  }
}

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
      expect(pagePreviewElements.addHeading).toBe(true)
    })

    it('should map an empty page to PagePreviewElements', () => {
      const pageQuestion = buildQuestionPage({
        title: '',
        components: []
      })
      const pagePreviewElements = new PagePreviewElements(pageQuestion)
      expect(pagePreviewElements.heading).toBe('')
      expect(pagePreviewElements.guidance).toBe('')
      expect(pagePreviewElements.addHeading).toBe(false)
      expect(pagePreviewElements.repeatQuestion).toBeUndefined()
      expect(pagePreviewElements.hasRepeater).toBe(false)
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

    it('should map a repeater page to PagePreviewElements', () => {
      const component = buildTextFieldComponent({
        title: 'Text field component'
      })
      const pageQuestion = buildRepeaterPage({
        title: 'Page title',
        components: [component],
        repeat: {
          options: {
            name: 'fawfed',
            title: 'Simple question responses'
          },
          schema: {
            min: 1,
            max: 3
          }
        }
      })
      const pagePreviewElements = new PagePreviewElements(pageQuestion)
      expect(pagePreviewElements.repeatQuestion).toBe(
        'Simple question responses'
      )
      expect(pagePreviewElements.hasRepeater).toBe(true)
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
    const guidanceComponent = buildMarkdownComponent({
      content: 'This is some guidance'
    })

    const selectComponent = buildSelectFieldComponent({
      id: 'd46c9ba0-f5d6-47ab-aa6b-f60b64306e5f',
      title: 'Select component',
      list: listId
    })
    const pageTitle = 'Page title'
    const page = buildQuestionPage({
      title: pageTitle,
      components: [textFieldComponent, listComponent, selectComponent]
    })
    const pageWithGuidance = buildQuestionPage({
      title: pageTitle,
      components: [
        guidanceComponent,
        textFieldComponent,
        listComponent,
        selectComponent
      ]
    })
    const formDefinition = buildDefinition({ pages: [page], lists: [list] })
    const formDefinitionWithGuidance = buildDefinition({
      pages: [pageWithGuidance],
      lists: [list]
    })

    /**
     *
     * @param {{
     *    definition?: FormDefinition,
     *    components?: ComponentDef[],
     *    currentPage?: Page,
     *    pageElementsInput?: PagePreviewElements
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
      components = page.components,
      pageElementsInput = undefined
    } = {}) => {
      const pageRenderMock = jest.fn()
      const renderer = new PageRendererStub(pageRenderMock)
      const pageElements =
        pageElementsInput ?? new PagePreviewElements(currentPage)
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
          classes: '',
          name: 'inputField',
          label: {
            classes: 'govuk-label--m',
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
              classes: 'govuk-fieldset__legend--m',
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
      expect(pageController.components).toHaveLength(3)
      const expectedSelectComponent = {
        model: {
          classes: '',
          label: {
            classes: 'govuk-label--m',
            text: 'Select component'
          },
          hint: {
            classes: '',
            text: ''
          },
          id: 'selectInput',
          items: [
            {
              hint: undefined,
              id: 'da310b6e-2513-4d14-a7a1-63a93231891d',
              label: {
                classes: '',
                text: ''
              },
              text: '',
              value: ''
            },
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
          ],
          name: 'selectInput'
        },
        questionType: 'SelectField'
      }
      expect(pageController.pageTitle).toEqual({
        text: pageTitle,
        classes: ''
      })
      expect(pageController.components).toEqual([
        expectedPageComponent,
        expectedListComponent,
        expectedSelectComponent
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

    it('should show dummy guidance when highlighted with no guidance text', () => {
      const { pageController } = buildController()
      expect(pageController.components[0].model.label?.text).toBe(
        'Question title'
      )
      expect(pageController.guidanceText).toBe('')
      pageController.highlightGuidance()
      const dummyGuidanceComponent = pageController.components[0]
      expect(dummyGuidanceComponent.model.content).toBe(
        '<p>Guidance text</p>\n'
      )
      expect(dummyGuidanceComponent.model).toEqual({
        classes: 'highlight',
        content: '<p>Guidance text</p>\n',
        id: 'markdown',
        name: 'markdown'
      })
    })

    it('should remove dummy guidance when unhighlighted with no guidance text', () => {
      const { pageController } = buildController()
      pageController.highlightGuidance()
      pageController.clearHighlight()
      expect(pageController.components[0].model.label?.text).toBe(
        'Question title'
      )
    })

    it('should render if you add guidance', () => {
      const newGuidance = 'This is some NEW guidance'
      const expectedGuidance = '<p>This is some NEW guidance</p>\n'
      const { pageController } = buildController()
      expect(pageController.guidanceText).toBe('')
      expect(pageController.components[0].model.label?.text).toBe(
        'Question title'
      )
      pageController.highlightGuidance()
      pageController.guidanceText = newGuidance
      expect(pageController.guidanceText).toBe(newGuidance)
      expect(pageController.components[0].model.content).toBe(expectedGuidance)
      expect(pageController.components[0].model.classes).toBe('highlight')
      expect(pageController.guidance.classes).toBe('highlight')
      pageController.clearHighlight()
      expect(pageController.guidanceText).toBe(newGuidance)
      expect(pageController.components[0].model.name).toBe('markdown')
    })

    describe('component title size', () => {
      const component = buildTextFieldComponent({
        title: 'Main title'
      })
      const dateInputComponent = buildDateComponent({
        title: 'Main title'
      })
      const pageWithNoTitle = buildQuestionPage({
        title: '',
        components: [dateInputComponent]
      })
      const pageWithSameTitle = buildQuestionPage({
        title: 'Main title',
        components: [component]
      })
      const pageWithDifferentTitle = buildQuestionPage({
        title: 'Different title',
        components: [component]
      })
      const formDefinition1 = buildDefinition({
        pages: [pageWithNoTitle, pageWithSameTitle, pageWithDifferentTitle]
      })

      it('should be small if there are more than one component', () => {
        const { pageController } = buildController()
        pageController.showTitle = false

        expect(pageController.components[0].model.label?.classes).toBe(
          'govuk-label--m'
        )
        expect(
          pageController.components[1].model.fieldset?.legend.classes
        ).toBe('govuk-fieldset__legend--m')
      })

      it('should be small if add page heading is selected', () => {
        const { pageController } = buildController({
          currentPage: pageWithNoTitle,
          components: pageWithNoTitle.components,
          definition: formDefinition1
        })
        pageController.showTitle = true

        expect(
          pageController.components[0].model.fieldset?.legend.classes
        ).toBe('govuk-fieldset__legend--m')
      })

      it('should be large if add page heading is deselected and one component', () => {
        const { pageController } = buildController({
          currentPage: pageWithNoTitle,
          components: pageWithNoTitle.components,
          definition: formDefinition1
        })
        pageController.showTitle = false
        expect(
          pageController.components[0].model.fieldset?.legend.classes
        ).toBe('govuk-fieldset__legend--l')
      })

      it('should be small if title is highlighted', () => {
        const { pageController } = buildController({
          currentPage: pageWithNoTitle,
          components: pageWithNoTitle.components,
          definition: formDefinition1
        })
        pageController.highlightTitle()

        expect(
          pageController.components[0].model.fieldset?.legend.classes
        ).toBe('govuk-fieldset__legend--m')
      })

      it('should be large if page heading is same as component title', () => {
        const { pageController } = buildController({
          currentPage: pageWithSameTitle,
          components: pageWithSameTitle.components,
          definition: formDefinition1
        })
        pageController.showTitle = true

        expect(pageController.components[0].model.label?.classes).toBe(
          'govuk-label--l'
        )
      })
    })

    it('should render if guidance is already there', () => {
      const { pageController } = buildController({
        currentPage: pageWithGuidance,
        definition: formDefinitionWithGuidance,
        components: pageWithGuidance.components
      })
      expect(pageController.components[0].model.content).toBe(
        '<p>This is some guidance</p>\n'
      )
    })

    it('should not render if guidance is removed', () => {
      const { pageController } = buildController({
        currentPage: pageWithGuidance,
        definition: formDefinitionWithGuidance,
        components: pageWithGuidance.components
      })
      pageController.guidanceText = ''
      expect(pageController.components[0]?.model?.label?.text).toBe(
        'Question title'
      )
    })

    it('should render if you change the guidance', () => {
      const newGuidance = 'This is some NEW guidance'
      const expectedGuidance = '<p>This is some NEW guidance</p>\n'
      const { pageController, pageRenderMock } = buildController({
        currentPage: pageWithGuidance,
        components: pageWithGuidance.components,
        definition: formDefinitionWithGuidance
      })
      pageController.highlightGuidance()
      pageController.guidanceText = newGuidance
      expect(pageController.guidanceText).toBe(newGuidance)
      expect(pageController.components[0].model.content).toBe(expectedGuidance)
      expect(pageController.components[0].model.classes).toBe('highlight')
      expect(pageController.guidance.classes).toBe('highlight')
      pageController.clearHighlight()
      expect(pageController.components[0].model.classes).toBe('')
      expect(pageController.guidance.classes).toBe('')
      expect(pageRenderMock).toHaveBeenCalledTimes(3)
    })

    it('should return an empty title should one not exist', () => {
      const pageController = new PreviewPageController(
        [textFieldComponent],
        new PagePreviewElements(buildQuestionPage({ title: '' })),
        buildDefinition({
          pages: [buildQuestionPage({ components: [textFieldComponent] })]
        }),
        renderer
      )

      expect(pageController.pageTitle).toEqual({
        text: '',
        classes: ''
      })
    })

    it('should hide title and guidance should addHeading be switched off', () => {
      const elements = new PagePreviewElementsWithHeading(
        pageWithGuidance,
        false
      )
      const { pageController } = buildController({
        currentPage: pageWithGuidance,
        definition: formDefinitionWithGuidance,
        components: pageWithGuidance.components,
        pageElementsInput: elements
      })

      expect(pageController.pageTitle).toEqual({
        text: '',
        classes: ''
      })
      expect(pageController.guidance).toEqual({
        text: '',
        classes: ''
      })
    })

    it('should show if title and first title are the same', () => {
      const sameTitle = 'Both have same title'
      const component = buildTextFieldComponent({
        title: sameTitle
      })
      const page1 = buildQuestionPage({
        title: sameTitle,
        components: [component]
      })
      const definition = buildDefinition({
        pages: [page1]
      })
      const { pageController } = buildController({
        components: page1.components,
        currentPage: page1,
        definition
      })
      expect(pageController.titleAndFirstTitleSame).toBe(true)
      expect(pageController.title).toBe('')
    })

    it('should toggle title and guidance should showTitle be set', () => {
      const elements = new PagePreviewElementsWithHeading(
        pageWithGuidance,
        false
      )
      const { pageController, pageRenderMock } = buildController({
        currentPage: pageWithGuidance,
        definition: formDefinitionWithGuidance,
        components: pageWithGuidance.components,
        pageElementsInput: elements
      })

      expect(pageController.showTitle).toBe(false)
      pageController.showTitle = true
      expect(pageController.showTitle).toBe(true)
      expect(pageController.title).toBe(pageTitle)
      pageController.showTitle = false
      expect(pageController.title).toBe('')
      expect(pageRenderMock).toHaveBeenCalledTimes(2)
    })

    it('should show title and guidance should addHeading be switched on', () => {
      const elements = new PagePreviewElementsWithHeading(
        buildQuestionPage({ title: '' }),
        true
      )
      const pageController = new PreviewPageController(
        [textFieldComponent],
        elements,
        buildDefinition({
          pages: [buildQuestionPage({ components: [textFieldComponent] })]
        }),
        renderer
      )
      expect(pageController.pageTitle).toEqual({
        text: 'Page heading',
        classes: ''
      })
      expect(pageController.guidance).toEqual({
        text: '',
        classes: ''
      })
    })

    it('should toggle multiple responses', () => {
      const elements = new PagePreviewElementsWithHeading(
        buildQuestionPage({ title: '' }),
        false
      )
      const page = buildQuestionPage({ components: [textFieldComponent] })
      const pageController = new PreviewPageController(
        page.components,
        elements,
        buildDefinition({
          pages: [page]
        }),
        renderer
      )
      expect(pageController.sectionTitle).toBeUndefined()
      expect(pageController.repeaterButton).toBeUndefined()
      pageController.setRepeater()
      expect(pageController.sectionTitle).toEqual({
        text: 'Question set name',
        classes: ''
      })
      expect(pageController.repeaterButton).toEqual({
        text: '[question set name]',
        classes: ''
      })
      pageController.sectionTitleText = 'Repeater question'
      expect(pageController.sectionTitleText).toBe('Repeater question 1')
      expect(pageController.repeaterButtonText).toBe('repeater question')
      pageController.unsetRepeater()
      expect(pageController.sectionTitleText).toBeUndefined()
      expect(pageController.repeaterButtonText).toBeUndefined()
      pageController.setRepeater()
      expect(pageController.sectionTitleText).toBe('Repeater question 1')
      expect(pageController.repeaterButtonText).toBe('repeater question')
      expect(pageRenderMock).toHaveBeenCalledTimes(4)
    })

    it('should highlight section title and repeater button', () => {
      const elements = new PagePreviewElementsWithHeading(
        buildQuestionPage({ title: '' }),
        false
      )
      const page = buildQuestionPage({ components: [textFieldComponent] })
      const pageController = new PreviewPageController(
        page.components,
        elements,
        buildDefinition({
          pages: [page]
        }),
        renderer
      )

      pageController.setRepeater()
      pageController.setHighLighted('repeater')
      expect(pageController.sectionTitle).toEqual({
        text: 'Question set name',
        classes: 'highlight'
      })
      expect(pageController.repeaterButton).toEqual({
        text: '[question set name]',
        classes: 'highlight'
      })
      pageController.sectionTitleText = 'Repeater question'
      pageController.clearHighlight()
      expect(pageController.sectionTitle).toEqual({
        text: 'Repeater question 1',
        classes: ''
      })
      expect(pageController.repeaterButton).toEqual({
        text: 'repeater question',
        classes: ''
      })
      pageController.unsetRepeater()
      expect(pageController.sectionTitleText).toBeUndefined()
      expect(pageController.repeaterButtonText).toBeUndefined()
      pageController.setRepeater()
      expect(pageController.sectionTitleText).toBe('Repeater question 1')
      expect(pageController.repeaterButtonText).toBe('repeater question')
      expect(pageRenderMock).toHaveBeenCalledTimes(6)
    })

    it('should show sectionTitle and repeaterButton given repeater page', () => {
      const component = buildTextFieldComponent({
        title: 'Text field question?'
      })
      const page = buildRepeaterPage({
        title: 'Repeater page',
        repeat: {
          options: {
            name: 'fawfed',
            title: 'Simple question responses'
          },
          schema: {
            min: 1,
            max: 3
          }
        },
        components: [component]
      })
      const definition = buildDefinition({
        pages: [page]
      })
      const elements = new PagePreviewElementsWithHeading(page, false)
      const pageController = new PreviewPageController(
        page.components,
        elements,
        definition,
        renderer
      )
      expect(pageController.sectionTitleText).toBe(
        'Simple question responses 1'
      )
      expect(pageController.repeaterButtonText).toBe(
        'simple question responses'
      )
      expect(pageController.isRepeater).toBe(true)
      pageController.sectionTitleText = ''
      expect(pageController.sectionTitleText).toBe('Question set name')
      expect(pageController.repeaterButtonText).toBe('[question set name]')
      pageController.sectionTitleText = 'a'
      expect(pageController.sectionTitleText).toBe('a 1')
      expect(pageController.repeaterButtonText).toBe('a')

      expect(pageRenderMock).toHaveBeenCalledTimes(2)
    })
  })
})

/**
 * @import { FormDefinition, Page } from '~/src/form/form-definition/types.js'
 * @import { ComponentDef } from '~/src/components/types.js'
 */
