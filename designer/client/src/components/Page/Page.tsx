import {
  hasComponents,
  hasSection,
  slugify,
  type ComponentDef,
  type Page as PageType
} from '@defra/forms-model'
import React, { useContext, useState, type CSSProperties } from 'react'

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
    <div className="component-item">
      <Component
        key={index}
        index={index}
        page={page}
        selectedComponent={selectedComponent}
      />
    </div>
  )
}

const ComponentList = (props: Readonly<{ page: PageType }>) => {
  const { page } = props

  if (!hasComponents(page) || !page.components.length) {
    return null
  }

  const { components = [] } = page

  return (
    <div className="component-list">
      {components.map((component, index) => (
        <ComponentItem
          key={index}
          index={index}
          page={page}
          selectedComponent={component}
        />
      ))}
    </div>
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

  const section = hasSection(page) ? findSection(data, page.section) : undefined

  const pageId = slugify(page.path)
  const headingId = `${pageId}-heading`

  const href = new URL(
    `/preview/draft/${meta.slug}${page.path}`,
    previewUrl
  ).toString()

  return (
    <div className="page" style={layout}>
      <div className="page__heading">
        <h3 className="govuk-heading-m" id={headingId}>
          {section && <span className="govuk-caption-m">{section.title}</span>}
          {page.title}
        </h3>
      </div>

      <ComponentList page={page} />

      <div className="page__actions">
        <button
          onClick={() => setIsEditingPage(true)}
          className="govuk-link"
          aria-describedby={headingId}
        >
          {i18n('page.edit')}
        </button>
        <a
          href={href}
          className="govuk-link"
          target="_blank"
          rel="noreferrer"
          aria-describedby={headingId}
        >
          {i18n('page.preview')}
        </a>
        {hasComponents(page) && (
          <button
            onClick={() => setIsCreatingComponent(true)}
            className="govuk-link"
            aria-describedby={headingId}
          >
            {i18n('component.create')}
          </button>
        )}
      </div>
      {isEditingPage && (
        <RenderInPortal>
          <Flyout
            title={i18n('page.edit')}
            onHide={() => setIsEditingPage(false)}
          >
            <PageEdit page={page} onSave={() => setIsEditingPage(false)} />
          </Flyout>
        </RenderInPortal>
      )}

      {isCreatingComponent && (
        <RenderInPortal>
          <Flyout onHide={() => setIsCreatingComponent(false)}>
            <ComponentContextProvider>
              <ComponentCreate
                onSave={() => setIsCreatingComponent(false)}
                page={page}
              />
            </ComponentContextProvider>
          </Flyout>
        </RenderInPortal>
      )}
    </div>
  )
}
