import { type ComponentDef } from '~/src/components/types.js'
import { type ConditionsModelData } from '~/src/conditions/types.js'
import { formDefinitionSchema } from '~/src/form/form-definition/index.js'
import { type ControllerPath, type ControllerType } from '~/src/pages/enums.js'

export enum Engine {
  V1 = 'V1',
  V2 = 'V2'
}

export interface Link {
  path: string
  condition?: string
  redirect?: string
}

export interface EventOptions {
  method: string
  url: string
}

export interface Event {
  type: string
  options: EventOptions
}

export interface Events {
  onLoad: Event
  onSave: Event
}

export interface PageBase {
  id?: string
  title: string
  path: string
  condition?: string
  events?: Events
  view?: string
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
  next: Link[]
  components: ComponentDef[]
}

export interface PageQuestion extends PageBase {
  controller?: ControllerType.Page
  section?: string | undefined
  next: Link[]
  components: ComponentDef[]
}

export interface PageTerminal extends PageBase {
  controller?: ControllerType.Terminal
  section?: string | undefined
  next: Link[]
  components: ComponentDef[]
}

export interface PageRepeat extends PageBase {
  controller: ControllerType.Repeat
  repeat: Repeat
  section?: string | undefined
  next: Link[]
  components: ComponentDef[]
}

export interface PageFileUpload extends PageBase {
  controller: ControllerType.FileUpload
  section?: string | undefined
  next: Link[]
  components: ComponentDef[]
}

export interface PageSummary extends PageBase {
  path: ControllerPath.Summary | string
  controller: ControllerType.Summary
  section?: undefined
}

export interface PageStatus extends PageBase {
  path: ControllerPath.Status | string
  controller: ControllerType.Status
  section?: undefined
}

export type Page =
  | PageStart
  | PageQuestion
  | PageTerminal
  | PageFileUpload
  | PageRepeat
  | PageSummary
  | PageStatus

export interface Section {
  name: string
  title: string
  hideTitle?: boolean
}

export interface Item {
  text: string
  value: string | number | boolean
  description?: string
  conditional?: { components: ComponentDef[] }
  condition?: string
}

export interface List {
  name: string
  title: string
  type: ListTypeContent
  items: Item[]
}

export type ListTypeOption = 'bulleted' | 'numbered'
export type ListTypeContent = 'string' | 'number' | 'boolean'

export interface Feedback {
  feedbackForm?: boolean
  url?: string
  emailAddress?: string
}

export interface PhaseBanner {
  phase?: 'alpha' | 'beta'
  feedbackUrl?: string
}

export interface ConditionWrapper {
  name: string
  displayName: string
  value: ConditionsModelData
}

/**
 * Interface for `formDefinitionSchema` Joi schema
 * @see {@link formDefinitionSchema}
 */
export interface FormDefinition {
  engine?: Engine
  pages: Page[]
  conditions: ConditionWrapper[]
  lists: List[]
  sections: Section[]
  startPage?: string
  name?: string
  feedback?: Feedback
  phaseBanner?: PhaseBanner
  declaration?: string
  skipSummary?: never
  metadata?: Record<string, unknown>
  outputEmail?: string
  output?: {
    audience: 'human' | 'machine'
    version: string
  }
}
