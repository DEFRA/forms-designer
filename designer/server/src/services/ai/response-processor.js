import { ComponentTypes, hasFormField, hasListField } from '@defra/forms-model'
import { v4 as uuidv4, validate as uuidValidate } from 'uuid'

import { createLogger } from '~/src/common/helpers/logging/logger.js'

const logger = createLogger()

/**
 * Enhanced Response Processor - Handles parsing and fixing AI responses
 * Centralises all response processing logic
 */
export class ResponseProcessor {
  constructor() {
    this.logger = createLogger()
  }

  /**
   * Process AI response and return clean form definition
   * @param {string} aiResponse - Raw AI response
   * @returns {object} Processed form definition
   */
  processResponse(aiResponse) {
    try {
      const formDefinition = this.extractJson(aiResponse)

      this.fixEngineField(formDefinition)
      this.fixAllGuids(formDefinition)
      this.fixComponentTitles(formDefinition)
      this.fixComponentTypes(formDefinition)
      this.fixComponentNames(formDefinition)
      this.fixListReferences(formDefinition)
      this.fixCoordinatorValues(formDefinition)
      this.ensureRequiredFields(formDefinition)

      logger.info('Response processing complete')
      return formDefinition
    } catch (error) {
      logger.error(error, 'Response processing failed')
      throw error
    }
  }

