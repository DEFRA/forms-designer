import { ConditionValue, conditionValueFrom } from '..'

describe('inline condition values', () => {
  test('can deserialize a Value object from plain old JSON', () => {
    const value = {
      type: 'Value',
      value: 'badgers',
      display: 'Badgers'
    }
    const returned = conditionValueFrom(value)

    expect(returned instanceof ConditionValue).toBe(true)
    expect(returned).toEqual(new ConditionValue('badgers', 'Badgers'))
  })

  test('can deserialize a RelativeTimeValue object from plain old JSON', () => {
    const value = {
      type: 'Value',
      value: 'badgers',
      display: 'Badgers'
    }
    const returned = conditionValueFrom(value)

    expect(returned instanceof ConditionValue).toBe(true)
    expect(returned).toEqual(new ConditionValue('badgers', 'Badgers'))
  })
})
