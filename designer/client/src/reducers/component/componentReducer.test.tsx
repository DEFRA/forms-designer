import {
  componentReducer,
  getSubReducer
} from '~/src/reducers/component/componentReducer'
import { Actions } from '~/src/reducers/component/types'
import {
  metaReducer,
  optionsReducer,
  fieldsReducer,
  schemaReducer,
  componentListReducer,
  componentListItemReducer
} from '~/src/reducers/component'

describe('Component reducer', () => {
  test('getSubReducer returns correct reducer', () => {
    const metaAction = Actions.NEW_COMPONENT
    const schemaAction = Actions.EDIT_SCHEMA_MIN
    const fieldsAction = Actions.EDIT_TITLE
    const optionsAction = Actions.EDIT_OPTIONS_HIDE_TITLE
    const listAction = Actions.EDIT_LIST
    const listItemAction = Actions.STATIC_LIST_ITEM_EDIT_VALUE

    expect(getSubReducer(metaAction)).toEqual(metaReducer)
    expect(getSubReducer(schemaAction)).toEqual(schemaReducer)
    expect(getSubReducer(optionsAction)).toEqual(optionsReducer)
    expect(getSubReducer(fieldsAction)).toEqual(fieldsReducer)
    expect(getSubReducer(listAction)).toEqual(componentListReducer)
    expect(getSubReducer(listItemAction)).toEqual(componentListItemReducer)
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
