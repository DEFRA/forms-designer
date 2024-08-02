import {
  absoluteDateOperatorNames,
  relativeDateOperatorNames,
  ComponentType,
  ConditionType,
  ConditionValue,
  type Condition,
  type ConditionData,
  type ConditionValueData,
  type Item,
  type OperatorName,
  type RelativeDateValue,
  type RelativeDateValueData,
  type ConditionalComponentType
} from '@defra/forms-model'
import React from 'react'

import {
  AbsoluteDateValues,
  type YearMonthDay
} from '~/src/conditions/AbsoluteDateValues.jsx'
import { isFieldConditionList } from '~/src/conditions/InlineConditionsDefinition.jsx'
import { RelativeDateValues } from '~/src/conditions/RelativeDateValues.jsx'
import { SelectValues } from '~/src/conditions/SelectValues.jsx'
import { TextValues } from '~/src/conditions/TextValues.jsx'
import { tryParseInt } from '~/src/conditions/inline-condition-helpers.js'

function AbsoluteDateComponent(props: {
  value?: ConditionValueData | RelativeDateValueData
  updateValue: (value: ConditionValue) => void
}) {
  let { value, updateValue } = props

  // Discard value when switching condition type
  if (value?.type !== ConditionType.Value) {
    value = undefined
  }

  const pad = (num: number) => num.toString().padStart(2, '0')

  const transformUpdatedValue = (value?: YearMonthDay) => {
    if (!value) {
      return
    }

    const { year, month, day } = value
    updateValue(new ConditionValue(`${pad(year)}-${pad(month)}-${pad(day)}`))
  }

  const transformInputValue = (condition?: ConditionValueData) => {
    if (!condition?.value) {
      return
    }

    const [year, month, day] = condition.value.split('-')
    return {
      year: tryParseInt(year),
      month: tryParseInt(month),
      day: tryParseInt(day)
    }
  }

  return (
    <AbsoluteDateValues
      value={transformInputValue(value)}
      updateValue={transformUpdatedValue}
    />
  )
}

function RelativeDateComponent(props: {
  value?: ConditionValueData | RelativeDateValueData
  updateValue: (value: RelativeDateValue) => void
}) {
  let { value, updateValue } = props

  // Discard value when switching condition type
  if (value?.type !== ConditionType.RelativeDate) {
    value = undefined
  }

  return <RelativeDateValues value={value} updateValue={updateValue} />
}

export type FieldDef =
  | {
      label: string
      name: string
      type: ConditionalComponentType
      values?: Item[]
    }
  | {
      label: string
      name: string
      type: 'Condition'
    }

export interface Props {
  fieldDef: FieldDef
  operator: OperatorName
  value?: ConditionData['value']
  updateValue: (value: Condition['value']) => void
}

export const InlineConditionsDefinitionValue = ({
  fieldDef,
  operator,
  value,
  updateValue
}: Props) => {
  if (fieldDef.type === ComponentType.DatePartsField) {
    const isDateAbsolute = absoluteDateOperatorNames.includes(operator)
    const isDateRelative = relativeDateOperatorNames.includes(operator)

    if (isDateAbsolute) {
      return <AbsoluteDateComponent value={value} updateValue={updateValue} />
    } else if (isDateRelative) {
      return <RelativeDateComponent value={value} updateValue={updateValue} />
    }

    return null
  }

  if (value?.type === ConditionType.RelativeDate) {
    return null
  }

  return isFieldConditionList(fieldDef) ? (
    <SelectValues fieldDef={fieldDef} value={value} updateValue={updateValue} />
  ) : (
    <TextValues value={value} updateValue={updateValue} />
  )
}
