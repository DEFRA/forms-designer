import {
  type ComponentDef,
  type ListTypeOption,
  type ListTypeContent
} from '@defra/forms-model'

import {
  type ComponentState,
  type ReducerActions
} from '~/src/reducers/component/componentReducer.jsx'
import { Options } from '~/src/reducers/component/types.js'

export type OptionsReducerActions =
  | {
      name: Options.EDIT_OPTIONS_HIDE_TITLE
      payload?: boolean
      as: Extract<ComponentDef, { options: { hideTitle?: boolean } }>
    }
  | {
      name: Options.EDIT_OPTIONS_REQUIRED
      payload?: boolean
      as: Extract<ComponentDef, { options: { required?: boolean } }>
    }
  | {
      name: Options.EDIT_OPTIONS_HIDE_OPTIONAL
      payload?: boolean
      as: Extract<ComponentDef, { options: { optionalText?: boolean } }>
    }
  | {
      name: Options.EDIT_OPTIONS_ROWS
      payload?: number
      as: Extract<ComponentDef, { options: { rows?: number } }>
    }
  | {
      name:
        | Options.EDIT_OPTIONS_MAX_DAYS_IN_PAST
        | Options.EDIT_OPTIONS_MAX_DAYS_IN_FUTURE
      payload?: number
      as: Extract<
        ComponentDef,
        { options: { maxDaysInPast?: number; maxDaysInFuture?: number } }
      >
    }
  | {
      name: Options.EDIT_OPTIONS_MAX_WORDS
      payload?: number
      as: Extract<ComponentDef, { options: { maxWords?: number } }>
    }
  | {
      name: Options.EDIT_OPTIONS_CLASSES
      payload?: string
      as: Extract<ComponentDef, { options: { classes?: string } }>
    }
  | {
      name: Options.EDIT_OPTIONS_CONDITION
      payload?: string
      as: Extract<ComponentDef, { options: { condition?: string } }>
    }
  | {
      name: Options.EDIT_OPTIONS_TYPE
      payload?: ListTypeContent
      as: Extract<ComponentDef, { options: { type?: ListTypeContent } }>
    }
  | {
      name: Options.EDIT_OPTIONS_TYPE
      payload?: ListTypeOption
      as: Extract<ComponentDef, { options: { type?: ListTypeOption } }>
    }
  | {
      name: Options.EDIT_OPTIONS_AUTOCOMPLETE
      payload?: string
      as: Extract<ComponentDef, { options: { autocomplete?: string } }>
    }
  | {
      name: Options.EDIT_OPTIONS_PREFIX | Options.EDIT_OPTIONS_SUFFIX
      payload?: string
      as: Extract<
        ComponentDef,
        { options: { prefix?: string; suffix?: string } }
      >
    }
  | {
      name: Options.EDIT_OPTIONS_CUSTOM_MESSAGE
      payload?: string
      as: Extract<
        ComponentDef,
        { options: { customValidationMessage?: string } }
      >
    }
  | {
      name: Options.EDIT_OPTIONS_ACCEPT
      payload?: string
      as: Extract<ComponentDef, { options: { accept?: string } }>
    }

export function optionsReducer(state: ComponentState, action: ReducerActions) {
  const stateNew = structuredClone(state)
  const { selectedComponent } = stateNew

  if (!selectedComponent) {
    throw new Error('No component selected')
  }

  const { as, name, payload } = action
  const { type } = selectedComponent

  // Require validation on every option change
  stateNew.hasValidated = false

  switch (name) {
    case Options.EDIT_OPTIONS_HIDE_TITLE: {
      if (type === as.type) {
        selectedComponent.options.hideTitle = payload
      }

      break
    }

    case Options.EDIT_OPTIONS_REQUIRED: {
      if (type === as.type) {
        selectedComponent.options.required = payload
      }

      break
    }

    case Options.EDIT_OPTIONS_HIDE_OPTIONAL: {
      if (type === as.type) {
        selectedComponent.options.optionalText = payload
      }

      break
    }

    case Options.EDIT_OPTIONS_ROWS: {
      if (type === as.type) {
        selectedComponent.options.rows = Number.isFinite(payload)
          ? payload
          : undefined
      }

      break
    }

    case Options.EDIT_OPTIONS_MAX_DAYS_IN_PAST: {
      if (type === as.type) {
        selectedComponent.options.maxDaysInPast = Number.isFinite(payload)
          ? payload
          : undefined
      }

      break
    }

    case Options.EDIT_OPTIONS_MAX_DAYS_IN_FUTURE: {
      if (type === as.type) {
        selectedComponent.options.maxDaysInFuture = Number.isFinite(payload)
          ? payload
          : undefined
      }

      break
    }

    case Options.EDIT_OPTIONS_MAX_WORDS: {
      if (type === as.type) {
        selectedComponent.options.maxWords = Number.isFinite(payload)
          ? payload
          : undefined
      }

      break
    }

    case Options.EDIT_OPTIONS_CLASSES: {
      if (type === as.type) {
        selectedComponent.options.classes = payload
      }

      break
    }

    case Options.EDIT_OPTIONS_CONDITION: {
      if (type === as.type) {
        selectedComponent.options.condition = payload
      }

      break
    }

    case Options.EDIT_OPTIONS_TYPE: {
      if (type === as.type) {
        selectedComponent.options.type = payload
      }

      break
    }

    case Options.EDIT_OPTIONS_AUTOCOMPLETE: {
      if (type === as.type) {
        selectedComponent.options.autocomplete = payload
      }

      break
    }

    case Options.EDIT_OPTIONS_PREFIX: {
      if (type === as.type) {
        selectedComponent.options.prefix = payload
      }

      break
    }

    case Options.EDIT_OPTIONS_SUFFIX: {
      if (type === as.type) {
        selectedComponent.options.suffix = payload
      }

      break
    }

    case Options.EDIT_OPTIONS_CUSTOM_MESSAGE: {
      if (type === as.type) {
        selectedComponent.options.customValidationMessage = payload
      }

      break
    }

    case Options.EDIT_OPTIONS_ACCEPT: {
      if (type === as.type) {
        selectedComponent.options.accept = payload
      }

      break
    }
  }

  return stateNew
}
