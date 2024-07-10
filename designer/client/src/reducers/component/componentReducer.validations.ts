import {
  hasContentField,
  hasListField,
  hasTitle,
  type ComponentDef,
  type ContentComponentsDef,
  type ListComponentsDef
} from '@defra/forms-model'

import { type ErrorList } from '~/src/ErrorSummary.jsx'
import { isEmpty } from '~/src/helpers.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { validateName, validateTitle } from '~/src/validations.js'

const validateContent = (component: ContentComponentsDef) => {
  const errors: ErrorList = {}

  if (!('content' in component) || isEmpty(component.content)) {
    errors.content = {
      href: `#field-content`,
      children: [i18n('errors.field', { field: 'Content' })]
    }
  }

  return errors
}

const validateList = (component: ListComponentsDef) => {
  const errors: ErrorList = {}

  if (!('list' in component) || isEmpty(component.list)) {
    errors.list = {
      href: `#field-options-list`,
      children: [i18n('list.errors.select')]
    }
  }

  return errors
}

export function fieldComponentValidations(component?: ComponentDef) {
  const validations: ErrorList[] = []

  if (hasTitle(component)) {
    validations.push(
      validateTitle(
        'title',
        'field-title',
        '$t(common.titleField.title)',
        component.title,
        i18n
      )
    )
  }

  validations.push(
    validateName(
      'name',
      'field-name',
      '$t(common.componentNameField.title)',
      component?.name,
      i18n
    )
  )

  if (hasContentField(component)) {
    validations.push(validateContent(component))
  }

  if (hasListField(component)) {
    validations.push(validateList(component))
  }

  const errors = validations.reduce((acc, error) => {
    return Object.keys(error).length ? { ...acc, ...error } : acc
  }, {})

  return errors
}

export function validateComponent(selectedComponent?: ComponentDef) {
  return {
    errors: fieldComponentValidations(selectedComponent),
    hasValidated: true
  }
}
