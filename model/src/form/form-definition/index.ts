import Joi from 'joi'

import { type FormDefinition } from '~/src/form/form-definition/types.js'

/**
 * If an optional key is added, CURRENT_VERSION does not need to be incremented.
 * Only breaking changes will require an increment, as well as a migration script.
 */
export const CURRENT_VERSION = 2

const sectionsSchema = Joi.object().keys({
  name: Joi.string().required(),
  title: Joi.string().required(),
  hideTitle: Joi.boolean().default(false)
})

const conditionFieldSchema = Joi.object().keys({
  name: Joi.string().required(),
  type: Joi.string().required(),
  display: Joi.string().required()
})

const conditionValueSchema = Joi.object().keys({
  type: Joi.string().required(),
  value: Joi.string().required(),
  display: Joi.string().required()
})

const relativeTimeValueSchema = Joi.object().keys({
  type: Joi.string().required(),
  timePeriod: Joi.string().required(),
  timeUnit: Joi.string().required(),
  direction: Joi.string().required(),
  timeOnly: Joi.boolean().required()
})

const conditionRefSchema = Joi.object().keys({
  conditionName: Joi.string().required(),
  conditionDisplayName: Joi.string().required(),
  coordinator: Joi.string().optional()
})

const conditionSchema = Joi.object().keys({
  field: conditionFieldSchema,
  operator: Joi.string().required(),
  value: Joi.alternatives().try(conditionValueSchema, relativeTimeValueSchema),
  coordinator: Joi.string().optional()
})

const conditionGroupSchema = Joi.object().keys({
  conditions: Joi.array().items(
    Joi.alternatives().try(
      conditionSchema,
      conditionRefSchema,
      Joi.any() /** Should be a joi.link('#conditionGroupSchema') */
    )
  )
})

const conditionsModelSchema = Joi.object().keys({
  name: Joi.string().required(),
  conditions: Joi.array().items(
    Joi.alternatives().try(
      conditionSchema,
      conditionRefSchema,
      conditionGroupSchema
    )
  )
})

const conditionsSchema = Joi.object().keys({
  name: Joi.string().required(),
  displayName: Joi.string(),
  value: Joi.alternatives().try(Joi.string(), conditionsModelSchema).required()
})

const localisedString = Joi.alternatives().try(
  Joi.object({ a: Joi.any() }).unknown(),
  Joi.string().allow('')
)

export const componentSchema = Joi.object()
  .keys({
    type: Joi.string().required(),
    name: Joi.string(),
    title: localisedString,
    hint: localisedString.optional(),
    options: Joi.object().default({}),
    schema: Joi.object({ min: Joi.number(), max: Joi.number() })
      .unknown(true)
      .default({}),
    list: Joi.string().optional()
  })
  .unknown(true)

const nextSchema = Joi.object().keys({
  path: Joi.string().required(),
  condition: Joi.string().allow('').optional(),
  redirect: Joi.string().uri().optional()
})

/**
 * `/status` is a special route for providing a user's application status.
 *  It should not be configured via the designer.
 */
const pageSchema = Joi.object().keys({
  path: Joi.string().required().disallow('/status'),
  title: localisedString,
  section: Joi.string(),
  controller: Joi.string(),
  components: Joi.array().items(componentSchema),
  next: Joi.array().items(nextSchema),
  repeatField: Joi.string().optional(),
  options: Joi.object().optional(),
  backLinkFallback: Joi.string().optional()
})

const toggleableString = Joi.alternatives().try(Joi.boolean(), Joi.string())

const confirmationPageSchema = Joi.object({
  customText: Joi.object({
    title: Joi.string().default('Application complete'),
    paymentSkipped: toggleableString.default(
      'Someone will be in touch to make a payment.'
    ),
    nextSteps: toggleableString.default(
      'You will receive an email with details with the next steps.'
    )
  }).default(),
  components: Joi.array().items(componentSchema)
})

const paymentSkippedWarningPage = Joi.object({
  customText: Joi.object({
    title: Joi.string().default('Pay for your application').optional(),
    caption: Joi.string().default('Payment').optional(),
    body: Joi.string().default('').optional()
  })
})

const specialPagesSchema = Joi.object().keys({
  confirmationPage: confirmationPageSchema.optional(),
  paymentSkippedWarningPage: paymentSkippedWarningPage.optional()
})

const listItemSchema = Joi.object().keys({
  text: localisedString,
  value: Joi.alternatives().try(Joi.number(), Joi.string()),
  description: localisedString.optional(),
  conditional: Joi.object()
    .keys({
      components: Joi.array()
        .required()
        .items(componentSchema.unknown(true))
        .unique('name')
    })
    .allow(null)
    .optional(),
  condition: Joi.string().allow(null, '').optional()
})

const listSchema = Joi.object().keys({
  name: Joi.string().required(),
  title: localisedString,
  type: Joi.string().required().valid('string', 'number'),
  items: Joi.array().items(listItemSchema)
})

