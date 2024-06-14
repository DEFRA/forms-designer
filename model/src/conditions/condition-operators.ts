import { isConditionalType } from '../components/helpers.js'

import { ComponentType } from '~/src/components/enums.js'
import { type ComponentDef } from '~/src/components/types.js'
import {
  timeUnits,
  dateUnits,
  dateTimeUnits,
  ConditionValue,
  RelativeTimeValue
} from '~/src/conditions/condition-values.js'
import {
  DateDirections,
  Operator,
  OperatorName
} from '~/src/conditions/enums.js'
import {
  type Conditionals,
  type DateUnits,
  type OperatorDefinition,
  type TimeUnits
} from '~/src/conditions/types.js'

const defaultOperators = {
  [OperatorName.Is]: inline(Operator.Is),
  [OperatorName.IsNot]: inline(Operator.IsNot)
}

function withDefaults<T>(param: T) {
  return Object.assign({}, param, defaultOperators)
}

const textFieldOperators = {
  [OperatorName.IsLongerThan]: lengthIs(Operator.IsMoreThan),
  [OperatorName.IsShorterThan]: lengthIs(Operator.IsLessThan),
  [OperatorName.HasLength]: lengthIs(Operator.Is)
}

const absoluteDateTimeOperators = {
  [OperatorName.Is]: absoluteDateTime(Operator.Is),
  [OperatorName.IsNot]: absoluteDateTime(Operator.IsNot),
  [OperatorName.IsBefore]: absoluteDateTime(Operator.IsLessThan),
  [OperatorName.IsAfter]: absoluteDateTime(Operator.IsMoreThan)
}

const relativeTimeOperators = (units: DateUnits | TimeUnits) => ({
  [OperatorName.IsAtLeast]: relativeTime(
    Operator.IsAtMost,
    Operator.IsAtLeast,
    units
  ),
  [OperatorName.IsAtMost]: relativeTime(
    Operator.IsAtLeast,
    Operator.IsAtMost,
    units
  ),
  [OperatorName.IsLessThan]: relativeTime(
    Operator.IsMoreThan,
    Operator.IsLessThan,
    units
  ),
  [OperatorName.IsMoreThan]: relativeTime(
    Operator.IsLessThan,
    Operator.IsMoreThan,
    units
  )
})

export const customOperators = {
  [ComponentType.CheckboxesField]: {
    [OperatorName.Contains]: reverseInline(Operator.Contains),
    [OperatorName.DoesNotContain]: not(reverseInline(Operator.Contains))
  },
  [ComponentType.NumberField]: withDefaults({
    [OperatorName.IsAtLeast]: inline(Operator.IsAtLeast),
    [OperatorName.IsAtMost]: inline(Operator.IsAtMost),
    [OperatorName.IsLessThan]: inline(Operator.IsLessThan),
    [OperatorName.IsMoreThan]: inline(Operator.IsMoreThan)
  }),
  [ComponentType.TimeField]: {
    ...absoluteDateTimeOperators,
    ...relativeTimeOperators(timeUnits)
  },
  [ComponentType.DatePartsField]: {
    ...absoluteDateTimeOperators,
    ...relativeTimeOperators(dateUnits)
  },
  [ComponentType.TextField]: withDefaults(textFieldOperators),
  [ComponentType.MultilineTextField]: withDefaults(textFieldOperators),
  [ComponentType.EmailAddressField]: withDefaults(textFieldOperators),
  [ComponentType.YesNoField]: defaultOperators
}

export function getOperatorNames(fieldType: ComponentType) {
  const conditionals = getConditionals(fieldType)
  if (!conditionals) {
    return []
  }

  return Object.keys(conditionals).sort()
}

export function getExpression(
  fieldType: ComponentType,
  fieldName: string,
  operator: OperatorName,
  value: ConditionValue | RelativeTimeValue
) {
  const conditionals = getConditionals(fieldType)
  if (!conditionals) {
    return
  }

  return conditionals[operator]?.expression(
    { type: fieldType, name: fieldName },
    value
  )
}

export function getOperatorConfig(
  fieldType: ComponentType,
  operator: OperatorName
) {
  return getConditionals(fieldType)?.[operator]
}

function getConditionals(
  fieldType: ComponentType
): Partial<Conditionals> | undefined {
  if (!isConditionalType(fieldType)) {
    return
  }

  return fieldType in customOperators
    ? customOperators[fieldType]
    : defaultOperators
}

function inline(operator: Operator): OperatorDefinition {
  return {
    expression(field, value) {
      return `${field.name} ${operator} ${formatValue(field, value)}`
    }
  }
}

function lengthIs(operator: Operator): OperatorDefinition {
  return {
    expression(field, value) {
      return `length(${field.name}) ${operator} ${formatValue(field, value)}`
    }
  }
}

function reverseInline(operator: Operator.Contains): OperatorDefinition {
  return {
    expression(field, value) {
      return `${formatValue(field, value)} ${operator} ${field.name}`
    }
  }
}

function not(operatorDefinition: OperatorDefinition): OperatorDefinition {
  return {
    expression(field, value) {
      return `not (${operatorDefinition.expression(field, value)})`
    }
  }
}

function formatValue(
  field: Pick<ComponentDef, 'type'>,
  value: ConditionValue | RelativeTimeValue
) {
  if (
    'value' in value &&
    (field.type === ComponentType.YesNoField ||
      field.type === ComponentType.NumberField)
  ) {
    return value.value
  }

  return `'${value.toExpression()}'`
}

export const absoluteDateOrTimeOperatorNames = Object.keys(
  absoluteDateTimeOperators
)

export const relativeDateOrTimeOperatorNames = Object.keys(
  relativeTimeOperators(dateTimeUnits)
)

function absoluteDateTime(operator: Operator): OperatorDefinition {
  return {
    expression(field, value) {
      if (!(value instanceof ConditionValue)) {
        throw new Error(
          "Expression param 'value' must be ConditionValue instance"
        )
      }

      return `${field.name} ${operator} '${formatValue(field, value)}'`
    }
  }
}

function relativeTime(
  pastOperator: Operator,
  futureOperator: Operator,
  units: DateUnits | TimeUnits
): OperatorDefinition {
  return {
    units,
    expression(field, value) {
      if (!(value instanceof RelativeTimeValue)) {
        throw new Error(
          "Expression param 'value' must be RelativeTimeValue instance"
        )
      }

      const isPast = value.direction === DateDirections.PAST
      return `${field.name} ${isPast ? pastOperator : futureOperator} ${value.toExpression()}`
    }
  }
}
