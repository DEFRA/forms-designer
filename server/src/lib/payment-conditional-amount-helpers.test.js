import {
  findConditionalAmountById,
  formatConditionForTile,
  hydrateConditionalAmountsFromComponent,
  mergeConditionalAmountsIntoOptions,
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

describe('mergeConditionalAmountsIntoOptions', () => {
  /** @type {any} */
  const paymentDetails = (extra = {}) => ({
    type: 'PaymentField',
    options: { amount: 0, description: 'Fee' },
    ...extra
  })

  it('writes state.conditionalAmounts onto options for PaymentField, stripping ids', () => {
    const result = mergeConditionalAmountsIntoOptions(paymentDetails(), {
      conditionalAmounts: [
        { id: 'a1', amount: 300, condition: 'c1' },
        { id: 'a2', amount: 500, condition: 'c2' }
      ]
    })
    expect(result.options.conditionalAmounts).toEqual([
      { amount: 300, condition: 'c1' },
      { amount: 500, condition: 'c2' }
    ])
    expect(result.options.amount).toBe(0)
    expect(result.options.description).toBe('Fee')
  })

  it('writes an empty array when state has an explicit empty list (user removed everything)', () => {
    const result = mergeConditionalAmountsIntoOptions(paymentDetails(), {
      conditionalAmounts: []
    })
    expect(result.options.conditionalAmounts).toEqual([])
  })

  it('leaves questionDetails untouched when state.conditionalAmounts is undefined (fresh session / lost session)', () => {
    const input = paymentDetails()
    const result = mergeConditionalAmountsIntoOptions(input, {})
    expect(result).toBe(input)
  })

  it('leaves questionDetails untouched when state itself is undefined', () => {
    const input = paymentDetails()
    const result = mergeConditionalAmountsIntoOptions(input, undefined)
    expect(result).toBe(input)
  })

  it('is a no-op for non-PaymentField components', () => {
    const questionDetails = /** @type {any} */ ({
      type: 'TextField',
      options: { required: true }
    })
    const result = mergeConditionalAmountsIntoOptions(questionDetails, {
      conditionalAmounts: [{ id: 'a1', amount: 1, condition: 'c1' }]
    })
    expect(result).toBe(questionDetails)
  })

  it('writes empty array on existing options object when user emptied the list', () => {
    const questionDetails = paymentDetails({ options: { amount: 5 } })
    const result = mergeConditionalAmountsIntoOptions(questionDetails, {
      conditionalAmounts: []
    })
    expect(result.options.amount).toBe(5)
    expect(result.options.conditionalAmounts).toEqual([])
  })
})

describe('hydrateConditionalAmountsFromComponent', () => {
  /**
   * @param {Array<{ amount: number, condition: string }>} entries
   * @returns {any}
   */
  const paymentComponent = (entries) => ({
    type: 'PaymentField',
    options: {
      conditionalAmounts: entries
    }
  })

  it('seeds state.conditionalAmounts with stable ids when state has none', () => {
    const result = hydrateConditionalAmountsFromComponent(
      paymentComponent([
        { amount: 300, condition: 'c1' },
        { amount: 500, condition: 'c2' }
      ]),
      {}
    )
    expect(result.conditionalAmounts).toHaveLength(2)
    expect(result.conditionalAmounts?.[0]).toMatchObject({
      amount: 300,
      condition: 'c1'
    })
    expect(result.conditionalAmounts?.[0].id).toEqual(expect.any(String))
    expect((result.conditionalAmounts?.[0].id ?? '').length).toBeGreaterThan(0)
    expect(result.conditionalAmounts?.[1].id).not.toBe(
      result.conditionalAmounts?.[0].id
    )
  })

  it('does NOT re-hydrate if state.conditionalAmounts is already set (idempotent)', () => {
    const existing = [{ id: 'stable-1', amount: 999, condition: 'c-other' }]
    const result = hydrateConditionalAmountsFromComponent(
      paymentComponent([{ amount: 300, condition: 'c1' }]),
      { conditionalAmounts: existing }
    )
    expect(result.conditionalAmounts).toBe(existing)
  })

  it('does NOT re-hydrate if state.conditionalAmounts is an empty array (user emptied)', () => {
    const result = hydrateConditionalAmountsFromComponent(
      paymentComponent([{ amount: 5, condition: 'c1' }]),
      { conditionalAmounts: [] }
    )
    expect(result.conditionalAmounts).toEqual([])
  })

  it('seeds an empty array when component has no conditionalAmounts', () => {
    const result = hydrateConditionalAmountsFromComponent(
      /** @type {any} */ ({
        type: 'PaymentField',
        options: { amount: 5 }
      }),
      {}
    )
    expect(result.conditionalAmounts).toEqual([])
  })

  it('is a no-op for non-PaymentField components', () => {
    const result = hydrateConditionalAmountsFromComponent(
      /** @type {any} */ ({ type: 'TextField', options: {} }),
      {}
    )
    expect(result.conditionalAmounts).toBeUndefined()
  })

  it('handles undefined component (no component yet — questionId === "new")', () => {
    const result = hydrateConditionalAmountsFromComponent(undefined, {})
    expect(result.conditionalAmounts).toBeUndefined()
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
