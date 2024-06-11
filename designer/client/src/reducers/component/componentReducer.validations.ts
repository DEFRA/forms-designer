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
import { validateTitle } from '~/src/validations.js'

// TODO move validations to "../../validations"
const validateName = ({ name }: ComponentDef) => {
  const errors: ErrorList = {}

  // TODO:- should also validate uniqueness.
  const nameIsEmpty = isEmpty(name)
  const nameHasSpace = /\s/g.test(name)

  if (nameHasSpace) {
    errors.name = {
      href: `#field-name`,
      children: ['name.errors.whitespace']
    }
  } else if (nameIsEmpty) {
    errors.name = {
      href: `#field-name`,
      children: ['errors.field', { field: 'Component name' }]
    }
  }

  return errors
}

const validateContent = (component: ContentComponentsDef) => {
  const errors: ErrorList = {}

  if (!('content' in component) || isEmpty(component.content)) {
    errors.content = {
      href: `#field-content`,
      children: ['errors.field', { field: 'Content' }]
    }
  }

  return errors
}

const validateList = (component: ListComponentsDef) => {
  const errors: ErrorList = {}

  if (!('list' in component)) {
    errors.list = {
      href: `#field-options-list`,
      children: ['list.errors.select']
    }
  }

  return errors
}

export function fieldComponentValidations(component: ComponentDef) {
  const validations = [validateName(component)]

  if (hasTitle(component)) {
    validations.push(
      validateTitle('title', 'field-title', '$t(title)', component.title, i18n)
    )
  }

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

export function validateComponent(selectedComponent: ComponentDef) {
  return {
    errors: fieldComponentValidations(selectedComponent)
  }
}
