import { type ErrorList } from '~/src/ErrorSummary.jsx'
import { hasSpaces, isEmpty } from '~/src/helpers.js'
import { i18n } from '~/src/i18n/i18n.jsx'

export function hasValidationErrors(errors = {}): errors is object {
  return !!Object.values(errors).filter(Boolean).length
}

export function validateNotEmpty<Key extends string>(
  name: Key,
  id: string,
  description: string,
  value?: string
) {
  const hasErrors = isEmpty(value)
  const errors: Partial<ErrorList<Key>> = {}

  if (hasErrors) {
    errors[name] = {
      href: `#${id}`,
      children: [
        i18n('errors.field', {
          field: description
        })
      ]
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
  const namesIsEmpty = isEmpty(value)
  const nameHasErrors = !namesIsEmpty && hasSpaces(value)
  const errors: Partial<ErrorList<Key>> = {}

  if (nameHasErrors) {
    const message = i18n('errors.spaces', {
      field: description
    })

    errors[name] = {
      href: `#${id}`,
      children: [message]
    }
  } else if (namesIsEmpty) {
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

export function validateTitle<Key extends string>(
  name: Key,
  id: string,
  description: string,
  value?: string
) {
  const titleIsEmpty = isEmpty(value)
  const errors: Partial<ErrorList<Key>> = {}

  if (titleIsEmpty) {
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
