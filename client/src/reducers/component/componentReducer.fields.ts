import { type ComponentDef } from '@defra/forms-model'

import {
  type ComponentState,
  type ReducerActions
} from '~/src/reducers/component/componentReducer.jsx'
import { Fields } from '~/src/reducers/component/types.js'

export type FieldsReducerActions =
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
  | {
      name: Fields.EDIT_LIST
      payload: string
      as: Extract<ComponentDef, { list: string }>
    }

export function fieldsReducer(state: ComponentState, action: ReducerActions) {
  const stateNew = structuredClone(state)
  const { selectedComponent } = stateNew

  if (!selectedComponent) {
    throw new Error('No component selected')
  }

  const { as, name, payload } = action
  const { type } = selectedComponent

  // Require validation on every field change
  stateNew.hasValidated = false

  switch (name) {
    case Fields.EDIT_TITLE: {
      if (type === as.type) {
        selectedComponent.title = payload
      }

      break
    }

    case Fields.EDIT_HELP: {
      if (type === as.type) {
        selectedComponent.hint = payload
      }

      break
    }

    case Fields.EDIT_CONTENT: {
      if (type === as.type) {
        selectedComponent.content = payload
      }

      break
    }

    case Fields.EDIT_LIST: {
      if (type === as.type) {
        selectedComponent.list = payload
      }

      break
    }
  }

  return stateNew
}
