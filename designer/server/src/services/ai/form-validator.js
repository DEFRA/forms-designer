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
      // First check for duplicate IDs which cause runtime errors
      const duplicateIdErrors = this.checkForDuplicateIds(formDefinition)

      const { error } = formDefinitionV2Schema.validate(formDefinition, {
        abortEarly: false
      })

      const allErrors = [...duplicateIdErrors]

      if (error) {
        const schemaErrors = error.details.map((detail) => ({
          type: 'schema_error',
          path: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }))
        allErrors.push(...schemaErrors)
      }

      if (allErrors.length > 0) {
        this.logger.warn('Form validation failed', {
          errorCount: allErrors.length,
          duplicateIdErrors: duplicateIdErrors.length,
          formName: formDefinition.name
        })

        return { isValid: false, errors: allErrors }
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
   * Check for duplicate IDs across all form elements
   * @param {any} formDefinition
   * @returns {Array<object>} Array of duplicate ID errors
   */
  checkForDuplicateIds(formDefinition) {
    const allIds = new Map() // Map of ID -> array of locations where it's used
    const errors = []

    // Helper to add ID and track its location
    const addId = (
      /** @type {string} */ id,
      /** @type {string} */ location
    ) => {
      if (!id) return
      if (!allIds.has(id)) {
        allIds.set(id, [])
      }
      allIds.get(id).push(location)
    }

    // Collect all IDs from different parts of the form
    try {
      // Page IDs
      if (formDefinition.pages) {
        formDefinition.pages.forEach(
          (/** @type {any} */ page, /** @type {number} */ pageIndex) => {
            if (page.id) {
              addId(page.id, `pages[${pageIndex}].id`)
            }

            // Component IDs
            if (page.components) {
              page.components.forEach(
                (
                  /** @type {any} */ component,
                  /** @type {number} */ componentIndex
                ) => {
                  if (component.id) {
                    addId(
                      component.id,
                      `pages[${pageIndex}].components[${componentIndex}].id`
                    )
                  }
                }
              )
            }
          }
        )
      }

      // List IDs and List Item IDs
      if (formDefinition.lists) {
        formDefinition.lists.forEach(
          (/** @type {any} */ list, /** @type {number} */ listIndex) => {
            if (list.id) {
              addId(list.id, `lists[${listIndex}].id`)
            }

            if (list.items) {
              list.items.forEach(
                (/** @type {any} */ item, /** @type {number} */ itemIndex) => {
                  if (item.id) {
                    addId(item.id, `lists[${listIndex}].items[${itemIndex}].id`)
                  }
                }
              )
            }
          }
        )
      }

      // Condition IDs and Condition Item IDs
      if (formDefinition.conditions) {
        formDefinition.conditions.forEach(
          (
            /** @type {any} */ condition,
            /** @type {number} */ conditionIndex
          ) => {
            if (condition.id) {
              addId(condition.id, `conditions[${conditionIndex}].id`)
            }

            if (condition.items) {
              condition.items.forEach(
                (/** @type {any} */ item, /** @type {number} */ itemIndex) => {
                  if (item.id) {
                    addId(
                      item.id,
                      `conditions[${conditionIndex}].items[${itemIndex}].id`
                    )
                  }
                }
              )
            }
          }
        )
      }

      // Check for duplicates
      for (const [id, locations] of allIds.entries()) {
        if (locations.length > 1) {
          errors.push({
            type: 'duplicate_id_error',
            path: locations.join(', '),
            message: `Duplicate ID "${id}" found in multiple locations: ${locations.join(', ')}. All IDs must be unique across the entire form definition.`,
            value: id,
            locations
          })
        }
      }
    } catch (error) {
      this.logger.error('Error checking for duplicate IDs', {
        error: error instanceof Error ? error.message : String(error)
      })

      errors.push({
        type: 'duplicate_check_error',
        message: `Failed to check for duplicate IDs: ${error instanceof Error ? error.message : String(error)}`
      })
    }

    return errors
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
