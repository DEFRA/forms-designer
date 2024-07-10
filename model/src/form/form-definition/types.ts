import { type ComponentDef } from '~/src/components/types.js'
import { type Condition } from '~/src/conditions/condition.js'
import { formDefinitionSchema } from '~/src/form/form-definition/index.js'

export interface Link {
  path: string
  condition?: string
  redirect?: string
}

export interface Page {
  title: string
  path: string
  controller?: string
  components?: ComponentDef[]
  section?: string // the section ID
  next?: Link[]
  repeatField?: string
  backLinkFallback?: string
}

export interface RepeatingFieldPage extends Page {
  controller: 'RepeatingFieldPageController'
  options: {
    summaryDisplayMode?: {
      samePage?: boolean
      separatePage?: boolean
      hideRowTitles?: boolean
    }
    customText?: {
      separatePageTitle?: string
    }
  }
}

export interface Section {
  name: string
  title: string
  hideTitle?: boolean
}

export interface Item {
  text: string
  value: string | number | boolean
  description?: string
  conditional?: { components: ComponentDef[] } | null
  condition?: string | null
}

export interface List {
  name: string
  title: string
  type: 'string' | 'number' | 'boolean'
  items: Item[]
}

export interface Feedback {
  feedbackForm?: boolean
  url?: string
  emailAddress?: string
}

export interface PhaseBanner {
  phase?: 'alpha' | 'beta'
  feedbackUrl?: string
}

export type ConditionWrapperValue =
  | string
  | {
      name: string
      conditions: Condition[]
    }

export interface ConditionRawData {
  name: string
  displayName: string
  value: ConditionWrapperValue
}

/**
 * Interface for `formDefinitionSchema` Joi schema
 * @see {@link formDefinitionSchema}
 */
export interface FormDefinition {
  pages: (Page | RepeatingFieldPage)[]
  conditions: ConditionRawData[]
  lists: List[]
  sections: Section[]
  startPage?: Page['path']
  name?: string
  feedback?: Feedback
  phaseBanner?: PhaseBanner
  skipSummary?: boolean
  declaration?: string
  metadata?: Record<string, unknown>
  outputEmail?: string
}
