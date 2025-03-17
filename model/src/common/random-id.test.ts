import { randomId } from '~/src/common/random-id.js'

describe('randomId', () => {
  test('should return 6 digit string', () => {
    const res = randomId()
    expect(res).toBeDefined()
    expect(res).toHaveLength(6)
  })
})
