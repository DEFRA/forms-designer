import {
  hasContent,
  hasContentField,
  hasListField,
  hasTitle,
  type ComponentDef
} from '@defra/forms-model'

import { i18n } from '~/src/i18n/i18n.jsx'
import { type ComponentState } from '~/src/reducers/component/componentReducer.jsx'
import { validateName, validateRequired } from '~/src/validations.js'

export function fieldComponentValidations(component?: ComponentDef) {
  const errors: ComponentState['errors'] = {}

  if (hasTitle(component)) {
    errors.title = validateRequired('field-title', component.title, {
      label: i18n('common.titleField.title')
    })
  }

  if (!hasContent(component)) {
    errors.name = validateName('field-name', component?.name, {
      label: i18n('common.componentNameField.title')
    })
  }

  if (hasContentField(component)) {
    errors.content = validateRequired('field-content', component.content, {
      label: 'Content'
    })
  }

  if (hasListField(component)) {
    errors.list = validateRequired('field-options-list', component.list, {
      message: 'list.errors.select'
    })
  }

  return errors
}
