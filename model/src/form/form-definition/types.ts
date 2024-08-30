import { type ComponentDef } from '~/src/components/types.js'
import { type ConditionsModelData } from '~/src/conditions/types.js'
import { formDefinitionSchema } from '~/src/form/form-definition/index.js'
import { type ControllerType } from '~/src/pages/enums.js'

export interface Link {
  path: string
  condition?: string
  redirect?: string
}

export interface PageBase {
  title: string
  path: string
  controller?: ControllerType
  components?: ComponentDef[]
  section?: string
  next?: Link[]
}

export interface PageWithNext extends PageBase {
  controller?:
    | ControllerType.Start
    | ControllerType.Home
    | ControllerType.Page
    | ControllerType.FileUpload
  next: Link[]
}

export interface PageWithComponents extends PageBase {
  controller?: ControllerType.Page | ControllerType.FileUpload
  components: ComponentDef[]
}

export type Page = PageWithComponents | PageWithNext | PageBase

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
