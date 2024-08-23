import { type ComponentDef } from '@defra/forms-model'
import React, {
  useReducer,
  createContext,
  type Dispatch,
  type ReactNode
} from 'react'

import { type ErrorList } from '~/src/ErrorSummary.jsx'
import { logger } from '~/src/common/helpers/logging/logger.js'
import randomId from '~/src/randomId.js'
import {
  fieldsReducer,
  type FieldsReducerActions
} from '~/src/reducers/component/componentReducer.fields.js'
import {
  metaReducer,
  type MetaReducerActions
} from '~/src/reducers/component/componentReducer.meta.js'
import {
  optionsReducer,
  type OptionsReducerActions
} from '~/src/reducers/component/componentReducer.options.js'
import {
  schemaReducer,
  type SchemaReducerActions
} from '~/src/reducers/component/componentReducer.schema.js'
import {
  Fields,
  Meta,
  Options,
  Schema,
  type Action,
  type Actions
} from '~/src/reducers/component/types.js'

export interface ComponentState {
  initialName: string
  selectedComponent?: ComponentDef
  hasValidated?: boolean
  showDeleteWarning?: boolean
  pagePath?: string
  errors: Partial<ErrorList<'title' | 'name' | 'content' | 'list'>>
}

export type ReducerActions =
  | MetaReducerActions
  | OptionsReducerActions
  | FieldsReducerActions
  | SchemaReducerActions

export interface ComponentContextType {
  state: ComponentState
  dispatch: Dispatch<ReducerActions>
}

/**
 * Context providing the {@link ComponentState} and {@link Dispatch} for changing any values specified by the enum type
 */
export const ComponentContext = createContext<ComponentContextType>({
  state: {} as ComponentState,
  dispatch: () => ({})
})

/**
 * Reducers mapped by action type
 */
const reducerByActionType = [
  [Meta, metaReducer],
  [Options, optionsReducer],
  [Fields, fieldsReducer],
  [Schema, schemaReducer]
] as const

export function valueIsInEnum(type: Action, collection: Actions) {
  return Object.values(collection).includes(type)
}

/**
 * when an enum is passed to getSubReducer, it will return the associated reducer defined in {@link reducerByActionType}
 */
export function getSubReducer(type: Action) {
  return reducerByActionType.find((a) => valueIsInEnum(type, a[0]))?.[1]
}

export function componentReducer(
  state: ComponentState,
  action: ReducerActions
): ComponentState {
  const { name } = action
  const { selectedComponent } = state

  if (name !== Meta.VALIDATE) {
    state.hasValidated = false
  }

  const subReducer = getSubReducer(name)

  if (!subReducer) {
    logger.warn(`Unrecognised action: ${action.name}`)
    return { ...state, selectedComponent }
  }

  return {
    ...state,
    ...subReducer(state, action)
  }
}

export const initComponentState = (
  props?: Omit<ComponentState, 'initialName'>
): ComponentState => {
  const { selectedComponent, pagePath, errors = {} } = props ?? {}

  return {
    initialName: selectedComponent?.name ?? randomId(),
    selectedComponent,
    pagePath,
    errors
  }
}

/**
 * Allows components to retrieve {@link ComponentState} and {@link Dispatch} from any component nested within `<ComponentContextProvider>`
 */
export const ComponentContextProvider = (
  props: Parameters<typeof initComponentState>[0] & {
    children: ReactNode
  }
) => {
  const { children, ...rest } = props
  const [state, dispatch] = useReducer(
    componentReducer,
    initComponentState(rest)
  )

  return (
    <ComponentContext.Provider value={{ state, dispatch }}>
      {children}
    </ComponentContext.Provider>
  )
}
