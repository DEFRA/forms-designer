import { type ComponentState } from '~/src/reducers/component/componentReducer.jsx'
import { Options } from '~/src/reducers/component/types.js'

export function optionsReducer(
  state: ComponentState,
  action: {
    type: Options
    payload?: unknown
  }
): ComponentState {
  const { type, payload } = action
  const { selectedComponent } = state
  const { options = {} } = selectedComponent ?? {}

  switch (type) {
    case Options.EDIT_OPTIONS_HIDE_TITLE:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, hideTitle: payload }
        }
      }
    case Options.EDIT_OPTIONS_REQUIRED:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, required: payload }
        }
      }
    case Options.EDIT_OPTIONS_ROWS:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, rows: payload }
        }
      }

    case Options.EDIT_OPTIONS_HIDE_OPTIONAL:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, optionalText: payload }
        }
      }
    case Options.EDIT_OPTIONS_CLASSES:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, classes: payload }
        }
      }

    case Options.EDIT_OPTIONS_MAX_DAYS_IN_FUTURE:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, maxDaysInFuture: payload }
        }
      }
    case Options.EDIT_OPTIONS_MAX_DAYS_IN_PAST:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, maxDaysInPast: payload }
        }
      }
    case Options.EDIT_OPTIONS_CONDITION:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, condition: payload }
        }
      }
    case Options.EDIT_OPTIONS_TYPE:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, type: payload }
        }
      }
    case Options.EDIT_OPTIONS_AUTOCOMPLETE:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, autocomplete: payload }
        }
      }
    case Options.EDIT_OPTIONS_PREFIX:
      return {
        ...state,
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, prefix: payload }
        }
      }
    case Options.EDIT_OPTIONS_SUFFIX:
      return {
        ...state,
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, suffix: payload }
        }
      }
    case Options.EDIT_OPTIONS_CUSTOM_MESSAGE:
      return {
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, customValidationMessage: payload }
        }
      }

    case Options.EDIT_OPTIONS_MAX_WORDS:
      return {
        ...state,
        selectedComponent: {
          ...selectedComponent,
          options: { ...options, maxWords: payload }
        }
      }
  }
}
