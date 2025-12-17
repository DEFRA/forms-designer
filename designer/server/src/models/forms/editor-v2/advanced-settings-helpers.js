import { isLocationFieldType } from '~/src/common/constants/component-types.js'
import { isCheckboxSelected } from '~/src/lib/utils.js'
import { locationInstructionDefaults } from '~/src/models/forms/editor-v2/location-instruction-defaults.js'

// Cache the location instruction defaults for performance
const ALL_LOCATION_INSTRUCTIONS = Object.values(locationInstructionDefaults)

/**
 * @param {ComponentType | undefined} questionType
 * @param {string | undefined} instructionText
 * @returns {boolean}
 */
function shouldIncludeLocationInstruction(questionType, instructionText) {
  if (!isLocationFieldType(questionType)) {
    return true
  }

  if (!instructionText) {
    return false
  }

  return !ALL_LOCATION_INSTRUCTIONS.includes(instructionText)
}

/**
 * Maps payload to additional component options
 * @param {Partial<FormEditorInputQuestion>} payload
 * @returns {object}
 */
export function getAdditionalOptions(payload) {
  const additionalOptions = {}

  const optionsMapping = [
    {
      key: 'classes',
      getValue: () => payload.classes,
      shouldInclude: () => payload.classes !== undefined
    },
    {
      key: 'rows',
      getValue: () => payload.rows,
      shouldInclude: () => payload.rows !== undefined
    },
    {
      key: 'prefix',
      getValue: () => payload.prefix,
      shouldInclude: () => payload.prefix !== undefined
    },
    {
      key: 'suffix',
      getValue: () => payload.suffix,
      shouldInclude: () => payload.suffix !== undefined
    },
    {
      key: 'maxDaysInFuture',
      getValue: () => payload.maxFuture,
      shouldInclude: () => payload.maxFuture !== undefined
    },
    {
      key: 'maxDaysInPast',
      getValue: () => payload.maxPast,
      shouldInclude: () => payload.maxPast !== undefined
    },
    {
      key: 'usePostcodeLookup',
      getValue: () => isCheckboxSelected(payload.usePostcodeLookup),
      shouldInclude: () => payload.usePostcodeLookup !== undefined
    },
    {
      key: 'instructionText',
      getValue: () => payload.instructionText,
      shouldInclude: () => {
        const hasInstructions =
          isCheckboxSelected(payload.giveInstructions) &&
          payload.instructionText
        if (!hasInstructions || !payload.instructionText) {
          return false
        }
        const questionType = /** @type {ComponentType} */ (payload.questionType)
        return shouldIncludeLocationInstruction(
          questionType,
          payload.instructionText
        )
      }
    }
  ]

  for (const mapping of optionsMapping) {
    if (mapping.shouldInclude()) {
      const value = mapping.getValue()
      Object.assign(additionalOptions, { [mapping.key]: value })
    }
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
 * @import { ComponentType, FormEditorInputQuestion } from '@defra/forms-model'
 */
