import { type ComponentDef } from '~/src/components/types.js'
import { type ConditionsModelData } from '~/src/conditions/types.js'
import { formDefinitionSchema } from '~/src/form/form-definition/index.js'
import { type ControllerPath, type ControllerType } from '~/src/pages/enums.js'

export interface Link {
  path: string
  condition?: string
  redirect?: string
}

export interface PageCondition {
  pageId: string
  componentId: string
  operator: string
  valueId: string
}

export interface PageBase {
  id: string
  path: string
  title: string
  condition?: PageCondition[][]
}

export interface RepeatOptions {
  name: string
  title: string
}

export interface RepeatSchema {
  min: number
  max: number
}

export interface Repeat {
  options: RepeatOptions
  schema: RepeatSchema
}

export interface PageStart extends PageBase {
  path: ControllerPath.Start | string
  controller: ControllerType.Start
  section?: string | undefined
  group?: string | undefined
  components: ComponentDef[]
}

export interface PageQuestion extends PageBase {
  controller?: ControllerType.Page
  section?: string | undefined
  group?: string | undefined
  components: ComponentDef[]
}

export interface PageRepeat extends PageBase {
  controller: ControllerType.Repeat
  repeat: Repeat
  section?: string | undefined
  group?: string | undefined
  components: ComponentDef[]
}

export interface PageFileUpload extends PageBase {
  controller: ControllerType.FileUpload
  section?: string | undefined
  group?: string | undefined
  components: ComponentDef[]
}

export interface PageTerminal extends PageBase {
  controller?: ControllerType.Terminal
  section?: string | undefined
  group?: string | undefined
  components: ComponentDef[]
}

export interface PageSummary extends PageBase {
  path: ControllerPath.Summary | string
  controller: ControllerType.Summary
  section?: undefined
  group?: undefined
}

export interface PageStatus extends PageBase {
  path: ControllerPath.Status | string
  controller: ControllerType.Status
  section?: undefined
  group?: undefined
}

export type Page =
  | PageStart
  | PageQuestion
  | PageFileUpload
  | PageRepeat
  | PageTerminal
  | PageSummary
  | PageStatus

export interface Section {
  id: string
  title: string
}

export interface PageGroup {
  id: string
  title: string
  condition?: string
}

export interface Item {
  id: string
  text: string
  value: string | number | boolean
}

export interface List {
  id: string
  title: string
  type: ListTypeContent
  items: Item[]
}

export type ListTypeOption = 'bulleted' | 'numbered'
export type ListTypeContent = 'string' | 'number' | 'boolean'

export interface ConditionWrapper {
  id: string
  name: string
  displayName: string
  value: ConditionsModelData
}

/**
 * Interface for `formDefinitionSchema` Joi schema
 * @see {@link formDefinitionSchema}
 */
export interface FormDefinition {
  id: string
  name: string
  pages: Page[]
  pageGroups: PageGroup[]
  conditions: ConditionWrapper[]
  lists: List[]
  sections: Section[]
}
