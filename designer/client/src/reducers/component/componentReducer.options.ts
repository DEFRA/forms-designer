import {
  type ComponentDef,
  type ListTypeOption,
  type ListTypeContent
} from '@defra/forms-model'

import { type ComponentState } from '~/src/reducers/component/componentReducer.jsx'
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

export function optionsReducer(
  state: ComponentState,
  { as, name, payload }: OptionsReducerActions
) {
  const stateNew = structuredClone(state)
  const { selectedComponent } = stateNew

  if (!selectedComponent) {
    throw new Error('No component selected')
  }

  const { type } = selectedComponent

  if (name === Options.EDIT_OPTIONS_HIDE_TITLE && type === as.type) {
    selectedComponent.options.hideTitle = payload
  }

  if (name === Options.EDIT_OPTIONS_REQUIRED && type === as.type) {
    selectedComponent.options.required = payload
  }

  if (name === Options.EDIT_OPTIONS_ROWS && type === as.type) {
    selectedComponent.options.rows = payload
  }

  if (name === Options.EDIT_OPTIONS_HIDE_OPTIONAL && type === as.type) {
    selectedComponent.options.optionalText = payload
  }

  if (name === Options.EDIT_OPTIONS_CLASSES && type === as.type) {
    selectedComponent.options.classes = payload
  }

  if (name === Options.EDIT_OPTIONS_MAX_DAYS_IN_FUTURE && type === as.type) {
    selectedComponent.options.maxDaysInFuture = payload
  }

  if (name === Options.EDIT_OPTIONS_MAX_DAYS_IN_PAST && type === as.type) {
    selectedComponent.options.maxDaysInPast = payload
  }

  if (name === Options.EDIT_OPTIONS_CONDITION && type === as.type) {
    selectedComponent.options.condition = payload
  }

  if (name === Options.EDIT_OPTIONS_TYPE && type === as.type) {
    selectedComponent.options.type = payload
  }

  if (name === Options.EDIT_OPTIONS_AUTOCOMPLETE && type === as.type) {
    selectedComponent.options.autocomplete = payload
  }

  if (name === Options.EDIT_OPTIONS_PREFIX && type === as.type) {
    selectedComponent.options.prefix = payload
  }

  if (name === Options.EDIT_OPTIONS_SUFFIX && type === as.type) {
    selectedComponent.options.suffix = payload
  }

  if (name === Options.EDIT_OPTIONS_CUSTOM_MESSAGE && type === as.type) {
    selectedComponent.options.customValidationMessage = payload
  }

  if (name === Options.EDIT_OPTIONS_MAX_WORDS && type === as.type) {
    selectedComponent.options.maxWords = payload
  }

  return stateNew
}