  /**
   * Extract JSON from AI response
   * @param {string} response
   * @returns {object}
   */
  extractJson(response) {
    const jsonRegex = /\{[\s\S]*\}/
    const match = jsonRegex.exec(response)

    if (!match) {
      throw new Error('No JSON found in AI response')
    }

    try {
      return JSON.parse(match[0])
    } catch (error) {
      logger.error(error, 'JSON parsing failed')
      throw new Error(
        `Invalid JSON in response: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * Fix all GUIDs in the form definition
   * @param {any} formDefinition
   */
  fixAllGuids(formDefinition) {
    const guidMap = new Map()
    let fixedCount = 0

    const fixGuid = (/** @type {any} */ obj, /** @type {string} */ field) => {
      if (!obj[field] || !this.isValidUuid(obj[field])) {
        const oldId = obj[field]
        const newId = uuidv4()
        obj[field] = newId

        if (oldId) {
          guidMap.set(oldId, newId)
          logger.debug(`Fixed invalid GUID: ${oldId} -> ${newId}`)
        }

        fixedCount++
      }
    }

    if (formDefinition.pages?.length) {
      formDefinition.pages.forEach(
        /** @type {any} */ (/** @type {{ components: any[]; }} */ page) => {
          fixGuid(page, 'id')

          if (page.components.length) {
            page.components.forEach(
              /** @type {any} */ (/** @type {any} */ component) => {
                fixGuid(component, 'id')
              }
            )
          }
        }
      )
    }

    if (formDefinition.lists?.length) {
      formDefinition.lists.forEach(
        /** @type {any} */ (/** @type {{ items: any[]; }} */ list) => {
          fixGuid(list, 'id')

          if (list.items.length) {
            list.items.forEach(
              /** @type {any} */ (/** @type {any} */ item) => {
                fixGuid(item, 'id')
              }
            )
          }
        }
      )
    }

    if (formDefinition.conditions.length) {
      formDefinition.conditions.forEach(
        /** @type {any} */ (/** @type {{ items: any[]; }} */ condition) => {
          fixGuid(condition, 'id')

          if (condition.items.length) {
            condition.items.forEach(
              /** @type {any} */ (/** @type {any} */ item) => {
                fixGuid(item, 'id')
              }
            )
          }
        }
      )
    }

    if (guidMap.size > 0) {
      this.updateGuidReferences(formDefinition, guidMap)
    }

    if (fixedCount > 0) {
      logger.info(`Fixed ${fixedCount} invalid or missing GUIDs`)
    }
  }

  /**
   * Update GUID references throughout the form
   * @param {any} formDefinition
   * @param {Map<string, string>} guidMap - Old ID -> New ID mappings
   */
  updateGuidReferences(formDefinition, guidMap) {
    if (formDefinition.pages?.length) {
      formDefinition.pages.forEach(
        /** @type {any} */ (
          /** @type {{ condition: string | undefined; next: any[]; components: any[]; }} */ page
        ) => {
          if (page.condition && guidMap.has(page.condition)) {
            page.condition = guidMap.get(page.condition)
          }

          if (page.next.length) {
            page.next.forEach((/** @type {any} */ next) => {
              if (next.condition && guidMap.has(next.condition)) {
                next.condition = guidMap.get(next.condition)
              }
            })
          }

          if (page.components.length) {
            page.components.forEach((/** @type {any} */ component) => {
              if (component.list && guidMap.has(component.list)) {
                component.list = guidMap.get(component.list)
              }
            })
          }
        }
      )
    }

    if (formDefinition.conditions.length) {
      formDefinition.conditions.forEach(
        (/** @type {{ items: any[]; }} */ condition) => {
          if (condition.items.length) {
            condition.items.forEach(
              (
                /** @type {{ componentId: string | undefined; type: string; value: { listId: string | undefined; itemId: string | undefined; }; }} */ item
              ) => {
                if (item.componentId && guidMap.has(item.componentId)) {
                  item.componentId = guidMap.get(item.componentId)
                }

                if (item.type === 'ListItemRef') {
                  if (item.value.listId && guidMap.has(item.value.listId)) {
                    item.value.listId = guidMap.get(item.value.listId)
                  }
                  if (item.value.itemId && guidMap.has(item.value.itemId)) {
                    item.value.itemId = guidMap.get(item.value.itemId)
                  }
                }
              }
            )
          }
        }
      )
    }
  }

  /**
   * Check if a string is a valid UUID v4
   * @param {string} uuid
   * @returns {boolean}
   */
  isValidUuid(uuid) {
    if (!uuid || typeof uuid !== 'string') return false

    // Use uuid library's validate function
    if (!uuidValidate(uuid)) return false

    // Additional check for v4 format
    const v4Regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return v4Regex.test(uuid)
  }

  /**
   * Fix engine field for V2 forms
   * @param {any} formDefinition
   */
  fixEngineField(formDefinition) {
    if (formDefinition.schema === 2 && formDefinition.engine !== 'V2') {
      formDefinition.engine = 'V2'
      logger.info('Fixed engine field to V2')
    }
  }

  /**
   * Fix empty component titles
   * @param {any} formDefinition
   */
  fixComponentTitles(formDefinition) {
    let fixedCount = 0

    formDefinition.pages?.forEach(
      (/** @type {{ components: any[]; title: string; }} */ page) => {
        page.components.forEach(
          (
            /** @type {Partial<import("@defra/forms-model").ComponentDef> | undefined} */ component
          ) => {
            if (
              hasFormField(component) &&
              (!component.title || component.title.trim() === '')
            ) {
              if (page.components.length === 1 && page.title) {
                component.title = page.title
              } else {
                component.title = this.generateComponentTitle(
                  component.type,
                  component.name
                )
              }
              fixedCount++
            }
          }
        )
      }
    )

    if (fixedCount > 0) {
      logger.info(`Fixed ${fixedCount} empty component titles`)
    }
  }

  /**
   * Fix invalid component types
   * @param {any} formDefinition
   */
  fixComponentTypes(formDefinition) {
    /** @type {Record<string, string>} */
    const typeMap = {
      EmailField: 'EmailAddressField',
      PhoneField: 'TelephoneNumberField',
      TextAreaField: 'MultilineTextField',
      TextArea: 'MultilineTextField',
      DropdownField: 'SelectField',
      Dropdown: 'SelectField',
      RadioField: 'RadiosField',
      Radio: 'RadiosField',
      CheckboxField: 'CheckboxesField',
      Checkbox: 'CheckboxesField',
      Date: 'DatePartsField',
      Address: 'UkAddressField'
    }

    let fixedCount = 0

    formDefinition.pages?.forEach(
      (/** @type {{ components: any[]; }} */ page) => {
        page.components.forEach(
          (/** @type {{ type: string | number; }} */ component) => {
            if (typeMap[component.type]) {
              component.type = typeMap[component.type]
              fixedCount++
            }
          }
        )
      }
    )

    if (fixedCount > 0) {
      logger.info(`Fixed ${fixedCount} invalid component types`)
    }
  }

  /**
   * Fix component names to be valid JS identifiers
   * @param {any} formDefinition
   */
  fixComponentNames(formDefinition) {
    let fixedCount = 0

    formDefinition.pages?.forEach(
      (/** @type {{ components: any[]; }} */ page) => {
        page.components.forEach(
          (
            /** @type {Partial<import("@defra/forms-model").ComponentDef> | undefined} */ component
          ) => {
            if (hasFormField(component) && component.name) {
              const validName = this.generateValidName(component.name)
              if (validName !== component.name) {
                component.name = validName
                fixedCount++
              }
            }
          }
        )
      }
    )

    if (fixedCount > 0) {
      logger.info(`Fixed ${fixedCount} invalid component names`)
    }
  }

  /**
   * Fix missing list references
   * @param {any} formDefinition
   */
  fixListReferences(formDefinition) {
    let fixedCount = 0

    const listMap = new Map()
    formDefinition.lists?.forEach(
      (/** @type {{ name: any; id: any; }} */ list) => {
        if (list.name && list.id) {
          listMap.set(list.name, list.id)
        }
      }
    )

    formDefinition.pages?.forEach(
      (/** @type {{ components: any[]; }} */ page) => {
        page.components.forEach(
          (
            /** @type {Partial<import("@defra/forms-model").ComponentDef> | undefined} */ component
          ) => {
            if (hasListField(component)) {
              if (component.list && listMap.has(component.list)) {
                component.list = listMap.get(component.list)
                fixedCount++
              } else if (!component.list && formDefinition.lists) {
                const defaultList = this.createDefaultList(component)
                formDefinition.lists.push(defaultList)
                component.list = defaultList.id
                fixedCount++
              }
            }
          }
        )
      }
    )

    if (fixedCount > 0) {
      logger.info(`Fixed ${fixedCount} list references`)
    }
  }

  /**
   * Fix coordinator values (AND/OR -> and/or)
   * @param {any} formDefinition
   */
  fixCoordinatorValues(formDefinition) {
    let fixedCount = 0

    formDefinition.conditions?.forEach(
      (/** @type {{ coordinator: string; }} */ condition) => {
        if (condition.coordinator === 'AND') {
          condition.coordinator = 'and'
          fixedCount++
        } else if (condition.coordinator === 'OR') {
          condition.coordinator = 'or'
          fixedCount++
        }
      }
    )

    if (fixedCount > 0) {
      logger.info(`Fixed ${fixedCount} coordinator values`)
    }
  }

  /**
   * Ensure all required fields are present
   * @param {any} formDefinition
   */
  ensureRequiredFields(formDefinition) {
    // Ensure top-level fields
    formDefinition.engine ??= 'V2'
    formDefinition.schema ??= 2
    formDefinition.pages ??= []
    formDefinition.sections ??= []

    // Ensure component fields
    formDefinition.pages?.forEach(
      (/** @type {{ components: any[]; }} */ page) => {
        page.components.forEach(
          (/** @type {{ options?: {}; schema?: {}; }} */ component) => {
            component.options ??= {}
            component.schema ??= {}
          }
        )
      }
    )
  }

  /**
   * Generate a valid component title
   * @param {string} type
   * @param {string} name
   * @returns {string}
   */
  generateComponentTitle(type, name) {
    const typeInfo = ComponentTypes.find((t) => t.name === type)
    const baseTitle = typeInfo?.title ?? 'Field'

    if (name && name !== 'field') {
      const formatted = name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim()
      return formatted
    }

    return baseTitle
  }

  /**
   * Generate valid JS identifier from string
   * @param {string} name
   * @returns {string}
   */
  generateValidName(name) {
    // Remove invalid characters and ensure starts with letter
    let valid = name.replace(/[^a-zA-Z0-9]/g, '')

    // Ensure starts with letter
    if (!/^[a-zA-Z]/.test(valid)) {
      valid = 'field' + valid
    }

    // Convert to camelCase if needed
    if (valid.length === 0) {
      valid = 'field'
    }

    return valid
  }

  /**
   * Create a default list for a component
   * @param {any} component
   * @returns {{id: string, name: string, title: string, type: string, items: Array<{id: string, text: string, value: string}>}}
   */
  createDefaultList(component) {
    const listId = uuidv4()
    const baseName = component.name ?? 'option'

    return {
      id: listId,
      name: `${baseName}List`,
      title: `Options for ${component.title ?? baseName}`,
      type: 'string',
      items: [
        {
          id: uuidv4(),
          text: 'Option 1',
          value: 'option1'
        },
        {
          id: uuidv4(),
          text: 'Option 2',
          value: 'option2'
        }
      ]
    }
  }
}
