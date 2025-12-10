import {
  buildMultilineTextFieldComponent,
  buildTextFieldComponent
} from '~/src/__stubs__/components.js'
import { ComponentElements } from '~/src/form/form-editor/preview/component-elements.js'
import { MultilineTextFieldComponentPreviewElements } from '~/src/form/form-editor/preview/long-answer.js'

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

describe('MultilineTextFieldComponentPreviewElements', () => {
  it('should instantiate with default values', () => {
    const component = buildMultilineTextFieldComponent({
      title: 'Tell us more',
      hint: 'Provide details'
    })
    const elements = new MultilineTextFieldComponentPreviewElements(component)

    expect(elements.values).toEqual({
      content: '',
      hintText: 'Provide details',
      items: [],
      optional: false,
      question: 'Tell us more',
      shortDesc: '',
      userClasses: '',
      maxLength: 0,
      rows: 5
    })
  })

  it('should handle maxLength from schema.max', () => {
    const component = buildMultilineTextFieldComponent({
      title: 'Your answer',
      schema: {
        max: 500
      }
    })
    const elements = new MultilineTextFieldComponentPreviewElements(component)
    const values = /** @type {MultilineTextFieldSettings} */ (elements.values)

    expect(values.maxLength).toBe(500)
  })

  it('should handle rows from options.rows', () => {
    const component = buildMultilineTextFieldComponent({
      title: 'Your answer',
      options: {
        rows: 10
      }
    })
    const elements = new MultilineTextFieldComponentPreviewElements(component)
    const values = /** @type {MultilineTextFieldSettings} */ (elements.values)

    expect(values.rows).toBe(10)
  })

  it('should handle both maxLength and rows together', () => {
    const component = buildMultilineTextFieldComponent({
      title: 'Your answer',
      schema: {
        max: 200
      },
      options: {
        rows: 8
      }
    })
    const elements = new MultilineTextFieldComponentPreviewElements(component)
    const values = /** @type {MultilineTextFieldSettings} */ (elements.values)

    expect(values.maxLength).toBe(200)
    expect(values.rows).toBe(8)
  })

  it('should default maxLength to 0 when schema.max is undefined', () => {
    const component = buildMultilineTextFieldComponent({
      title: 'Your answer',
      schema: {}
    })
    const elements = new MultilineTextFieldComponentPreviewElements(component)
    const values = /** @type {MultilineTextFieldSettings} */ (elements.values)

    expect(values.maxLength).toBe(0)
  })

  it('should default rows to 5 when options.rows is undefined', () => {
    const component = buildMultilineTextFieldComponent({
      title: 'Your answer',
      options: {}
    })
    const elements = new MultilineTextFieldComponentPreviewElements(component)
    const values = /** @type {MultilineTextFieldSettings} */ (elements.values)

    expect(values.rows).toBe(5)
  })

  it('should handle maxLength of 0', () => {
    const component = buildMultilineTextFieldComponent({
      title: 'Your answer',
      schema: {
        max: 0
      }
    })
    const elements = new MultilineTextFieldComponentPreviewElements(component)
    const values = /** @type {MultilineTextFieldSettings} */ (elements.values)

    expect(values.maxLength).toBe(0)
  })

  it('should handle rows of 0', () => {
    const component = buildMultilineTextFieldComponent({
      title: 'Your answer',
      options: {
        rows: 0
      }
    })
    const elements = new MultilineTextFieldComponentPreviewElements(component)
    const values = /** @type {MultilineTextFieldSettings} */ (elements.values)

    expect(values.rows).toBe(0)
  })

  it('should inherit base question properties', () => {
    const component = buildMultilineTextFieldComponent({
      title: 'What is your feedback?',
      hint: 'Be specific',
      options: {
        required: false,
        optionalText: true,
        classes: 'custom-class',
        rows: 12
      },
      schema: {
        max: 1000
      }
    })
    const elements = new MultilineTextFieldComponentPreviewElements(component)
    const values = /** @type {MultilineTextFieldSettings} */ (elements.values)

    expect(values.question).toBe('What is your feedback?')
    expect(values.hintText).toBe('Be specific')
    expect(values.optional).toBe(true)
    expect(values.userClasses).toBe('custom-class')
    expect(values.maxLength).toBe(1000)
    expect(values.rows).toBe(12)
  })

  it('should handle large maxLength values', () => {
    const component = buildMultilineTextFieldComponent({
      title: 'Your essay',
      schema: {
        max: 10000
      },
      options: {
        rows: 20
      }
    })
    const elements = new MultilineTextFieldComponentPreviewElements(component)
    const values = /** @type {MultilineTextFieldSettings} */ (elements.values)

    expect(values.maxLength).toBe(10000)
    expect(values.rows).toBe(20)
  })

  it('should handle null schema.max', () => {
    const component = buildMultilineTextFieldComponent({
      title: 'Your answer',
      schema: {
        // @ts-expect-error error checking
        max: null
      }
    })
    const elements = new MultilineTextFieldComponentPreviewElements(component)
    const values = /** @type {MultilineTextFieldSettings} */ (elements.values)

    expect(values.maxLength).toBe(0)
  })

  it('should handle null options.rows', () => {
    const component = buildMultilineTextFieldComponent({
      title: 'Your answer',
      options: {
        // @ts-expect-error error checking
        rows: null
      }
    })
    const elements = new MultilineTextFieldComponentPreviewElements(component)
    const values = /** @type {MultilineTextFieldSettings} */ (elements.values)

    expect(values.rows).toBe(5)
  })

  it('should include all base properties with multiline-specific properties', () => {
    const component = buildMultilineTextFieldComponent({
      title: 'Question text',
      hint: 'Hint text',
      options: {
        rows: 7
      },
      schema: {
        max: 300
      }
    })
    const elements = new MultilineTextFieldComponentPreviewElements(component)
    const values = /** @type {MultilineTextFieldSettings} */ (elements.values)

    // Check base properties exist
    expect(values).toHaveProperty('question')
    expect(values).toHaveProperty('hintText')
    expect(values).toHaveProperty('optional')
    expect(values).toHaveProperty('shortDesc')
    expect(values).toHaveProperty('userClasses')
    expect(values).toHaveProperty('content')
    expect(values).toHaveProperty('items')

    // Check multiline-specific properties exist
    expect(values).toHaveProperty('maxLength')
    expect(values).toHaveProperty('rows')

    // Check correct values
    expect(values.maxLength).toBe(300)
    expect(values.rows).toBe(7)
  })
})

/** @import {MultilineTextFieldSettings} from './types.js' */
