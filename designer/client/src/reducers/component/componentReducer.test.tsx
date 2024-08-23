import { ComponentType, type ComponentDef } from '@defra/forms-model'

import { fieldsReducer } from '~/src/reducers/component/componentReducer.fields.js'
import {
  componentReducer,
  getSubReducer,
  type ComponentState,
  type ReducerActions
} from '~/src/reducers/component/componentReducer.jsx'
import { metaReducer } from '~/src/reducers/component/componentReducer.meta.js'
import { optionsReducer } from '~/src/reducers/component/componentReducer.options.js'
import { schemaReducer } from '~/src/reducers/component/componentReducer.schema.js'
import {
  Fields,
  Meta,
  Options,
  Schema
} from '~/src/reducers/component/types.js'

describe('Component reducer', () => {
  const component: ComponentDef = {
    name: 'field',
    title: 'Title',
    type: ComponentType.TextField,
    options: {},
    schema: {}
  }

  test('getSubReducer returns correct reducer', () => {
    const metaAction = Meta.NEW_COMPONENT
    const schemaAction = Schema.EDIT_SCHEMA_MIN
    const fieldsAction = Fields.EDIT_TITLE
    const optionsAction = Options.EDIT_OPTIONS_HIDE_TITLE

    expect(getSubReducer(metaAction)).toEqual(metaReducer)
    expect(getSubReducer(schemaAction)).toEqual(schemaReducer)
    expect(getSubReducer(optionsAction)).toEqual(optionsReducer)
    expect(getSubReducer(fieldsAction)).toEqual(fieldsReducer)
  })

  test('componentReducer sets hasValidated: false', () => {
    const title = 'Updated title'

    const action: ReducerActions = {
      name: Fields.EDIT_TITLE,
      payload: title,
      as: component
    }

    const state: ComponentState = {
      initialName: component.name,
      selectedComponent: component,
      hasValidated: true
    }

    expect(componentReducer(state, action)).toEqual({
      initialName: component.name,
      selectedComponent: { ...component, title },
      hasValidated: false
    })
  })

  test('componentReducer sets hasValidated: true', () => {
    const action: ReducerActions = {
      name: Meta.VALIDATE
    }

    const state: ComponentState = {
      initialName: component.name,
      selectedComponent: component,
      hasValidated: false
    }

    expect(componentReducer(state, action)).toEqual({
      initialName: component.name,
      selectedComponent: component,
      errors: expect.any(Object),
      hasValidated: true
    })
  })
})
