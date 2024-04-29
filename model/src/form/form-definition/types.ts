import { type ComponentDef } from '~/src/components/types.js'
import { type Condition } from '~/src/conditions/condition.js'
import { type OutputType } from '~/src/data-model/enums.js'
import { formDefinitionSchema } from '~/src/form/form-definition/index.js'

type Toggleable<T> = boolean | T

export interface Next {
  path: string
  condition?: string
  redirect?: string
}

export type Link = Next

export interface Page {
  title: string
  path: string
  controller?: string
  components?: ComponentDef[]
  section: string // the section ID
  next?: Next[]
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

export interface MultipleApiKeys {
  test?: string
  production?: string
}

export interface EmailOutputConfiguration {
  emailAddress: string
}

export interface NotifyOutputConfiguration {
  apiKey: string
  templateId: string
  emailField: string
  personalisation: string[]
  personalisationFieldCustomisation?: Record<string, string[]>
  addReferencesToPersonalisation?: boolean
  emailReplyToIdConfiguration?: {
    emailReplyToId: string
    condition?: string
  }[]
}

export interface WebhookOutputConfiguration {
  url: string
  allowRetry?: boolean
}

export type OutputConfiguration =
  | EmailOutputConfiguration
  | NotifyOutputConfiguration
  | WebhookOutputConfiguration

export interface Output {
  name: string
  title: string
  type: OutputType
  outputConfiguration: OutputConfiguration
}

export interface ConfirmationPage {
  customText: {
    title: string
    paymentSkipped: Toggleable<string>
    nextSteps: Toggleable<string>
  }
  components: ComponentDef[]
}

export interface PaymentSkippedWarningPage {
  customText: {
    title: string
    caption: string
    body: string
  }
}

export interface SpecialPages {
  confirmationPage?: ConfirmationPage
  paymentSkippedWarningPage?: PaymentSkippedWarningPage
}

export interface Fee {
  description: string
  amount: number
  multiplier?: string
  condition?: string
  prefix?: string
}

export interface FeeOptions {
  payApiKey?: string | MultipleApiKeys
  paymentReferenceFormat?: string
  payReturnUrl?: string
  allowSubmissionWithoutPayment: boolean
  maxAttempts: number
  customPayErrorMessage?: string
  showPaymentSkippedWarningPage: boolean
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
  fees: Fee[]
  skipSummary?: boolean
  outputs: Output[]
  declaration?: string
  metadata?: Record<string, unknown>
  payApiKey?: string | MultipleApiKeys
  specialPages?: SpecialPages
  paymentReferenceFormat?: string
  feeOptions?: FeeOptions
  version?: number
}
