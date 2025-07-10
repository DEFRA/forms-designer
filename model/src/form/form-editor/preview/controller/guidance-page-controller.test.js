import {
  GUIDANCE_PAGE_CONTENT,
  buildGuidancePage
} from '~/src/__stubs__/pages.js'
import { PageRendererStub } from '~/src/form/form-editor/__stubs__/preview.js'
import { GuidancePageController } from '~/src/form/form-editor/preview/controller/guidance-page-controller.js'
import { PagePreviewElements } from '~/src/form/form-editor/preview/controller/page-controller-base.js'

describe('guidance page controller', () => {
  const pageRenderMock = jest.fn()
  const renderer = new PageRendererStub(pageRenderMock)

  it('should show Page heading and guidance text when the page has not been saved', () => {
    const elements = new PagePreviewElements(undefined)
    const controller = new GuidancePageController(elements, renderer)
    expect(controller.title).toBe('Page heading')
    expect(controller.components[0].model).toEqual({
      classes: '',
      content: '<p>Guidance text</p>\n',
      id: 'markdown',
      name: 'markdown'
    })
    expect(controller.guidance).toEqual({
      classes: '',
      text: 'Guidance text'
    })
    expect(controller.guidanceText).toBe('Guidance text')
    expect(controller.components).toHaveLength(1)
    controller.highlightGuidance()
    expect(controller.guidance).toEqual({
      text: 'Guidance text',
      classes: 'highlight'
    })
    expect(controller.components).toEqual([
      {
        model: {
          classes: 'highlight',
          content: '<p>Guidance text</p>\n',
          id: 'markdown',
          name: 'markdown'
        },
        questionType: 'Markdown'
      }
    ])
    controller.guidanceText = 'Here is some guidance'
    expect(controller.guidance).toEqual({
      text: 'Here is some guidance',
      classes: 'highlight'
    })
    expect(controller.components).toEqual([
      {
        model: {
          classes: 'highlight',
          content: '<p>Here is some guidance</p>\n',
          id: 'markdown',
          name: 'markdown'
        },
        questionType: 'Markdown'
      }
    ])
  })

  it('should show Page heading and guidance when the page has been saved', () => {
    const elements = new PagePreviewElements(
      buildGuidancePage({
        title: 'Guidance page'
      })
    )
    const controller = new GuidancePageController(elements, renderer)
    expect(controller.guidance.text).toBe(GUIDANCE_PAGE_CONTENT)
    expect(controller.title).toBe('Guidance page')
    expect(controller.components[0]).toEqual({
      model: {
        classes: '',
        content: `<p>${GUIDANCE_PAGE_CONTENT}</p>\n`,
        id: 'markdown',
        name: 'markdown'
      },
      questionType: 'Markdown'
    })
  })
})
