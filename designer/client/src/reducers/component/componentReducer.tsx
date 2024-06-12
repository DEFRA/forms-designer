import { type ComponentDef } from '@defra/forms-model'
import React, { useReducer, createContext, type Dispatch } from 'react'

import logger from '~/src/plugins/logger.js'
import randomId from '~/src/randomId.js'
import { fieldsReducer } from '~/src/reducers/component/componentReducer.fields.js'
import { metaReducer } from '~/src/reducers/component/componentReducer.meta.js'
import { optionsReducer } from '~/src/reducers/component/componentReducer.options.js'
import { schemaReducer } from '~/src/reducers/component/componentReducer.schema.js'
import {
  type ComponentActions,
  Meta,
  Schema,
  Fields,
  Options,
  Actions
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
 * Context providing the {@link ComponentState} and {@link dispatch} for changing any values specified by {@link Actions}
 */
export const ComponentContext = createContext<{
  state: ComponentState
  dispatch: Dispatch<{
    type: string
    payload?: string
  }>
}>({
  state: defaultValues,
  dispatch: () => {}
})

/**
 * A map of the Actions and the associated reducer
 */
const ActionsReducerCollection = [
  [Meta, metaReducer],
  [Options, optionsReducer],
  [Fields, fieldsReducer],
  [Schema, schemaReducer]
]

export function valueIsInEnum<T>(value: keyof ComponentActions, enumType: T) {
  return Object.values(enumType).includes(value)
}

/**
 * when an {@link Actions} is passed to getSubReducer, it will return the associated reducer defined in {@link ActionsReducerCollection}
 */
export function getSubReducer(type) {
  return ActionsReducerCollection.find((a) => valueIsInEnum(type, a[0]))?.[1]
}

const isNotValidate = (type): type is Meta.VALIDATE => {
  return Object.values(Actions).includes(type)
}

export function componentReducer(
  state,
  action: {
    type: ComponentActions
    payload: any
  }
) {
  const { type } = action
  const { selectedComponent } = state

  if (isNotValidate(type)) {
    state.hasValidated = false
  }

  const subReducer: any = getSubReducer(type)

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
    isNew: props?.isNew || ((selectedComponent?.name && false) ?? true),
    listItemErrors: {}
  }
}

/**
 * Allows components to retrieve {@link ComponentState} and {@link dispatch} from any component nested within `<ComponentContextProvider>`
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
