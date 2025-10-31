import { merge } from '~/src/common/nunjucks/filters/merge.js'

describe('merge', () => {
  test('should merge', () => {
    const targetDict = { field1: 'val1' }
    const sourceDict = { field2: 'val2' }
    const res = merge(targetDict, sourceDict)
    expect(res).toEqual({
      field1: 'val1',
      field2: 'val2'
    })
  })

  test('should handle bad source object', () => {
    const targetDict = { field1: 'val1' }
    // @ts-expect-error - invalid type
    expect(merge(targetDict, 'bad')).toEqual({
      field1: 'val1'
    })
  })

  test('should handle bad target object', () => {
    // @ts-expect-error - invalid type
    expect(merge('bad1', 'bad2')).toBe('bad1')
  })
})
