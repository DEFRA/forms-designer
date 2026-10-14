import { type ComponentDef } from '@defra/forms-model'

import {
  type ComponentState,
  type ReducerActions
} from '~/src/reducers/component/componentReducer.jsx'
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

export function schemaReducer(state: ComponentState, action: ReducerActions) {
  const stateNew = structuredClone(state)
  const { selectedComponent } = stateNew

  if (!selectedComponent) {
    throw new Error('No component selected')
  }

  const { as, name, payload } = action
  const { type } = selectedComponent

  // Require validation on every schema change
  stateNew.hasValidated = false

  switch (name) {
    case Schema.EDIT_SCHEMA_MIN: {
      if (type === as.type) {
        selectedComponent.schema.min = Number.isFinite(payload)
          ? payload
          : undefined
      }

      break
    }

    case Schema.EDIT_SCHEMA_MAX: {
      if (type === as.type) {
        selectedComponent.schema.max = Number.isFinite(payload)
          ? payload
          : undefined
      }

      break
    }

    case Schema.EDIT_SCHEMA_PRECISION: {
      if (type === as.type) {
        selectedComponent.schema.precision = Number.isFinite(payload)
          ? payload
          : undefined
      }

      break
    }

    case Schema.EDIT_SCHEMA_LENGTH: {
      if (type === as.type) {
        selectedComponent.schema.length = Number.isFinite(payload)
          ? payload
          : undefined
      }

      break
    }

    case Schema.EDIT_SCHEMA_REGEX: {
      if (type === as.type) {
        selectedComponent.schema.regex = payload
      }

      break
    }
  }

  return stateNew
}
