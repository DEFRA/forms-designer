import { type FormDefinition } from '@defra/forms-model'
import { createContext } from 'react'

export interface DataContextType {
  data: FormDefinition
  save: (definition: FormDefinition) => Promise<FormDefinition>
}

export const DataContext = createContext<DataContextType>({
  data: {} as DataContextType['data'],
  save: () => Promise.resolve({} as DataContextType['data'])
})
