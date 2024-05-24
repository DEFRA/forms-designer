import FocusTrap from 'focus-trap-react'
import React, {
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactChildren,
  useContext,
  useLayoutEffect,
  useState
} from 'react'

import { FlyoutContext } from '~/src/context/index.js'
import { i18n } from '~/src/i18n/index.js'

interface Props {
  style?: string
  width?: string
  onHide?: (
    e?: KeyboardEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>
  ) => void
  closeOnEnter?: (e: KeyboardEvent<HTMLButtonElement>) => void
  show?: boolean
  offset?: number
  title?: string
  children?: ReactChildren | React.JSX.Element
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

  const onHide: Props['onHide'] = (e) => {
    e?.preventDefault()

    if (props.onHide) {
      props.onHide()

      if (props.NEVER_UNMOUNTS) {
        flyoutContext.decrement()
      }
    }
  }

  const closeOnEnter: Props['closeOnEnter'] = (e) => {
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
    <FocusTrap>
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
                <h4 className="govuk-heading-m" data-testid="flyout-heading">
                  {props.title}
                </h4>
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
