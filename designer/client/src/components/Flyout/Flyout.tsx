import FocusTrap from 'focus-trap-react'
import React, {
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode
} from 'react'

import { FlyoutContext } from '~/src/context/FlyoutContext.js'
import { i18n } from '~/src/i18n/i18n.jsx'

interface Props {
  title?: string
  width?: string
  children?: ReactNode
  onHide: () => void
}

export function useFlyoutEffect(props?: Readonly<Pick<Props, 'onHide'>>) {
  const { count, increment, decrement } = useContext(FlyoutContext)

  const [offset, setOffset] = useState(0)
  const [style, setStyle] = useState<CSSProperties>()

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
    if (offset > 0) {
      setStyle({
        paddingLeft: `${offset * 50}px`,
        transform: `translateX(${offset * -50}px)`,
        position: 'relative'
      })
    }
  }, [offset])

  function closeOnClick(
    e?: KeyboardEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>
  ) {
    e?.preventDefault()
    props?.onHide()
  }

  function closeOnEnter(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter') {
      closeOnClick(e)
    }
  }

  return {
    style,
    offset,
    closeOnEnter,
    closeOnClick
  }
}

export function Flyout(props: Readonly<Props>) {
  const { title, width = '', children, onHide } = props
  const { style, closeOnClick, closeOnEnter, offset } = useFlyoutEffect({
    onHide
  })

  return (
    <div className="flyout show" data-testid={`flyout-${offset}`}>
      <FocusTrap
        focusTrapOptions={{
          preventScroll: true,
          tabbableOptions: { displayCheck: 'none' }
        }}
      >
        <div className={`flyout__container ${width}`} style={style}>
          <button
            className="flyout__button-close govuk-link"
            onClick={closeOnClick}
            onKeyDown={closeOnEnter}
          >
            {i18n('close')}
          </button>
          <div className="panel panel--flyout">
            <div className="panel-header govuk-!-padding-top-4 govuk-!-padding-left-4">
              {title && <h4 className="govuk-heading-m">{title}</h4>}
            </div>
            <div className="panel-body">
              <div className="govuk-!-padding-left-4 govuk-!-padding-right-4 govuk-!-padding-bottom-4">
                {children}
              </div>
            </div>
          </div>
        </div>
      </FocusTrap>
    </div>
  )
}
