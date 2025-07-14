import {
  buildList,
  buildListItem,
  buildRadiosComponent,
  buildSelectFieldComponent,
  buildTextFieldComponent
} from '~/src/__stubs__/components.js'
import { buildDefinition } from '~/src/__stubs__/form-definition.js'
import { buildQuestionPage } from '~/src/__stubs__/pages.js'
import { PageRendererStub } from '~/src/form/form-editor/__stubs__/preview.js'
import { PagePreviewElements } from '~/src/form/form-editor/preview/controller/page-controller-base.js'
import { ReorderQuestionsPageController } from '~/src/form/form-editor/preview/controller/reorder-questions-page-controller.js'

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
const formDefinition = buildDefinition({ pages: [page], lists: [list] })

const buildControllerWithNoComponents = ({
  currentPage = page,
  definition = formDefinition,
  components = /** @type {ComponentDef[]} */ ([])
} = {}) => {
  const pageRenderMock = jest.fn()
  const renderer = new PageRendererStub(pageRenderMock)
  const pageElements = new PagePreviewElements(currentPage)
  const pageController = new ReorderQuestionsPageController(
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

describe('reorder-questions-page-controller', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('ReorderQuestionsPageController', () => {
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
    const formDefinition = buildDefinition({ pages: [page], lists: [list] })

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
     *  pageController: ReorderQuestionsPageController
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
      const pageController = new ReorderQuestionsPageController(
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

    it('should reorder items', () => {
      const { pageController } = buildController()
      expect(pageController.components[0].questionType).toBe(
        textFieldComponent.type
      )
      expect(pageController.components[1].questionType).toBe(listComponent.type)
      expect(pageController.components[2].questionType).toBe(
        selectComponent.type
      )
      pageController.reorderComponents(
        'd46c9ba0-f5d6-47ab-aa6b-f60b64306e5f,407dd0d7-cce9-4f43-8e1f-7d89cb698875,34455d57-df37-4b69-a64f-6c3af0317ebe'
      )
      expect(pageController.components[0].questionType).toBe(
        selectComponent.type
      )
      expect(pageController.components[1].questionType).toBe(
        textFieldComponent.type
      )
      expect(pageController.components[2].questionType).toBe(listComponent.type)
    })

    it('should ignore reorder if no sort order of items', () => {
      const { pageController } = buildController()
      expect(pageController.components[0].questionType).toBe(
        textFieldComponent.type
      )
      expect(pageController.components[1].questionType).toBe(listComponent.type)
      expect(pageController.components[2].questionType).toBe(
        selectComponent.type
      )
      pageController.reorderComponents(undefined)
      expect(pageController.components[0].questionType).toBe(
        textFieldComponent.type
      )
      expect(pageController.components[1].questionType).toBe(listComponent.type)
      expect(pageController.components[2].questionType).toBe(
        selectComponent.type
      )
    })

    it('should ignore reorder if no components', () => {
      const { pageController } = buildControllerWithNoComponents()
      expect(pageController.components).toHaveLength(0)
      pageController.reorderComponents('some-id')
      expect(pageController.components).toHaveLength(0)
    })

    it('should highlight question', () => {
      const { pageController } = buildController()
      expect(pageController.components[0].questionType).toBe(
        textFieldComponent.type
      )
      expect(pageController.components[1].questionType).toBe(listComponent.type)
      expect(pageController.components[2].questionType).toBe(
        selectComponent.type
      )
      pageController.highlightQuestion('407dd0d7-cce9-4f43-8e1f-7d89cb698875')
      expect(pageController.components[0].model.classes).toBe('highlight')
      expect(pageController.components[1].model.classes).toBe('')
      expect(pageController.components[2].model.classes).toBe('')
    })
  })
})

/**
 * @import { FormDefinition, Page } from '~/src/form/form-definition/types.js'
 * @import { ComponentDef } from '~/src/components/types.js'
 */
