import { testFormDefinitionWithComponentsAndLeadingGuidance } from '~/src/__stubs__/form-definition.js'
import { mergeMissingComponentsIntoOrder } from '~/src/routes/forms/editor-v2/helpers.js'

describe('Editor v2 helpers', () => {
  describe('mergeMissingComponentsIntoOrder', () => {
    test('should retain position of components not in the order array', () => {
      const page =
        testFormDefinitionWithComponentsAndLeadingGuidance.pages.at(0)
      const order = [
        '43425d8e-4832-4ed1-a574-1d29fd63cf3c',
        'cda48ac2-91b1-47a8-ba14-8480b5d2c86f'
      ]
      mergeMissingComponentsIntoOrder(page, order)
      expect(order).toEqual([
        '04132d25-a648-43ae-9d5d-6fa410ae8d99',
        '43425d8e-4832-4ed1-a574-1d29fd63cf3c',
        'cda48ac2-91b1-47a8-ba14-8480b5d2c86f'
      ])
    })
  })
})
