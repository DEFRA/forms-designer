import { type ComponentType } from '~/src/components/enums.js'
import { isConditionalType } from '~/src/components/helpers.js'

export class ConditionField {
  name
  type
  display

  constructor(name?: string, type?: ComponentType, display?: string) {
    if (!name || typeof name !== 'string') {
      throw new Error("ConditionField param 'name' must be a string")
    }

    if (!isConditionalType(type)) {
      throw new Error("ConditionField param 'type' must support conditions")
    }

    if (!display || typeof display !== 'string') {
      throw new Error("ConditionField param 'display' must be a string")
    }

    this.name = name
    this.type = type
    this.display = display
  }

  static from(obj: { name: string; type: ComponentType; display: string }) {
    return new ConditionField(obj.name, obj.type, obj.display)
  }
}
