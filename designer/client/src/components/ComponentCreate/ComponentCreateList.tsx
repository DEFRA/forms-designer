import {
  ComponentTypes,
  controllerNameFromPath,
  ControllerType,
  hasContent,
  hasSelectionFields,
  type ComponentDef,
  type ContentComponentsDef,
  type Page,
  type SelectionComponentsDef
} from '@defra/forms-model'
import React, { type MouseEvent, useCallback } from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'

const contentFields: ContentComponentsDef[] = []
const selectionFields: SelectionComponentsDef[] = []
const inputFields: ComponentDef[] = []

const ComponentTypesSorted = [...structuredClone(ComponentTypes)].sort(
  ({ type: typeA }, { type: typeB }) => typeA.localeCompare(typeB)
)

for (const component of ComponentTypesSorted) {
  if (hasContent(component)) {
    contentFields.push(component)
  } else if (hasSelectionFields(component)) {
    selectionFields.push(component)
  } else {
    inputFields.push(component)
  }
}

interface Props {
  page: Page
  onSelectComponent: (type: ComponentDef) => void
}

export const ComponentCreateList = (props: Readonly<Props>) => {
  const { page, onSelectComponent } = props
  const controller = controllerNameFromPath(page.controller)

  // Allow component pages to add input + selection fields
  const isComponentPage =
    controller === ControllerType.Page ||
    controller === ControllerType.FileUpload

  const selectComponent = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, component: ComponentDef) => {
      event.preventDefault()
      onSelectComponent(component)
    },
    [onSelectComponent]
  )

  return (
    <div className="govuk-form-group">
      <h1 className="govuk-hint">{i18n('component.create_info')}</h1>
      <ol className="govuk-list">
        <li>
          <h2 className="govuk-heading-s">{i18n('Content')}</h2>
          <div className="govuk-hint">
            {i18n('component.contentfields_info')}
          </div>
          <ol className="govuk-list">
            {contentFields.map((component) => (
              <li key={component.name}>
                <p className="govuk-body govuk-!-margin-bottom-2">
                  <a
                    className="govuk-link"
                    href="#0"
                    onClick={(e) => selectComponent(e, component)}
                  >
                    {i18n(`fieldTypeToName.${component.type}`)}
                  </a>
                </p>
                <div className="govuk-hint govuk-!-margin-top-2">
                  {i18n(`fieldTypeToName.${component.type}_info`)}
                </div>
              </li>
            ))}
          </ol>
          {isComponentPage && (
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
          )}
        </li>
        {isComponentPage && (
          <>
            <li>
              <h2 className="govuk-heading-s">{i18n('Input fields')}</h2>
              <div className="govuk-hint">
                {i18n('component.inputfields_info')}
              </div>
              <ol className="govuk-list">
                {inputFields.map((component) => (
                  <li key={component.type}>
                    <p className="govuk-body govuk-!-margin-bottom-2">
                      <a
                        href="#0"
                        className="govuk-link"
                        onClick={(e) => selectComponent(e, component)}
                      >
                        {i18n(`fieldTypeToName.${component.type}`)}
                      </a>
                    </p>
                    <div className="govuk-hint govuk-!-margin-top-2">
                      {i18n(`fieldTypeToName.${component.type}_info`)}
                    </div>
                  </li>
                ))}
              </ol>
              <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
            </li>
            <li>
              <h2 className="govuk-heading-s">{i18n('Selection fields')}</h2>
              <div className="govuk-hint">
                {i18n('component.selectfields_info')}
              </div>
              <ol className="govuk-list">
                {selectionFields.map((component) => (
                  <li key={component.type}>
                    <p className="govuk-body govuk-!-margin-bottom-2">
                      <a
                        href="#0"
                        className="govuk-link"
                        onClick={(e) => selectComponent(e, component)}
                      >
                        {i18n(`fieldTypeToName.${component.type}`)}
                      </a>
                    </p>
                    <div className="govuk-hint govuk-!-margin-top-2">
                      {i18n(`fieldTypeToName.${component.type}_info`)}
                    </div>
                  </li>
                ))}
              </ol>
            </li>
          </>
        )}
      </ol>
    </div>
  )
}
