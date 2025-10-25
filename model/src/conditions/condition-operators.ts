import { ComponentType } from '~/src/components/enums.js'
import { isConditionalType, isContentType } from '~/src/components/helpers.js'
import {
  type ComponentDef,
  type ConditionalComponentType
} from '~/src/components/types.js'
import {
  ConditionValue,
  RelativeDateValue
} from '~/src/conditions/condition-values.js'
import { type Condition } from '~/src/conditions/condition.js'
import {
  ConditionType,
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

function withDefaults<T>(operators: T) {
  return { ...defaultOperators, ...operators }
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
  [ComponentType.AutocompleteField]: defaultOperators,
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
  [ComponentType.MultilineTextField]: {
    [OperatorName.IsLongerThan]: lengthIs(Operator.IsMoreThan),
    [OperatorName.IsShorterThan]: lengthIs(Operator.IsLessThan)
  },
  [ComponentType.EmailAddressField]: withDefaults(textFieldOperators),
  [ComponentType.TelephoneNumberField]: defaultOperators,
  [ComponentType.SelectField]: defaultOperators,
  [ComponentType.YesNoField]: defaultOperators,
  [ComponentType.DeclarationField]: defaultOperators
}

export function getOperatorNames(fieldType?: ConditionalComponentType) {
  const conditionals = getConditionals(fieldType)
  if (!conditionals) {
    return []
  }

  return Object.keys(conditionals) as OperatorName[]
}

export function getExpression(
  fieldType: ConditionalComponentType,
  fieldName: string,
  operator: OperatorName,
  value: Condition['value']
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

function getConditionals(
  fieldType?: ConditionalComponentType
): Partial<Conditionals> | undefined {
  if (!fieldType || !isConditionalType(fieldType) || isContentType(fieldType)) {
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
  value: Condition['value']
) {
  if (
    (field.type === ComponentType.DatePartsField &&
      value.type === ConditionType.RelativeDate) ||
    field.type === ComponentType.NumberField ||
    field.type === ComponentType.YesNoField
  ) {
    return value.toValue()
  }

  return `'${value.toValue().replace(/'/g, "\\'")}'`
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

      return `${field.name} ${operator} ${formatValue(field, value)}`
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
      return `${field.name} ${isPast ? pastOperator : futureOperator} ${formatValue(field, value)}`
    }
  }
}
