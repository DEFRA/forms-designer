import { type ParseKeys, type TOptions } from 'i18next'
import { type Root, type Schema } from 'joi'

import { type ErrorListItem } from '~/src/ErrorSummary.jsx'
import { i18n } from '~/src/i18n/i18n.jsx'

export function hasValidationErrors(errors = {}): errors is object {
  return !!Object.values(errors).filter(Boolean).length
}

/**
 * Custom field validator
 */
export function validateCustom(
  id: string,
  value: ValidatorValue | undefined,
  options: {
    label?: string
    message: ValidatorMessage
    schema: Schema
  }
): ErrorListItem | undefined {
  const result = options.schema.validate(value)
  if (!result.error) {
    return
  }

  const message = i18n(options.message, {
    field: options.label
  })

  return {
    href: `#${id}`,
    children: [message]
  }
}

/**
 * Required field validator
 */
export const validateRequired: Validator<string> = (id, value, options) => {
  const { label, message, schema } = options

  return validateCustom(id, value, {
    label,
    message: message ?? 'errors.required',
    schema: schema.string().required()
  })
}

type Validator<
  ValueType extends ValidatorValue,
  OptionsType = {
    label?: string
    message?: ValidatorMessage
    schema: Root
  }
> = (
  id: string,
  value: ValueType | undefined,
  options: OptionsType
) => ErrorListItem | undefined

export type ValidatorValue = string | number | boolean | unknown[] | undefined
export type ValidatorMessage = ParseKeys<'translation', TOptions>
