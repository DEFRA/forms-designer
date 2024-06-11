import {
  timeUnits,
  absoluteDateOrTimeOperatorNames,
  getOperatorConfig,
  relativeDateOrTimeOperatorNames,
  ComponentType,
  ConditionValue,
  type ConditionalComponentType,
  type OperatorName
} from '@defra/forms-model'
import React from 'react'

import { AbsoluteDateTimeValues } from '~/src/conditions/AbsoluteDateTimeValues.jsx'
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

  const absoluteDateTimeRenderFunctions = {
    [ComponentType.DateField]: AbsoluteDateValues,
    [ComponentType.DatePartsField]: AbsoluteDateValues,
    [ComponentType.DateTimeField]: AbsoluteDateTimeValues,
    [ComponentType.DateTimePartsField]: AbsoluteDateTimeValues,
    [ComponentType.TimeField]: AbsoluteTimeValues
  }

  if (fieldType in absoluteDateTimeRenderFunctions) {
    if (absoluteDateOrTimeOperatorNames.includes(operator)) {
      // since these are all classes return a function which creates new class comp
      const CustomRendering = absoluteDateTimeRenderFunctions[fieldType]
      const pad = (num: number) => num.toString().padStart(2, '0')

      return function CustomRenderingWrapper({ value, updateValue }) {
        const transformUpdatedValue = (value) => {
          let transformed
          switch (CustomRendering) {
            case AbsoluteDateTimeValues:
              transformed = value.toISOString()
              break
            case AbsoluteDateValues:
              const { year, month, day } = value
              transformed = `${pad(year)}-${pad(month)}-${pad(day)}`
              break
            case AbsoluteTimeValues:
              const { hour, minute } = value
              transformed = `${pad(hour)}:${pad(minute)}`
          }
          updateValue(new ConditionValue(transformed))
        }
        const transformInputValue = (condition?: ConditionValue) => {
          if (condition?.value) {
            switch (CustomRendering) {
              case AbsoluteDateTimeValues:
                // value should be an ISO format date string
                return new Date(condition.value)
              case AbsoluteDateValues:
                const [year, month, day] = condition.value.split('-')
                return {
                  year: tryParseInt(year),
                  month: tryParseInt(month),
                  day: tryParseInt(day)
                }
              case AbsoluteTimeValues:
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
    } else if (relativeDateOrTimeOperatorNames.includes(operator)) {
      const units = operatorConfig.units
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
