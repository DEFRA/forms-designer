/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-console */
import { ComponentTypes, hasFormField, hasListField } from '@defra/forms-model'
import { v4 as uuidv4, validate as uuidValidate } from 'uuid'

import { createLogger } from '~/src/common/helpers/logging/logger.js'

/**
 * Enhanced Response Processor - Handles parsing and fixing AI responses
 * Centralises all response processing logic
 */
export class ResponseProcessor {
  constructor() {
    this.logger = createLogger()
  }

  /**
   * Clean XML tags from description text for user display
   * @param {string} text - Text that may contain XML tags
   * @returns {string} Clean text without XML tags
   */
  cleanDescriptionText(text) {
    console.log('🧹 cleanDescriptionText called')
    console.log('📝 Input text length:', text?.length)
    console.log('📝 Input preview:', text?.substring(0, 200))

    if (!text || typeof text !== 'string') {
      console.log('❌ Invalid input - returning empty string')
      return ''
    }

    // Remove XML tags (opening and closing)
    let cleaned = text
      .replace(/<[^>]*>/g, '') // Remove all XML tags
      .replace(/&lt;/g, '<') // Decode HTML entities
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim() // Remove leading/trailing whitespace

    // Clean up extra whitespace
    cleaned = cleaned
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple newlines to double newlines
      .replace(/[ \t]+/g, ' ') // Multiple spaces/tabs to single space
      .trim()

    console.log('✅ cleanDescriptionText completed')
    console.log('📝 Output text length:', cleaned.length)
    console.log('📝 Output preview:', cleaned.substring(0, 200))

    return cleaned
  }

  /**
   * Process AI response and return clean form definition
   * @param {string} aiResponse - Raw AI response
   * @returns {object} Processed form definition
   */
  processResponse(aiResponse) {
    console.log('🔄 processResponse called')
    console.log('📝 AI Response Length:', aiResponse?.length)
    console.log('📝 AI Response Preview:', aiResponse?.substring(0, 200))

    try {
      const formDefinition = this.extractJson(aiResponse)
      console.log(
        '✅ processResponse - extracted JSON:',
        JSON.stringify(formDefinition, null, 2)
      )

      this.fixEngineField(formDefinition)
      this.fixAllGuids(formDefinition)
      this.fixComponentTitles(formDefinition)
      this.fixComponentTypes(formDefinition)
      this.fixComponentNames(formDefinition)
      this.fixListReferences(formDefinition)
      this.fixCoordinatorValues(formDefinition)
      this.fixConditionStructure(formDefinition)
      this.ensureRequiredFields(formDefinition)

      console.log('🎉 processResponse completed successfully')
      console.log(
        '📊 Final Form Definition:',
        JSON.stringify(formDefinition, null, 2)
      )
      console.log('📊 Pages Count:', formDefinition.pages?.length)
      console.log('📊 Lists Count:', formDefinition.lists?.length)
      console.log('📊 Conditions Count:', formDefinition.conditions?.length)

      return formDefinition
    } catch (error) {
      console.error('❌ processResponse failed:', error)
      console.error('📝 AI Response that caused error:', aiResponse)
      throw error
    }
  }

