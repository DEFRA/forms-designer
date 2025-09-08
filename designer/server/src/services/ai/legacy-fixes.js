/**
 * Legacy Response Fixes
 *
 * This file contains response processing methods that are rarely used in practice
 * but kept as fallback for edge cases. These methods are only called when initial
 * validation fails, not on every request.
 */

import { createLogger } from '~/src/common/helpers/logging/logger.js'

const logger = createLogger()

export class LegacyResponseFixes {
  constructor() {
    this.logger = logger
  }

  /**
   * Apply all legacy fixes to a form definition
   * These are only called when validation fails as a fallback
   * @param {any} formDef - The form definition to fix
   * @returns {any} The fixed form definition
   */
  applyLegacyFixes(formDef) {
    this.logger.info(
      '[LegacyFixes] Applying legacy fixes as fallback after validation failure'
    )

    let fixed = { ...formDef }
    let totalFixes = 0

    // Apply each legacy fix in order
    const engineFixes = this.fixEngineField(fixed)
    if (engineFixes > 0) {
      totalFixes += engineFixes
      this.logger.info(`[LegacyFixes] Fixed ${engineFixes} engine field issues`)
    }

    const titleFixes = this.fixComponentTitles(fixed)
    if (titleFixes > 0) {
      totalFixes += titleFixes
      this.logger.info(
        `[LegacyFixes] Fixed ${titleFixes} component title issues`
      )
    }

    const typeFixes = this.fixComponentTypes(fixed)
    if (typeFixes > 0) {
      totalFixes += typeFixes
      this.logger.info(`[LegacyFixes] Fixed ${typeFixes} component type issues`)
    }

    const nameFixes = this.fixComponentNames(fixed)
    if (nameFixes > 0) {
      totalFixes += nameFixes
      this.logger.info(`[LegacyFixes] Fixed ${nameFixes} component name issues`)
    }

    const listFixes = this.fixListReferences(fixed)
    if (listFixes > 0) {
      totalFixes += listFixes
      this.logger.info(`[LegacyFixes] Fixed ${listFixes} list reference issues`)
    }

    const coordinatorFixes = this.fixCoordinatorValues(fixed)
    if (coordinatorFixes > 0) {
      totalFixes += coordinatorFixes
      this.logger.info(
        `[LegacyFixes] Fixed ${coordinatorFixes} coordinator value issues`
      )
    }

    const conditionFixes = this.fixConditionStructure(fixed)
    if (conditionFixes > 0) {
      totalFixes += conditionFixes
      this.logger.info(
        `[LegacyFixes] Fixed ${conditionFixes} condition structure issues`
      )
    }

    this.logger.info(
      `[LegacyFixes] Completed legacy fixes - total fixes applied: ${totalFixes}`
    )
    return fixed
  }

  /**
   * Fix engine field - ensure it's set to 'Form' if missing or invalid
   */
  fixEngineField(formDef) {
    let fixCount = 0

    if (!formDef.engine || formDef.engine !== 'Form') {
      this.logger.debug(
        `[LegacyFixes] fixEngineField - updating engine from ${formDef.engine} to Form`
      )
      formDef.engine = 'Form'
      fixCount++
    }

    return fixCount
  }

  /**
   * Fix component titles - ensure all components have valid titles
   */
  fixComponentTitles(formDef) {
    let fixCount = 0

    if (formDef.pages && Array.isArray(formDef.pages)) {
      formDef.pages.forEach((page, pageIndex) => {
        if (page.components && Array.isArray(page.components)) {
          page.components.forEach((component, componentIndex) => {
            // Fix missing or invalid titles based on component type
            if (component.type && !component.content && !component.html) {
              // Non-content components should have a title
              if (
                !component.title ||
                typeof component.title !== 'string' ||
                component.title.trim() === ''
              ) {
                const defaultTitle =
                  component.name || `${component.type}_${componentIndex + 1}`
                this.logger.debug(
                  `[LegacyFixes] fixComponentTitles - page ${pageIndex}, component ${componentIndex}: setting title to ${defaultTitle}`
                )
                component.title = defaultTitle
                fixCount++
              }
            }

            // Fix title for specific component types
            if (
              component.type === 'Details' &&
              (!component.title || component.title === '')
            ) {
              component.title = 'More information'
              this.logger.debug(
                `[LegacyFixes] fixComponentTitles - setting Details component title to default`
              )
              fixCount++
            }
          })
        }
      })
    }

    return fixCount
  }

