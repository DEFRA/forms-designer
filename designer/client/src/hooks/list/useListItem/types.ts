import { type Item, type FormDefinition } from '@defra/forms-model'
import { type ChangeEvent } from 'react'

import { type i18n } from '~/src/i18n/i18n.jsx'

export interface ListItemHook {
  handleTitleChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleConditionChange: (e: ChangeEvent<HTMLSelectElement>) => void
  handleValueChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleHintChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  prepareForDelete: (data: FormDefinition, index?: number) => FormDefinition
  prepareForSubmit: (data: FormDefinition) => FormDefinition
  validate: (i18nProp: typeof i18n) => boolean
  value: Item['value']
  condition: Item['condition']
  title: string
  hint?: string
}
