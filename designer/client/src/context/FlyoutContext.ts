import { createContext } from 'react'

export interface FlyoutContextType {
  count: number
  increment: () => void
  decrement: () => void
}

export const FlyoutContext = createContext<FlyoutContextType>({
  count: 1,
  increment: () => undefined,
  decrement: () => undefined
})
