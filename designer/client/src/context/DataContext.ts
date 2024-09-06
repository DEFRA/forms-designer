import { type FormDefinition, type FormMetadata } from '@defra/forms-model'
import { createContext } from 'react'

export interface DataContextType {
  data: FormDefinition
  meta: FormMetadata
  previewUrl: string
  save: (definition: FormDefinition) => Promise<FormDefinition>
}

export const DataContext = createContext<DataContextType>({
  data: {} as DataContextType['data'],
  meta: {} as DataContextType['meta'],
  previewUrl: '',
  save: () => Promise.resolve({} as DataContextType['data'])
})
