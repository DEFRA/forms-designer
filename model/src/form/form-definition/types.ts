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
  extensions?: Extension[]
}

/**
 * Optional behaviours that can be attached to a single list item.
 *
 * Extensions are additive - a definition written before they existed has no
 * `extensions` property and behaves exactly as before.
 */
export enum ExtensionType {
  Exclusive = 'exclusive',
  AdditionalQuestion = 'additional-question'
}

export interface ExtensionBase {
  type: ExtensionType
}

export type Extension = Exclusive | AdditionalQuestion

/**
 * Marks an item as the "none of the above" style option. Selecting it clears
 * every other option (with JavaScript) and, whether or not JavaScript ran,
 * selecting it alongside another option is a validation error.
 *
 * At most one item in a list may carry this extension, and it must be either
 * the first or the last item.
 */
export interface Exclusive extends ExtensionBase {
  type: ExtensionType.Exclusive
}

/**
 * A short answer question revealed when the item it is attached to is
 * selected. Only an item that also carries the {@link Exclusive} extension
 * may carry this one.
 *
 * The answer is held in form state under `<componentName>__<name>` and is
 * discarded whenever the exclusive option is not selected.
 */
export interface AdditionalQuestion extends ExtensionBase {
  type: ExtensionType.AdditionalQuestion
  id: string
  /**
   * Suffix for the state key, unique within the component. Must be a valid
   * identifier so it can be used as an HTML input name.
   */
  name: string
  title: string
  hint?: string
  options?: {
    /**
     * Whether an answer is required once the exclusive option is selected.
     * Defaults to true.
     */
    required?: boolean
  }
  schema: {
    max?: number
    min?: number
    length?: number
    regex?: string
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
  /**
   * Id of the condition determining whether submissions are sent to this
   * output. V2 only - rejected by the V1 schema.
   */
  condition?: string
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
