import randomId from '~/src/randomId.js'
import { validateComponent } from '~/src/reducers/component/componentReducer.validations.js'
import { Meta } from '~/src/reducers/component/types.js'

export function metaReducer(
  state,
  action: {
    type: Meta
    payload?: unknown
  }
) {
  const { type, payload } = action
  const { selectedComponent = {} } = state
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
      return {
        ...state,
        selectedComponent: {
          name: randomId(),
          title: '',
          schema: {},
          options: { required: true }
        }
      }
    case Meta.SET_COMPONENT:
      return { ...state, selectedComponent: payload, errors: {} }
    case Meta.SET_PAGE:
      return { ...state, pagePath: payload }
    case Meta.VALIDATE:
      return {
        ...state,
        ...validateComponent(selectedComponent)
      }
  }
}