  /**
   * Extract JSON from AI response
   * @param {string} response
   * @returns {object}
   */
  extractJson(response) {
    console.log('🔍 extractJson called')
    console.log('📝 Response Length:', response?.length)
    console.log('📝 Response Preview:', response?.substring(0, 100))

    const jsonRegex = /\{[\s\S]*\}/
    const match = jsonRegex.exec(response)

    if (!match) {
      console.error('❌ extractJson - No JSON found in response:', response)
      throw new Error('No JSON found in AI response')
    }

    try {
      const parsed = JSON.parse(match[0])
      console.log('✅ extractJson completed successfully')
      console.log('🔑 Parsed Keys:', Object.keys(parsed))
      console.log('📏 Matched JSON Length:', match[0].length)
      return parsed
    } catch (error) {
      console.error('❌ extractJson - JSON parsing failed:', error)
      console.error('📝 Matched JSON:', match[0])
      throw new Error(
        `Invalid JSON in response: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * Fix all GUIDs in the form definition to ensure they are valid and unique
   * @param {FormDefinition} formDefinition
   * @returns {void}
   */
  fixAllGuids(formDefinition) {
    console.log('🔧 fixAllGuids called')
    console.log('📊 Form Definition:', JSON.stringify(formDefinition, null, 2))
    console.log('📊 Pages Count:', formDefinition.pages?.length)
    console.log('📊 Lists Count:', formDefinition.lists?.length)
    console.log('📊 Conditions Count:', formDefinition.conditions?.length)

    let fixedCount = 0
    const guidMap = new Map()
    const seenIds = new Set()

    // Generate a unique UUID that hasn't been used yet
    const generateUniqueUuid = () => {
      let newUuid
      do {
        newUuid = uuidv4()
      } while (seenIds.has(newUuid))

      seenIds.add(newUuid)
      return newUuid
    }

    const fixGuid = (/** @type {any} */ obj, /** @type {string} */ field) => {
      if (obj && typeof obj[field] === 'string') {
        console.log('🔍 isValidUuid called:', {
          uuid: obj[field],
          type: typeof obj[field]
        })
        const isValid = this.isValidUuid(obj[field])
        console.log('✅ isValidUuid result:', {
          uuid: obj[field],
          result: isValid
        })

        if (!isValid || seenIds.has(obj[field])) {
          const oldUuid = obj[field]
          const newUuid = generateUniqueUuid()
          obj[field] = newUuid
          guidMap.set(oldUuid, newUuid)
          fixedCount++

          if (!isValid) {
            console.log('🔄 Fixed invalid GUID:', `${oldUuid} -> ${newUuid}`)
          } else {
            console.log('🔄 Fixed duplicate GUID:', `${oldUuid} -> ${newUuid}`)
          }
        } else {
          // Mark this valid UUID as seen
          seenIds.add(obj[field])
        }
      }
    }

    if (formDefinition.pages?.length) {
      formDefinition.pages.forEach(
        /** @type {any} */ (/** @type {{ components: any[]; }} */ page) => {
          fixGuid(page, 'id')

          if (page.components?.length) {
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

          if (list.items?.length) {
            list.items.forEach(
              /** @type {any} */ (/** @type {any} */ item) => {
                fixGuid(item, 'id')
              }
            )
          }
        }
      )
    }

    if (formDefinition.conditions?.length) {
      formDefinition.conditions.forEach(
        /** @type {any} */ (/** @type {{ items: any[]; }} */ condition) => {
          fixGuid(condition, 'id')

          if (condition.items?.length) {
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

    console.log('✅ fixAllGuids completed')
    console.log('📊 Fixed Count:', fixedCount)
    console.log('📊 GUID Map Size:', guidMap.size)
    console.log('📊 GUID Map:', Array.from(guidMap.entries()))

    if (fixedCount > 0) {
      console.log(`✅ Fixed ${fixedCount} invalid or missing GUIDs`)
    }
  }

  /**
   * Update GUID references throughout the form
   * @param {any} formDefinition
   * @param {Map<string, string>} guidMap - Old ID -> New ID mappings
   */
  updateGuidReferences(formDefinition, guidMap) {
    console.log('🔄 updateGuidReferences called')
    console.log('📊 Form Definition:', JSON.stringify(formDefinition, null, 2))
    console.log('📊 GUID Map:', Array.from(guidMap.entries()))

    if (formDefinition.pages?.length) {
      formDefinition.pages.forEach(
        /** @type {any} */ (
          /** @type {{ condition: string | undefined; next: any[]; components: any[]; }} */ page
        ) => {
          if (page.condition && guidMap.has(page.condition)) {
            const oldCondition = page.condition
            page.condition = guidMap.get(page.condition)
            console.log('🔄 Updated page condition reference:', {
              oldCondition,
              newCondition: page.condition
            })
          }

          if (page.next?.length) {
            page.next.forEach((/** @type {any} */ next) => {
              if (next.condition && guidMap.has(next.condition)) {
                const oldCondition = next.condition
                next.condition = guidMap.get(next.condition)
                console.log('🔄 Updated next condition reference:', {
                  oldCondition,
                  newCondition: next.condition
                })
              }
            })
          }

          if (page.components?.length) {
            page.components.forEach((/** @type {any} */ component) => {
              if (component.list && guidMap.has(component.list)) {
                const oldList = component.list
                component.list = guidMap.get(component.list)
                console.log('🔄 Updated component list reference:', {
                  oldList,
                  newList: component.list
                })
              }
            })
          }
        }
      )
    }

    if (formDefinition.conditions?.length) {
      formDefinition.conditions.forEach(
        (/** @type {{ items: any[]; }} */ condition) => {
          if (condition.items?.length) {
            condition.items.forEach(
              (
                /** @type {{ componentId: string | undefined; type: string; value: { listId: string | undefined; itemId: string | undefined; }; }} */ item
              ) => {
                if (item.componentId && guidMap.has(item.componentId)) {
                  const oldComponentId = item.componentId
                  item.componentId = guidMap.get(item.componentId)
                  console.log('🔄 Updated condition item componentId:', {
                    oldComponentId,
                    newComponentId: item.componentId
                  })
                }

                if (item.type === 'ListItemRef') {
                  if (item.value.listId && guidMap.has(item.value.listId)) {
                    const oldListId = item.value.listId
                    item.value.listId = guidMap.get(item.value.listId)
                    console.log('🔄 Updated condition item listId:', {
                      oldListId,
                      newListId: item.value.listId
                    })
                  }
                  if (item.value.itemId && guidMap.has(item.value.itemId)) {
                    const oldItemId = item.value.itemId
                    item.value.itemId = guidMap.get(item.value.itemId)
                    console.log('🔄 Updated condition item itemId:', {
                      oldItemId,
                      newItemId: item.value.itemId
                    })
                  }
                }
              }
            )
          }
        }
      )
    }

    console.log('✅ updateGuidReferences completed')
  }

  /**
   * Check if a string is a valid UUID
   * @param {string} uuid
   * @returns {boolean}
   */
  isValidUuid(uuid) {
    console.log('🔍 isValidUuid called:', { uuid, type: typeof uuid })

    if (!uuid || typeof uuid !== 'string') {
      console.log('❌ isValidUuid - invalid input:', {
        uuid,
        type: typeof uuid
      })
      return false
    }

    const result = uuidValidate(uuid)
    console.log('✅ isValidUuid result:', { uuid, result })
    return result
  }

  /**
   * Fix engine field for V2 forms
   * @param {any} formDefinition
   */
  fixEngineField(formDefinition) {
    console.log('🔧 fixEngineField called')
    console.log('📊 Current Engine:', formDefinition.engine)
    console.log('📊 Current Schema:', formDefinition.schema)

    if (formDefinition.schema === 2 && formDefinition.engine !== 'V2') {
      const oldEngine = formDefinition.engine
      formDefinition.engine = 'V2'
      console.log('✅ fixEngineField - Fixed engine field to V2:', {
        oldEngine,
        newEngine: formDefinition.engine
      })
    } else {
      console.log('ℹ️  fixEngineField - No changes needed')
    }
  }

  /**
   * Fix empty component titles
   * @param {any} formDefinition
   */
  fixComponentTitles(formDefinition) {
    console.log('🔧 fixComponentTitles called')
    console.log('📊 Pages Count:', formDefinition.pages?.length)

    let fixedCount = 0

    formDefinition.pages?.forEach(
      (/** @type {{ components: any[]; title: string; }} */ page) => {
        if (page.components?.length) {
          page.components.forEach(
            (
              /** @type {Partial<import("@defra/forms-model").ComponentDef> | undefined} */ component
            ) => {
              if (
                hasFormField(component) &&
                (!component.title || component.title.trim() === '')
              ) {
                const oldTitle = component.title
                if (page.components.length === 1 && page.title) {
                  component.title = page.title
                } else {
                  component.title = this.generateComponentTitle(
                    component.type,
                    component.name
                  )
                }
                console.log('🔄 Fixed component title:', {
                  componentId: component.id,
                  oldTitle,
                  newTitle: component.title
                })
                fixedCount++
              }
            }
          )
        }
      }
    )

    console.log('✅ fixComponentTitles completed:', { fixedCount })

    if (fixedCount > 0) {
      console.log(`✅ Fixed ${fixedCount} empty component titles`)
    }
  }

  /**
   * Fix invalid component types
   * @param {any} formDefinition
   */
  fixComponentTypes(formDefinition) {
    console.log('🔧 fixComponentTypes called')
    console.log('📊 Pages Count:', formDefinition.pages?.length)

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
        if (page.components?.length) {
          page.components.forEach(
            (/** @type {{ type: string | number; }} */ component) => {
              if (typeMap[component.type]) {
                const oldType = component.type
                component.type = typeMap[component.type]
                console.log('🔄 Fixed component type:', {
                  componentId: component.id,
                  oldType,
                  newType: component.type
                })
                fixedCount++
              }
            }
          )
        }
      }
    )

    console.log('✅ fixComponentTypes completed:', { fixedCount })

    if (fixedCount > 0) {
      console.log(`✅ Fixed ${fixedCount} invalid component types`)
    }
  }

  /**
   * Fix component names to be valid JS identifiers
   * @param {any} formDefinition
   */
  fixComponentNames(formDefinition) {
    console.log('🔧 fixComponentNames called')
    console.log('📊 Pages Count:', formDefinition.pages?.length)

    let fixedCount = 0

    formDefinition.pages?.forEach(
      (/** @type {{ components: any[]; }} */ page) => {
        if (page.components?.length) {
          page.components.forEach(
            (
              /** @type {Partial<import("@defra/forms-model").ComponentDef> | undefined} */ component
            ) => {
              if (hasFormField(component) && component.name) {
                const validName = this.generateValidName(component.name)
                if (validName !== component.name) {
                  const oldName = component.name
                  component.name = validName
                  console.log('🔄 Fixed component name:', {
                    componentId: component.id,
                    oldName,
                    newName: component.name
                  })
                  fixedCount++
                }
              }
            }
          )
        }
      }
    )

    console.log('✅ fixComponentNames completed:', { fixedCount })

    if (fixedCount > 0) {
      console.log(`✅ Fixed ${fixedCount} invalid component names`)
    }
  }

  /**
   * Fix missing list references
   * @param {any} formDefinition
   */
  fixListReferences(formDefinition) {
    console.log('🔧 fixListReferences called')
    console.log('📊 Pages Count:', formDefinition.pages?.length)
    console.log('📊 Lists Count:', formDefinition.lists?.length)

    let fixedCount = 0

    const listMap = new Map()
    formDefinition.lists?.forEach(
      (/** @type {{ name: any; id: any; }} */ list) => {
        if (list.name && list.id) {
          listMap.set(list.name, list.id)
        }
      }
    )

    console.log('📊 Built list map:', Array.from(listMap.entries()))

    formDefinition.pages?.forEach(
      (/** @type {{ components: any[]; }} */ page) => {
        if (page.components?.length) {
          page.components.forEach(
            (
              /** @type {Partial<import("@defra/forms-model").ComponentDef> | undefined} */ component
            ) => {
              if (hasListField(component)) {
                if (component.list && listMap.has(component.list)) {
                  const oldList = component.list
                  component.list = listMap.get(component.list)
                  console.log('🔄 Fixed list reference:', {
                    componentId: component.id,
                    oldList,
                    newList: component.list
                  })
                  fixedCount++
                } else if (!component.list && formDefinition.lists) {
                  const defaultList = this.createDefaultList(component)
                  formDefinition.lists.push(defaultList)
                  component.list = defaultList.id
                  console.log('🔄 Created default list for component:', {
                    componentId: component.id,
                    defaultList: JSON.stringify(defaultList, null, 2)
                  })
                  fixedCount++
                }
              }
            }
          )
        }
      }
    )

    console.log('✅ fixListReferences completed:', { fixedCount })

    if (fixedCount > 0) {
      console.log(`✅ Fixed ${fixedCount} list references`)
    }
  }

  /**
   * Fix coordinator values (AND/OR -> and/or)
   * @param {any} formDefinition
   */
  fixCoordinatorValues(formDefinition) {
    console.log('🔧 fixCoordinatorValues called')
    console.log('📊 Conditions Count:', formDefinition.conditions?.length)

    let fixedCount = 0

    formDefinition.conditions?.forEach(
      (/** @type {{ coordinator: string; }} */ condition) => {
        if (condition.coordinator === 'AND') {
          const oldCoordinator = condition.coordinator
          condition.coordinator = 'and'
          console.log('🔄 Fixed coordinator value:', {
            conditionId: condition.id,
            oldCoordinator,
            newCoordinator: condition.coordinator
          })
          fixedCount++
        } else if (condition.coordinator === 'OR') {
          const oldCoordinator = condition.coordinator
          condition.coordinator = 'or'
          console.log('🔄 Fixed coordinator value:', {
            conditionId: condition.id,
            oldCoordinator,
            newCoordinator: condition.coordinator
          })
          fixedCount++
        }
      }
    )

    console.log('✅ fixCoordinatorValues completed:', { fixedCount })

    if (fixedCount > 0) {
      console.log(`✅ Fixed ${fixedCount} coordinator values`)
    }
  }

  /**
   * Fix condition structure by converting old format conditions to the new wrapper format
   * @param {any} formDefinition
   */
  fixConditionStructure(formDefinition) {
    console.log('🔧 fixConditionStructure called')
    console.log('📊 Conditions Count:', formDefinition.conditions?.length)
    console.log(
      '📊 Conditions:',
      JSON.stringify(formDefinition.conditions, null, 2)
    )

    if (
      !formDefinition.conditions ||
      !Array.isArray(formDefinition.conditions)
    ) {
      console.log('ℹ️  fixConditionStructure - No conditions to fix')
      return
    }

    // eslint-disable-next-line no-console
    console.log('=== CONDITION STRUCTURE FIX - BEFORE ===')
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(formDefinition.conditions, null, 2))

    let fixedCount = 0
    /** @type {any[]} */
    const newConditions = []

    formDefinition.conditions.forEach((/** @type {any} */ condition) => {
      if (condition.field && !condition.items) {
        // eslint-disable-next-line no-console
        console.log('Found old format condition with field:', condition)

        const componentId = this.findComponentIdByName(
          formDefinition,
          condition.field.name
        )

        const wrappedCondition = {
          id: condition.id ?? uuidv4(),
          displayName: condition.field.display ?? 'Condition',
          coordinator: 'and',
          items: [
            {
              id: uuidv4(),
              componentId,
              operator: condition.operator,
              type: condition.value?.type ?? 'StringValue',
              value: this.fixConditionValue(condition.value)
            }
          ]
        }

        console.log('🔄 Converted old format condition:', {
          oldCondition: JSON.stringify(condition, null, 2),
          newCondition: JSON.stringify(wrappedCondition, null, 2),
          componentId
        })

        newConditions.push(wrappedCondition)
        fixedCount++
        console.log(
          `✅ Converted old format condition to wrapper format: ${condition.field.display}`
        )
      } else if (condition.items && Array.isArray(condition.items)) {
        if (!condition.coordinator && condition.items.length > 1) {
          condition.coordinator = 'and'
          console.log('🔄 Added default coordinator:', {
            conditionId: condition.id
          })
        }
        newConditions.push(condition)
      } else {
        newConditions.push(condition)
      }
    })

    if (fixedCount > 0) {
      formDefinition.conditions = newConditions
      console.log('✅ fixConditionStructure completed:', {
        fixedCount,
        oldConditionsCount: formDefinition.conditions?.length,
        newConditionsCount: newConditions.length
      })
    }

    // eslint-disable-next-line no-console
    console.log('=== CONDITION STRUCTURE FIX - AFTER ===')
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(formDefinition.conditions, null, 2))
  }

  /**
   * Find component ID by name
   * @param {any} formDefinition
   * @param {string} componentName
   * @returns {string|undefined}
   */
  findComponentIdByName(formDefinition, componentName) {
    console.log('🔍 findComponentIdByName called:', { componentName })

    for (const page of formDefinition.pages ?? []) {
      for (const component of page.components ?? []) {
        if (component.name === componentName) {
          console.log('✅ Found component by name:', {
            componentName,
            componentId: component.id,
            pageId: page.id
          })
          return component.id
        }
      }
    }

    console.log('❌ Component not found by name:', { componentName })
    return undefined
  }

  /**
   * Ensure all required fields are present
   * @param {any} formDefinition
   */
  ensureRequiredFields(formDefinition) {
    console.log('🔧 ensureRequiredFields called')
    console.log('📊 Current Engine:', formDefinition.engine)
    console.log('📊 Current Schema:', formDefinition.schema)
    console.log('📊 Pages Count:', formDefinition.pages?.length)

    const changes = []

    if (!formDefinition.engine) {
      formDefinition.engine = 'V2'
      changes.push('Set engine to V2')
    }

    if (!formDefinition.schema) {
      formDefinition.schema = 2
      changes.push('Set schema to 2')
    }

    if (!formDefinition.pages) {
      formDefinition.pages = []
      changes.push('Initialized pages array')
    }

    if (!formDefinition.sections) {
      formDefinition.sections = []
      changes.push('Initialized sections array')
    }

    if (formDefinition.schema === 2) {
      if (!formDefinition.name) {
        formDefinition.name = ''
        changes.push('Set name to empty string')
      }

      if (!formDefinition.startPage && formDefinition.pages?.length > 0) {
        formDefinition.startPage = formDefinition.pages[0].path
        changes.push(`Set startPage to ${formDefinition.startPage}`)
      }
    }

    formDefinition.pages?.forEach(
      (/** @type {{ components: any[]; }} */ page) => {
        if (page.components?.length) {
          page.components.forEach(
            (/** @type {{ options?: {}; schema?: {}; }} */ component) => {
              if (!component.options) {
                component.options = {}
                changes.push(`Set options for component ${component.id}`)
              }
              if (!component.schema) {
                component.schema = {}
                changes.push(`Set schema for component ${component.id}`)
              }
            }
          )
        }
      }
    )

    console.log('✅ ensureRequiredFields completed')
    console.log('📊 Changes:', changes)
    console.log('📊 Changes Count:', changes.length)
  }

  /**
   * Generate a valid component title
   * @param {string} type
   * @param {string} name
   * @returns {string}
   */
  generateComponentTitle(type, name) {
    console.log('🔧 generateComponentTitle called:', { type, name })

    const typeInfo = ComponentTypes.find((t) => t.name === type)
    const baseTitle = typeInfo?.title ?? 'Field'

    let result
    if (name && name !== 'field') {
      const formatted = name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim()
      result = formatted
    } else {
      result = baseTitle
    }

    console.log('✅ generateComponentTitle result:', { type, name, result })
    return result
  }

  /**
   * Generate valid JS identifier from string
   * @param {string} name
   * @returns {string}
   */
  generateValidName(name) {
    console.log('🔧 generateValidName called:', { name })

    let valid = name.replace(/[^a-zA-Z0-9]/g, '')

    if (!/^[a-zA-Z]/.test(valid)) {
      valid = 'field' + valid
    }

    if (valid.length === 0) {
      valid = 'field'
    }

    console.log('✅ generateValidName result:', { name, valid })
    return valid
  }

  /**
   * Create a default list for a component
   * @param {any} component
   * @returns {{id: string, name: string, title: string, type: string, items: Array<{id: string, text: string, value: string}>}}
   */
  createDefaultList(component) {
    console.log(
      '🔧 createDefaultList called:',
      JSON.stringify(component, null, 2)
    )

    const listId = uuidv4()
    const baseName = component.name ?? 'option'

    const defaultList = {
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

    console.log(
      '✅ createDefaultList result:',
      JSON.stringify(defaultList, null, 2)
    )
    return defaultList
  }

  /**
   * Fix the value object for a condition item
   * @param {any} value
   * @returns {any}
   */
  fixConditionValue(value) {
    console.log('🔧 fixConditionValue called:', { value, type: typeof value })

    if (value === null || value === undefined) {
      console.log('ℹ️  fixConditionValue - null/undefined value')
      return null
    }

    if (typeof value === 'object' && value !== null) {
      if (value.type === 'ListItemRef') {
        const result = {
          listId: value.listId,
          itemId: value.itemId
        }
        console.log('✅ fixConditionValue - ListItemRef:', { value, result })
        return result
      }
      const { type, ...cleanValue } = value
      console.log('✅ fixConditionValue - object without type:', {
        value,
        cleanValue
      })
      return cleanValue
    }

    console.log('✅ fixConditionValue - primitive value:', { value })
    return value
  }
}

/*
import { FormDefinition } from '@defra/forms-model'
*/
