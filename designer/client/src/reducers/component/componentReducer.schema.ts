import { type ComponentDef } from '@defra/forms-model'

import { type ComponentState } from '~/src/reducers/component/componentReducer.jsx'
import { Schema } from '~/src/reducers/component/types.js'

export type SchemaReducerActions =
  | {
      name: Schema.EDIT_SCHEMA_MIN | Schema.EDIT_SCHEMA_MAX
      payload?: number
      as: Extract<ComponentDef, { schema: { min?: number; max?: number } }>
    }
  | {
      name: Schema.EDIT_SCHEMA_PRECISION
      payload?: number
      as: Extract<ComponentDef, { schema: { precision?: number } }>
    }
  | {
      name: Schema.EDIT_SCHEMA_LENGTH
      payload?: number
      as: Extract<ComponentDef, { schema: { length?: number } }>
    }
  | {
      name: Schema.EDIT_SCHEMA_REGEX
      payload?: string
      as: Extract<ComponentDef, { schema: { regex?: string } }>
    }

export function schemaReducer(
  state: ComponentState,
  action: SchemaReducerActions
) {
  const stateNew = structuredClone(state)
  const { selectedComponent } = stateNew

  if (!selectedComponent) {
    return stateNew
  }

  const { as, name, payload } = action
  const { type } = selectedComponent

  if (name === Schema.EDIT_SCHEMA_MIN && type === as.type) {
    selectedComponent.schema.min = payload
  }

  if (name === Schema.EDIT_SCHEMA_MAX && type === as.type) {
    selectedComponent.schema.max = payload
  }

  if (name === Schema.EDIT_SCHEMA_PRECISION && type === as.type) {
    selectedComponent.schema.precision = payload
  }

  if (name === Schema.EDIT_SCHEMA_LENGTH && type === as.type) {
    selectedComponent.schema.length = payload
  }

  if (name === Schema.EDIT_SCHEMA_REGEX && type === as.type) {
    selectedComponent.schema.regex = payload
  }

  return stateNew
}
