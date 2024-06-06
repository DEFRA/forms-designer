import { type MouseEvent, type KeyboardEvent } from 'react'
import { useState } from 'react'

interface MenuItemHook {
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
