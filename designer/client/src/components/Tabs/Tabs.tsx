import classNames from 'classnames'
import { Tabs as TabsJS } from 'govuk-frontend'
import React, {
  useEffect,
  useRef,
  type FunctionComponent,
  type HTMLAttributes,
  type ReactNode
} from 'react'

interface Props extends HTMLAttributes<HTMLParagraphElement> {
  className?: string
  id?: string
  idPrefix?: string
  items: ({
    id?: string
    label: string
    panel: {
      children: ReactNode
    } & HTMLAttributes<HTMLDivElement>
  } & HTMLAttributes<HTMLAnchorElement>)[]
  title?: string
  onInit?: () => void
}

export const Tabs: FunctionComponent<Props> = (props) => {
  let { className, id, idPrefix, items, title, onInit, ...attributes } = props

  idPrefix ??= ''
  title ??= 'Contents'

  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (tabsRef.current) {
      new TabsJS(tabsRef.current)
      onInit?.()
    }
  }, [tabsRef])

  const tabContent = items.map((item, index) => {
    const { id, label, panel, ...linkAttributes } = item
    const tabPanelId = id ?? `${idPrefix}-${index + 1}`

    return (
      <li
        key={tabPanelId}
        className={classNames(
          'govuk-tabs__list-item',
          index === 0 ? 'govuk-tabs__list-item--selected' : undefined
        )}
      >
        <a
          className="govuk-tabs__tab"
          href={`#${tabPanelId}`}
          {...linkAttributes}
        >
          {label}
        </a>
      </li>
    )
  })

  const tabs = <ul className="govuk-tabs__list">{tabContent}</ul>

  const panels = items.map((item, index) => {
    const { id, panel } = item
    const tabPanelId = id ?? `${idPrefix}-${index + 1}`

    return (
      <div
        key={tabPanelId}
        id={tabPanelId}
        className={classNames(
          'govuk-tabs__panel',
          index > 0 ? 'govuk-tabs__panel--hidden' : undefined
        )}
        {...panel}
      />
    )
  })

  return (
    <div
      id={id}
      className={classNames('govuk-tabs', className)}
      {...attributes}
      data-module="govuk-tabs"
      ref={tabsRef}
    >
      <h2 className="govuk-tabs__title">{title}</h2>
      {tabs}
      {panels}
    </div>
  )
}
