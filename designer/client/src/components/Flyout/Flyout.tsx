import FocusTrap from 'focus-trap-react'
import React, {
  useContext,
  useLayoutEffect,
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

export function useFlyoutEffect(props: Pick<Props, 'onHide'>) {
  const flyoutContext = useContext(FlyoutContext)
  const [offset, setOffset] = useState(0)
  const [style, setStyle] = useState<CSSProperties>()

  /**
   * Run on component mount
   */
  useLayoutEffect(() => {
    flyoutContext.increment()
    return function cleanup() {
      flyoutContext.decrement()
    }
  }, [])

  useLayoutEffect(() => {
    setOffset(flyoutContext.count)
  }, [])

  useLayoutEffect(() => {
    if (offset > 0) {
      setStyle({
        paddingLeft: `${offset * 50}px`,
        transform: `translateX(${offset * -50}px)`,
        position: 'relative'
      })
    }
  }, [offset])

  function onHide(
    e?: KeyboardEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>
  ) {
    e?.preventDefault()
    props?.onHide()
  }

  function closeOnEnter(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter') {
      onHide(e)
    }
  }

  return {
    style,
    offset,
    closeOnEnter,
    onHide
  }
}

export function Flyout(props: Props) {
  const { style, onHide, closeOnEnter, offset } = useFlyoutEffect(props)

  return (
    <div className="flyout show" data-testid={`flyout-${offset}`}>
      <FocusTrap
        focusTrapOptions={{
          preventScroll: true,
          tabbableOptions: { displayCheck: 'none' }
        }}
      >
        <div className={`flyout__container ${props.width}`} style={style}>
          <button
            className="flyout__button-close govuk-link"
            onClick={onHide}
            onKeyPress={closeOnEnter}
          >
            {i18n('close')}
          </button>
          <div className="panel panel--flyout">
            <div className="panel-header govuk-!-padding-top-4 govuk-!-padding-left-4">
              {props.title && (
                <h4 className="govuk-heading-m">{props.title}</h4>
              )}
            </div>
            <div className="panel-body">
              <div className="govuk-!-padding-left-4 govuk-!-padding-right-4 govuk-!-padding-bottom-4">
                {props.children}
              </div>
            </div>
          </div>
        </div>
      </FocusTrap>
    </div>
  )
}
