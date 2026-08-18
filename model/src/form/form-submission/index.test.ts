import { ConditionEvaluationOutcome } from '~/src/form/form-submission/enums.js'
import {
  formSubmitConditionEvaluationSchema,
  formSubmitNotificationTargetSchema,
  formSubmitPayloadSchema
} from '~/src/form/form-submission/index.js'
import { type SubmitPayload } from '~/src/form/form-submission/types.js'

const conditionId = 'ab1bbaae-bf0e-4577-8416-8a8c83da1fb9'
const componentId = '1c61fa1f-a8dc-463c-ade0-13aa7cbf4960'

const basePayload: SubmitPayload = {
  retrievalKey: 'enrique.chase@defra.gov.uk',
  sessionId: '1ba0b7e9-5b93-4b0c-8b8b-6d6a3b1e2a53',
  main: [{ name: 'yBpZQO', title: 'Your name', value: 'Enrique Chase' }],
  repeaters: []
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

describe('formSubmitNotificationTargetSchema', () => {
  it('should accept a fully populated target', () => {
    const { error, value } = formSubmitNotificationTargetSchema.validate({
      emailAddress: 'casework@defra.gov.uk',
      audience: 'machine',
      version: '2'
    })

    expect(error).toBeUndefined()
    expect(value).toEqual({
      emailAddress: 'casework@defra.gov.uk',
      audience: 'machine',
      version: '2'
    })
  })

  it('should reject a target with no audience', () => {
    const { error } = formSubmitNotificationTargetSchema.validate({
      emailAddress: 'enrique.chase@defra.gov.uk',
      version: '1'
    })

    expect(error).toBeDefined()
    expect(error?.message).toContain('audience')
  })

  it('should reject an unknown audience', () => {
    const { error } = formSubmitNotificationTargetSchema.validate({
      emailAddress: 'enrique.chase@defra.gov.uk',
      audience: 'robot',
      version: '1'
    })

    expect(error).toBeDefined()
    expect(error?.message).toContain('audience')
  })

  it.each([
    'enrique.chase@defra.gov.uk',
    'casework@example.com',
    'someone@example.io',
    'someone@sub.domain.museum',
    'someone@example.internal'
  ])('should accept the email address %s', (emailAddress) => {
    const { error } = formSubmitNotificationTargetSchema.validate({
      emailAddress,
      audience: 'human',
      version: '1'
    })

    expect(error).toBeUndefined()
  })

  it('should reject a malformed email address', () => {
    const { error } = formSubmitNotificationTargetSchema.validate({
      emailAddress: 'not-an-email',
      audience: 'human',
      version: '1'
    })

    expect(error).toBeDefined()
    expect(error?.message).toContain('emailAddress')
  })
})

describe('formSubmitPayloadSchema', () => {
  it('should accept a payload of form answers', () => {
    const { error } = formSubmitPayloadSchema.validate(basePayload)

    expect(error).toBeUndefined()
  })

  // The submission-api `/submit` payload carries form answers only. Condition
  // outcomes and notification targets travel on the adapter submission
  // message instead (see forms-engine-plugin), which is what gets stored
  // against the submission and read by forms-notify-listener.
  it.each(['conditionEvaluations', 'notificationTargets'])(
    'should reject a payload carrying %s',
    (key) => {
      const { error } = formSubmitPayloadSchema.validate({
        ...basePayload,
        [key]: []
      })

      expect(error).toBeDefined()
      expect(error?.message).toContain('not allowed')
    }
  )
})
