import { setProperty } from '~/src/utils/set-property.js'

describe('setProperty', () => {
  test('should ignore if object undefined', () => {
    const obj = undefined
    const res = setProperty(obj, 'name', 'value')
    expect(res).toEqual(obj)
  })

  test('should set property on object', () => {
    const obj = { prop1: 'val1' }
    const res = setProperty(obj, 'prop2', 'val2')
    expect(res).toEqual({
      prop1: 'val1',
      prop2: 'val2'
    })
  })
})
