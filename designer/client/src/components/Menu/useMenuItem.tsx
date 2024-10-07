import { type KeyboardEvent, type MouseEvent } from 'react'
import { useState } from 'react'

export interface MenuItemHook {
  isVisible: boolean
  show: (
    e?: KeyboardEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>
  ) => void
  hide: (
    e?: KeyboardEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>
  ) => void
}

export function useMenuItem(): MenuItemHook {
  const [isVisible, setIsVisible] = useState(false)

  const show: MenuItemHook['show'] = (e) => {
    e?.preventDefault()
    setIsVisible(true)
  }

  const hide: MenuItemHook['hide'] = (e) => {
    e?.preventDefault()
    setIsVisible(false)
  }

  return {
    isVisible,
    show,
    hide
  }
}
