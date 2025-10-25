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

  it('should handle user-supplied classes - nothing passed here', () => {
    const elements = new ComponentElements(buildTextFieldComponent())
    expect(() => elements.setPreviewDOM(new HTMLElement())).toThrow()
    expect(() => elements.setPreviewHTML('<p>test</p>')).toThrow()
    const values = elements.values
    expect(values).toEqual({
      content: '',
      hintText: '',
      items: [],
      optional: false,
      question: 'Text field',
      shortDesc: '',
      userClasses: ''
    })
  })

  it('should handle user-supplied classes - value passed', () => {
    const elements = new ComponentElements(
      buildTextFieldComponent({
        options: {
          classes: 'my-special-class'
        }
      })
    )
    const values = elements.values
    expect(values).toEqual({
      content: '',
      hintText: '',
      items: [],
      optional: false,
      question: 'Text field',
      shortDesc: '',
      userClasses: 'my-special-class'
    })
  })

  it('should handle user-supplied classes - value missing', () => {
    const elements = new ComponentElements(
      buildTextFieldComponent({
        options: {
          classes: undefined
        }
      })
    )
    const values = elements.values
    expect(values).toEqual({
      content: '',
      hintText: '',
      items: [],
      optional: false,
      question: 'Text field',
      shortDesc: '',
      userClasses: ''
    })
  })
})
