import { buildCombinedId } from '~/src/form/form-editor/preview/utils.js'

describe('buildCombinedId', () => {
  it('should combine id and name', () => {
    expect(buildCombinedId('fieldName', 'some-id')).toBe('fieldName-some-id')
  })

  it('should handle undefined id', () => {
    expect(buildCombinedId('fieldName', undefined)).toBe('fieldName')
  })
})
