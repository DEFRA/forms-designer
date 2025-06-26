import {
  ComponentType,
  ComponentTypes,
  hasFormField,
  hasListField
} from '@defra/forms-model'
import { v4 as uuidv4 } from 'uuid'

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

      // Fix engine field for V2 forms (schema 2 should always use engine V2)
      if (parsedForm.schema === 2) {
        if (!parsedForm.engine) {
          parsedForm.engine = 'V2'
          logger.info('Added missing engine field: V2 (temporary workaround)')
        } else if (parsedForm.engine !== 'V2') {
          const oldEngine = parsedForm.engine
          parsedForm.engine = 'V2'
          logger.info(
            `Fixed incorrect engine field: ${oldEngine} → V2 (temporary workaround)`
          )
        }
      }

      if (parsedForm.schema === 2 && parsedForm.lists && parsedForm.pages) {
        logger.info('Processing V2 list references (temporary workaround)')

        /** @type {Record<string, string>} */
        const listNameToIdMap = {}
        parsedForm.lists.forEach(
          /** @param {any} list */ (list) => {
            if (list.name && list.id) {
              listNameToIdMap[list.name] = list.id
            }
          }
        )

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

      this.generateMissingGuids(parsedForm)

      this.fixEmptyComponentTitles(parsedForm)

      this.fixInvalidComponentTypes(parsedForm)

      this.fixMissingListReferences(parsedForm)

      this.fixComponentNamePatterns(parsedForm)

      logger.info(
        'Form parsed and auto-fixes applied, returning for validation by caller'
      )

      return parsedForm
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
   * Generate UUIDs for missing ID fields - CONSERVATIVE approach for referential integrity
   * @param {any} formDefinition
   */
  generateMissingGuids(formDefinition) {
    let fixedGuids = 0

    const isValidUuid = (/** @type {string} */ uuid) => {
      if (!uuid || typeof uuid !== 'string') return false
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      return uuidRegex.test(uuid)
    }

    if (formDefinition.pages && Array.isArray(formDefinition.pages)) {
      formDefinition.pages.forEach(
        /** @param {any} page */ (page) => {
          if (!page.id || !isValidUuid(page.id)) {
            const oldValue = page.id
            page.id = this.generateUuid()
            fixedGuids++
            if (oldValue) {
              logger.info(`Fixed invalid page ID: ${oldValue} → ${page.id}`)
            } else {
              logger.info(`Generated missing page ID: ${page.id}`)
            }
          }
        }
      )
    }

    if (fixedGuids > 0) {
      logger.info(`Fixed ${fixedGuids} page UUIDs`)
    }
  }

  /**
   * Fix empty or missing component titles
   * @param {any} formDefinition
   */
  fixEmptyComponentTitles(formDefinition) {
    let fixedTitles = 0

    if (formDefinition.pages && Array.isArray(formDefinition.pages)) {
      formDefinition.pages.forEach(
        /** @param {any} page */ (page) => {
          if (page.components && Array.isArray(page.components)) {
            page.components.forEach(
              /** @param {any} component */ (component) => {
                if (!component.title || component.title.trim() === '') {
                  const componentType = component.type ?? 'Component'
                  const componentName = component.name ?? 'field'
                  component.title = this.generateComponentTitle(
                    componentType,
                    componentName
                  )
                  fixedTitles++
                  logger.info(`Fixed empty component title: ${component.title}`)
                }
              }
            )
          }
        }
      )
    }

    if (fixedTitles > 0) {
      logger.info(`Fixed ${fixedTitles} empty component titles (automatic fix)`)
    }
  }

  /**
   * Fix invalid component types (common AI mistakes)
   * @param {any} formDefinition
   */
  fixInvalidComponentTypes(formDefinition) {
    let fixedTypes = 0

    const componentTypeFixMap = {
      EmailField: 'EmailAddressField',
      PhoneField: 'TelephoneNumberField',
      TextAreaField: 'MultilineTextField',
      DropdownField: 'SelectField',
      RadioField: 'RadiosField',
      CheckboxField: 'CheckboxesField'
    }

    if (formDefinition.pages && Array.isArray(formDefinition.pages)) {
      formDefinition.pages.forEach(
        /** @param {any} page */ (page) => {
          if (page.components && Array.isArray(page.components)) {
            page.components.forEach(
              /** @param {any} component */ (component) => {
                if (
                  component.type &&
                  typeof component.type === 'string' &&
                  component.type in componentTypeFixMap
                ) {
                  const oldType = component.type
                  const fixedType = /** @type {string} */ (
                    componentTypeFixMap[
                      /** @type {keyof typeof componentTypeFixMap} */ (
                        component.type
                      )
                    ]
                  )
                  component.type = fixedType
                  fixedTypes++
                  logger.info(
                    `Fixed invalid component type: ${oldType} → ${component.type}`
                  )
                }
              }
            )
          }
        }
      )
    }

    if (fixedTypes > 0) {
      logger.info(`Fixed ${fixedTypes} invalid component types (automatic fix)`)
    }
  }

  /**
   * Fix missing list references for list-based components
   * @param {any} formDefinition
   */
  fixMissingListReferences(formDefinition) {
    let fixedReferences = 0

    if (!formDefinition.pages || !formDefinition.lists) {
      return
    }

    const listBasedComponents = Object.values(ComponentType).filter((type) => {
      const mockComponent = { type }
      return hasListField(mockComponent)
    })

    formDefinition.pages.forEach(
      /** @param {any} page */ (page) => {
        if (page.components && Array.isArray(page.components)) {
          page.components.forEach(
            /** @param {any} component */ (component) => {
              if (
                listBasedComponents.includes(component.type) &&
                !component.list
              ) {
                if (formDefinition.lists.length > 0) {
                  component.list = formDefinition.lists[0].id
                  fixedReferences++
                  logger.info(
                    `Fixed missing list reference for ${component.type}: ${component.list}`
                  )
                } else {
                  const defaultList = this.createDefaultList(component)
                  formDefinition.lists.push(defaultList)
                  component.list = defaultList.id
                  fixedReferences++
                  logger.info(
                    `Created default list for ${component.type}: ${defaultList.id}`
                  )
                }
              }
            }
          )
        }
      }
    )

    if (fixedReferences > 0) {
      logger.info(
        `Fixed ${fixedReferences} missing list references (automatic fix)`
      )
    }
  }

  /**
   * Generate a UUID v4
   * @returns {string}
   */
  generateUuid() {
    return uuidv4()
  }

  /**
   * Generate a meaningful component title
   * @param {string} componentType
   * @param {string} componentName
   * @returns {string}
   */
  generateComponentTitle(componentType, componentName) {
    const componentDef = ComponentTypes.find(
      (def) => def.name === componentType
    )
    const baseTitle = componentDef?.title ?? 'Input field'
    const formattedName = componentName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim()

    return formattedName !== 'field'
      ? `${baseTitle} for ${formattedName.toLowerCase()}`
      : baseTitle
  }

  /**
   * Create a default list for a component
   * @param {any} component
   * @returns {any}
   */
  createDefaultList(component) {
    const listId = this.generateUuid()
    const componentName = component.name ?? 'option'

    return {
      id: listId,
      name: `${componentName}List`,
      title: `${this.generateComponentTitle(component.type, componentName)} options`,
      type: 'string',
      items: [
        {
          id: this.generateUuid(),
          text: 'Option 1',
          value: 'option1'
        },
        {
          id: this.generateUuid(),
          text: 'Option 2',
          value: 'option2'
        }
      ]
    }
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

  /**
   * Validate GDS compliance for the form (relaxed for AI generation success)
   * @param {any} formDefinition - The form definition to validate
   * @returns {{ isValid: boolean, errors: string[] }} - Validation result
   */
  validateGDSCompliance(formDefinition) {
    /** @type {string[]} */
    const errors = []

    if (!formDefinition.pages || !Array.isArray(formDefinition.pages)) {
      return { isValid: true, errors: [] }
    }

    formDefinition.pages.forEach(
      /**
       * @param {any} page
       * @param {number} _pageIndex
       */
      (page, _pageIndex) => {
        if (!page.components || !Array.isArray(page.components)) {
          return
        }

        const inputComponents = page.components.filter(
          /** @param {any} component */ (component) => {
            return hasFormField(component)
          }
        )

        if (inputComponents.length > 4) {
          const hasRelatedFields = this.checkForRelatedFields(inputComponents)

          if (!hasRelatedFields) {
            errors.push(
              `Page "${page.title ?? page.path}" has ${inputComponents.length} input fields that don't appear to be related. Consider splitting into separate pages for better user experience.`
            )
          }
        }

        page.components.forEach(
          /** @param {any} component */ (component) => {
            if (component.title?.includes('*')) {
              errors.push(
                `Component "${component.title}" contains asterisk (*). Remove asterisks and use options.required instead.`
              )
            }
          }
        )
      }
    )

    if (errors.length > 0) {
      logger.debug('GDS compliance violations found:', errors)
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Check if multiple input fields are legitimately related per GDS exceptions
   * @param {any[]} inputComponents - Array of input components
   * @returns {boolean} - True if fields appear to be related
   */
  checkForRelatedFields(inputComponents) {
    const fieldNames = inputComponents.map(
      (comp) => comp.name?.toLowerCase() ?? comp.title?.toLowerCase() ?? ''
    )

    const relatedPatterns = [
      // Name components
      ['first', 'last', 'middle', 'given', 'family', 'surname'],
      // Address components
      ['address', 'street', 'city', 'town', 'postcode', 'county'],
      // Date components
      ['day', 'month', 'year', 'date'],
      // Contact details (when essential)
      ['email', 'phone', 'telephone', 'mobile'],
      // Passport/ID details
      ['passport', 'number', 'expiry', 'issue']
    ]

    return relatedPatterns.some((pattern) => {
      const matches = fieldNames.filter((name) =>
        pattern.some((keyword) => name.includes(keyword))
      )
      return matches.length >= Math.min(inputComponents.length * 0.6, 2)
    })
  }

  /**
   * Fix component names that contain numbers/special characters
   * @param {any} formDefinition
   */
  fixComponentNamePatterns(formDefinition) {
    let fixedNames = 0

    if (formDefinition.pages && Array.isArray(formDefinition.pages)) {
      formDefinition.pages.forEach(
        /** @param {any} page */ (page) => {
          if (page.components && Array.isArray(page.components)) {
            page.components.forEach(
              /** @param {any} component */ (component) => {
                if (
                  component.name &&
                  (component.name.includes('1') ||
                    component.name.includes('2') ||
                    component.name.includes('3') ||
                    component.name.includes('4') ||
                    component.name.includes('5') ||
                    component.name.includes('6') ||
                    component.name.includes('7') ||
                    component.name.includes('8') ||
                    component.name.includes('9') ||
                    component.name.includes('0') ||
                    !/^[a-zA-Z]+$/.test(component.name))
                ) {
                  const oldName = component.name
                  component.name = this.generateValidComponentName(
                    component.name
                  )
                  fixedNames++
                  logger.info(
                    `Fixed invalid component name: ${oldName} → ${component.name}`
                  )
                }
              }
            )
          }
        }
      )
    }

    if (fixedNames > 0) {
      logger.info(`Fixed ${fixedNames} invalid component names (automatic fix)`)
    }
  }

  /**
   * Generate a valid component name that matches the required pattern
   * @param {string} originalName
   * @returns {string}
   */
  generateValidComponentName(originalName) {
    let cleanName = originalName.replace(/[^a-zA-Z]/g, '')

    if (cleanName.length < 2) {
      cleanName = 'field'
    }

    cleanName = cleanName.charAt(0).toLowerCase() + cleanName.slice(1)

    return cleanName
  }
}

/**
 * @import { FormDefinition }  from '@defra/forms-model'
 */
