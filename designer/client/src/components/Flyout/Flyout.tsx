import FocusTrap from 'focus-trap-react'
import React, {
  type CSSProperties,
  type ReactChildren,
  useContext,
  useLayoutEffect,
  useState
} from 'react'

import { FlyoutContext } from '~/src/context/index.js'
import { i18n } from '~/src/i18n/index.js'

import './Flyout.scss'

interface Props {
  style: string
  width?: string
  onHide: () => void
  closeOnEnter: (e) => void
  show: boolean
  offset: number
  title?: string
  children?: ReactChildren
  NEVER_UNMOUNTS?: boolean
}

export function useFlyoutEffect(props: Props) {
  const flyoutContext = useContext(FlyoutContext)
  const [offset, setOffset] = useState(0)
  const [style, setStyle] = useState<CSSProperties>()
  const show = props.show ?? true

  /**
   * @code on component mount
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

  const onHide = (e) => {
    e?.preventDefault()

    if (props.onHide) {
      props.onHide()

      if (props.NEVER_UNMOUNTS) {
        flyoutContext.decrement()
      }
    }
  }

  const closeOnEnter = (e) => {
    if (e.key === 'Enter') {
      onHide(e)
    }
  }

  return { style, width: props?.width, closeOnEnter, onHide, offset, show }
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
          <a
            tabIndex={0}
            title="Close"
            className="flyout__button-close govuk-body govuk-!-font-size-16"
            onClick={onHide}
            onKeyPress={closeOnEnter}
          >
            {i18n('close')}
          </a>
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
