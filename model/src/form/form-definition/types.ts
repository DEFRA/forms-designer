import { type ComponentDef } from '~/src/components/types.js'
import { type ConditionsModelData } from '~/src/conditions/types.js'
import { formDefinitionSchema } from '~/src/form/form-definition/index.js'
import { type ControllerPath, type ControllerType } from '~/src/pages/enums.js'

export interface Link {
  path: string
  condition?: string
  redirect?: string
}

export interface PageBase {
  title: string
  path: string
}

export interface PageStart extends PageBase {
  controller: ControllerType.Start | ControllerType.Home
  section?: string | undefined
  next: Link[]
  components: ComponentDef[]
}

export interface PageQuestion extends PageBase {
  controller?: ControllerType.Page | ControllerType.FileUpload
  section?: string | undefined
  next: Link[]
  components: ComponentDef[]
}

export interface PageSummary extends PageBase {
  path: ControllerPath.Summary
  controller: ControllerType.Summary
  section?: undefined
}

export interface PageStatus extends PageBase {
  path: ControllerPath.Status
  controller: ControllerType.Status
  section?: undefined
}

export type Page = PageStart | PageQuestion | PageSummary | PageStatus

export type RequiredField<
  Type extends Partial<object>,
  KeyType extends keyof Type
> = Omit<Type, KeyType> &
  Required<{
    [Key in KeyType]: Type[Key]
  }>

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
  pages: Page[]
  conditions: ConditionWrapper[]
  lists: List[]
  sections: Section[]
  startPage?: string
  name?: string
  feedback?: Feedback
  phaseBanner?: PhaseBanner
  skipSummary?: boolean
  declaration?: string
  metadata?: Record<string, unknown>
  outputEmail?: string
}
