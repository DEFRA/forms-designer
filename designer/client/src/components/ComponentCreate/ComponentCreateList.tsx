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

import { isComponentAllowed } from '~/src/helpers.js'
import { i18n } from '~/src/i18n/i18n.jsx'

interface Props {
  page: Page
  onSelectComponent: (type: ComponentDef) => void
}

export const ComponentCreateList = (props: Readonly<Props>) => {
  const { page, onSelectComponent } = props

  const controller = controllerNameFromPath(
    page.controller ?? ControllerType.Page
  )

  // Allow component pages to add input + selection fields
  const isComponentPage =
    controller === ControllerType.Page ||
    controller === ControllerType.FileUpload

  const componentList = useMemo(() => {
    return [...structuredClone(ComponentTypes)]
      .filter(isComponentAllowed(page))
      .sort(({ type: typeA }, { type: typeB }) => typeA.localeCompare(typeB))
  }, [page])

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
      <div className="govuk-hint">{i18n('componentCreate.hint')}</div>
      <ol className="govuk-list">
        <li>
          <h3 className="govuk-heading-s govuk-!-margin-bottom-1">
            {i18n('componentCreate.contentFields.title')}
          </h3>
          <p className="govuk-body">
            {i18n('componentCreate.contentFields.info')}
          </p>
          {!contentFields.length && (
            <p className="govuk-hint">
              {i18n('componentCreate.contentFields.unavailable')}
            </p>
          )}
          {!!contentFields.length && (
            <ol className="govuk-list">
              {contentFields.map((component) => (
                <li key={component.name}>
                  <p className="govuk-body govuk-!-margin-bottom-2">
                    <button
                      className="govuk-link"
                      type="button"
                      role="link"
                      onClick={(e) => {
                        e.preventDefault()
                        onSelectComponent(component)
                      }}
                    >
                      {i18n(`fieldTypeToName.${component.type}`)}
                    </button>
                  </p>
                  <div className="govuk-hint govuk-!-margin-top-2">
                    {i18n(`fieldTypeToName.${component.type}_info`)}
                  </div>
                </li>
              ))}
            </ol>
          )}
          {isComponentPage && (
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
          )}
        </li>
        {isComponentPage && (
          <>
            <li>
              <h3 className="govuk-heading-s govuk-!-margin-bottom-1">
                {i18n('componentCreate.inputFields.title')}
              </h3>
              <p className="govuk-body">
                {i18n('componentCreate.inputFields.info')}
              </p>
              {!inputFields.length && (
                <p className="govuk-hint">
                  {i18n('componentCreate.inputFields.unavailable')}
                </p>
              )}
              {!!inputFields.length && (
                <ol className="govuk-list">
                  {inputFields.map((component) => (
                    <li key={component.type}>
                      <p className="govuk-body govuk-!-margin-bottom-2">
                        <button
                          className="govuk-link"
                          type="button"
                          role="link"
                          onClick={(e) => {
                            e.preventDefault()
                            onSelectComponent(component)
                          }}
                        >
                          {i18n(`fieldTypeToName.${component.type}`)}
                        </button>
                      </p>
                      <div className="govuk-hint govuk-!-margin-top-2">
                        {i18n(`fieldTypeToName.${component.type}_info`)}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
              <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
            </li>
            <li>
              <h3 className="govuk-heading-s govuk-!-margin-bottom-1">
                {i18n('componentCreate.selectionFields.title')}
              </h3>
              <p className="govuk-body">
                {i18n('componentCreate.selectionFields.info')}
              </p>
              {!selectionFields.length && (
                <p className="govuk-hint">
                  {i18n('componentCreate.selectionFields.unavailable')}
                </p>
              )}
              {!!selectionFields.length && (
                <ol className="govuk-list">
                  {selectionFields.map((component) => (
                    <li key={component.type}>
                      <p className="govuk-body govuk-!-margin-bottom-2">
                        <button
                          className="govuk-link"
                          type="button"
                          role="link"
                          onClick={(e) => {
                            e.preventDefault()
                            onSelectComponent(component)
                          }}
                        >
                          {i18n(`fieldTypeToName.${component.type}`)}
                        </button>
                      </p>
                      <div className="govuk-hint govuk-!-margin-top-2">
                        {i18n(`fieldTypeToName.${component.type}_info`)}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          </>
        )}
      </ol>
    </div>
  )
}
