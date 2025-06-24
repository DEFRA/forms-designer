import { PreviewPageController } from '@defra/forms-model'
import {
  buildDefinition,
  buildMarkdownComponent,
  buildQuestionPage,
  buildTextFieldComponent
} from '@defra/forms-model/stubs'

import { pageHeadingAndGuidanceHTML } from '~/src/javascripts/preview/__stubs__/page.js'
import { questionDetailsPreviewHTML } from '~/src/javascripts/preview/__stubs__/question'
import { setupPageController } from '~/src/javascripts/preview/page-controller/setup-page-controller.js'

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
jest.mock('~/src/views/preview-components/textarea.njk', () => '')
jest.mock('~/src/views/preview-components/radios.njk', () => '')
jest.mock('~/src/views/preview-components/selectfield.njk', () => '')
jest.mock('~/src/views/preview-components/checkboxesfield.njk', () => '')
jest.mock('~/src/views/preview-components/date-input.njk', () => '')
jest.mock('~/src/views/preview-components/monthyearfield.njk', () => '')
jest.mock('~/src/views/preview-components/fileuploadfield.njk', () => '')
jest.mock('~/src/views/page-preview-component/template.njk', () => '')
jest.mock('~/src/views/page-preview-component/macro.njk', () => '')
jest.mock('~/src/views/preview-controllers/page-controller.njk', () => '')
jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

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
  const page = buildQuestionPage({
    title: 'Page title',
    components
  })
  const definition = buildDefinition({
    pages: [page]
  })

  it('should setup', () => {
    document.body.innerHTML =
      pageHeadingAndGuidanceHTML + questionDetailsPreviewHTML

    const pageController = setupPageController(page, definition)
    expect(pageController).toBeInstanceOf(PreviewPageController)
  })
})
