import {
  type ComponentDef,
  type Page as PageType,
  type FormDefinition
} from '@defra/forms-model'
import React, { useContext, useState, type CSSProperties } from 'react'

import { Component } from '~/src/Component.jsx'
import { PageEdit } from '~/src/PageEdit.jsx'
import { ComponentCreate } from '~/src/components/ComponentCreate/ComponentCreate.jsx'
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContextProvider } from '~/src/reducers/component/componentReducer.jsx'

const ComponentItem = (props: {
  index: number
  page: PageType
  selectedComponent: ComponentDef
  data: FormDefinition
}) => {
  const { index, page, selectedComponent, data } = props

  return (
    <div className="component-item">
      <Component
        key={index}
        index={index}
        page={page}
        data={data}
        selectedComponent={selectedComponent}
      />
    </div>
  )
}

const ComponentList = (props: { page: PageType; data: FormDefinition }) => {
  const { page, data } = props
  const { components = [] } = page

  return (
    <div className="component-list">
      {components.map((component, index) => (
        <ComponentItem
          key={index}
          index={index}
          page={page}
          data={data}
          selectedComponent={component}
        />
      ))}
    </div>
  )
}

export const Page = (props: {
  page: PageType
  previewUrl: string
  slug: string
  layout?: CSSProperties
}) => {
  const { page, previewUrl, slug, layout } = props

  const { data } = useContext(DataContext)
  const [isEditingPage, setIsEditingPage] = useState(false)
  const [isCreatingComponent, setIsCreatingComponent] = useState(false)

  const section = data.sections.find(({ name }) => name === page.section)

  // Remove slashes from IDs
  const pageId = page.path.replace(/\//g, '')
  const headingId = `${pageId}-heading`

  return (
    <div id={pageId} title={page.path} className={'page'} style={layout}>
      <div className="page__heading">
        <h3 className="govuk-heading-m" id={headingId}>
          {section && <span className="govuk-caption-m">{section.title}</span>}
          {page.title}
        </h3>
      </div>

      <ComponentList page={page} data={data} />

      <div className="page__actions">
        <button
          onClick={() => setIsEditingPage(true)}
          className="govuk-link"
          aria-describedby={headingId}
        >
          {i18n('Edit page')}
        </button>
        <a
          href={new URL(`/preview/draft/${slug}${page.path}`, previewUrl).href}
          className="govuk-link"
          target="_blank"
          rel="noreferrer"
          aria-describedby={headingId}
        >
          {i18n('Preview page')}
        </a>
        <button
          onClick={() => setIsCreatingComponent(true)}
          className="govuk-link"
          aria-describedby={headingId}
        >
          {i18n('component.create')}
        </button>
      </div>
      {isEditingPage && (
        <RenderInPortal>
          <Flyout title="Edit Page" onHide={() => setIsEditingPage(false)}>
            <PageEdit page={page} onSave={() => setIsEditingPage(false)} />
          </Flyout>
        </RenderInPortal>
      )}

      {isCreatingComponent && (
        <RenderInPortal>
          <Flyout onHide={() => setIsCreatingComponent(false)}>
            <ComponentContextProvider>
              <ComponentCreate
                toggleAddComponent={() => setIsCreatingComponent(false)}
                page={page}
              />
            </ComponentContextProvider>
          </Flyout>
        </RenderInPortal>
      )}
    </div>
  )
}
