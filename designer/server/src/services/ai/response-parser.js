import { formDefinitionV2Schema } from '@defra/forms-model'

import { createLogger } from '~/src/common/helpers/logging/logger.js'

const logger = createLogger()

export class ParseError extends Error {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message)
    this.name = 'ParseError'
  }
}

export class ValidationError extends Error {
  /**
   * @param {string} message
   * @param {import('joi').ValidationErrorItem[]} details
   */
  constructor(message, details = []) {
    super(message)
    this.name = 'ValidationError'
    this.details = details
  }
}

/**
 * @typedef {object} FormDefinition
 * @property {string} [engine] - The engine of the form
 * @property {string} [schema] - The schema of the form
 * @property {Array<object>} [pages] - The pages of the form
 * @property {Array<object>} [conditions] - The conditions of the form
 * @property {Array<object>} [lists] - The lists of the form
 * @property {Array<object>} [sections] - The sections of the form
 */

export class ResponseParser {
  /**
   * Parse AI response and extract form definition JSON
   *
   * NOTE: This method includes temporary workarounds for agentic workflow issues:
   * - Adds missing engine: 'V2' field for V2 forms
   * - Converts list name references to list ID references
   *
   * These should be removed once root causes are fixed in the model schema and AI prompts.
   * @param {string} aiResponse - The AI response containing JSON
   * @returns {import('@defra/forms-model').FormDefinition} - Parsed and validated form definition
   */
  parseFormDefinition(aiResponse) {
    try {
      logger.info('Extracting JSON from AI response')
      const jsonRegex = /\{[\s\S]*\}/
      const jsonMatch = jsonRegex.exec(aiResponse)
      if (!jsonMatch) {
        logger.error('No JSON found in AI response', aiResponse)
        throw new ParseError('No JSON found in AI response')
      }

      const jsonString = jsonMatch[0]
      logger.info('JSON extracted successfully', jsonString)

      logger.info('Parsing JSON')
      const parsedForm = JSON.parse(jsonString)

      // TODO: Remove this manual parsing once core issues are fixed:
      //
      // ISSUE 1: Schema Default Problem
      // - formDefinitionV2Schema inherits engine default of 'V1' from base schema
      // - AI generates forms with schema:2 but engine field defaults to 'V1' during validation
      // - Should be fixed by updating formDefinitionV2Schema to default engine: 'V2'
      //
      // ISSUE 2: List Reference Format
      // - V2 requires component.list to reference list.id (UUID)
      // - AI sometimes generates component.list referencing list.name (string)
      // - This is due to training data inconsistencies and should be fixed by improving AI prompts
      //
      // ISSUE 3: Coordinator Case Sensitivity
      // - AI sometimes generates condition.coordinator as "AND"/"OR" instead of "and"/"or"
      // - System expects lowercase values as per Coordinator enum
      // - Should be fixed by improving AI prompts to specify lowercase values
      //
      // ISSUE 4: Agentic Validation Too Permissive
      // - Joi schema validation applies defaults/transforms that mask real issues
      // - AI thinks form is valid when it will actually fail at forms manager
      // - Should be fixed by stricter validation in agentic workflow

      // FIX 1: Ensure V2 forms have correct engine field
      if (parsedForm.schema === 2 && !parsedForm.engine) {
        parsedForm.engine = 'V2'
        logger.info('Added missing engine field: V2 (temporary workaround)')
      }

      // FIX 2: Convert list name references to list ID references in V2 forms
      if (parsedForm.schema === 2 && parsedForm.lists && parsedForm.pages) {
        logger.info('Processing V2 list references (temporary workaround)')

        // Create a map of list names to list IDs
        /** @type {Record<string, string>} */
        const listNameToIdMap = {}
        parsedForm.lists.forEach(
          /** @param {any} list */ (list) => {
            if (list.name && list.id) {
              listNameToIdMap[list.name] = list.id
            }
          }
        )

        // Update component list references from names to IDs
        let fixedReferences = 0
        parsedForm.pages.forEach(
          /** @param {any} page */ (page) => {
            if (page.components) {
              page.components.forEach(
                /** @param {any} component */ (component) => {
                  if (component.list && listNameToIdMap[component.list]) {
                    const oldListRef = component.list
                    component.list = listNameToIdMap[component.list]
                    fixedReferences++
                    logger.info(
                      `Fixed list reference: ${oldListRef} → ${component.list}`
                    )
                  }
                }
              )
            }
          }
        )

        if (fixedReferences > 0) {
          logger.info(
            `Fixed ${fixedReferences} list references (temporary workaround)`
          )
        }
      }

      // FIX 3: Normalize coordinator values from uppercase to lowercase
      if (parsedForm.conditions && Array.isArray(parsedForm.conditions)) {
        logger.info(
          'Processing condition coordinator values (temporary workaround)'
        )

        let fixedCoordinators = 0
        parsedForm.conditions.forEach(
          /** @param {any} condition */ (condition) => {
            if (condition.coordinator) {
              if (condition.coordinator === 'AND') {
                condition.coordinator = 'and'
                fixedCoordinators++
                logger.info('Fixed coordinator: AND → and')
              } else if (condition.coordinator === 'OR') {
                condition.coordinator = 'or'
                fixedCoordinators++
                logger.info('Fixed coordinator: OR → or')
              }
            }
          }
        )

        if (fixedCoordinators > 0) {
          logger.info(
            `Fixed ${fixedCoordinators} coordinator values (temporary workaround)`
          )
        }
      }

      logger.info('Validating against formDefinitionV2Schema')

      const { error, value } = formDefinitionV2Schema.validate(parsedForm)
      if (error) {
        logger.error('Validation failed', error)

        error.details.slice(0, 5).forEach((detail, index) => {
          const errorInfo = {
            errorNumber: index + 1,
            path: detail.path.join('.'),
            message: detail.message,
            type: detail.type
          }
          logger.error(`Validation Error ${index + 1}`, errorInfo)
        })

        throw new ValidationError(
          'Generated form failed schema validation',
          error.details
        )
      }

      logger.info('AI form successfully parsed and validated', value)

      return value
    } catch (error) {
      if (error instanceof ParseError || error instanceof ValidationError) {
        throw error
      }

      const errorMessage =
        error instanceof Error ? error.message : String(error)
      logger.error('Failed to parse AI response', { error: errorMessage })
      throw new ParseError(`Failed to parse AI response: ${errorMessage}`)
    }
  }

