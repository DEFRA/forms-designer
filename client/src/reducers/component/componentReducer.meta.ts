import { type ComponentDef } from '@defra/forms-model'
import { type Root } from 'joi'

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
      name: Meta.SET_COMPONENT
      payload?: undefined
      as?: undefined
    }
  | {
      name: Meta.VALIDATE
      payload: Root
      as?: undefined
    }
  | {
      name: Meta.EDIT
      payload: boolean
      as?: undefined
    }

export function metaReducer(state: ComponentState, action: ReducerActions) {
  const stateNew = structuredClone(state)

  const { selectedComponent } = stateNew
  const { name, payload } = action

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
      stateNew.errors = fieldComponentValidations(selectedComponent, payload)
      stateNew.hasValidated = true
      break
  }

  return stateNew
}
