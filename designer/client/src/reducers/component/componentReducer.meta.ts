import { type ComponentDef } from '@defra/forms-model'

import {
  type ComponentState,
  type ReducerActions
} from '~/src/reducers/component/componentReducer.jsx'
import { fieldComponentValidations } from '~/src/reducers/component/componentReducer.validations.js'
import { Meta } from '~/src/reducers/component/types.js'

export type MetaReducerActions =
  | {
      name: Meta.NEW_COMPONENT
      payload: ComponentDef
      as?: undefined
    }
  | {
      name: Meta.SET_COMPONENT | Meta.VALIDATE
      payload?: undefined
      as?: undefined
    }
  | {
      name: Meta.SET_SELECTED_LIST
      payload?: string
      as: Extract<ComponentDef, { list: string }>
    }

export function metaReducer(state: ComponentState, action: ReducerActions) {
  const stateNew = structuredClone(state)

  const { selectedComponent } = stateNew
  const { as, name, payload } = action

  // Require validation on every meta change
  stateNew.hasValidated = false

  switch (name) {
    case Meta.NEW_COMPONENT:
      stateNew.selectedComponent = payload
      break

    case Meta.SET_COMPONENT:
      stateNew.selectedComponent = undefined
      stateNew.errors = {}
      break

    case Meta.VALIDATE:
      stateNew.errors = fieldComponentValidations(selectedComponent)
      stateNew.hasValidated = true
      break

    case Meta.SET_SELECTED_LIST: {
      if (selectedComponent?.type === as.type) {
        selectedComponent.list = payload ?? ''
      }

      break
    }
  }

  return stateNew
}
