import {
  ComponentTypes,
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
import { PageLinkage } from '~/src/components/PageLinkage/PageLinkage.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContextProvider } from '~/src/reducers/component/componentReducer.jsx'

const ComponentItem = (props: {
  index: number
  page: PageType | RepeatingFieldPage
  component: ComponentDef
  data: FormDefinition
}) => {
  const { index, page, component, data } = props

  return (
    <div className="component-item">
      <Component key={index} page={page} component={component} data={data} />
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
          component={component}
          data={data}
        />
      ))}
    </div>
  )
}

export const Page = (props: {
  page: PageType | RepeatingFieldPage
  previewUrl: string
  id: string
  slug: string
  layout?: CSSProperties
}) => {
  const { page, previewUrl, slug, layout } = props

  const { data, save } = useContext(DataContext)
  const [isEditingPage, setIsEditingPage] = useState(false)
  const [isCreatingComponent, setIsCreatingComponent] = useState(false)

  const onEditEnd = () => {
    setIsEditingPage(false)
  }

  const section = data.sections.find((section) => section.name === page.section)

  const formComponents =
    page.components?.filter(
      (comp) =>
        ComponentTypes.find((type) => type.name === comp.type)?.subType ===
        'field'
    ) ?? []

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
        <PageLinkage page={page} layout={layout} />
      </div>

      <ComponentList page={page} data={data} />

      <div className="page__actions">
        <button
          title={i18n('Edit page')}
          onClick={() => setIsEditingPage(true)}
          className="govuk-link"
        >
          {i18n('Edit page')}
        </button>
        <button
          title={i18n('Create component')}
          onClick={() => setIsCreatingComponent(true)}
          className="govuk-link"
        >
          {i18n('Create component')}
        </button>
        <a
          title={i18n('Preview page')}
          href={new URL(`/preview/draft/${slug}${page.path}`, previewUrl).href}
          className="govuk-link"
          target="_blank"
          rel="noreferrer"
        >
          {i18n('Preview')}{' '}
          <span className="govuk-visually-hidden">{pageTitle}</span>
        </a>
      </div>
      {isEditingPage && (
        <Flyout title="Edit Page" onHide={setIsEditingPage}>
          <PageEdit page={page} onEdit={onEditEnd} />
        </Flyout>
      )}

      {isCreatingComponent && (
        <Flyout show={true} onHide={setIsCreatingComponent}>
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
      )}
    </div>
  )
}
