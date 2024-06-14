import {
  timeUnits,
  absoluteDateOrTimeOperatorNames,
  getOperatorConfig,
  relativeDateOrTimeOperatorNames,
  ComponentType,
  ConditionValue,
  type OperatorName,
  type ConditionalComponentType
} from '@defra/forms-model'
import React from 'react'

import { AbsoluteDateValues } from '~/src/conditions/AbsoluteDateValues.jsx'
import { AbsoluteTimeValues } from '~/src/conditions/AbsoluteTimeValues.jsx'
import { RelativeTimeValues } from '~/src/conditions/RelativeTimeValues.jsx'
import { SelectValues } from '~/src/conditions/SelectValues.jsx'
import { TextValues } from '~/src/conditions/TextValues.jsx'
import { tryParseInt } from '~/src/conditions/inline-condition-helpers.js'

function DateTimeComponent(
  fieldType: ConditionalComponentType,
  operator: OperatorName
) {
  const operatorConfig = getOperatorConfig(fieldType, operator)

  let CustomRendering:
    | typeof AbsoluteDateValues
    | typeof AbsoluteTimeValues
    | undefined

  switch (fieldType) {
    case ComponentType.DatePartsField:
      CustomRendering = AbsoluteDateValues
      break

    case ComponentType.TimeField:
      CustomRendering = AbsoluteTimeValues
      break
  }

  if (absoluteDateOrTimeOperatorNames.includes(operator)) {
    const pad = (num: number) => num.toString().padStart(2, '0')

    return function CustomRenderingWrapper({ value, updateValue }) {
      if (!CustomRendering) {
        return null
      }

      const transformUpdatedValue = (value) => {
        let transformed
        switch (fieldType) {
          case ComponentType.DatePartsField:
            const { year, month, day } = value
            transformed = `${pad(year)}-${pad(month)}-${pad(day)}`
            break
          case ComponentType.TimeField:
            const { hour, minute } = value
            transformed = `${pad(hour)}:${pad(minute)}`
        }

        updateValue(new ConditionValue(transformed))
      }

      const transformInputValue = (condition?: ConditionValue) => {
        if (condition?.value) {
          switch (fieldType) {
            case ComponentType.DatePartsField:
              const [year, month, day] = condition.value.split('-')
              return {
                year: tryParseInt(year),
                month: tryParseInt(month),
                day: tryParseInt(day)
              }
            case ComponentType.TimeField:
              const [hour, minute] = condition.value.split(':')
              return { hour: tryParseInt(hour), minute: tryParseInt(minute) }
          }
        }

        return undefined
      }

      return (
        <CustomRendering
          value={transformInputValue(value)}
          updateValue={transformUpdatedValue}
        />
      )
    }
  } else if (
    operatorConfig &&
    relativeDateOrTimeOperatorNames.includes(operator)
  ) {
    const { units } = operatorConfig

    return function RelativeTimeValuesWrapper({ value, updateValue }) {
      return (
        <RelativeTimeValues
          value={value}
          updateValue={updateValue}
          units={units}
          timeOnly={units === timeUnits}
        />
      )
    }
  }

  return null
}

interface FieldDef {
  label: string
  name: string
  type: ConditionalComponentType
  values?: any[]
}

interface Props {
  fieldDef: FieldDef
  operator: OperatorName
  value?: any
  updateValue: (any) => void
}

export const InlineConditionsDefinitionValue = ({
  fieldDef,
  operator,
  value,
  updateValue
}: Props) => {
  const CustomComponent = DateTimeComponent(fieldDef.type, operator)
  if (CustomComponent) {
    return <CustomComponent value={value} updateValue={updateValue} />
  }
  return (fieldDef.values?.length ?? 0) > 0 ? (
    <SelectValues
      fieldDef={fieldDef}
      operator={operator}
      value={value}
      updateValue={updateValue}
    />
  ) : (
    <TextValues
      fieldDef={fieldDef}
      operator={operator}
      value={value}
      updateValue={updateValue}
    />
  )
}
