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
  style?: string
  width?: string
  onHide?: () => void
  show?: boolean
  offset?: number
  title?: string
  children?: ReactNode
  NEVER_UNMOUNTS?: boolean
}

export function useFlyoutEffect(props: Props) {
  const flyoutContext = useContext(FlyoutContext)
  const [offset, setOffset] = useState(0)
  const [style, setStyle] = useState<CSSProperties>()
  const show = props.show ?? true

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

  const onHide = (
    e?: KeyboardEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e?.preventDefault()

    if (props.onHide) {
      props.onHide()

      if (props.NEVER_UNMOUNTS) {
        flyoutContext.decrement()
      }
    }
  }

  function closeOnEnter(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter') {
      onHide(e)
    }
  }

  return { style, width: props.width, closeOnEnter, onHide, offset, show }
}

export function Flyout(props: Props) {
  const {
    style,
    width = '',
    onHide,
    closeOnEnter,
    show,
    offset
  } = useFlyoutEffect(props)

  if (!show) {
    return null
  }

  return (
    <FocusTrap focusTrapOptions={{ preventScroll: true }}>
      <div className="flyout show" data-testid={`flyout-${offset}`}>
        <div className={`flyout__container ${width}`} style={style}>
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
      </div>
    </FocusTrap>
  )
}
