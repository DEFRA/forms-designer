import { type FormDefinition } from '@defra/forms-model'

export interface ListItemHook {
  handleTitleChange: (e) => void
  handleConditionChange: (e) => void
  handleValueChange: (e) => void
  handleHintChange: (e) => void
  prepareForDelete: <T>(data: T, index?: number) => T
  prepareForSubmit: (data: FormDefinition) => FormDefinition
  validate: (i18n: any) => boolean
  value: any
  condition: any
  title: string
  hint: string
}
