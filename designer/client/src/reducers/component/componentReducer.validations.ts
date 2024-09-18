import {
  hasContent,
  hasContentField,
  hasListField,
  hasTitle,
  type ComponentDef
} from '@defra/forms-model'
import { type Root } from 'joi'

import { i18n } from '~/src/i18n/i18n.jsx'
import { type ComponentState } from '~/src/reducers/component/componentReducer.jsx'
import { validateName, validateRequired } from '~/src/validations.js'

export function fieldComponentValidations(
  component: ComponentDef | undefined,
  schema: Root
) {
  const errors: ComponentState['errors'] = {}

  if (hasTitle(component)) {
    errors.title = validateRequired('field-title', component.title, {
      label: i18n('common.titleField.title'),
      schema
    })
  }

  if (!hasContent(component)) {
    errors.name = validateName('field-name', component?.name, {
      label: i18n('common.componentNameField.title'),
      schema
    })
  }

  if (hasContentField(component)) {
    errors.content = validateRequired('field-content', component.content, {
      label: 'Content',
      schema
    })
  }

  if (hasListField(component)) {
    errors.list = validateRequired('field-options-list', component.list, {
      message: 'list.errors.select',
      schema
    })
  }

  return errors
}
