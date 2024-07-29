import {
  ConditionType,
  ConditionValue,
  conditionValueFrom
} from '~/src/conditions/index.js'

describe('condition values', () => {
  test('can deserialize a Value object from plain old JSON', () => {
    const returned = conditionValueFrom({
      type: ConditionType.Value,
      value: 'badgers',
      display: 'Badgers'
    })

    expect(returned instanceof ConditionValue).toBe(true)
    expect(returned).toEqual(new ConditionValue('badgers', 'Badgers'))
  })

  test('can deserialize a RelativeDateValue object from plain old JSON', () => {
    const returned = conditionValueFrom({
      type: ConditionType.Value,
      value: 'badgers',
      display: 'Badgers'
    })

    expect(returned instanceof ConditionValue).toBe(true)
    expect(returned).toEqual(new ConditionValue('badgers', 'Badgers'))
  })
})
