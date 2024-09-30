import { ComponentType, type ComponentDef } from '@defra/forms-model'
import Joi from 'joi'

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
  const component1: ComponentDef = {
    name: 'field1',
    title: 'Text field',
    type: ComponentType.TextField,
    options: {},
    schema: {}
  }

  const component2: ComponentDef = {
    name: 'field2',
    title: 'UK address field',
    type: ComponentType.UkAddressField,
    options: {}
  }

  test('getSubReducer returns correct reducer', () => {
    const metaAction: ReducerActions = {
      name: Meta.NEW_COMPONENT,
      payload: component1
    }

    const schemaAction: ReducerActions = {
      name: Schema.EDIT_SCHEMA_MIN,
      payload: 2,
      as: component1
    }

    const optionsAction: ReducerActions = {
      name: Options.EDIT_OPTIONS_HIDE_TITLE,
      payload: true,
      as: component2
    }

    const fieldsAction: ReducerActions = {
      name: Fields.EDIT_TITLE,
      payload: 'Updated title',
      as: component2
    }

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
      as: component1
    }

    const state: ComponentState = {
      selectedComponent: component1,
      hasValidated: true,
      errors: {}
    }

    expect(componentReducer(state, action)).toEqual({
      selectedComponent: { ...component1, title },
      errors: expect.any(Object),
      hasValidated: false
    })
  })

  test('componentReducer sets hasValidated: true', () => {
    const action: ReducerActions = {
      name: Meta.VALIDATE,
      payload: Joi
    }

    const state: ComponentState = {
      selectedComponent: component1,
      hasValidated: false,
      errors: {}
    }

    expect(componentReducer(state, action)).toEqual({
      selectedComponent: component1,
      errors: expect.any(Object),
      hasValidated: true
    })
  })
})
