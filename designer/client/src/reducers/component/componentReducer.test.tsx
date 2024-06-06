import { fieldsReducer } from '~/src/reducers/component/componentReducer.fields.js'
import {
  componentReducer,
  getSubReducer
} from '~/src/reducers/component/componentReducer.jsx'
import { metaReducer } from '~/src/reducers/component/componentReducer.meta.js'
import { optionsReducer } from '~/src/reducers/component/componentReducer.options.js'
import { schemaReducer } from '~/src/reducers/component/componentReducer.schema.js'
import { Actions } from '~/src/reducers/component/types.js'

describe('Component reducer', () => {
  test('getSubReducer returns correct reducer', () => {
    const metaAction = Actions.NEW_COMPONENT
    const schemaAction = Actions.EDIT_SCHEMA_MIN
    const fieldsAction = Actions.EDIT_TITLE
    const optionsAction = Actions.EDIT_OPTIONS_HIDE_TITLE

    expect(getSubReducer(metaAction)).toEqual(metaReducer)
    expect(getSubReducer(schemaAction)).toEqual(schemaReducer)
    expect(getSubReducer(optionsAction)).toEqual(optionsReducer)
    expect(getSubReducer(fieldsAction)).toEqual(fieldsReducer)
  })

  test('componentReducer adds hasValidated flag correctly', () => {
    expect(
      componentReducer(
        {},
        { type: Actions.EDIT_TITLE, payload: 'changing title' }
      )
    ).toEqual(
      expect.objectContaining({
        hasValidated: false
      })
    )
  })
})
