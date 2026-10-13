import { ConditionEvaluationOutcome } from '~/src/form/form-submission/enums.js'
import {
  formSubmitConditionEvaluationSchema,
  formSubmitPayloadSchema,
  saveAndExitMessageData,
  saveAndExitV2MessageData
} from '~/src/form/form-submission/index.js'
import { type SubmitPayload } from '~/src/form/form-submission/types.js'

const conditionId = 'ab1bbaae-bf0e-4577-8416-8a8c83da1fb9'
const componentId = '1c61fa1f-a8dc-463c-ade0-13aa7cbf4960'

const basePayload: SubmitPayload = {
  retrievalKey: 'enrique.chase@defra.gov.uk',
  sessionId: '1ba0b7e9-5b93-4b0c-8b8b-6d6a3b1e2a53',
  main: [{ name: 'yBpZQO', title: 'Your name', value: 'Enrique Chase' }],
  repeaters: [],
  language: 'en-GB',
  referenceNumber: 'XXX-XXX-XXX'
}

describe('formSubmitConditionEvaluationSchema', () => {
  it('should accept a fully populated evaluation', () => {
    const { error, value } = formSubmitConditionEvaluationSchema.validate({
      conditionId,
      outcome: ConditionEvaluationOutcome.True,
      references: [{ componentId, componentName: 'yBpZQO', answered: false }]
    })

    expect(error).toBeUndefined()
    expect(value).toMatchObject({
      conditionId,
      outcome: ConditionEvaluationOutcome.True
    })
  })

  it('should accept an evaluation with no references', () => {
    const { error } = formSubmitConditionEvaluationSchema.validate({
      conditionId,
      outcome: ConditionEvaluationOutcome.False,
      references: []
    })

    expect(error).toBeUndefined()
  })

  it('should reject an unknown outcome', () => {
    const { error } = formSubmitConditionEvaluationSchema.validate({
      conditionId,
      outcome: 'maybe',
      references: []
    })

    expect(error).toBeDefined()
    expect(error?.message).toContain('outcome')
  })

  it('should reject a missing references array', () => {
    const { error } = formSubmitConditionEvaluationSchema.validate({
      conditionId,
      outcome: ConditionEvaluationOutcome.Error
    })

    expect(error).toBeDefined()
    expect(error?.message).toContain('references')
  })
})

describe('formSubmitPayloadSchema', () => {
  it('should accept a payload of form answers', () => {
    const { error } = formSubmitPayloadSchema.validate(basePayload)

    expect(error).toBeUndefined()
  })

  it('defaults a missing language to en-GB', () => {
    const payloadWithoutLanguage = { ...basePayload }
    delete payloadWithoutLanguage.language

    const { error, value } = formSubmitPayloadSchema.validate(
      payloadWithoutLanguage
    )

    expect(error).toBeUndefined()
    expect(value.language).toBe('en-GB')
  })

  it('rejects an empty language', () => {
    const { error } = formSubmitPayloadSchema.validate({
      ...basePayload,
      language: ''
    })

    expect(error).toBeDefined()
    expect(error?.message).toContain('language')
  })

  // The submission-api `/submit` payload carries form answers only. Condition
  // outcomes travel on the adapter submission message instead (see
  // forms-engine-plugin), which is what gets stored against the submission and
  // read by forms-notify-listener.
  it('should reject a payload carrying conditionEvaluations', () => {
    const { error } = formSubmitPayloadSchema.validate({
      ...basePayload,
      conditionEvaluations: []
    })

    expect(error).toBeDefined()
    expect(error?.message).toContain('not allowed')
  })
})

describe.each([
  [
    'saveAndExitMessageData',
    saveAndExitMessageData,
    {
      form: {
        id: 'form-id',
        title: 'Form title',
        status: 'live',
        isPreview: false,
        baseUrl: 'https://example.com'
      },
      email: 'user@example.com',
      security: { question: 'memorable-place', answer: 'Somewhere' },
      state: {}
    }
  ],
  [
    'saveAndExitV2MessageData',
    saveAndExitV2MessageData,
    {
      form: {
        id: 'form-id',
        title: 'Form title',
        status: 'live',
        isPreview: false,
        baseUrl: 'https://example.com'
      },
      email: 'user@example.com',
      auth: { sub: 'user-id', issuer: 'issuer' },
      state: { $$__referenceNumber: 'XXX-XXX-XXX' }
    }
  ]
])('%s', (_name, schema, data) => {
  it('defaults a missing language to en-GB', () => {
    const { error, value } = schema.validate(data)

    expect(error).toBeUndefined()
    expect(value.form.language).toBe('en-GB')
  })

  it('rejects an empty language', () => {
    const { error } = schema.validate({
      ...data,
      form: { ...data.form, language: '' }
    })

    expect(error).toBeDefined()
    expect(error?.message).toContain('language')
  })
})
