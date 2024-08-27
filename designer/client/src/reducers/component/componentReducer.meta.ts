import { type ComponentState } from '~/src/reducers/component/componentReducer.jsx'
import { validateComponent } from '~/src/reducers/component/componentReducer.validations.js'
import { Meta } from '~/src/reducers/component/types.js'

export function metaReducer(
  state: ComponentState,
  action: {
    type: Meta
    payload?: unknown
  }
): ComponentState {
  const { type, payload } = action
  const { selectedComponent } = state

  switch (type) {
    case Meta.SET_SELECTED_LIST:
      return {
        ...state,
        selectedComponent: {
          ...selectedComponent,
          list: payload
        }
      }

    case Meta.NEW_COMPONENT:
      return { ...state, selectedComponent: payload }

    case Meta.SET_COMPONENT:
      return { ...state, selectedComponent: payload, errors: {} }

    case Meta.VALIDATE:
      return {
        ...state,
        ...validateComponent(selectedComponent)
      }
  }
}
