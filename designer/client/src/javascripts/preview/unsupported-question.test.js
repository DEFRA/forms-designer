import {
  questionDetailsLeftPanelHTML,
  questionDetailsPreviewHTML
} from '~/src/javascripts/preview/__stubs__/question'
import { SetupPreview } from '~/src/javascripts/setup-preview.js'

jest.mock('~/src/javascripts/preview/nunjucks-renderer.js')

describe('UnsupportedQuestion', () => {
  it('should create class', () => {
    document.body.innerHTML =
      questionDetailsLeftPanelHTML + questionDetailsPreviewHTML
    const res = SetupPreview('unsupported')
    expect(res).toBeDefined()
  })
})
