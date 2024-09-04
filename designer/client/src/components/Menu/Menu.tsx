import { hasComponents, hasListField } from '@defra/forms-model'
import { highlightAll } from 'prismjs'
import React, { useContext } from 'react'

import { DeclarationEdit } from '~/src/DeclarationEdit.jsx'
import { LinkEdit } from '~/src/LinkEdit.jsx'
import { PageCreate } from '~/src/PageCreate.jsx'
import { DataPrettyPrint } from '~/src/components/DataPrettyPrint/DataPrettyPrint.jsx'
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { SubMenu } from '~/src/components/Menu/SubMenu.jsx'
import { useMenuItem } from '~/src/components/Menu/useMenuItem.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { Tabs } from '~/src/components/Tabs/Tabs.jsx'
import { ConditionsEdit } from '~/src/conditions/ConditionsEdit.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ListsEdit } from '~/src/list/ListsEdit.jsx'
import { ListsEditorContextProvider } from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListContextProvider } from '~/src/reducers/listReducer.jsx'
import { SectionsEdit } from '~/src/section/SectionsEdit.jsx'

export function Menu() {
  const { data, meta } = useContext(DataContext)

  const page = useMenuItem()
  const link = useMenuItem()
  const sections = useMenuItem()
  const conditions = useMenuItem()
  const lists = useMenuItem()
  const summary = useMenuItem()
  const overview = useMenuItem()

  const overviewTabs = [
    {
      label: 'Definition',
      id: 'tab-definition',
      panel: {
        children: (
          <>
            <h4 className="govuk-heading-m govuk-!-margin-bottom-2">
              Definition
            </h4>
            <p className="govuk-body">Form definition JSON</p>

            <DataPrettyPrint className="language-json">{data}</DataPrettyPrint>
          </>
        )
      }
    },
    {
      label: 'Metadata',
      id: 'tab-metadata',
      panel: {
        children: (
          <>
            <h4 className="govuk-heading-m govuk-!-margin-bottom-2">
              Metadata
            </h4>
            <p className="govuk-body">Form metadata JSON</p>

            <DataPrettyPrint className="language-json">{meta}</DataPrettyPrint>
          </>
        )
      }
    },
    {
      label: 'Pages',
      id: 'tab-pages',
      panel: {
        children: (
          <>
            <h4 className="govuk-heading-m govuk-!-margin-bottom-2">Pages</h4>
            <p className="govuk-body">
              Form definition JSON <code>pages</code> showing paths and titles
            </p>

            <DataPrettyPrint className="language-json">
              {data.pages.map((page) => ({
                path: page.path,
                title: page.title
              }))}
            </DataPrettyPrint>
          </>
        )
      }
    },
    {
      label: 'Components',
      id: 'tab-components',
      panel: {
        children: (
          <>
            <h4 className="govuk-heading-m govuk-!-margin-bottom-2">
              Components
            </h4>
            <p className="govuk-body">
              Form definition JSON <code>components</code> showing name, type
              and (optional) list
            </p>

            <DataPrettyPrint className="language-json">
              {data.pages.filter(hasComponents).flatMap(({ components }) =>
                components.map((component) => ({
                  name: component.name,
                  type: component.type,
                  list: hasListField(component) ? component.list : undefined
                }))
              )}
            </DataPrettyPrint>
          </>
        )
      }
    }
  ]

  return (
    <>
      <nav className="menu">
        <div className="govuk-button-group govuk-!-margin-bottom-0">
          <button className="govuk-button" onClick={page.show}>
            {i18n('menu.addPage')}
          </button>
          <button className="govuk-button" onClick={link.show}>
            {i18n('menu.links')}
          </button>
          <button className="govuk-button" onClick={sections.show}>
            {i18n('menu.sections')}
          </button>
          <button className="govuk-button" onClick={conditions.show}>
            {i18n('menu.conditions')}
          </button>
          <button className="govuk-button" onClick={lists.show}>
            {i18n('menu.lists')}
          </button>
          <button className="govuk-button" onClick={summary.show}>
            {i18n('menu.summary')}
          </button>
        </div>
        <SubMenu overview={overview} />
      </nav>

      {page.isVisible && (
        <RenderInPortal>
          <Flyout title={i18n('page.add')} onHide={page.hide}>
            <PageCreate onSave={page.hide} />
          </Flyout>
        </RenderInPortal>
      )}

      {link.isVisible && (
        <RenderInPortal>
          <Flyout title={i18n('menu.links')} onHide={link.hide}>
            <LinkEdit onSave={link.hide} />
          </Flyout>
        </RenderInPortal>
      )}

      {sections.isVisible && (
        <RenderInPortal>
          <Flyout title={i18n('sections.edit')} onHide={sections.hide}>
            <SectionsEdit />
          </Flyout>
        </RenderInPortal>
      )}

      {conditions.isVisible && (
        <RenderInPortal>
          <Flyout
            title={i18n('conditions.addOrEdit')}
            onHide={conditions.hide}
            width="large"
          >
            <ConditionsEdit />
          </Flyout>
        </RenderInPortal>
      )}

      {lists.isVisible && (
        <RenderInPortal>
          <Flyout title={i18n('list.addOrEdit')} onHide={lists.hide}>
            <ListsEditorContextProvider>
              <ListContextProvider>
                <ListsEdit showEditLists={false} />
              </ListContextProvider>
            </ListsEditorContextProvider>
          </Flyout>
        </RenderInPortal>
      )}

      {summary.isVisible && (
        <RenderInPortal>
          <Flyout title={i18n('summary.edit')} onHide={summary.hide}>
            <DeclarationEdit onSave={summary.hide} />
          </Flyout>
        </RenderInPortal>
      )}

      {overview.isVisible && (
        <RenderInPortal>
          <Flyout width="xlarge" onHide={overview.hide}>
            <Tabs
              title="Form overview"
              items={overviewTabs}
              onInit={highlightAll}
              className="app-tabs--overview"
            ></Tabs>
          </Flyout>
        </RenderInPortal>
      )}
    </>
  )
}
