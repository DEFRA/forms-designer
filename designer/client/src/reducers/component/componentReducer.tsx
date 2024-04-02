import React, { useReducer, createContext } from 'react'
import randomId from '~/src/randomId'
import { schemaReducer } from '~/src/reducers/component/componentReducer.schema'
import { optionsReducer } from '~/src/reducers/component/componentReducer.options'
import { metaReducer } from '~/src/reducers/component/componentReducer.meta'
import { fieldsReducer } from '~/src/reducers/component/componentReducer.fields'

import {
  type ComponentActions,
  Meta,
  Schema,
  Fields,
  Options,
  Actions
} from '~/src/reducers/component/types'
import { ComponentDef } from '@defra/forms-model'
import logger from '~/src/plugins/logger'

type ComponentState = {
  selectedComponent: Partial<ComponentDef>
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
  dispatch: React.Dispatch<any>
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
  return Object.values(enumType).indexOf(value) !== -1
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
    logger.log('Unrecognised action:', action.type)
    return { ...state, selectedComponent }
  }
}

export const initComponentState = (props) => {
  const selectedComponent = props?.component
  const newName = randomId()
  return {
    selectedComponent: selectedComponent ?? { name: newName, options: {} },
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
