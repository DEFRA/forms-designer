import { type ComponentDef } from '~/src/components/types.js'
import { type Coordinator } from '~/src/conditions/enums.js'
import {
  type ConditionGroupDataV2,
  type ConditionsModelData
} from '~/src/conditions/types.js'
import { type ControllerPath, type ControllerType } from '~/src/pages/enums.js'

export enum Engine {
  V1 = 'V1',
  V2 = 'V2'
}

export enum SchemaVersion {
  V1 = 1,
  V2 = 2
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
  onLoad?: Event
  onSave?: Event
}

export interface AuthConfig {
  mode?: 'required' | 'try' | 'none'
  strategy?: string
  access?: {
    scope?: string[]
  }
}

export interface PageBase {
  id?: string
  title: string
  path: string
  condition?: string
  events?: Events
  view?: string
  auth?: AuthConfig
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
  components?: ComponentDef[]
}

export interface PageSummaryWithConfirmationEmail extends PageBase {
  path: ControllerPath.Summary | string
  controller: ControllerType.SummaryWithConfirmationEmail
  section?: undefined
  components?: ComponentDef[]
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
  | PageSummaryWithConfirmationEmail
  | PageStatus

export interface Section {
  id?: string
  name: string
  title: string
  hideTitle?: boolean
}

export interface Item {
  id?: string
  text: string
  value: string | number | boolean
  description?: string
  conditional?: { components: ComponentDef[] }
  condition?: string
  hint?: {
    id?: string
    text: string
  }
}

export interface List {
  id?: string
  name: string
  title: string
  type: ListTypeContent
  items: Item[]
}

export type ListTypeOption = 'bulleted' | 'numbered'
export type ListTypeContent = 'string' | 'number' | 'boolean'

export interface Feedback {
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

export interface ConditionWrapperV2 {
  id: string
  displayName: string
  coordinator?: Coordinator
  items: ConditionGroupDataV2
}

export type OutputAudience = 'human' | 'machine'

export interface Output {
  audience: OutputAudience
  version: string
  emailAddress: string
}

export interface FormOptions {
  showReferenceNumber?: boolean
  disableUserFeedback?: boolean
}

/**
 * Interface for `formDefinitionSchema` Joi schema
 */
export interface FormDefinition {
  engine?: Engine
  schema?: SchemaVersion
  pages: Page[]
  conditions: (ConditionWrapper | ConditionWrapperV2)[]
  lists: List[]
  sections: Section[]
  startPage?: string
  name?: string
  feedback?: Feedback
  phaseBanner?: PhaseBanner
  declaration?: string // Deprecated in v2
  skipSummary?: never
  metadata?: Record<string, unknown>
  options?: FormOptions
  outputEmail?: string // Deprecated
  output?: {
    audience: OutputAudience
    version: string
  }
  outputs?: Output[]
}
