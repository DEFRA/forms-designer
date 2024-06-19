import React, { useContext } from 'react'

import { DeclarationEdit } from '~/src/DeclarationEdit.jsx'
import { LinkCreate } from '~/src/LinkCreate.jsx'
import { PageCreate } from '~/src/PageCreate.jsx'
import { DataPrettyPrint } from '~/src/components/DataPrettyPrint/DataPrettyPrint.jsx'
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { SubMenu } from '~/src/components/Menu/SubMenu.jsx'
import { useMenuItem } from '~/src/components/Menu/useMenuItem.jsx'
import { Tabs } from '~/src/components/Tabs/Tabs.jsx'
import { ConditionsEdit } from '~/src/conditions/ConditionsEdit.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ListsEdit } from '~/src/list/ListsEdit.jsx'
import { ListsEditorContextProvider } from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListContextProvider } from '~/src/reducers/listReducer.jsx'
import { SectionsEdit } from '~/src/section/SectionsEdit.jsx'

interface Props {
  slug: string
}

export function Menu({ slug }: Props) {
  const { data } = useContext(DataContext)

  const page = useMenuItem()
  const link = useMenuItem()
  const sections = useMenuItem()
  const conditions = useMenuItem()
  const lists = useMenuItem()
  const summaryBehaviour = useMenuItem()
  const summary = useMenuItem()
  const summaryTabs = [
    {
      label: 'Data model',
      id: 'tab-model',
      panel: {
        children: <DataPrettyPrint />,
        'data-testid': 'tab-model'
      }
    },
    {
      label: 'JSON',
      id: 'tab-json',
      panel: {
        children: <pre>{JSON.stringify(data, null, 2)}</pre>,
        'data-testid': 'tab-json'
      }
    },
    {
      label: 'Summary',
      id: 'tab-summary',
      panel: {
        children: (
          <pre>
            {JSON.stringify(
              'pages' in data ? data.pages.map((page) => page.path) : [],
              null,
              2
            )}
          </pre>
        ),
        'data-testid': 'tab-summary'
      }
    }
  ]

  return (
    <>
      <nav className="menu">
        <div className="menu__row">
          <button
            className="govuk-button"
            data-testid="menu-page"
            onClick={page.show}
          >
            {i18n('menu.addPage')}
          </button>
          <button
            className="govuk-button"
            data-testid="menu-links"
            onClick={link.show}
          >
            {i18n('menu.links')}
          </button>
          <button
            className="govuk-button"
            data-testid="menu-sections"
            onClick={sections.show}
          >
            {i18n('menu.sections')}
          </button>
          <button
            className="govuk-button"
            data-testid="menu-conditions"
            onClick={conditions.show}
          >
            {i18n('menu.conditions')}
          </button>
          <button
            className="govuk-button"
            data-testid="menu-lists"
            onClick={lists.show}
          >
            {i18n('menu.lists')}
          </button>
          <button
            className="govuk-button"
            data-testid="menu-summary-behaviour"
            onClick={summaryBehaviour.show}
          >
            {i18n('menu.summaryBehaviour')}
          </button>
          <button
            className="govuk-button"
            onClick={summary.show}
            data-testid="menu-summary"
          >
            {i18n('menu.summary')}
          </button>
        </div>
        <SubMenu slug={slug} />
      </nav>

      {page.isVisible && (
        <Flyout title="Add Page" onHide={page.hide}>
          <PageCreate onCreate={() => page.hide()} />
        </Flyout>
      )}

      {link.isVisible && (
        <Flyout title={i18n('menu.links')} onHide={link.hide}>
          <LinkCreate onCreate={() => link.hide()} />
        </Flyout>
      )}

      {sections.isVisible && (
        <Flyout title="Edit Sections" onHide={sections.hide}>
          <SectionsEdit />
        </Flyout>
      )}

      {conditions.isVisible && (
        <Flyout
          title={i18n('conditions.addOrEdit')}
          onHide={conditions.hide}
          width="large"
        >
          <ConditionsEdit />
        </Flyout>
      )}

      {lists.isVisible && (
        <Flyout title="Edit Lists" onHide={lists.hide}>
          <ListsEditorContextProvider>
            <ListContextProvider>
              <ListsEdit showEditLists={false} />
            </ListContextProvider>
          </ListsEditorContextProvider>
        </Flyout>
      )}

      {summaryBehaviour.isVisible && (
        <Flyout title="Edit Summary behaviour" onHide={summaryBehaviour.hide}>
          <DeclarationEdit onCreate={() => summaryBehaviour.hide()} />
        </Flyout>
      )}

      {summary.isVisible && (
        <Flyout title="Summary" width="large" onHide={summary.hide}>
          <Tabs title="Summary" items={summaryTabs}></Tabs>
        </Flyout>
      )}
    </>
  )
}
