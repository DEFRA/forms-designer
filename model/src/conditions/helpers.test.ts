import { getConditionV2 } from '~/src/conditions/index.js'
import { type FormDefinition } from '~/src/form/form-definition/types.js'

describe('condition helpers', () => {
  test('can get condition if exists', () => {
    const definition: FormDefinition = {
      conditions: [
        {
          id: '1',
          displayName: '',
          items: []
        }
      ],
      pages: [],
      lists: [],
      sections: []
    }

    expect(getConditionV2(definition, '1')).toEqual(definition.conditions[0])
  })

  test('throws if condition does not exist', () => {
    const definition: FormDefinition = {
      conditions: [
        {
          id: '1',
          displayName: '',
          items: []
        }
      ],
      pages: [],
      lists: [],
      sections: []
    }

    expect(() => getConditionV2(definition, '2')).toThrow(
      "Condition '2' not found in form"
    )
  })
})
