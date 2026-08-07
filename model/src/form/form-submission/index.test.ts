import { ConditionEvaluationOutcome } from '~/src/form/form-submission/enums.js'
import {
  formSubmitConditionEvaluationSchema,
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

describe('formSubmitPayloadSchema', () => {
  it('should accept a payload without condition evaluations', () => {
    const { error } = formSubmitPayloadSchema.validate(basePayload)

    expect(error).toBeUndefined()
  })

  it('should accept a payload with condition evaluations', () => {
    const { error } = formSubmitPayloadSchema.validate({
      ...basePayload,
      conditionEvaluations: [
        {
          conditionId,
          outcome: ConditionEvaluationOutcome.True,
          references: [
            { componentId, componentName: 'yBpZQO', answered: false }
          ]
        }
      ]
    } satisfies SubmitPayload)

    expect(error).toBeUndefined()
  })

  it('should reject malformed condition evaluations', () => {
    const { error } = formSubmitPayloadSchema.validate({
      ...basePayload,
      conditionEvaluations: [{ conditionId }]
    })

    expect(error).toBeDefined()
  })

  it('should accept a payload with notification targets', () => {
    const notificationTargets = [
      {
        emailAddress: 'enrique.chase@defra.gov.uk',
        audience: 'human' as const,
        version: '1'
      },
      {
        emailAddress: 'casework@defra.gov.uk',
        audience: 'machine' as const,
        version: '2'
      }
    ]

    const { error, value } = formSubmitPayloadSchema.validate({
      ...basePayload,
      notificationTargets
    } satisfies SubmitPayload)

    expect(error).toBeUndefined()
    expect(value.notificationTargets).toEqual(notificationTargets)
  })

  it('should accept the same address twice in different output formats', () => {
    const { error } = formSubmitPayloadSchema.validate({
      ...basePayload,
      notificationTargets: [
        {
          emailAddress: 'casework@defra.gov.uk',
          audience: 'human' as const,
          version: '1'
        },
        {
          emailAddress: 'casework@defra.gov.uk',
          audience: 'machine' as const,
          version: '1'
        }
      ]
    } satisfies SubmitPayload)

    expect(error).toBeUndefined()
  })

  it('should accept a payload with no notification targets', () => {
    const { error } = formSubmitPayloadSchema.validate({
      ...basePayload,
      notificationTargets: []
    } satisfies SubmitPayload)

    expect(error).toBeUndefined()
  })

  it('should reject a notification target with no audience', () => {
    const { error } = formSubmitPayloadSchema.validate({
      ...basePayload,
      notificationTargets: [
        { emailAddress: 'enrique.chase@defra.gov.uk', version: '1' }
      ]
    })

    expect(error).toBeDefined()
    expect(error?.message).toContain('audience')
  })

  it('should reject an unknown audience', () => {
    const { error } = formSubmitPayloadSchema.validate({
      ...basePayload,
      notificationTargets: [
        {
          emailAddress: 'enrique.chase@defra.gov.uk',
          audience: 'robot',
          version: '1'
        }
      ]
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
    const { error } = formSubmitPayloadSchema.validate({
      ...basePayload,
      notificationTargets: [
        { emailAddress, audience: 'human' as const, version: '1' }
      ]
    } satisfies SubmitPayload)

    expect(error).toBeUndefined()
  })

  it('should reject a malformed email address', () => {
    const { error } = formSubmitPayloadSchema.validate({
      ...basePayload,
      notificationTargets: [
        {
          emailAddress: 'not-an-email',
          audience: 'human' as const,
          version: '1'
        }
      ]
    } satisfies SubmitPayload)

    expect(error).toBeDefined()
    expect(error?.message).toContain('emailAddress')
  })

  it('should reject a bare email address', () => {
    const { error } = formSubmitPayloadSchema.validate({
      ...basePayload,
      notificationTargets: ['enrique.chase@defra.gov.uk']
    })

    expect(error).toBeDefined()
    expect(error?.message).toContain('must be of type object')
  })
})
