import { type ErrorList } from '~/src/ErrorSummary.jsx'
import { hasSpaces, isEmpty } from '~/src/helpers.js'
import { i18n } from '~/src/i18n/i18n.jsx'

export function hasValidationErrors(errors = {}) {
  return Object.keys(errors).length > 0
}

export function validateNotEmpty<Key extends string>(
  name: Key,
  id: string,
  description: string,
  value?: string,
  existingErrors: ErrorList = {}
) {
  const hasErrors = isEmpty(value)
  const errors = existingErrors

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
  value?: string,
  i18nProp?: typeof i18n
) {
  const translate = i18nProp ?? i18n

  const namesIsEmpty = isEmpty(value)
  const nameHasErrors = !namesIsEmpty && hasSpaces(value)
  const errors: Partial<ErrorList<Key>> = {}

  if (nameHasErrors) {
    const message = translate('name.errors.whitespace')

    errors[name] = {
      href: `#${id}`,
      children: [message]
    }
  } else if (namesIsEmpty) {
    const message = translate('errors.field', {
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
  value?: string,
  i18nProp?: typeof i18n
) {
  const translate = i18nProp ?? i18n

  const titleIsEmpty = isEmpty(value)
  const errors: Partial<ErrorList<Key>> = {}

  if (titleIsEmpty) {
    const message = translate('errors.field', {
      field: description
    })

    errors[name] = {
      href: `#${id}`,
      children: [message]
    }
  }

  return errors
}
