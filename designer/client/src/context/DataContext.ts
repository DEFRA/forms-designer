import { type FormDefinition } from '@defra/forms-model'
import { createContext } from 'react'

export const DataContext = createContext<{
  data: FormDefinition
  save: (toUpdate: FormDefinition) => Promise<false>
}>({
  data: {} as FormDefinition,
  save: async (_data: FormDefinition) => false
})
