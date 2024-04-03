export enum OutputType {
  Email = 'email',
  Notify = 'notify',
  Webhook = 'webhook'
}

export interface EmailOutputConfiguration {
  emailAddress: string
}

export interface NotifyOutputConfiguration {
  apiKey: string
  templateId: string
  emailField: string
  personalisation: string[]
  addReferencesToPersonalisation?: boolean
}

export interface WebhookOutputConfiguration {
  url: string
  allowRetry: boolean
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

export interface ValidationError {
  href?: string
  children: string
}

export interface ValidationErrors {
  title?: ValidationError
  name?: ValidationError
  email?: ValidationError
  templateId?: ValidationError
  apiKey?: ValidationError
  url?: ValidationError
}
