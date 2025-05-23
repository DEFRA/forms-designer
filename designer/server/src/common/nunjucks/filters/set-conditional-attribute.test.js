import { setConditionalAttribute } from '~/src/common/nunjucks/filters/set-conditional-attribute.js'

describe('setConditionalAttribute', () => {
  const elem = {
    items: [
      { text: 'option1', value: 'value1' },
      { text: 'option2', value: 'value2' },
      { text: 'option3', value: 'value3' }
    ]
  }
  test('should ignore if value not found', () => {
    const html = '<p>Some html text</p>'
    const res = setConditionalAttribute(elem, 'not-found', html)
    expect(res).toEqual(elem)
  })

  test('should set conditional html on appropriate value', () => {
    const html = '<p>Some html text</p>'
    const res = setConditionalAttribute(elem, 'value2', html)
    expect(res).toEqual({
      items: [
        { text: 'option1', value: 'value1' },
        { text: 'option2', value: 'value2', conditional: { html } },
        { text: 'option3', value: 'value3' }
      ]
    })
  })
})
