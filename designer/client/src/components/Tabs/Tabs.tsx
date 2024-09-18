import classNames from 'classnames'
import { Tabs as TabsJS } from 'govuk-frontend'
import { useEffect, useRef, type ComponentProps } from 'react'

interface Props extends ComponentProps<'div'> {
  idPrefix?: string
  items: ({
    label: string
    panel: ComponentProps<'div'>
  } & ComponentProps<'a'>)[]
  onInit?: () => void
}

export function Tabs(props: Readonly<Props>) {
  let { className, id, idPrefix, items, title, onInit, ...attributes } = props

  idPrefix ??= ''
  title ??= 'Contents'

  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (tabsRef.current) {
      // eslint-disable-next-line no-new
      new TabsJS(tabsRef.current)
      onInit?.()
    }
  }, [tabsRef, onInit])

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
