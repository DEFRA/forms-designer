import { formDefinitionV2Schema } from '@defra/forms-model'

import { createLogger } from '~/src/common/helpers/logging/logger.js'

export class FormValidationError extends Error {
  /**
   * @param {string} message
   * @param {Array<object>} errors
   */
  constructor(message, errors = []) {
    super(message)
    this.name = 'FormValidationError'
    this.errors = errors
  }
}

/**
 * Simplified form validator that uses the existing FormDefinitionV2Schema
 * which already includes all referential integrity checks
 */
export class AIFormValidator {
  constructor() {
    this.logger = createLogger()
  }

  /**
   * Validates form definition using the existing Joi schema
   * @param {any} formDefinition
   * @returns {{isValid: boolean, errors: Array<object>}} - The validation result
   */
  validateFormIntegrity(formDefinition) {
    try {
      // Use the existing formDefinitionV2Schema which already handles:
      // - Schema validation
      // - Referential integrity (componentIdRefSchema, conditionIdRef, listIdRef)
      // - Uniqueness constraints
      // - Business logic rules
      const { error } = formDefinitionV2Schema.validate(formDefinition, {
        abortEarly: false
      })

      if (error) {
        const errors = error.details.map((detail) => ({
          type: 'schema_error',
          path: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }))

        this.logger.warn('Form validation failed', {
          errorCount: errors.length,
          formName: formDefinition.name
        })

        return { isValid: false, errors }
      }

      this.logger.debug('Form validation passed', {
        formName: formDefinition.name,
        pageCount: formDefinition.pages?.length ?? 0
      })

      return { isValid: true, errors: [] }
    } catch (error) {
      this.logger.error('Validation process failed', {
        error: error instanceof Error ? error.message : String(error)
      })

      return {
        isValid: false,
        errors: [
          {
            type: 'validation_error',
            message: error instanceof Error ? error.message : String(error)
          }
        ]
      }
    }
  }

  /**
   * Generates suggestions for fixing validation errors
   * @param {Array<any>} errors
   * @returns {Array<string>}
   */
  generateFixSuggestions(errors) {
    return errors.map((error) => {
      if (error.path) {
        return `Fix validation error at ${error.path}: ${error.message}`
      }
      return `Fix validation error: ${error.message}`
    })
  }
}
