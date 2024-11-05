import { formDefinitionSchema } from '~/src/form/form-definition/index.js'
import { type FormDefinition } from '~/src/form/form-definition/types.js'

describe('Form definition schema', () => {
  let definition: FormDefinition

  beforeEach(() => {
    definition = {
      pages: [],
      lists: [],
      sections: [],
      conditions: []
    }
  })

  describe('Feedback', () => {
    it("should allow empty feedback URL when 'feedbackForm' is false", () => {
      definition.feedback = {
        feedbackForm: false,
        url: ''
      }

      const result = formDefinitionSchema.validate(definition, {
        abortEarly: false
      })

      expect(result.error).toBeUndefined()
    })
  })
})
