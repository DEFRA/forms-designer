import FocusTrap from 'focus-trap-react'
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode
} from 'react'

import { FlyoutContext } from '~/src/context/FlyoutContext.js'
import { i18n } from '~/src/i18n/i18n.jsx'

interface Props {
  title: string
  width?: string
  children?: ReactNode
  onHide: () => void
}

export function useFlyoutEffect(
  props: Readonly<Pick<Props, 'onHide' | 'title'>>
) {
  const { count, increment, decrement } = useContext(FlyoutContext)

  const [offset, setOffset] = useState(0)
  const [style, setStyle] = useState<CSSProperties>()

  const ref = useRef<HTMLDialogElement>(null)

  /**
   * Open dialog when styled
   */
  useEffect(() => {
    if (!style || !ref.current || ref.current.hasAttribute('open')) {
      return
    }

    ref.current.showModal()
  }, [style])

  /**
   * Count open flyouts
   */
  useEffect(() => {
    increment()
    return () => decrement()
  }, [increment, decrement])

  /**
   * Update offset for newly open flyouts
   */
  useEffect(() => {
    if (style) {
      return
    }

    setOffset(count)
  }, [style, count])

  /**
   * Update styling for offset flyouts
   */
  useEffect(() => {
    setStyle({
      paddingLeft: `${offset * 50}px`,
      transform: `translateX(${offset * -50}px)`
    })
  }, [offset])

  function closeOnClick(
    e?: KeyboardEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>
  ) {
    e?.preventDefault()

    ref.current?.close()
    props.onHide()
  }

  function closeOnEnter(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter') {
      closeOnClick(e)
    }
  }

  return {
    style,
    offset,
    ref,
    closeOnEnter,
    closeOnClick
  }
}

export function Flyout(props: Readonly<Props>) {
  const { title, width = '', children } = props
  const { style, offset, ref, closeOnClick, closeOnEnter } =
    useFlyoutEffect(props)

  const count = offset + 1
  const headingId = `flyout-${count}-heading`

  return (
    <FocusTrap
      focusTrapOptions={{
        preventScroll: true,
        tabbableOptions: { displayCheck: 'none' }
      }}
    >
      <dialog className="flyout" aria-labelledby={headingId} ref={ref}>
        <div className={`flyout__container ${width}`.trim()} style={style}>
          <button
            className="flyout__button-close govuk-link"
            onClick={closeOnClick}
            onKeyDown={closeOnEnter}
          >
            {i18n('close')}
          </button>
          <div className="panel">
            <div className="panel__header">
              <h2 id={headingId} className="govuk-heading-m">
                {title}
              </h2>
            </div>
            <div className="panel__body">{children}</div>
          </div>
        </div>
      </dialog>
    </FocusTrap>
  )
}
