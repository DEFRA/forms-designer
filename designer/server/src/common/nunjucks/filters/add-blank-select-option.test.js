import { addBlankSelectOption } from '~/src/common/nunjucks/filters/add-blank-select-option.js'

describe('#addBlankSelectOption', () => {
  test('should add blank option', () => {
    const elem = {
      name: 'select',
      items: [{ id: '12345', text: 'Option 1', value: 'opt1' }]
    }
    expect(addBlankSelectOption(elem)).toEqual({
      name: 'select',
      items: [
        { id: '__0__', text: '', value: '' },
        { id: '12345', text: 'Option 1', value: 'opt1' }
      ]
    })
  })

  test('should ignore if already has blank option', () => {
    const elem = {
      name: 'select',
      items: [
        { id: '__0__', text: '', value: '' },
        { id: '12345', text: 'Option 1', value: 'opt1' }
      ]
    }
    expect(addBlankSelectOption(elem)).toEqual({
      name: 'select',
      items: [
        { id: '__0__', text: '', value: '' },
        { id: '12345', text: 'Option 1', value: 'opt1' }
      ]
    })
  })
})
