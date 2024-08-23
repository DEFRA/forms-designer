import { type ComponentDef } from '@defra/forms-model'

import { type ComponentState } from '~/src/reducers/component/componentReducer.jsx'
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
      name: Meta.SET_PAGE
      payload: string
      as?: undefined
    }
  | {
      name: Meta.SET_SELECTED_LIST
      payload?: string
      as: Extract<ComponentDef, { list: string }>
    }

export function metaReducer(state: ComponentState, action: MetaReducerActions) {
  const stateNew = structuredClone(state)

  const { selectedComponent } = stateNew
  const { as, name, payload } = action

  if (name === Meta.NEW_COMPONENT) {
    stateNew.selectedComponent = payload
  }

  if (name === Meta.SET_COMPONENT) {
    stateNew.selectedComponent = payload
    stateNew.errors = {}
  }

  if (name === Meta.VALIDATE) {
    stateNew.errors = fieldComponentValidations(selectedComponent)
    stateNew.hasValidated = true
  }

  if (name === Meta.SET_PAGE) {
    stateNew.pagePath = payload
  }

  if (name === Meta.SET_SELECTED_LIST && selectedComponent?.type === as.type) {
    selectedComponent.list = payload ?? ''
  }

  return stateNew
}
