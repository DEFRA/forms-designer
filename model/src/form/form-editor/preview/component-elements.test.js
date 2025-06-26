import { buildTextFieldComponent } from '~/src/__stubs__/components.js'
import { ComponentElements } from '~/src/form/form-editor/preview/component-elements.js'

describe('component-elements', () => {
  it('should instantiate', () => {
    const elements = new ComponentElements(
      buildTextFieldComponent({ title: 'Component title' })
    )
    expect(elements.values.question).toBe('Component title')
  })

  it('should cover unhappy path', () => {
    const elements = new ComponentElements(buildTextFieldComponent())
    expect(() => elements.setPreviewDOM(new HTMLElement())).toThrow()
    expect(() => elements.setPreviewHTML('<p>test</p>')).toThrow()
  })
})