  /**
   * Fix component types - ensure all component types are valid
   */
  fixComponentTypes(formDef) {
    let fixCount = 0

    const validTypes = [
      'TextField',
      'MultilineTextField',
      'EmailAddressField',
      'TelephoneNumberField',
      'NumberField',
      'DatePartsField',
      'MonthYearField',
      'YesNoField',
      'SelectField',
      'RadiosField',
      'CheckboxesField',
      'FileUploadField',
      'Html',
      'Details',
      'InsetText',
      'Para',
      'List',
      'Section',
      'AutocompleteField',
      'UkAddressField'
    ]

    if (formDef.pages && Array.isArray(formDef.pages)) {
      formDef.pages.forEach((page, pageIndex) => {
        if (page.components && Array.isArray(page.components)) {
          page.components.forEach((component, componentIndex) => {
            if (component.type && !validTypes.includes(component.type)) {
              // Try to map common variations to valid types
              const typeMap = {
                Text: 'TextField',
                Textarea: 'MultilineTextField',
                Email: 'EmailAddressField',
                Phone: 'TelephoneNumberField',
                Number: 'NumberField',
                Date: 'DatePartsField',
                YesNo: 'YesNoField',
                Select: 'SelectField',
                Radio: 'RadiosField',
                Checkbox: 'CheckboxesField',
                File: 'FileUploadField',
                Content: 'Html',
                Paragraph: 'Para'
              }

              const mappedType = typeMap[component.type] || 'TextField'
              this.logger.debug(
                `[LegacyFixes] fixComponentTypes - page ${pageIndex}, component ${componentIndex}: changing type from ${component.type} to ${mappedType}`
              )
              component.type = mappedType
              fixCount++
            }
          })
        }
      })
    }

    return fixCount
  }

  /**
   * Fix component names - ensure all input components have valid names
   */
  fixComponentNames(formDef) {
    let fixCount = 0
    const usedNames = new Set()

    const inputTypes = [
      'TextField',
      'MultilineTextField',
      'EmailAddressField',
      'TelephoneNumberField',
      'NumberField',
      'DatePartsField',
      'MonthYearField',
      'YesNoField',
      'SelectField',
      'RadiosField',
      'CheckboxesField',
      'FileUploadField',
      'AutocompleteField',
      'UkAddressField'
    ]

    if (formDef.pages && Array.isArray(formDef.pages)) {
      formDef.pages.forEach((page, pageIndex) => {
        if (page.components && Array.isArray(page.components)) {
          page.components.forEach((component, componentIndex) => {
            if (inputTypes.includes(component.type)) {
              if (
                !component.name ||
                typeof component.name !== 'string' ||
                component.name.trim() === ''
              ) {
                // Generate a name from the title or type
                let baseName = component.title || component.type || 'field'
                baseName = baseName
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '_')
                  .replace(/^_+|_+$/g, '')
                  .substring(0, 30)

                if (!baseName) baseName = 'field'

                // Ensure uniqueness
                let name = baseName
                let counter = 1
                while (usedNames.has(name)) {
                  name = `${baseName}_${counter}`
                  counter++
                }

                this.logger.debug(
                  `[LegacyFixes] fixComponentNames - page ${pageIndex}, component ${componentIndex}: setting name to ${name}`
                )
                component.name = name
                usedNames.add(name)
                fixCount++
              } else {
                usedNames.add(component.name)
              }
            }
          })
        }
      })
    }

