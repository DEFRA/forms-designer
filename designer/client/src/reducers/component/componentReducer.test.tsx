import { fieldsReducer } from '~/src/reducers/component/componentReducer.fields.js'
import {
  componentReducer,
  getSubReducer
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

  test('componentReducer adds hasValidated flag correctly', () => {
    expect(
      componentReducer(
        {},
        { type: Fields.EDIT_TITLE, payload: 'changing title' }
      )
    ).toEqual(
      expect.objectContaining({
        hasValidated: false
      })
    )
  })
})