  /**
   * @param {import('@defra/forms-model').FormDefinition} formDefinition
   * @returns {number}
   */
  countComponents(formDefinition) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!formDefinition.pages) {
      return 0
    }

    return formDefinition.pages.reduce(
      /**
       * @param {number} total
       * @param {object} page
       * @returns {number}
       */
      (total, page) => {
        if (!('components' in page) || !Array.isArray(page.components)) {
          return total
        }
        return total + page.components.length
      },
      0
    )
  }

  /**
   * @param {FormDefinition | any} formDefinition - Form definition (conditions and lists may be undefined)
   */
  extractFormSummary(formDefinition) {
    const pages = formDefinition.pages ?? []
    const components = this.countComponents(formDefinition)
    const conditions = formDefinition.conditions?.length ?? 0
    const lists = formDefinition.lists?.length ?? 0

    return {
      pageCount: pages.length,
      componentCount: components,
      conditionCount: conditions,
      listCount: lists,
      hasConditionalLogic: conditions > 0,
      formFlow: pages.map(
        /**
         * @param {object} page
         */
        (page) => ({
          title: 'title' in page ? page.title : '',
          path: 'path' in page ? page.path : '',
          componentCount:
            'components' in page && Array.isArray(page.components)
              ? page.components.length
              : 0
        })
      )
    }
  }
}

/**
 * @import { FormDefinition }  from '@defra/forms-model'
 */
