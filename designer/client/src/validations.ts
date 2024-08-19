import { type ErrorList } from '~/src/ErrorSummary.jsx'
import { hasSpaces, isEmpty } from '~/src/helpers.js'
import { i18n } from '~/src/i18n/i18n.jsx'

export function hasValidationErrors(errors = {}): errors is object {
  return !!Object.values(errors).filter(Boolean).length
}

export function validateRequired<Key extends string>(
  name: Key,
  id: string,
  description: string,
  value?: string
) {
  const errors: Partial<ErrorList<Key>> = {}

  if (isEmpty(value)) {
    const message = i18n('errors.field', {
      field: description
    })

    errors[name] = {
      href: `#${id}`,
      children: [message]
    }
  }

  return errors
}

export function validateNoSpaces<Key extends string>(
  name: Key,
  id: string,
  description: string,
  value?: string
) {
  const errors: Partial<ErrorList<Key>> = {}

  if (hasSpaces(value)) {
    const message = i18n('errors.spaces', {
      field: description
    })

    errors[name] = {
      href: `#${id}`,
      children: [message]
    }
  }

  return errors
}

export function validateName<Key extends string>(
  name: Key,
  id: string,
  description: string,
  value?: string
) {
  const errorRequired = validateRequired(name, id, description, value)
  const errorNoSpaces = validateNoSpaces(name, id, description, value)

  return {
    ...errorRequired,
    ...errorNoSpaces
  }
}

export type ValidatorValue = string | number | boolean | unknown[] | undefined
