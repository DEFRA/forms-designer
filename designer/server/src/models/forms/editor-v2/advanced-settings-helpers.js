import { isCheckboxSelected } from '~/src/lib/utils.js'

/**
 * Maps payload to additional component options
 * @param {Partial<FormEditorInputQuestion>} payload
 * @returns {object}
 */
export function getAdditionalOptions(payload) {
  const additionalOptions = {}
  if (payload.classes) {
    additionalOptions.classes = payload.classes
  }
  if (payload.rows) {
    additionalOptions.rows = payload.rows
  }
  if (payload.prefix) {
    additionalOptions.prefix = payload.prefix
  }
  if (payload.suffix) {
    additionalOptions.suffix = payload.suffix
  }
  if (payload.maxFuture !== undefined) {
    additionalOptions.maxDaysInFuture = payload.maxFuture
  }
  if (payload.maxPast !== undefined) {
    additionalOptions.maxDaysInPast = payload.maxPast
  }
  if (payload.usePostcodeLookup !== undefined) {
    additionalOptions.usePostcodeLookup = isCheckboxSelected(
      payload.usePostcodeLookup
    )
  }
  if (isCheckboxSelected(payload.giveInstructions) && payload.instructionText) {
    additionalOptions.instructionText = payload.instructionText
  }
  return additionalOptions
}

/**
 * Determine if val contains a value (including zero as a valid number)
 * @param {string | undefined} val
 * @returns {string | undefined}
 */
export function isValueOrZero(val) {
  return val !== undefined ? 'has-value' : undefined
}

/**
 * Maps payload to additional schema properties
 * @param {Partial<FormEditorInputQuestion>} payload
 * @returns {object}
 */
export function getAdditionalSchema(payload) {
  // Note - any properties that should allow a 'zero' need to have their check wrapped in isValueOrZero() as opposed
  // to just a value check e.g. 'minFiles' and 'precision'
  const additionalSchema = {}

  const schemaMapping = [
    {
      key: 'min',
      sources: ['minLength', 'min', 'minFiles'],
      getValue: () => payload.minLength ?? payload.min ?? payload.minFiles,
      shouldInclude: () =>
        payload.minLength ??
        isValueOrZero(payload.min) ??
        isValueOrZero(payload.minFiles)
    },
    {
      key: 'max',
      sources: ['maxLength', 'max', 'maxFiles'],
      getValue: () => payload.maxLength ?? payload.max ?? payload.maxFiles,
      shouldInclude: () =>
        payload.maxLength ?? isValueOrZero(payload.max) ?? payload.maxFiles
    },
    {
      key: 'length',
      getValue: () => payload.exactFiles,
      shouldInclude: () => payload.exactFiles
    },
    {
      key: 'regex',
      getValue: () => payload.regex,
      shouldInclude: () => payload.regex
    },
    {
      key: 'precision',
      getValue: () => payload.precision,
      shouldInclude: () => isValueOrZero(payload.precision)
    }
  ]

  for (const mapping of schemaMapping) {
    if (mapping.shouldInclude()) {
      const value = mapping.getValue()
      Object.assign(additionalSchema, { [mapping.key]: value })
    }
  }

  return additionalSchema
}

/**
 * Maps payload to extra root-level fields
 * @param {Partial<FormEditorInputQuestion>} payload
 * @returns {object}
 */
export function mapExtraRootFields(payload) {
  const rootFields = {}
  if (payload.list) {
    rootFields.list = payload.list
  }
  if (payload.declarationText) {
    rootFields.content = payload.declarationText
  }
  return rootFields
}

/**
 * @import { FormEditorInputQuestion } from '@defra/forms-model'
 */
