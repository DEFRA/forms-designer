import {
  findConditionalAmountById,
  formatConditionForTile,
  removeConditionalAmountById,
  setConditionalAmountEditState,
  upsertConditionalAmount
} from '~/src/lib/payment-conditional-amount-helpers.js'

/**
 * @param {string} id
 * @param {number} amount
 * @param {string} condition
 */
const item = (id, amount, condition) => ({ id, amount, condition })

describe('findConditionalAmountById', () => {
  it('returns the matching item', () => {
    const items = [item('a', 1, 'c1'), item('b', 2, 'c2')]
    expect(findConditionalAmountById(items, 'b')).toEqual(item('b', 2, 'c2'))
  })

  it('returns undefined for unknown id', () => {
    expect(
      findConditionalAmountById([item('a', 1, 'c1')], 'missing')
    ).toBeUndefined()
  })

  it('handles undefined input', () => {
    expect(findConditionalAmountById(undefined, 'a')).toBeUndefined()
  })

  it('handles empty input', () => {
    expect(findConditionalAmountById([], 'a')).toBeUndefined()
  })
})

describe('removeConditionalAmountById', () => {
  it('removes the matching item, preserving order', () => {
    const items = [item('a', 1, 'c1'), item('b', 2, 'c2'), item('c', 3, 'c3')]
    expect(removeConditionalAmountById(items, 'b')).toEqual([
      item('a', 1, 'c1'),
      item('c', 3, 'c3')
    ])
  })

  it('returns a new array (no mutation)', () => {
    const items = [item('a', 1, 'c1')]
    const out = removeConditionalAmountById(items, 'a')
    expect(out).not.toBe(items)
    expect(items).toHaveLength(1)
  })

  it('is a no-op for unknown id', () => {
    const items = [item('a', 1, 'c1')]
    expect(removeConditionalAmountById(items, 'missing')).toEqual(items)
  })
})

describe('upsertConditionalAmount', () => {
  it('appends when id is not in the list', () => {
    const items = [item('a', 1, 'c1')]
    const out = upsertConditionalAmount(items, item('b', 2, 'c2'))
    expect(out).toEqual([item('a', 1, 'c1'), item('b', 2, 'c2')])
  })

  it('replaces in-place when id matches, preserving position', () => {
    const items = [item('a', 1, 'c1'), item('b', 2, 'c2'), item('c', 3, 'c3')]
    const out = upsertConditionalAmount(items, item('b', 99, 'c-new'))
    expect(out).toEqual([
      item('a', 1, 'c1'),
      item('b', 99, 'c-new'),
      item('c', 3, 'c3')
    ])
  })

  it('does not mutate the input array', () => {
    const items = [item('a', 1, 'c1')]
    const out = upsertConditionalAmount(items, item('b', 2, 'c2'))
    expect(out).not.toBe(items)
    expect(items).toEqual([item('a', 1, 'c1')])
  })
})

describe('setConditionalAmountEditState', () => {
  it('builds expanded edit row from existing item', () => {
    expect(setConditionalAmountEditState(item('a', 5, 'c1'), true)).toEqual({
      expanded: true,
      id: 'a',
      amount: 5,
      condition: 'c1'
    })
  })

  it('builds collapsed empty edit row when no item passed', () => {
    expect(setConditionalAmountEditState(undefined, false)).toEqual({
      expanded: false,
      id: '',
      amount: '',
      condition: ''
    })
  })

  it('builds expanded empty edit row for the Add flow', () => {
    expect(setConditionalAmountEditState(undefined, true)).toEqual({
      expanded: true,
      id: '',
      amount: '',
      condition: ''
    })
  })
})

describe('formatConditionForTile', () => {
  it('returns displayName + readable expression when condition is found', () => {
    const conditions = [
      {
        id: 'c1',
        displayName: 'IsFarmer',
        expression: "'Are you a farmer?' is 'yes'"
      }
    ]
    expect(formatConditionForTile('c1', conditions)).toEqual({
      displayName: 'IsFarmer',
      expression: "'Are you a farmer?' is 'yes'"
    })
  })

  it('falls back to id and empty expression when condition is missing', () => {
    expect(formatConditionForTile('c-missing', [])).toEqual({
      displayName: 'c-missing',
      expression: ''
    })
  })

  it('handles a condition without an expression (defensive)', () => {
    const conditions = [{ id: 'c1', displayName: 'IsFarmer' }]
    expect(formatConditionForTile('c1', conditions)).toEqual({
      displayName: 'IsFarmer',
      expression: ''
    })
  })
})
