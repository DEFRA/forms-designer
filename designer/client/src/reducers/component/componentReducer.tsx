import { type ComponentDef } from '@defra/forms-model'
import React, { useReducer, createContext, type Dispatch } from 'react'

import { logger } from '~/src/common/helpers/logging/logger.js'
import randomId from '~/src/randomId.js'
import { fieldsReducer } from '~/src/reducers/component/componentReducer.fields.js'
import { metaReducer } from '~/src/reducers/component/componentReducer.meta.js'
import { optionsReducer } from '~/src/reducers/component/componentReducer.options.js'
import { schemaReducer } from '~/src/reducers/component/componentReducer.schema.js'
import {
  Fields,
  Meta,
  Options,
  Schema,
  type Action,
  type Actions
} from '~/src/reducers/component/types.js'

interface ComponentState {
  selectedComponent?: Partial<ComponentDef>
  isNew?: boolean
  initialName?: ComponentDef['name']
  pagePath?: string
  listItemErrors?: {}
}

const defaultValues = {
  selectedComponent: {}
}

/**
 * Context providing the {@link ComponentState} and {@link Dispatch} for changing any values specified by the enum type
 */
export const ComponentContext = createContext<{
  state: ComponentState
  dispatch: Dispatch<{
    type: Action
    payload?: string
  }>
}>({
  state: defaultValues,
  dispatch: () => {}
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
  state,
  action: {
    type: Action
    payload?: unknown
  }
) {
  const { type } = action
  const { selectedComponent = {} } = state

  if (type !== Meta.VALIDATE) {
    state.hasValidated = false
  }

  const subReducer = getSubReducer(type)

  if (subReducer) {
    return {
      ...state,
      ...subReducer(state, action)
    }
  } else {
    logger.warn(`Unrecognised action: ${action.type}`)
    return { ...state, selectedComponent }
  }
}

export const initComponentState = (props) => {
  const selectedComponent = props?.component
  const newName = randomId()
  return {
    selectedComponent: selectedComponent ?? {
      name: newName,
      options: {},
      schema: {}
    },
    initialName: selectedComponent?.name ?? newName,
    pagePath: props?.pagePath,
    isNew: props?.isNew ?? !selectedComponent?.name,
    listItemErrors: {}
  }
}

/**
 * Allows components to retrieve {@link ComponentState} and {@link Dispatch} from any component nested within `<ComponentContextProvider>`
 */
export const ComponentContextProvider = (props) => {
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
