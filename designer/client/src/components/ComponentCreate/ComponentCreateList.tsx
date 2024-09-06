import {
  ComponentTypes,
  controllerNameFromPath,
  ControllerType,
  hasComponents,
  hasContent,
  hasInputField,
  hasSelectionFields,
  type ComponentDef,
  type Page
} from '@defra/forms-model'
import React, { useMemo } from 'react'

import { i18n } from '~/src/i18n/i18n.jsx'

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

  const componentList = useMemo(() => {
    return [...structuredClone(ComponentTypes)].sort(
      ({ type: typeA }, { type: typeB }) => typeA.localeCompare(typeB)
    )
  }, [])

  const { contentFields, selectionFields, inputFields } = useMemo(() => {
    return {
      contentFields: componentList.filter(hasContent),
      selectionFields: componentList.filter(hasSelectionFields),
      inputFields: componentList.filter(hasInputField)
    }
  }, [componentList])

  if (!hasComponents(page)) {
    return null
  }

  return (
    <div className="govuk-form-group">
      <div className="govuk-hint">{i18n('component.create_info')}</div>
      <ol className="govuk-list">
        <li>
          <h3 className="govuk-heading-s">{i18n('Content')}</h3>
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
                    onClick={(e) => {
                      e.preventDefault()
                      onSelectComponent(component)
                    }}
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
              <h3 className="govuk-heading-s">{i18n('Input fields')}</h3>
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
                        onClick={(e) => {
                          e.preventDefault()
                          onSelectComponent(component)
                        }}
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
              <h3 className="govuk-heading-s">{i18n('Selection fields')}</h3>
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
                        onClick={(e) => {
                          e.preventDefault()
                          onSelectComponent(component)
                        }}
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
