import { type ComponentType } from '~/src/components/enums.js'
import { isConditionalType, isContentType } from '~/src/components/helpers.js'
import { type ConditionalComponentType } from '~/src/components/types.js'
import { type ConditionFieldData } from '~/src/conditions/types.js'

export class ConditionField {
  name: string
  type: ConditionalComponentType
  display: string

  constructor(name?: string, type?: ComponentType, display?: string) {
    if (!name || typeof name !== 'string') {
      throw new Error("ConditionField param 'name' must be a string")
    }

    if (!isConditionalType(type) || isContentType(type)) {
      throw new Error("ConditionField param 'type' must support conditions")
    }

    if (!display || typeof display !== 'string') {
      throw new Error("ConditionField param 'display' must be a string")
    }

    this.name = name
    this.type = type
    this.display = display
  }

  clone(): ConditionField {
    return ConditionField.from(this)
  }

  toJSON(): ConditionFieldData {
    return structuredClone(this.clone())
  }

  static from(obj: ConditionField | ConditionFieldData) {
    return new ConditionField(obj.name, obj.type, obj.display)
  }
}
