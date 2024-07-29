import { isConditionalType } from '../components/helpers.js'

import { ComponentType } from '~/src/components/enums.js'
import { type ComponentDef } from '~/src/components/types.js'
import {
  ConditionValue,
  RelativeDateValue
} from '~/src/conditions/condition-values.js'
import {
  DateDirections,
  Operator,
  OperatorName
} from '~/src/conditions/enums.js'
import {
  type Conditionals,
  type OperatorDefinition
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

const absoluteDateOperators = {
  [OperatorName.Is]: absoluteDate(Operator.Is),
  [OperatorName.IsNot]: absoluteDate(Operator.IsNot),
  [OperatorName.IsBefore]: absoluteDate(Operator.IsLessThan),
  [OperatorName.IsAfter]: absoluteDate(Operator.IsMoreThan)
}

const relativeDateOperators = {
  [OperatorName.IsAtLeast]: relativeDate(Operator.IsAtMost, Operator.IsAtLeast),
  [OperatorName.IsAtMost]: relativeDate(Operator.IsAtLeast, Operator.IsAtMost),
  [OperatorName.IsLessThan]: relativeDate(
    Operator.IsMoreThan,
    Operator.IsLessThan
  ),
  [OperatorName.IsMoreThan]: relativeDate(
    Operator.IsLessThan,
    Operator.IsMoreThan
  )
}

export const customOperators = {
  [ComponentType.RadiosField]: defaultOperators,
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
  [ComponentType.DatePartsField]: {
    ...absoluteDateOperators,
    ...relativeDateOperators
  },
  [ComponentType.TextField]: withDefaults(textFieldOperators),
  [ComponentType.MultilineTextField]: withDefaults(textFieldOperators),
  [ComponentType.EmailAddressField]: withDefaults(textFieldOperators),
  [ComponentType.SelectField]: defaultOperators,
  [ComponentType.YesNoField]: defaultOperators
}

export function getOperatorNames(fieldType?: ComponentType) {
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
  value: ConditionValue | RelativeDateValue
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
  fieldType?: ComponentType
): Partial<Conditionals> | undefined {
  if (!fieldType || !isConditionalType(fieldType)) {
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
  value: ConditionValue | RelativeDateValue
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

export const absoluteDateOperatorNames = Object.keys(
  absoluteDateOperators
) as OperatorName[]

export const relativeDateOperatorNames = Object.keys(
  relativeDateOperators
) as OperatorName[]

function absoluteDate(operator: Operator): OperatorDefinition {
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

function relativeDate(
  pastOperator: Operator,
  futureOperator: Operator
): OperatorDefinition {
  return {
    expression(field, value) {
      if (!(value instanceof RelativeDateValue)) {
        throw new Error(
          "Expression param 'value' must be RelativeDateValue instance"
        )
      }

      const isPast = value.direction === DateDirections.PAST
      return `${field.name} ${isPast ? pastOperator : futureOperator} ${value.toExpression()}`
    }
  }
}
