import {
  GuidancePageController,
  PreviewPageController,
  ReorderQuestionsPageController,
  SummaryPageController
} from '@defra/forms-model'
import {
  buildAutoCompleteComponent,
  buildDefinition,
  buildList,
  buildListItem,
  buildMarkdownComponent,
  buildQuestionPage,
  buildSummaryPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import {
  pageHeadingAndGuidanceHTML,
  summaryPageHTML
} from '~/src/javascripts/preview/__stubs__/page.js'
import { questionDetailsPreviewHTML } from '~/src/javascripts/preview/__stubs__/question'
import { getPageAndDefinition } from '~/src/javascripts/preview/page-controller/get-page-details.js'
import {
  setupGuidanceController,
  setupPageController,
  setupReorderQuestionsController,
  setupSummaryPageController
} from '~/src/javascripts/preview/page-controller/setup-page-controller.js'

jest.mock('~/src/javascripts/preview/nunjucks.js')
jest.mock('~/src/views/preview-components/checkboxesfield.njk', () => '')
jest.mock('~/src/views/preview-components/autocompletefield.njk', () => '')
jest.mock('~/src/views/preview-components/ukaddressfield.njk', () => '')
jest.mock('~/src/views/preview-components/markdown.njk', () => '')
jest.mock('~/src/views/preview-components/selectfield.njk', () => '')
jest.mock('~/src/views/preview-components/telephonenumberfield.njk', () => '')
jest.mock('~/src/views/preview-components/emailaddressfield.njk', () => '')
jest.mock('~/src/views/preview-components/inset.njk', () => '')
jest.mock('~/src/views/preview-components/textfield.njk', () => '')
jest.mock('~/src/views/preview-components/numberfield.njk', () => '')
jest.mock('~/src/views/preview-components/yesnofield.njk', () => '')
jest.mock('~/src/views/preview-components/textarea.njk', () => '')
jest.mock('~/src/views/preview-components/multilinetextfield.njk', () => '')
jest.mock('~/src/views/preview-components/radios.njk', () => '')
jest.mock('~/src/views/preview-components/radiosfield.njk', () => '')
jest.mock('~/src/views/preview-components/selectfield.njk', () => '')
jest.mock('~/src/views/preview-components/checkboxesfield.njk', () => '')
jest.mock('~/src/views/preview-components/date-input.njk', () => '')
jest.mock('~/src/views/preview-components/datepartsfield.njk', () => '')
jest.mock('~/src/views/preview-components/monthyearfield.njk', () => '')
jest.mock('~/src/views/preview-components/fileuploadfield.njk', () => '')
jest.mock('~/src/views/page-preview-component/template.njk', () => '')
jest.mock('~/src/views/page-preview-component/macro.njk', () => '')
jest.mock('~/src/views/preview-controllers/page-controller.njk', () => '')
jest.mock('~/src/views/preview-controllers/summary-controller.njk', () => '')
jest.mock('~/src/views/summary-preview-component/template.njk', () => '')
jest.mock('~/src/views/summary-preview-component/macro.njk', () => '')
jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')
jest.mock('~/src/javascripts/preview/page-controller/get-page-details.js')

describe('setup-page-controller', () => {
  const components = [
    buildTextFieldComponent(),
    buildTextFieldComponent({
      id: '756286fc-ee67-470c-b62c-d4638eb8df35',
      name: 'abcadf',
      title: 'question 2'
    }),
    buildMarkdownComponent()
  ]
  const pageId = 'ff2c6c10-f49b-44e4-bc70-5c85eb5a006a'
  const definitionId = 'a6060751-3b61-4cf9-ae94-76e15c89eacc'
  const page = buildQuestionPage({
    id: pageId,
    title: 'Page title',
    components
  })
  const definition = buildDefinition({
    pages: [page]
  })

  describe('setupPageController', () => {
    jest.mocked(getPageAndDefinition).mockResolvedValue({
      definition,
      page
    })
    it('should setup', async () => {
      document.body.innerHTML =
        pageHeadingAndGuidanceHTML + questionDetailsPreviewHTML

      const pageController = await setupPageController(pageId, definitionId)
      expect(pageController).toBeInstanceOf(PreviewPageController)
    })

    it('should handle pages without components', async () => {
      document.body.innerHTML = '<p>missing content</p>'

      const page2 = buildSummaryPage({ id: pageId, title: 'Summary page' })
      const definition2 = buildDefinition({ pages: [page2] })
      jest.mocked(getPageAndDefinition).mockResolvedValue({
        definition: definition2,
        page: page2
      })
      const pageController = await setupPageController(pageId, definitionId)
      expect(pageController).toBeInstanceOf(PreviewPageController)
      expect(pageController.title).toBe('')
    })

    it('should handle autocomplete components', async () => {
      document.body.innerHTML =
        pageHeadingAndGuidanceHTML + questionDetailsPreviewHTML
      const listId = 'feaa6e19-414d-4633-9c8c-1135bc84f1f2'
      const list = buildList({
        id: listId,
        items: [
          buildListItem({
            text: 'Item 1'
          }),
          buildListItem({
            text: 'Item 2'
          })
        ]
      })
      const autocompleteComponent = buildAutoCompleteComponent({
        list: listId
      })
      const page2 = buildQuestionPage({
        id: pageId,
        components: [autocompleteComponent]
      })
      const definition2 = buildDefinition({
        pages: [page],
        lists: [list]
      })
      jest.mocked(getPageAndDefinition).mockResolvedValue({
        definition: definition2,
        page: page2
      })
      const pageController = await setupPageController(pageId, definitionId)
      expect(pageController.components[1].model.attributes).toEqual({
        'data-module': 'govuk-accessible-autocomplete'
      })
    })

    it('should fail if definition does not exist', async () => {
      jest.mocked(getPageAndDefinition).mockResolvedValue({
        definition: undefined,
        page: undefined
      })
      await expect(setupPageController(pageId, definitionId)).rejects.toThrow(
        new Error(`Page not found with id ff2c6c10-f49b-44e4-bc70-5c85eb5a006a`)
      )
    })
  })

  describe('setupGuidanceController', () => {
    it('should setup', () => {
      document.body.innerHTML =
        pageHeadingAndGuidanceHTML + questionDetailsPreviewHTML
      const guidancePage = setupGuidanceController()

      expect(guidancePage).toBeInstanceOf(GuidancePageController)
      expect(guidancePage.title).toBe('Where do you live?')
    })
  })

  describe('setupReorderQuestionsController', () => {
    it('should setup', async () => {
      document.body.innerHTML =
        pageHeadingAndGuidanceHTML + questionDetailsPreviewHTML
      jest.mocked(getPageAndDefinition).mockResolvedValue({
        definition,
        page
      })
      const reorderPage = await setupReorderQuestionsController(
        pageId,
        definitionId
      )

      expect(reorderPage).toBeInstanceOf(ReorderQuestionsPageController)
      expect(reorderPage.title).toBe('Where do you live?')
    })
  })

  describe('setupSummaryPageController', () => {
    it('should setup', async () => {
      const page = buildSummaryPage({
        id: pageId,
        components: []
      })
      const formDefinition = buildDefinition({
        pages: [page]
      })
      document.body.innerHTML =
        summaryPageHTML(false, '') + questionDetailsPreviewHTML
      jest.mocked(getPageAndDefinition).mockResolvedValue({
        definition: formDefinition,
        page: undefined
      })
      const summaryPage = await setupSummaryPageController(definitionId)
      expect(summaryPage).toBeInstanceOf(SummaryPageController)
      expect(summaryPage.declarationText).toBe('')
      expect(summaryPage.declaration).toEqual({
        text: '',
        classes: ''
      })
    })
  })
})
