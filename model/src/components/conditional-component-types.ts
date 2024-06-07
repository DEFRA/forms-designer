import { ComponentSubType } from '~/src/components/enums.js'
import { type ConditionalComponent } from '~/src/components/types.js'

export const ConditionalComponentTypes = [
  {
    name: 'TextField',
    title: 'Text field',
    subType: ComponentSubType.Field
  },
  {
    name: 'NumberField',
    title: 'Number field',
    subType: ComponentSubType.Field
  }
] satisfies ConditionalComponent[]
