import { type ComponentDef } from '@defra/forms-model'

import { type ComponentState } from '~/src/reducers/component/componentReducer.jsx'
import { Fields } from '~/src/reducers/component/types.js'

export type FieldsReducerActions =
  | {
      name: Fields.EDIT_NAME
      payload: string
      as?: undefined
    }
  | {
      name: Fields.EDIT_TITLE
      payload: string
      as: Extract<ComponentDef, { title: string }>
    }
  | {
      name: Fields.EDIT_HELP
      payload?: string
      as: Extract<ComponentDef, { hint?: string }>
    }
  | {
      name: Fields.EDIT_CONTENT
      payload: string
      as: Extract<ComponentDef, { content: string }>
    }

export function fieldsReducer(
  state: ComponentState,
  action: FieldsReducerActions
) {
  const stateNew = structuredClone(state)
  const { selectedComponent } = stateNew

  if (!selectedComponent) {
    throw new Error('No component selected')
  }

  const { as, name, payload } = action
  const { type } = selectedComponent

  if (name === Fields.EDIT_NAME) {
    selectedComponent.name = payload
  }

  if (name === Fields.EDIT_CONTENT && type === as.type) {
    selectedComponent.content = payload
  }

  if (name === Fields.EDIT_TITLE && type === as.type) {
    selectedComponent.title = payload
  }

  if (name === Fields.EDIT_HELP && type === as.type) {
    selectedComponent.hint = payload
  }

  return stateNew
}