const feeSchema = Joi.object().keys({
  description: Joi.string().required(),
  amount: Joi.number().required(),
  multiplier: Joi.string().optional(),
  condition: Joi.string().optional(),
  prefix: Joi.string().optional()
})

const multiApiKeySchema = Joi.object({
  test: Joi.string().optional(),
  production: Joi.string().optional()
})

const replyToConfigurationSchema = Joi.object({
  emailReplyToId: Joi.string(),
  condition: Joi.string().allow('').optional()
})

const notifySchema = Joi.object().keys({
  apiKey: [Joi.string().allow('').optional(), multiApiKeySchema],
  templateId: Joi.string(),
  emailField: Joi.string(),
  personalisation: Joi.array().items(Joi.string()),
  personalisationFieldCustomisation: Joi.object()
    .pattern(/./, Joi.array().items(Joi.string()))
    .optional(),
  addReferencesToPersonalisation: Joi.boolean().optional(),
  emailReplyToIdConfiguration: Joi.array().items(replyToConfigurationSchema)
})

const emailSchema = Joi.object().keys({
  emailAddress: Joi.string()
})

const webhookSchema = Joi.object().keys({
  url: Joi.string(),
  allowRetry: Joi.boolean().default(true)
})

const outputSchema = Joi.object().keys({
  name: Joi.string(),
  title: Joi.string().optional(),
  type: Joi.string().allow('notify', 'email', 'webhook', 'sheets'),
  outputConfiguration: Joi.alternatives().try(
    notifySchema,
    emailSchema,
    webhookSchema
  )
})

const feedbackSchema = Joi.object().keys({
  feedbackForm: Joi.boolean().default(false),
  url: Joi.when('feedbackForm', {
    is: Joi.boolean().valid(false),
    then: Joi.string().optional().allow('')
  }),
  emailAddress: Joi.string()
    .email({
      tlds: {
        allow: false
      }
    })
    .optional()
})

const phaseBannerSchema = Joi.object().keys({
  phase: Joi.string().valid('alpha', 'beta')
})

const feeOptionSchema = Joi.object()
  .keys({
    payApiKey: [Joi.string().allow('').optional(), multiApiKeySchema],
    paymentReferenceFormat: [Joi.string().optional()],
    payReturnUrl: Joi.string().optional(),
    allowSubmissionWithoutPayment: Joi.boolean().optional().default(true),
    maxAttempts: Joi.number().optional().default(3),
    customPayErrorMessage: Joi.string().optional(),
    showPaymentSkippedWarningPage: Joi.when('allowSubmissionWithoutPayment', {
      is: true,
      then: Joi.boolean().valid(true, false).default(false),
      otherwise: Joi.boolean().valid(false).default(false)
    })
  })
  .default(({ payApiKey, paymentReferenceFormat }) => {
    return {
      ...(payApiKey && { payApiKey }),
      ...(paymentReferenceFormat && { paymentReferenceFormat })
    }
  })

/**
 * Joi schema for `FormDefinition` interface
 * @see {@link FormDefinition}
 */
export const formDefinitionSchema = Joi.object()
  .required()
  .keys({
    name: localisedString.optional(),
    feedback: feedbackSchema,
    startPage: Joi.string().required(),
    pages: Joi.array().required().items(pageSchema).unique('path'),
    sections: Joi.array().items(sectionsSchema).unique('name').required(),
    conditions: Joi.array().items(conditionsSchema).unique('name'),
    lists: Joi.array().items(listSchema).unique('name'),
    fees: Joi.array().items(feeSchema).optional(),
    paymentReferenceFormat: Joi.string().optional(),
    metadata: Joi.object({ a: Joi.any() }).unknown().optional(),
    declaration: Joi.string().allow('').optional(),
    outputs: Joi.array().items(outputSchema),
    payApiKey: [Joi.string().allow('').optional(), multiApiKeySchema],
    skipSummary: Joi.boolean().default(false),
    version: Joi.number().default(CURRENT_VERSION),
    phaseBanner: phaseBannerSchema,
    specialPages: specialPagesSchema.optional(),
    feeOptions: feeOptionSchema
  })

// Maintain compatibility with legacy named export
// E.g. `import { Schema } from '@defra/forms-model'`
export const Schema = formDefinitionSchema

/**
 *  Schema versions:
 *  Undefined / 0 - initial version as at 28/8/20. Conditions may be in object structure or string form.
 *  1 - Relevant components (radio, checkbox, select, autocomplete) now contain
 *      options as 'values' rather than referencing a data list
 *  2 - Reverse v1. Values populating radio, checkboxes, select, autocomplete are defined in Lists only.
 *  TODO:- merge fees and paymentReferenceFormat
 *  2 - 2023-05-04 `feeOptions` has been introduced. paymentReferenceFormat and payApiKey can be configured in top level or feeOptions. feeOptions will take precedent.
 *      if feeOptions are empty, it will pull values from the top level keys.
 *      WARN: Fee/GOV.UK pay configurations (apart from fees) should no longer be stored in the top level, always within feeOptions.
 */
