import {
  ComponentTypes,
  type ComponentDef,
  type Page as PageType,
  type RepeatingFieldPage,
  type FormDefinition
} from '@defra/forms-model'
import React, { useContext, useState, type CSSProperties } from 'react'
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from 'react-sortable-hoc'

import { Component } from '~/src/component.js'
import { ComponentCreate } from '~/src/components/ComponentCreate/index.js'
import { Flyout } from '~/src/components/Flyout/index.js'
import { PageLinkage } from '~/src/components/PageLinkage/index.js'
import { DataContext } from '~/src/context/index.js'
import { findPage } from '~/src/data/index.js'
import { i18n } from '~/src/i18n/index.js'
import PageEdit from '~/src/page-edit.js'
import { ComponentContextProvider } from '~/src/reducers/component/index.js'

const SortableItem = SortableElement(
  (props: {
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
)

const SortableList = SortableContainer(
  (props: { page: PageType | RepeatingFieldPage; data: FormDefinition }) => {
    const { page, data } = props
    const { components = [] } = page

    return (
      <div className="component-list">
        {components.map((component, index) => (
          <SortableItem
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
)

export const Page = (props: {
  page: PageType | RepeatingFieldPage
  previewUrl: string
  id: string
  layout?: CSSProperties
}) => {
  const { page, previewUrl, id, layout } = props

  const { data, save } = useContext(DataContext)
  const [isEditingPage, setIsEditingPage] = useState(false)
  const [isCreatingComponent, setIsCreatingComponent] = useState(false)

  const onSortEnd = ({
    oldIndex,
    newIndex
  }: {
    oldIndex: number
    newIndex: number
  }) => {
    const copy = { ...data }
    const [copyPage, index] = findPage(data, page.path)
      copyPage.components = arrayMove(copyPage.components, oldIndex, newIndex)
    copy.pages[index] = copyPage
    save(copy)
  }

  const onEditEnd = () => {
    setIsEditingPage(false)
  }

  const section = data.sections.find((section) => section.name === page.section)

  const formComponents =
    page?.components?.filter(
      (comp) =>
        ComponentTypes.find((type) => type.name === comp.type)?.subType ===
        'field'
    ) ?? []

  const pageTitle =
    page.title ||
    (formComponents.length === 1 && page.components[0] === formComponents[0]
      ? formComponents[0].title
      : page.title)

  return (
    <div id={page.path} title={page.path} className={'page'} style={layout}>
      <div className="page__heading">
        <h3>
          {section && <span>{section.title}</span>}
          {page.title}
        </h3>
        <PageLinkage page={page} layout={layout} />
      </div>

      <SortableList
        page={page}
        data={data}
        pressDelay={90}
        onSortEnd={onSortEnd}
        lockAxis="y"
        helperClass="dragging"
        lockToContainerEdges
      />

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
          href={new URL(`/${id}${page.path}`, previewUrl).toString()}
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