    return fixCount
  }

  /**
   * Fix list references - ensure all list references are valid
   */
  fixListReferences(formDef) {
    let fixCount = 0

    // Collect all available list names
    const availableLists = new Set()
    if (formDef.lists && Array.isArray(formDef.lists)) {
      formDef.lists.forEach((list) => {
        if (list.name) {
          availableLists.add(list.name)
        }
      })
    }

    if (formDef.pages && Array.isArray(formDef.pages)) {
      formDef.pages.forEach((page, pageIndex) => {
        if (page.components && Array.isArray(page.components)) {
          page.components.forEach((component, componentIndex) => {
            // Fix list references in select/radio/checkbox components
            if (
              [
                'SelectField',
                'RadiosField',
                'CheckboxesField',
                'AutocompleteField'
              ].includes(component.type)
            ) {
              if (component.list && !availableLists.has(component.list)) {
                this.logger.debug(
                  `[LegacyFixes] fixListReferences - page ${pageIndex}, component ${componentIndex}: removing invalid list reference ${component.list}`
                )
                delete component.list

                // If no items are defined, add default items
                if (
                  !component.items ||
                  !Array.isArray(component.items) ||
                  component.items.length === 0
                ) {
                  component.items = [
                    { text: 'Option 1', value: 'option1' },
                    { text: 'Option 2', value: 'option2' }
                  ]
                  this.logger.debug(
                    `[LegacyFixes] fixListReferences - added default items to component`
                  )
                }
                fixCount++
              }
            }
          })
        }
      })
    }

    return fixCount
  }

  /**
   * Fix coordinator values - ensure all conditions have valid coordinators
   */
  fixCoordinatorValues(formDef) {
    let fixCount = 0

    if (formDef.conditions && Array.isArray(formDef.conditions)) {
      formDef.conditions.forEach((condition, index) => {
        if (condition.value && typeof condition.value === 'object') {
          // Check if coordinator is missing or invalid
          if (
            !condition.value.coordinator ||
            (condition.value.coordinator !== 'and' &&
              condition.value.coordinator !== 'or')
          ) {
            // Default to 'and' if multiple conditions exist
            if (
              condition.value.conditions &&
              Array.isArray(condition.value.conditions) &&
              condition.value.conditions.length > 1
            ) {
              this.logger.debug(
                `[LegacyFixes] fixCoordinatorValues - condition ${index}: setting coordinator to 'and'`
              )
              condition.value.coordinator = 'and'
              fixCount++
            } else if (
              condition.value.conditions &&
              Array.isArray(condition.value.conditions) &&
              condition.value.conditions.length === 1
            ) {
              // Remove coordinator for single condition
              this.logger.debug(
                `[LegacyFixes] fixCoordinatorValues - condition ${index}: removing coordinator for single condition`
              )
              delete condition.value.coordinator
              fixCount++
            }
          }
        }
      })
    }

    return fixCount
  }

  /**
   * Fix condition structure - ensure all conditions have valid structure
   */
  fixConditionStructure(formDef) {
    let fixCount = 0

    if (formDef.conditions && Array.isArray(formDef.conditions)) {
      formDef.conditions.forEach((condition, index) => {
        // Ensure condition has a name
        if (!condition.name || typeof condition.name !== 'string') {
          condition.name = `condition_${index + 1}`
          this.logger.debug(
            `[LegacyFixes] fixConditionStructure - condition ${index}: added name ${condition.name}`
          )
          fixCount++
        }

        // Ensure condition has a display name
        if (
          !condition.displayName ||
          typeof condition.displayName !== 'string'
        ) {
          condition.displayName = condition.name
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase())
          this.logger.debug(
            `[LegacyFixes] fixConditionStructure - condition ${index}: added displayName ${condition.displayName}`
          )
          fixCount++
        }

        // Fix condition value structure
        if (condition.value && typeof condition.value === 'object') {
          if (
            !condition.value.conditions ||
            !Array.isArray(condition.value.conditions)
          ) {
            if (
              condition.value.field &&
              condition.value.operator &&
              condition.value.value !== undefined
            ) {
              // Convert single condition to array format
              condition.value = {
                conditions: [
                  {
                    field: { name: condition.value.field },
                    operator: condition.value.operator,
                    value: condition.value.value
                  }
                ]
              }
              this.logger.debug(
                `[LegacyFixes] fixConditionStructure - condition ${index}: converted to array format`
              )
              fixCount++
            }
          }
        }
      })
    }

    return fixCount
  }
}
