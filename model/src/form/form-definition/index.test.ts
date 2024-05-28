import { formDefinitionSchema } from '~/src/form/form-definition/index.js'

const baseConfiguration = {
  metadata: {},
  startPage: '/first-page',
  pages: [],
  lists: [],
  sections: [],
  conditions: [],
  outputs: [],
  version: 2,
  skipSummary: false,
  phaseBanner: {}
}

test('allows feedback URL to be an empty string when feedbackForm is false', () => {
  const goodConfiguration = {
    ...baseConfiguration,
    feedback: {
      feedbackForm: false,
      url: ''
    },
    name: 'Schema fix 3'
  }

  const { error } = formDefinitionSchema.validate(goodConfiguration, {
    abortEarly: false
  })

  expect(error).toBeUndefined()
})
