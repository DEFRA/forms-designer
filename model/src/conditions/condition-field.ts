import { ConditionalComponentTypes } from '~/src/components/component-types.js'
import { type ConditionalComponentType } from '~/src/components/types.js'

export class ConditionField {
  name
  type
  display

  constructor(
    name?: string,
    type?: ConditionalComponentType,
    display?: string
  ) {
    if (!name || typeof name !== 'string') {
      throw new Error("ConditionField param 'name' must be a string")
    }

    if (
      !ConditionalComponentTypes.find(
        (componentType) => componentType.type === type
      )
    ) {
      throw new Error(
        "ConditionField param 'type' must be from enum ConditionalComponentTypes"
      )
    }

    if (!display || typeof display !== 'string') {
      throw new Error("ConditionField param 'display' must be a string")
    }

    this.name = name
    this.type = type
    this.display = display
  }

  static from(obj: {
    name: string
    type: ConditionalComponentType
    display: string
  }) {
    return new ConditionField(obj.name, obj.type, obj.display)
  }
}
