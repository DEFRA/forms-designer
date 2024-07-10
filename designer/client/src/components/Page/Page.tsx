import {
  ComponentSubType,
  getComponentDefaults,
  type ComponentDef,
  type Page as PageType,
  type RepeatingFieldPage,
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
  page: PageType | RepeatingFieldPage
  selectedComponent: ComponentDef
  data: FormDefinition
}) => {
  const { index, page, selectedComponent, data } = props

  return (
    <div className="component-item">
      <Component
        key={index}
        page={page}
        data={data}
        selectedComponent={selectedComponent}
      />
    </div>
  )
}

const ComponentList = (props: {
  page: PageType | RepeatingFieldPage
  data: FormDefinition
}) => {
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
  page: PageType | RepeatingFieldPage
  previewUrl: string
  slug: string
  layout?: CSSProperties
}) => {
  const { page, previewUrl, slug, layout } = props

  const { data } = useContext(DataContext)
  const [isEditingPage, setIsEditingPage] = useState(false)
  const [isCreatingComponent, setIsCreatingComponent] = useState(false)

  const onEditEnd = () => {
    setIsEditingPage(false)
  }

  const section = data.sections.find((section) => section.name === page.section)

  const formComponents =
    page.components?.filter((component) => {
      const { subType } = getComponentDefaults(component) ?? {}
      return subType === ComponentSubType.Field
    }) ?? []

  const pageTitle =
    page.title ||
    (formComponents.length === 1 && page.components?.[0] === formComponents[0]
      ? formComponents[0].title
      : page.title)

  return (
    <div id={page.path} title={page.path} className={'page'} style={layout}>
      <div className="page__heading">
        <h3 className="govuk-heading-m">
          {section && <span className="govuk-caption-m">{section.title}</span>}
          {page.title}
        </h3>
      </div>

      <ComponentList page={page} data={data} />

      <div className="page__actions">
        <button onClick={() => setIsEditingPage(true)} className="govuk-link">
          {i18n('Edit page')}
        </button>
        <a
          href={new URL(`/preview/draft/${slug}${page.path}`, previewUrl).href}
          className="govuk-link"
          target="_blank"
          rel="noreferrer"
          aria-label={`${i18n('Preview')} ${pageTitle}`}
        >
          {i18n('Preview page')}
        </a>
        <button
          onClick={() => setIsCreatingComponent(true)}
          className="govuk-link"
        >
          {i18n('component.create')}
        </button>
      </div>
      {isEditingPage && (
        <RenderInPortal>
          <Flyout title="Edit Page" onHide={setIsEditingPage}>
            <PageEdit page={page} onEdit={onEditEnd} />
          </Flyout>
        </RenderInPortal>
      )}

      {isCreatingComponent && (
        <RenderInPortal>
          <Flyout onHide={setIsCreatingComponent}>
            <ComponentContextProvider>
              <ComponentCreate
                renderInForm={true}
                toggleAddComponent={() => {
                  setIsCreatingComponent(false)
                }}
                page={page}
              />
            </ComponentContextProvider>
          </Flyout>
        </RenderInPortal>
      )}
    </div>
  )
}
