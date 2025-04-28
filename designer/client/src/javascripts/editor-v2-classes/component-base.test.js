import { ComponentBase } from '~/src/javascripts/editor-v2-classes/component-base.js'

describe('ComponentBase class', () => {
  const componentBase = new ComponentBase(document)
  describe('initialisation', () => {
    test('should create class', () => {
      expect(componentBase).toBeDefined()
      expect(componentBase.baseDomElements).toBeDefined()
    })
  })
})
