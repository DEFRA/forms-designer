import { PageRendererStub } from '~/src/form/form-editor/__stubs__/preview.js'
import { GuidancePageController } from '~/src/form/form-editor/preview/controller/guidance-page-controller.js'
import { PagePreviewElements } from '~/src/form/form-editor/preview/controller/page-controller-base.js'

describe('test', () => {
  it('should pass', () => {
    describe('guidance page controller', () => {
      const pageRenderMock = jest.fn()
      const renderer = new PageRendererStub(pageRenderMock)
      const elements = new PagePreviewElements(undefined)

      it('should show Page heading', () => {
        const controller = new GuidancePageController(elements, renderer)
        expect(controller).toBeInstanceOf(GuidancePageController)
      })
    })
  })
})
