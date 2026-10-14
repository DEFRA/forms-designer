/* eslint-disable react/jsx-no-target-blank */

import {
  ControllerType,
  Engine,
  hasComponents,
  slugify,
  type ComponentDef,
  type Page as PageType
} from '@defra/forms-model'
import classNames from 'classnames'
import { useContext, useState, type CSSProperties } from 'react'

import { Component } from '~/src/Component.jsx'
import { PageEdit } from '~/src/PageEdit.jsx'
import { ComponentCreate } from '~/src/components/ComponentCreate/ComponentCreate.jsx'
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { findSection } from '~/src/data/section/findSection.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContextProvider } from '~/src/reducers/component/componentReducer.jsx'

const ComponentItem = (
  props: Readonly<{
    index: number
    page: PageType
    selectedComponent: ComponentDef
  }>
) => {
  const { index, page, selectedComponent } = props

  return (
    <Component
      index={index}
      page={page}
      key={selectedComponent.name}
      selectedComponent={selectedComponent}
    />
  )
}

const ComponentList = (props: Readonly<{ page: PageType }>) => {
  const { page } = props

  if (!hasComponents(page) || !page.components.length) {
    return null
  }

  const { components } = page

  return (
    <ul className="app-results">
      {components.map((component, index) => (
        <ComponentItem
          index={index}
          page={page}
          key={component.name}
          selectedComponent={component}
        />
      ))}
    </ul>
  )
}

export const Page = (
  props: Readonly<{
    page: PageType
    layout?: CSSProperties
  }>
) => {
  const { page, layout } = props

  const { data, meta, previewUrl } = useContext(DataContext)
  const [isEditingPage, setIsEditingPage] = useState(false)
  const [isCreatingComponent, setIsCreatingComponent] = useState(false)

  const section =
    hasComponents(page) && page.section
      ? findSection(data, page.section)
      : undefined

  const pageId = slugify(page.path)
  const headingId = `${pageId}-heading`

  const href = new URL(
    `/form/preview/draft/${meta.slug}${page.path}?force`,
    previewUrl
  ).toString()

  const isV2 = data.engine === Engine.V2

  return (
    <div
      className={classNames({
        page: true,
        'page--repeat': page.controller === ControllerType.Repeat,
        'page--terminal': isV2 && page.controller === ControllerType.Terminal,
        'page--conditional':
          isV2 && page.controller !== ControllerType.Terminal && page.condition
      })}
      style={layout}
    >
      {isV2 && page.controller === ControllerType.Repeat && (
        <strong className="govuk-tag govuk-tag--grey">Add another</strong>
      )}
      {isV2 && page.controller === ControllerType.Terminal && (
        <strong className="govuk-tag govuk-tag--red">Exit</strong>
      )}
      {isV2 &&
        page.controller !== ControllerType.Terminal &&
        page.condition && (
          <strong className="govuk-tag govuk-tag--blue">Conditional</strong>
        )}
      <div className="page__heading">
        <h3 className="govuk-heading-m" id={headingId}>
          {section && <span className="govuk-caption-m">{section.title}</span>}
          {page.title}
        </h3>
      </div>

      <ComponentList page={page} />

      <div className="page__actions">
        <button
          className="govuk-button app-button--editor"
          type="button"
          aria-describedby={headingId}
          onClick={() => setIsEditingPage(true)}
        >
          {i18n('page.edit')}
        </button>
        <a
          href={href}
          className="govuk-button app-button--editor"
          target="_blank"
          rel="opener"
          aria-describedby={headingId}
        >
          {i18n('page.preview')}
        </a>
        {hasComponents(page) && (
          <button
            className="govuk-button app-button--editor"
            aria-describedby={headingId}
            onClick={() => setIsCreatingComponent(true)}
          >
            {i18n('component.create')}
          </button>
        )}
      </div>
      {isEditingPage && (
        <RenderInPortal>
          <Flyout
            id="page-edit"
            title={i18n('page.edit')}
            onHide={() => setIsEditingPage(false)}
          >
            <PageEdit page={page} onSave={() => setIsEditingPage(false)} />
          </Flyout>
        </RenderInPortal>
      )}

      {isCreatingComponent && (
        <RenderInPortal>
          <ComponentContextProvider>
            <ComponentCreate
              onSave={() => setIsCreatingComponent(false)}
              page={page}
            />
          </ComponentContextProvider>
        </RenderInPortal>
      )}
    </div>
  )
}
