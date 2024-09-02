import Joi, { type Schema } from 'joi'

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
    message: string
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
  const message = options.message ?? 'errors.required'

  return validateCustom(id, value, {
    label: options.label,
    message,
    schema: Joi.string().required()
  })
}

/**
 * No spaces validator
 */
export const validateNoSpaces: Validator<string> = (id, value, options) => {
  const message = options.message ?? 'errors.spaces'

  return validateCustom(id, value, {
    label: options.label,
    message,
    schema: Joi.string().regex(/\s/, { invert: true }).required()
  })
}

/**
 * Auto populated name validator
 */
export const validateName: Validator<string> = (...args) => {
  return validateRequired(...args) ?? validateNoSpaces(...args)
}

type Validator<
  ValueType extends ValidatorValue,
  OptionsType = {
    label?: string
    message?: string
  }
> = (
  id: string,
  value: ValueType | undefined,
  options: OptionsType
) => ErrorListItem | undefined

export type ValidatorValue = string | number | boolean | unknown[] | undefined
