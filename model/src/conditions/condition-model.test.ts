import { ComponentType } from '~/src/components/enums.js'
import {
  Condition,
  ConditionField,
  ConditionGroupDef,
  ConditionRef,
  ConditionType,
  ConditionValue,
  ConditionsModel,
  Coordinator,
  DateDirections,
  DateUnits,
  Operator,
  OperatorName,
  RelativeDateValue
} from '~/src/conditions/index.js'
import { type ConditionsModelData } from '~/src/conditions/types.js'

describe('condition model', () => {
  let underTest: ConditionsModel

  beforeEach(() => {
    underTest = new ConditionsModel()
  })

  describe('before adding the first condition', () => {
    test('should return an empty array', () => {
      expect(underTest.asPerUserGroupings).toEqual([])
    })

    test('should return an empty presentation string', () => {
      expect(underTest.toPresentationString()).toBe('')
      expect(underTest.toPresentationHtml()).toBe('')
    })

    test('should not have conditions', () => {
      expect(underTest.hasConditions).toBe(false)
    })
  })

  describe('adding the first condition', () => {
    beforeEach(() => {
      underTest.add(
        new Condition(
          new ConditionField('badger', ComponentType.TextField, 'Badger'),
          OperatorName.Is,
          new ConditionValue('Monkeys')
        )
      )
    })

    test('should have one item in the model', () => {
      expect(underTest.asPerUserGroupings).toEqual([
        {
          coordinator: undefined,
          field: {
            name: 'badger',
            type: ComponentType.TextField,
            display: 'Badger'
          },
          operator: OperatorName.Is,
          value: {
            type: ConditionType.Value,
            value: 'Monkeys',
            display: 'Monkeys'
          }
        }
      ])
    })

    test('should return a human readable presentation string', () => {
      expect(underTest.toPresentationString()).toBe("'Badger' is 'Monkeys'")
      expect(underTest.toPresentationHtml()).toBe("'Badger' is 'Monkeys'")
    })

    test('should return a valid expression string', () => {
      expect(underTest.toExpression()).toBe("badger == 'Monkeys'")
    })

    test('should have conditions', () => {
      expect(underTest.hasConditions).toBe(true)
    })
  })

  describe('multiple conditions with a simple and', () => {
    beforeEach(() => {
      underTest.add(
        new Condition(
          new ConditionField('badger', ComponentType.TextField, 'Badger'),
          OperatorName.Is,
          new ConditionValue('Monkeys')
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('monkeys', ComponentType.TextField, 'Monkeys'),
          OperatorName.IsNot,
          new ConditionValue('Giraffes'),
          Coordinator.AND
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.IsNot,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
    })

    test('should have three items in the model', () => {
      expect(underTest.asPerUserGroupings).toEqual([
        {
          coordinator: undefined,
          field: {
            display: 'Badger',
            type: ComponentType.TextField,
            name: 'badger'
          },
          operator: OperatorName.Is,
          value: {
            type: ConditionType.Value,
            value: 'Monkeys',
            display: 'Monkeys'
          }
        },
        {
          coordinator: Coordinator.AND,
          field: {
            display: 'Monkeys',
            type: ComponentType.TextField,
            name: 'monkeys'
          },
          operator: OperatorName.IsNot,
          value: {
            type: ConditionType.Value,
            value: 'Giraffes',
            display: 'Giraffes'
          }
        },
        {
          coordinator: Coordinator.AND,
          field: {
            display: 'Squiffy',
            type: ComponentType.TextField,
            name: 'squiffy'
          },
          operator: OperatorName.IsNot,
          value: {
            type: ConditionType.Value,
            value: 'Donkeys',
            display: 'Donkeys'
          }
        }
      ])
    })

    test('should return a human readable presentation string with all properties', () => {
      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Monkeys' and 'Monkeys' is not 'Giraffes' and 'Squiffy' is not 'Donkeys'"
      )
      expect(underTest.toPresentationHtml()).toBe(
        "'Badger' is 'Monkeys' <span class=\"govuk-!-font-weight-bold\">AND</span> 'Monkeys' is not 'Giraffes' <span class=\"govuk-!-font-weight-bold\">AND</span> 'Squiffy' is not 'Donkeys'"
      )
    })

    test('should return a valid expression', () => {
      expect(underTest.toExpression()).toBe(
        "badger == 'Monkeys' and monkeys != 'Giraffes' and squiffy != 'Donkeys'"
      )
    })

    test('should have conditions', () => {
      expect(underTest.hasConditions).toBe(true)
    })
  })

  describe('multiple conditions with a simple or', () => {
    beforeEach(() => {
      underTest.add(
        new Condition(
          new ConditionField('badger', ComponentType.TextField, 'Badger'),
          OperatorName.Is,
          new ConditionValue('Monkeys')
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('monkeys', ComponentType.TextField, 'Monkeys'),
          OperatorName.IsNot,
          new ConditionValue('Giraffes'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.IsNot,
          new ConditionValue('Donkeys'),
          Coordinator.OR
        )
      )
    })

    test('should have three items in the model', () => {
      expect(underTest.asPerUserGroupings).toEqual([
        {
          coordinator: undefined,
          field: {
            display: 'Badger',
            type: ComponentType.TextField,
            name: 'badger'
          },
          operator: OperatorName.Is,
          value: {
            type: ConditionType.Value,
            value: 'Monkeys',
            display: 'Monkeys'
          }
        },
        {
          coordinator: Coordinator.OR,
          field: {
            display: 'Monkeys',
            type: ComponentType.TextField,
            name: 'monkeys'
          },
          operator: OperatorName.IsNot,
          value: {
            type: ConditionType.Value,
            value: 'Giraffes',
            display: 'Giraffes'
          }
        },
        {
          coordinator: Coordinator.OR,
          field: {
            display: 'Squiffy',
            type: ComponentType.TextField,
            name: 'squiffy'
          },
          operator: OperatorName.IsNot,
          value: {
            type: ConditionType.Value,
            value: 'Donkeys',
            display: 'Donkeys'
          }
        }
      ])
    })

    test('should return a human readable presentation string with all properties', () => {
      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Monkeys' or 'Monkeys' is not 'Giraffes' or 'Squiffy' is not 'Donkeys'"
      )
      expect(underTest.toPresentationHtml()).toBe(
        "'Badger' is 'Monkeys' <span class=\"govuk-!-font-weight-bold\">OR</span> 'Monkeys' is not 'Giraffes' <span class=\"govuk-!-font-weight-bold\">OR</span> 'Squiffy' is not 'Donkeys'"
      )
    })

    test('should return a valid expression', () => {
      expect(underTest.toExpression()).toBe(
        "badger == 'Monkeys' or monkeys != 'Giraffes' or squiffy != 'Donkeys'"
      )
    })
  })

  describe('or followed by and', () => {
    test('should return a human readable presentation string with all properties', () => {
      underTest.add(
        new Condition(
          new ConditionField('badger', ComponentType.TextField, 'Badger'),
          OperatorName.Is,
          new ConditionValue('Zebras')
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('monkeys', ComponentType.TextField, 'Monkeys'),
          OperatorName.Is,
          new ConditionValue('Giraffes'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.IsNot,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Zebras' or ('Monkeys' is 'Giraffes' and 'Squiffy' is not 'Donkeys')"
      )
      expect(underTest.toExpression()).toBe(
        "badger == 'Zebras' or (monkeys == 'Giraffes' and squiffy != 'Donkeys')"
      )
    })
  })

  describe('and followed by or', () => {
    test('should return a human readable presentation string with all properties', () => {
      underTest.add(
        new Condition(
          new ConditionField('badger', ComponentType.TextField, 'Badger'),
          OperatorName.Is,
          new ConditionValue('Zebras')
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.IsNot,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('monkeys', ComponentType.TextField, 'Monkeys'),
          OperatorName.Is,
          new ConditionValue('Giraffes'),
          Coordinator.OR
        )
      )
      expect(underTest.toPresentationString()).toBe(
        "('Badger' is 'Zebras' and 'Squiffy' is not 'Donkeys') or 'Monkeys' is 'Giraffes'"
      )
      expect(underTest.toExpression()).toBe(
        "(badger == 'Zebras' and squiffy != 'Donkeys') or monkeys == 'Giraffes'"
      )
    })
  })

  describe('complicated conditions', () => {
    beforeEach(() => {
      underTest.add(
        new Condition(
          new ConditionField('badger', ComponentType.TextField, 'Badger'),
          OperatorName.Is,
          new ConditionValue('Zebras')
        )
      )
      underTest.add(new ConditionRef('under18', 'Under 18', Coordinator.OR))
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.Is,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('duration', ComponentType.NumberField, 'Duration'),
          OperatorName.IsAtLeast,
          new ConditionValue('10'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField(
            'birthday',
            ComponentType.DatePartsField,
            'Birthday'
          ),
          OperatorName.IsAtLeast,
          new RelativeDateValue('10', DateUnits.DAYS, DateDirections.PAST),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.IsNot,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
    })

    test('should return a human readable presentation string with all properties', () => {
      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Zebras' or ('Under 18' and 'Squiffy' is 'Donkeys') or 'Duration' is at least '10' or ('Birthday' is at least '10 days in the past' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('should return a valid expression', () => {
      expect(underTest.toExpression()).toBe(
        "badger == 'Zebras' or (under18 and squiffy == 'Donkeys') or duration >= 10 or (birthday <= dateForComparison(-10, 'days') and squiffy != 'Donkeys')"
      )
    })
  })

  describe('YesNoField', () => {
    beforeEach(() => {
      underTest.add(
        new Condition(
          new ConditionField('badger', ComponentType.YesNoField, 'Badger'),
          OperatorName.Is,
          new ConditionValue('true')
        )
      )
    })

    test('should return a valid expression with unquoted value', () => {
      expect(underTest.toExpression()).toBe('badger == true')
    })
  })

  describe('DatePartsField', () => {
    it.each([
      {
        operatorName: OperatorName.Is,
        operator: Operator.Is
      },
      {
        operatorName: OperatorName.IsNot,
        operator: Operator.IsNot
      },
      {
        operatorName: OperatorName.IsBefore,
        operator: Operator.IsLessThan
      },
      {
        operatorName: OperatorName.IsAfter,
        operator: Operator.IsMoreThan
      }
    ])(
      `should return an absolute date expression for '$operatorName' operator`,
      ({ operatorName, operator }) => {
        const type = ComponentType.DatePartsField
        const field = new ConditionField('launchDate', type, 'Launch date')
        const value = new ConditionValue('2024-06-25')

        underTest.add(new Condition(field, operatorName, value))
        expect(underTest.toExpression()).toBe(
          `launchDate ${operator} '2024-06-25'`
        )
      }
    )

    it.each([
      {
        direction: DateDirections.FUTURE,
        operatorName: OperatorName.IsAtLeast,
        operator: Operator.IsAtLeast
      },
      {
        direction: DateDirections.PAST,
        operatorName: OperatorName.IsAtLeast,
        operator: Operator.IsAtMost // Reversed in past
      },
      {
        direction: DateDirections.FUTURE,
        operatorName: OperatorName.IsAtMost,
        operator: Operator.IsAtMost
      },
      {
        direction: DateDirections.PAST,
        operatorName: OperatorName.IsAtMost,
        operator: Operator.IsAtLeast // Reversed in past
      },
      {
        direction: DateDirections.FUTURE,
        operatorName: OperatorName.IsLessThan,
        operator: Operator.IsLessThan
      },
      {
        direction: DateDirections.PAST,
        operatorName: OperatorName.IsLessThan,
        operator: Operator.IsMoreThan // Reversed in past
      },
      {
        direction: DateDirections.FUTURE,
        operatorName: OperatorName.IsMoreThan,
        operator: Operator.IsMoreThan
      },
      {
        direction: DateDirections.PAST,
        operatorName: OperatorName.IsMoreThan,
        operator: Operator.IsLessThan // Reversed in past
      }
    ])(
      `should return a relative date expression for '$operatorName' operator`,
      ({ direction, operatorName, operator }) => {
        const type = ComponentType.DatePartsField
        const field = new ConditionField('launchDate', type, 'Launch date')
        const value = new RelativeDateValue('10', DateUnits.DAYS, direction)

        underTest.add(new Condition(field, operatorName, value))
        expect(underTest.toExpression()).toBe(
          `launchDate ${operator} dateForComparison(${direction === DateDirections.PAST ? '-10' : '10'}, 'days')`
        )
      }
    )
  })

  describe('replacing conditions', () => {
    beforeEach(() => {
      underTest.add(
        new Condition(
          new ConditionField('badger', ComponentType.TextField, 'Badger'),
          OperatorName.Is,
          new ConditionValue('Monkeys')
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('monkeys', ComponentType.TextField, 'Monkeys'),
          OperatorName.IsNot,
          new ConditionValue('Giraffes'),
          Coordinator.AND
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.IsNot,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
    })

    test('should replace first condition without coordinator', () => {
      underTest.replace(
        0,
        new Condition(
          new ConditionField('badger', ComponentType.TextField, 'Badger'),
          OperatorName.Is,
          new ConditionValue('Giraffes')
        )
      )
      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Giraffes' and 'Monkeys' is not 'Giraffes' and 'Squiffy' is not 'Donkeys'"
      )
    })

    test('should replace subsequent condition with coordinator', () => {
      underTest.replace(
        2,
        new Condition(
          new ConditionField('badger', ComponentType.TextField, 'Badger'),
          OperatorName.Is,
          new ConditionValue('Giraffes'),
          Coordinator.AND
        )
      )
      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Monkeys' and 'Monkeys' is not 'Giraffes' and 'Badger' is 'Giraffes'"
      )
    })

    test('should not replace first condition with coordinator', () => {
      expect(() =>
        underTest.replace(
          0,
          new Condition(
            new ConditionField('badger', ComponentType.TextField, 'Badger'),
            OperatorName.Is,
            new ConditionValue('Giraffes'),
            Coordinator.AND
          )
        )
      ).toThrow(Error)
    })

    test('should not replace condition for index equal to conditions length', () => {
      expect(() =>
        underTest.replace(
          3,
          new Condition(
            new ConditionField('badger', ComponentType.TextField, 'Badger'),
            OperatorName.Is,
            new ConditionValue('Giraffes'),
            Coordinator.AND
          )
        )
      ).toThrow(Error)
    })

    test('should not replace condition for index greater than conditions length', () => {
      expect(() =>
        underTest.replace(
          4,
          new Condition(
            new ConditionField('badger', ComponentType.TextField, 'Badger'),
            OperatorName.Is,
            new ConditionValue('Giraffes'),
            Coordinator.AND
          )
        )
      ).toThrow(Error)
    })

    test('should not replace subsequent condition without coordinator', () => {
      expect(() =>
        underTest.replace(
          2,
          new Condition(
            new ConditionField('badger', ComponentType.TextField, 'Badger'),
            OperatorName.Is,
            new ConditionValue('Giraffes')
          )
        )
      ).toThrow(Error)
    })
  })

  describe('adding user generated groups', () => {
    beforeEach(() => {
      underTest.add(
        new Condition(
          new ConditionField('badger', ComponentType.TextField, 'Badger'),
          OperatorName.Is,
          new ConditionValue('Zebras')
        )
      )
      underTest.add(new ConditionRef('under18', 'Under 18', Coordinator.OR))
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.Is,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('duration', ComponentType.NumberField, 'Duration'),
          OperatorName.IsAtLeast,
          new ConditionValue('10'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField(
            'birthday',
            ComponentType.DatePartsField,
            'Birthday'
          ),
          OperatorName.Is,
          new ConditionValue('10/10/2019'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.IsNot,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
    })

    test('should apply defined group and auto-group the remaining conditions', () => {
      underTest.addGroups([new ConditionGroupDef(0, 1)])
      expect(underTest.toPresentationString()).toBe(
        "(('Badger' is 'Zebras' or 'Under 18') and 'Squiffy' is 'Donkeys') or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('should be able to apply group with single and condition and not need to clarify', () => {
      underTest.addGroups([new ConditionGroupDef(1, 2)])
      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Zebras' or ('Under 18' and 'Squiffy' is 'Donkeys') or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('should correctly auto-group multiple user groups together', () => {
      underTest.addGroups([
        new ConditionGroupDef(0, 1),
        new ConditionGroupDef(2, 3)
      ])
      expect(underTest.toPresentationString()).toBe(
        "(('Badger' is 'Zebras' or 'Under 18') and ('Squiffy' is 'Donkeys' or 'Duration' is at least '10')) or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('should correctly handle trailing and condition with existing groups', () => {
      underTest.addGroups([
        new ConditionGroupDef(0, 1),
        new ConditionGroupDef(2, 4)
      ])
      expect(underTest.toPresentationString()).toBe(
        "('Badger' is 'Zebras' or 'Under 18') and ('Squiffy' is 'Donkeys' or 'Duration' is at least '10' or 'Birthday' is '10/10/2019') and 'Squiffy' is not 'Donkeys'"
      )
    })

    test('should correctly clarify conditions inside user generated groups', () => {
      underTest.addGroups([
        new ConditionGroupDef(0, 2),
        new ConditionGroupDef(3, 5)
      ])
      expect(underTest.toPresentationString()).toBe(
        "('Badger' is 'Zebras' or ('Under 18' and 'Squiffy' is 'Donkeys')) or ('Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys'))"
      )
    })

    test('subsequent calls to addGroups should operate on the previously grouped entries', () => {
      underTest.addGroups([new ConditionGroupDef(0, 2)])
      underTest.addGroups([new ConditionGroupDef(1, 2)])
      expect(underTest.toPresentationString()).toBe(
        "('Badger' is 'Zebras' or ('Under 18' and 'Squiffy' is 'Donkeys')) or (('Duration' is at least '10' or 'Birthday' is '10/10/2019') and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('subsequent calls to addGroups can create nested groups', () => {
      underTest.addGroups([new ConditionGroupDef(0, 1)])
      underTest.addGroups([new ConditionGroupDef(0, 1)])
      expect(underTest.toPresentationString()).toBe(
        "(('Badger' is 'Zebras' or 'Under 18') and 'Squiffy' is 'Donkeys') or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('user groupings, but not automatic groupings, should be returned from asPerUserGroupings', () => {
      underTest.addGroups([new ConditionGroupDef(0, 1)])
      underTest.addGroups([new ConditionGroupDef(0, 1)])

      const returned = underTest.asPerUserGroupings
      expect(returned).toEqual([
        {
          conditions: [
            {
              conditions: [
                {
                  coordinator: undefined,
                  field: {
                    display: 'Badger',
                    type: ComponentType.TextField,
                    name: 'badger'
                  },
                  operator: OperatorName.Is,
                  value: {
                    type: ConditionType.Value,
                    value: 'Zebras',
                    display: 'Zebras'
                  }
                },
                {
                  coordinator: Coordinator.OR,
                  conditionName: 'under18',
                  conditionDisplayName: 'Under 18'
                }
              ]
            },
            {
              coordinator: Coordinator.AND,
              field: {
                display: 'Squiffy',
                type: ComponentType.TextField,
                name: 'squiffy'
              },
              operator: OperatorName.Is,
              value: {
                type: ConditionType.Value,
                value: 'Donkeys',
                display: 'Donkeys'
              }
            }
          ]
        },
        {
          coordinator: Coordinator.OR,
          field: {
            display: 'Duration',
            type: ComponentType.NumberField,
            name: 'duration'
          },
          operator: OperatorName.IsAtLeast,
          value: {
            type: ConditionType.Value,
            value: '10',
            display: '10'
          }
        },
        {
          coordinator: Coordinator.OR,
          field: {
            display: 'Birthday',
            type: ComponentType.DatePartsField,
            name: 'birthday'
          },
          operator: OperatorName.Is,
          value: {
            type: ConditionType.Value,
            value: '10/10/2019',
            display: '10/10/2019'
          }
        },
        {
          coordinator: Coordinator.AND,
          field: {
            display: 'Squiffy',
            type: ComponentType.TextField,
            name: 'squiffy'
          },
          operator: OperatorName.IsNot,
          value: {
            type: ConditionType.Value,
            value: 'Donkeys',
            display: 'Donkeys'
          }
        }
      ])
    })
  })

  describe('splitting user generated groups', () => {
    beforeEach(() => {
      underTest.add(
        new Condition(
          new ConditionField('badger', ComponentType.TextField, 'Badger'),
          OperatorName.Is,
          new ConditionValue('Zebras')
        )
      )
      underTest.add(new ConditionRef('under18', 'Under 18', Coordinator.OR))
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.Is,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('duration', ComponentType.NumberField, 'Duration'),
          OperatorName.IsAtLeast,
          new ConditionValue('10'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField(
            'birthday',
            ComponentType.DatePartsField,
            'Birthday'
          ),
          OperatorName.Is,
          new ConditionValue('10/10/2019'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.IsNot,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
    })

    test('should split defined group and auto-group the remaining conditions', () => {
      underTest.addGroups([new ConditionGroupDef(0, 1)])
      underTest.splitGroup(0)
      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Zebras' or ('Under 18' and 'Squiffy' is 'Donkeys') or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('should split composite group and auto-group the remaining conditions', () => {
      underTest.addGroups([new ConditionGroupDef(0, 1)])
      underTest.addGroups([new ConditionGroupDef(0, 1)])
      underTest.splitGroup(0)
      expect(underTest.toPresentationString()).toBe(
        "(('Badger' is 'Zebras' or 'Under 18') and 'Squiffy' is 'Donkeys') or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('should do nothing if trying to split a group that is not grouped', () => {
      underTest.splitGroup(0)
      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Zebras' or ('Under 18' and 'Squiffy' is 'Donkeys') or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })
  })

  describe('removing conditions and groups', () => {
    beforeEach(() => {
      underTest.add(
        new Condition(
          new ConditionField('badger', ComponentType.TextField, 'Badger'),
          OperatorName.Is,
          new ConditionValue('Zebras')
        )
      )
      underTest.add(new ConditionRef('under18', 'Under 18', Coordinator.OR))
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.Is,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('duration', ComponentType.NumberField, 'Duration'),
          OperatorName.IsAtLeast,
          new ConditionValue('10'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField(
            'birthday',
            ComponentType.DatePartsField,
            'Birthday'
          ),
          OperatorName.Is,
          new ConditionValue('10/10/2019'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.IsNot,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
    })

    test('should remove the specified condition indexes', () => {
      underTest.remove([1, 4])
      expect(underTest.asPerUserGroupings).toHaveLength(4)

      expect(underTest.toPresentationString()).toBe(
        "('Badger' is 'Zebras' and 'Squiffy' is 'Donkeys') or ('Duration' is at least '10' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('should remove the only condition', () => {
      underTest.addGroups([new ConditionGroupDef(0, 5)])
      underTest.remove([0])
      expect(underTest.asPerUserGroupings).toHaveLength(0)
    })

    test('should allow removal of condition before group condition', () => {
      underTest.addGroups([new ConditionGroupDef(1, 2)])
      underTest.remove([0])
      expect(underTest.asPerUserGroupings).toHaveLength(4)
    })

    test('should remove all elements from a user-defined group', () => {
      expect(underTest.asPerUserGroupings).toHaveLength(6)
      underTest.addGroups([new ConditionGroupDef(0, 1)])
      expect(underTest.asPerUserGroupings).toHaveLength(5)
      underTest.remove([0])
      expect(underTest.asPerUserGroupings).toHaveLength(4)

      expect(underTest.toPresentationString()).toBe(
        "'Squiffy' is 'Donkeys' or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('should remove all elements from a nested group', () => {
      expect(underTest.asPerUserGroupings).toHaveLength(6)
      underTest.addGroups([new ConditionGroupDef(0, 1)])
      underTest.addGroups([new ConditionGroupDef(0, 1)])
      expect(underTest.asPerUserGroupings).toHaveLength(4)
      underTest.remove([0])
      expect(underTest.asPerUserGroupings).toHaveLength(3)

      expect(underTest.toPresentationString()).toBe(
        "'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('should do nothing if provided invalid index to remove', () => {
      expect(underTest.asPerUserGroupings).toHaveLength(6)

      underTest.remove([6])

      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Zebras' or ('Under 18' and 'Squiffy' is 'Donkeys') or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })
  })

  describe('name', () => {
    test('should set and return name', () => {
      underTest.name = 'some condition name'
      expect(underTest.name).toBe('some condition name')
    })

    test('should overwrite name', () => {
      underTest.name = 'some condition name'
      underTest.name = 'some condition name 2'
      expect(underTest.name).toBe('some condition name 2')
    })

    test('should return undefined if no name set', () => {
      expect(underTest.name).toBeUndefined()
    })
  })

  describe('clone', () => {
    beforeEach(() => {
      underTest.name = 'some condition name'
      underTest.add(
        new Condition(
          new ConditionField('badger', ComponentType.TextField, 'Badger'),
          OperatorName.Is,
          new ConditionValue('Zebras')
        )
      )
      underTest.add(new ConditionRef('under18', 'Under 18', Coordinator.OR))
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.Is,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('duration', ComponentType.NumberField, 'Duration'),
          OperatorName.IsAtLeast,
          new ConditionValue('10'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField(
            'birthday',
            ComponentType.DatePartsField,
            'Birthday'
          ),
          OperatorName.Is,
          new ConditionValue('10/10/2019'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.IsNot,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
    })

    test('should be cloned', () => {
      const returned = underTest.clone()
      const returnedCondition1 = returned.asPerUserGroupings[0] as Condition
      const underTestCondition1 = underTest.asPerUserGroupings[0] as Condition

      returnedCondition1.coordinator = Coordinator.OR
      underTestCondition1.coordinator = undefined

      expect(returned).toStrictEqual(underTest)
      expect(returned).not.toBe(underTest)
      expect(returnedCondition1).not.toEqual(underTestCondition1)
    })
  })

  describe('clear', () => {
    beforeEach(() => {
      underTest.name = 'some condition name'
      underTest.add(
        new Condition(
          new ConditionField('badger', ComponentType.TextField, 'Badger'),
          OperatorName.Is,
          new ConditionValue('Zebras')
        )
      )
      underTest.add(new ConditionRef('under18', 'Under 18', Coordinator.OR))
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.Is,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('duration', ComponentType.NumberField, 'Duration'),
          OperatorName.IsAtLeast,
          new ConditionValue('10'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField(
            'birthday',
            ComponentType.DatePartsField,
            'Birthday'
          ),
          OperatorName.Is,
          new ConditionValue('10/10/2019'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.IsNot,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
      underTest.addGroups([new ConditionGroupDef(0, 2)])
    })

    test('should clear state', () => {
      const returned = underTest.clear()
      expect(returned === underTest).toBe(true)
      expect(returned.hasConditions).toBe(false)
      expect(returned.asPerUserGroupings).toEqual([])
      expect(returned.name).toBeUndefined()
      expect(returned.toPresentationString()).toBe('')
    })
  })

  describe('moving conditions and groups', () => {
    beforeEach(() => {
      underTest.add(
        new Condition(
          new ConditionField('badger', ComponentType.TextField, 'Badger'),
          OperatorName.Is,
          new ConditionValue('Zebras')
        )
      )
      underTest.add(new ConditionRef('under18', 'Under 18', Coordinator.OR))
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.Is,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('duration', ComponentType.NumberField, 'Duration'),
          OperatorName.IsAtLeast,
          new ConditionValue('10'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField(
            'birthday',
            ComponentType.DatePartsField,
            'Birthday'
          ),
          OperatorName.Is,
          new ConditionValue('10/10/2019'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.IsNot,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
    })

    test('should move a condition earlier when not becoming the first item', () => {
      underTest.moveEarlier(3)

      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Zebras' or 'Under 18' or ('Duration' is at least '10' and 'Squiffy' is 'Donkeys') or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('should move the last condition earlier', () => {
      underTest.moveEarlier(5)

      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Zebras' or ('Under 18' and 'Squiffy' is 'Donkeys') or ('Duration' is at least '10' and 'Squiffy' is not 'Donkeys') or 'Birthday' is '10/10/2019'"
      )
    })

    test('should move a condition earlier and switch co-ordinators when becoming the first item', () => {
      underTest.moveEarlier(1)

      expect(underTest.toPresentationString()).toBe(
        "'Under 18' or ('Badger' is 'Zebras' and 'Squiffy' is 'Donkeys') or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('should move a condition group earlier and switch co-ordinators when becoming the first item', () => {
      underTest.addGroups([new ConditionGroupDef(1, 2)])
      underTest.moveEarlier(1)

      expect(underTest.toPresentationString()).toBe(
        "('Under 18' and 'Squiffy' is 'Donkeys') or 'Badger' is 'Zebras' or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('move earlier does nothing when already the first item', () => {
      underTest.moveEarlier(0)

      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Zebras' or ('Under 18' and 'Squiffy' is 'Donkeys') or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('move earlier does nothing when before the first item', () => {
      underTest.moveEarlier(-1)

      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Zebras' or ('Under 18' and 'Squiffy' is 'Donkeys') or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('move earlier does nothing when after the last item', () => {
      underTest.moveEarlier(-1)

      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Zebras' or ('Under 18' and 'Squiffy' is 'Donkeys') or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('move later does nothing when already the last item', () => {
      underTest.moveLater(5)

      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Zebras' or ('Under 18' and 'Squiffy' is 'Donkeys') or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('move later does nothing when after the last item', () => {
      underTest.moveLater(6)

      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Zebras' or ('Under 18' and 'Squiffy' is 'Donkeys') or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('move later does nothing when before the first item', () => {
      underTest.moveLater(-1)

      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Zebras' or ('Under 18' and 'Squiffy' is 'Donkeys') or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('should move a condition later when not the first or last item', () => {
      underTest.moveLater(3)

      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Zebras' or ('Under 18' and 'Squiffy' is 'Donkeys') or 'Birthday' is '10/10/2019' or ('Duration' is at least '10' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('should move penultimate condition later', () => {
      underTest.moveLater(4)

      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Zebras' or ('Under 18' and 'Squiffy' is 'Donkeys') or ('Duration' is at least '10' and 'Squiffy' is not 'Donkeys') or 'Birthday' is '10/10/2019'"
      )
    })

    test('should move a condition later and switch co-ordinators when moving the first item', () => {
      underTest.moveLater(0)

      expect(underTest.toPresentationString()).toBe(
        "'Under 18' or ('Badger' is 'Zebras' and 'Squiffy' is 'Donkeys') or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })

    test('should move a condition group later and switch co-ordinators when moving the first item', () => {
      underTest.addGroups([new ConditionGroupDef(0, 1)])
      underTest.moveLater(0)

      expect(underTest.toPresentationString()).toBe(
        "('Squiffy' is 'Donkeys' and ('Badger' is 'Zebras' or 'Under 18')) or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'Donkeys')"
      )
    })
  })

  describe('invalid configuration', () => {
    describe('invalid operator', () => {
      test('should throw an error on condition creation if no operator provided', () => {
        const type = ComponentType.TextField
        const field = new ConditionField('badger', type, 'Badger')
        const value = new ConditionValue('Monkeys')

        expect(() => new Condition(field, undefined, value)).toThrow(Error)
      })

      test('should throw an error on condition creation if non-string operator provided', () => {
        const type = ComponentType.TextField
        const field = new ConditionField('badger', type, 'Badger')
        const value = new ConditionValue('Monkeys')

        expect(
          // @ts-expect-error - Allow invalid param for test
          () => new Condition(field, {}, value)
        ).toThrow(Error)
      })
    })

    describe('invalid field', () => {
      test('should throw an error on condition creation if no field provided', () => {
        expect(
          () =>
            new Condition(
              undefined,
              OperatorName.Is,
              new ConditionValue('Monkeys')
            )
        ).toThrow(Error)
      })

      test('should throw an error on condition creation if field is not a ConditionField type', () => {
        const value = new ConditionValue('Monkeys')

        expect(
          // @ts-expect-error - Allow invalid param for test
          () => new Condition({}, OperatorName.Is, value)
        ).toThrow(Error)
      })

      test('should throw an error on field creation if no value provided', () => {
        expect(
          () => new ConditionField(undefined, ComponentType.TextField, 'Badger')
        ).toThrow(Error)
      })

      test('should throw an error on field creation if no type provided', () => {
        expect(() => new ConditionField('badger', undefined, 'Badger')).toThrow(
          Error
        )
      })

      test('should throw an error on field creation if invalid type provided', () => {
        expect(
          // @ts-expect-error - Allow invalid param for test
          () => new ConditionField('badger', 'MadeUpType', 'Badger')
        ).toThrow(Error)
      })

      test('should throw an error on field creation if invalid name value type provided', () => {
        expect(
          // @ts-expect-error - Allow invalid param for test
          () => new ConditionField({}, ComponentType.TextField, 'Badger')
        ).toThrow(Error)
      })

      test('should throw an error on field creation if invalid display value type provided', () => {
        expect(
          // @ts-expect-error - Allow invalid param for test
          () => new ConditionField('Badger', ComponentType.TextField, {})
        ).toThrow(Error)
      })

      test('should throw an error on field creation if no display value provided', () => {
        expect(
          () => new ConditionField('badger', ComponentType.TextField, undefined)
        ).toThrow(Error)
      })

      test('should throw errors from factory method', () => {
        expect(
          // @ts-expect-error - Allow missing properties for test
          () => ConditionField.from({ name: 'badger' })
        ).toThrow(Error)
      })
    })

    describe('invalid value', () => {
      test('should throw an error on condition creation if no value provided', () => {
        const type = ComponentType.TextField
        const field = new ConditionField('badger', type, 'Badger')
        expect(
          () => new Condition(field, OperatorName.Is, undefined, undefined)
        ).toThrow(Error)
      })

      test('should throw an error on condition creation if value is not a Value type', () => {
        const field = { value: 'badger', display: 'Badger' }

        expect(
          // @ts-expect-error - Allow invalid param for test
          () => new Condition(field, OperatorName.Is, 'Monkeys')
        ).toThrow(Error)
      })

      test('should throw an error on value creation if no value provided', () => {
        // @ts-expect-error - Allow missing params for test
        expect(() => new ConditionValue()).toThrow(Error)
      })

      test('should throw an error on value creation if display value is provided and is not a string', () => {
        expect(
          // @ts-expect-error - Allow invalid param for test
          () => new ConditionValue('badger', {})
        ).toThrow(Error)
      })

      test('should throw an error on value creation if value is provided and is not a string', () => {
        expect(
          // @ts-expect-error - Allow invalid param for test
          () => new ConditionValue({}, 'Badger')
        ).toThrow(Error)
      })

      test('should throw errors from factory method', () => {
        expect(
          // @ts-expect-error - Allow invalid param for test
          () => ConditionValue.from({})
        ).toThrow(Error)
      })
    })

    describe('invalid coordinator', () => {
      test('should throw an error on condition creation if invalid coordinator provided', () => {
        const type = ComponentType.TextField
        const field = new ConditionField('badger', type, 'Badger')
        const value = new ConditionValue('Monkeys')

        expect(
          // @ts-expect-error - Allow invalid param for test
          () => new Condition(field, OperatorName.Is, value, OperatorName.Is)
        ).toThrow(Error)
      })

      test('should throw an error on adding first condition if a coordinator is provided', () => {
        const type = ComponentType.TextField
        const field = new ConditionField('badger', type, 'Badger')
        const value = new ConditionValue('Monkeys')

        expect(() =>
          underTest.add(
            new Condition(field, OperatorName.Is, value, Coordinator.OR)
          )
        ).toThrow(Error)
      })

      test('should throw an error on adding subsequent condition if no coordinator is provided', () => {
        const type = ComponentType.TextField
        const field = new ConditionField('badger', type, 'Badger')
        const value = new ConditionValue('Monkeys')

        expect(() => {
          underTest.add(new Condition(field, OperatorName.Is, value))
          underTest.add(new Condition(field, OperatorName.Is, value))
        }).toThrow(Error)
      })
    })

    describe('invalid group def', () => {
      test('should throw error if there is no last value', () => {
        expect(() => new ConditionGroupDef(3)).toThrow(Error)
      })

      test('should throw error if there is no first value', () => {
        expect(() => new ConditionGroupDef(undefined, 3)).toThrow(Error)
      })

      test('should throw error if first > last', () => {
        expect(() => new ConditionGroupDef(4, 3)).toThrow(Error)
      })

      test('should throw error if first == last', () => {
        expect(() => new ConditionGroupDef(4, 4)).toThrow(Error)
      })
    })
  })

  describe('serialisation and deserialisation', () => {
    beforeEach(() => {
      underTest.name = 'some condition name'
      underTest.add(
        new Condition(
          new ConditionField('badger', ComponentType.TextField, 'Badger'),
          OperatorName.Is,
          new ConditionValue('Zebras')
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('monkeys', ComponentType.TextField, 'Monkeys'),
          OperatorName.Is,
          new ConditionValue('giraffes', 'Giraffes'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.Is,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('duration', ComponentType.NumberField, 'Duration'),
          OperatorName.IsAtLeast,
          new ConditionValue('10'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField(
            'birthday',
            ComponentType.DatePartsField,
            'Birthday'
          ),
          OperatorName.Is,
          new ConditionValue('10/10/2019'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField(
            'reported',
            ComponentType.DatePartsField,
            'Reported'
          ),
          OperatorName.IsMoreThan,
          new RelativeDateValue('10', DateUnits.DAYS, DateDirections.PAST),
          Coordinator.AND
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.IsNot,
          new ConditionValue('Donkeys'),
          Coordinator.AND
        )
      )
      underTest.add(
        new ConditionRef(
          'anotherCondition',
          'Another condition',
          Coordinator.OR
        )
      )
      underTest.addGroups([new ConditionGroupDef(0, 2)])
    })

    test('serialising to json returns the expected result', () => {
      const expected = {
        name: 'some condition name',
        conditions: [
          {
            conditions: [
              {
                field: {
                  name: 'badger',
                  type: ComponentType.TextField,
                  display: 'Badger'
                },
                operator: OperatorName.Is,
                value: {
                  type: ConditionType.Value,
                  value: 'Zebras',
                  display: 'Zebras'
                }
              },
              {
                coordinator: Coordinator.OR,
                field: {
                  name: 'monkeys',
                  type: ComponentType.TextField,
                  display: 'Monkeys'
                },
                operator: OperatorName.Is,
                value: {
                  type: ConditionType.Value,
                  value: 'giraffes',
                  display: 'Giraffes'
                }
              },
              {
                coordinator: Coordinator.AND,
                field: {
                  name: 'squiffy',
                  type: ComponentType.TextField,
                  display: 'Squiffy'
                },
                operator: OperatorName.Is,
                value: {
                  type: ConditionType.Value,
                  value: 'Donkeys',
                  display: 'Donkeys'
                }
              }
            ]
          },
          {
            coordinator: Coordinator.OR,
            field: {
              name: 'duration',
              type: ComponentType.NumberField,
              display: 'Duration'
            },
            operator: OperatorName.IsAtLeast,
            value: {
              type: ConditionType.Value,
              value: '10',
              display: '10'
            }
          },
          {
            coordinator: Coordinator.OR,
            field: {
              name: 'birthday',
              type: ComponentType.DatePartsField,
              display: 'Birthday'
            },
            operator: OperatorName.Is,
            value: {
              type: ConditionType.Value,
              value: '10/10/2019',
              display: '10/10/2019'
            }
          },
          {
            coordinator: Coordinator.AND,
            field: {
              name: 'reported',
              type: ComponentType.DatePartsField,
              display: 'Reported'
            },
            operator: OperatorName.IsMoreThan,
            value: {
              type: ConditionType.RelativeDate,
              period: '10',
              unit: DateUnits.DAYS,
              direction: DateDirections.PAST
            }
          },
          {
            coordinator: Coordinator.AND,
            field: {
              name: 'squiffy',
              type: ComponentType.TextField,
              display: 'Squiffy'
            },
            operator: OperatorName.IsNot,
            value: {
              type: ConditionType.Value,
              value: 'Donkeys',
              display: 'Donkeys'
            }
          },
          {
            coordinator: Coordinator.OR,
            conditionName: 'anotherCondition',
            conditionDisplayName: 'Another condition'
          }
        ]
      } satisfies ConditionsModelData

      expect(JSON.stringify(underTest)).toEqual(JSON.stringify(expected))
    })

    test('deserialising the serialised json returns a new ConditionsModel equal to the original', () => {
      const returned = ConditionsModel.from(
        JSON.parse(JSON.stringify(underTest))
      )

      expect(returned).toStrictEqual(underTest)
      expect(returned).not.toBe(underTest)

      expect(returned.toExpression()).toEqual(underTest.toExpression())
      expect(returned.toPresentationString()).toEqual(
        underTest.toPresentationString()
      )
    })

    test('ConditionsModel.from with existing conditions model returns the passed object', () => {
      const returned = ConditionsModel.from(underTest)

      expect(returned).toStrictEqual(underTest)
      expect(returned).toBe(underTest)
    })
  })

  describe('escaping condition values', () => {
    beforeEach(() => {
      underTest.add(
        new Condition(
          new ConditionField('badger', ComponentType.TextField, 'Badger'),
          OperatorName.Is,
          new ConditionValue("Zebra's")
        )
      )
      underTest.add(new ConditionRef('under18', 'Under 18', Coordinator.OR))
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.Is,
          new ConditionValue("Donkey's"),
          Coordinator.AND
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('duration', ComponentType.NumberField, 'Duration'),
          OperatorName.IsAtLeast,
          new ConditionValue('10'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField(
            'birthday',
            ComponentType.DatePartsField,
            'Birthday'
          ),
          OperatorName.Is,
          new ConditionValue('10/10/2019'),
          Coordinator.OR
        )
      )
      underTest.add(
        new Condition(
          new ConditionField('squiffy', ComponentType.TextField, 'Squiffy'),
          OperatorName.IsNot,
          new ConditionValue("K'plah's!"),
          Coordinator.AND
        )
      )
    })

    test('single quotes are escaped in toExpression', () => {
      expect(underTest.toExpression()).toBe(
        "badger == 'Zebra\\'s' or (under18 and squiffy == 'Donkey\\'s') or duration >= 10 or (birthday == '10/10/2019' and squiffy != 'K\\'plah\\'s!')"
      )
    })

    test('single quotes are not escaped in toPresentationString', () => {
      expect(underTest.toPresentationString()).toBe(
        "'Badger' is 'Zebra's' or ('Under 18' and 'Squiffy' is 'Donkey's') or 'Duration' is at least '10' or ('Birthday' is '10/10/2019' and 'Squiffy' is not 'K'plah's!')"
      )
    })
  })
})
