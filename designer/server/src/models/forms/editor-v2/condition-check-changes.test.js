import { testFormDefinitionWithMultipleV2Conditions } from '~/src/__stubs__/form-definition.js'
import { getImpactedPages } from '~/src/models/forms/editor-v2/condition-check-changes.js'

describe('editor-v2 - condition-check-changes', () => {
  describe('getImpactedPages', () => {
    test('should return no pages', () => {
      const definition = structuredClone(
        testFormDefinitionWithMultipleV2Conditions
      )
      expect(getImpactedPages(definition, '')).toEqual([])
    })

    test('should return one page with its titles', () => {
      const definition = structuredClone(
        testFormDefinitionWithMultipleV2Conditions
      )
      // @ts-expect-error - condition may not exist on page
      definition.pages[2].condition = 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2'
      expect(
        getImpactedPages(definition, 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2')
      ).toEqual(['Page 3: Fave animal'])
    })

    test('should return multiple pages with their titles', () => {
      const definition = structuredClone(
        testFormDefinitionWithMultipleV2Conditions
      )
      // @ts-expect-error - condition may not exist on page
      definition.pages[0].condition = 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2'
      // @ts-expect-error - condition may not exist on page
      definition.pages[1].condition = 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2'
      // @ts-expect-error - condition may not exist on page
      definition.pages[2].condition = 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2'
      expect(
        getImpactedPages(definition, 'd5e9f931-e151-4dd6-a2b9-68a03f3537e2')
      ).toEqual([
        'Page 1: What is your full name',
        'Page 2: Fave color',
        'Page 3: Fave animal'
      ])
    })
  })
})
