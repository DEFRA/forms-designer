import {
  ComponentType,
  hasComponents,
  hasTitle,
  slugify,
  type ComponentDef,
  type Page
} from '@defra/forms-model'
import React, { useContext, useState, type ComponentProps } from 'react'

import { ComponentEdit } from '~/src/ComponentEdit.jsx'
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { findPage } from '~/src/data/page/findPage.js'
import { arrayMove } from '~/src/helpers.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContextProvider } from '~/src/reducers/component/componentReducer.jsx'

export function ComponentField(props: Readonly<ComponentProps<'span'>>) {
  const { children, ...attributes } = props

  return (
    <span {...attributes} aria-hidden="true">
      {children}
    </span>
  )
}

export function TextField() {
  return <ComponentField className="app-field-input" />
}

export function TelephoneNumberField() {
  return <ComponentField className="app-field-input app-icon app-icon--phone" />
}

export function EmailAddressField() {
  return <ComponentField className="app-field-input app-icon app-icon--email" />
}

export function UkAddressField() {
  return (
    <ComponentField className="app-field-address">
      <span className="app-field-input" />
      <span className="app-field-input" />
      <span className="app-field-input-m" />
      <span className="app-field-input-s" />
    </ComponentField>
  )
}

export function MultilineTextField() {
  return (
    <ComponentField className="app-field-textarea app-icon app-icon--textarea" />
  )
}

export function NumberField() {
  return (
    <ComponentField className="app-field-input app-icon app-icon--number" />
  )
}

export function MonthYearField() {
  return (
    <ComponentField className="app-group">
      <span className="app-field-input-xs" />
      <span className="app-field-input-s" />
    </ComponentField>
  )
}

export function DatePartsField() {
  return (
    <ComponentField className="app-group">
      <span className="app-field-input-xs" />
      <span className="app-field-input-xs" />
      <span className="app-field-input-s" />
    </ComponentField>
  )
}

export function RadiosField() {
  return (
    <ComponentField>
      <span className="app-group">
        <span className="app-field-radio app-field-radio--checked" />
        <span className="app-field-line-s" />
      </span>
      <span className="app-group">
        <span className="app-field-radio" />
        <span className="app-field-line-s" />
      </span>
      <span className="app-group">
        <span className="app-field-radio" />
        <span className="app-field-line-s" />
      </span>
    </ComponentField>
  )
}

export function CheckboxesField() {
  return (
    <ComponentField>
      <span className="app-group">
        <span className="app-field-checkbox app-field-checkbox--checked" />
        <span className="app-field-line-s" />
      </span>
      <span className="app-group">
        <span className="app-field-checkbox" />
        <span className="app-field-line-s" />
      </span>
      <span className="app-group">
        <span className="app-field-checkbox" />
        <span className="app-field-line-s" />
      </span>
    </ComponentField>
  )
}

export function SelectField() {
  return (
    <ComponentField className="app-field-input app-icon app-icon--dropdown" />
  )
}

export function AutocompleteField() {
  return (
    <ComponentField className="app-field-input app-icon app-icon--autocomplete" />
  )
}

export function YesNoField() {
  return (
    <ComponentField className="app-group">
      <span className="app-field-radio app-field-radio--checked" />
      <span className="app-field-line-xs govuk-!-margin-right-1" />
      <span className="app-field-radio" />
      <span className="app-field-line-xs govuk-!-margin-right-1" />
    </ComponentField>
  )
}

export function Details() {
  return (
    <ComponentField className="app-content app-field-details app-icon app-icon--details">
      <span className="app-field-line-m" />
    </ComponentField>
  )
}

export function InsetText() {
  return (
    <ComponentField className="app-content app-field-inset">
      <span className="app-field-line-m" />
      <span className="app-field-line-m" />
    </ComponentField>
  )
}

export function List() {
  return (
    <ComponentField className="app-content">
      <span className="app-field-heading" />
      <span className="app-icon app-icon--bullet">
        <span className="app-field-line-m" />
      </span>
      <span className="app-icon app-icon--bullet">
        <span className="app-field-line-m" />
      </span>
      <span className="app-icon app-icon--bullet">
        <span className="app-field-line-m" />
      </span>
    </ComponentField>
  )
}

export function Html() {
  return (
    <ComponentField className="app-content">
      <span className="app-field-heading govuk-!-margin-bottom-1"></span>
      <span className="app-field-line" />
      <span className="app-field-line" />
      <span className="app-field-line" />
    </ComponentField>
  )
}

export function FileUploadField() {
  return (
    <ComponentField className="app-field-input">
      <span className="app-field-prefix app-field-prefix--file-upload" />
    </ComponentField>
  )
}

export const componentTypes = {
  [ComponentType.TextField]: TextField,
  [ComponentType.TelephoneNumberField]: TelephoneNumberField,
  [ComponentType.NumberField]: NumberField,
  [ComponentType.EmailAddressField]: EmailAddressField,
  [ComponentType.DatePartsField]: DatePartsField,
  [ComponentType.MonthYearField]: MonthYearField,
  [ComponentType.MultilineTextField]: MultilineTextField,
  [ComponentType.RadiosField]: RadiosField,
  [ComponentType.CheckboxesField]: CheckboxesField,
  [ComponentType.AutocompleteField]: AutocompleteField,
  [ComponentType.SelectField]: SelectField,
  [ComponentType.YesNoField]: YesNoField,
  [ComponentType.UkAddressField]: UkAddressField,
  [ComponentType.Details]: Details,
  [ComponentType.Html]: Html,
  [ComponentType.InsetText]: InsetText,
  [ComponentType.List]: List,
  [ComponentType.FileUploadField]: FileUploadField
}

interface Props {
  page: Page
  selectedComponent: ComponentDef
  index: number
}

export function Component(props: Readonly<Props>) {
  const { page, selectedComponent, index } = props

  const { data, save } = useContext(DataContext)
  const [showEditor, setShowEditor] = useState<boolean>(false)
  const onSave = () => setShowEditor(!showEditor)

  const { title, type } = selectedComponent

  // Check if component type is supported
  if (!(type in componentTypes)) {
    return null
  }

  const ComponentIcon = componentTypes[type]

  const pageId = slugify(page.path)
  const headingId = `${pageId}-heading`
  const name = i18n(`fieldTypeToName.${type}`)
  const suffix = hasTitle(selectedComponent) ? `: ${title}` : ''

  // '[Action] XXX component'
  const componentFlyoutTitle = i18n('component.edit', { name })
  const componentMoveUpTitle = i18n('component.moveUp')
  const componentMoveDownTitle = i18n('component.moveDown')

  // '[Action] XXX component: Title here'
  const componentMoveUpLabel = `${i18n('component.moveUp_label', { name })}${suffix}`
  const componentMoveDownLabel = `${i18n('component.moveDown_label', { name })}${suffix}`
  const componentButtonLabel = `${componentFlyoutTitle}${suffix}`

  const move = async (oldIndex: number, newIndex: number) => {
    const definition = structuredClone(data)
    const pageEdit = findPage(definition, page.path)

    if (!hasComponents(pageEdit)) {
      return false
    }

    const length = pageEdit.components.length

    if (newIndex === -1) {
      newIndex = length - 1
    } else if (newIndex === length) {
      newIndex = 0
    }

    pageEdit.components = arrayMove(pageEdit.components, oldIndex, newIndex)

    await save(definition)
  }

  const showMoveActions = hasComponents(page) && page.components.length > 1

  return (
    <div className="app-component">
      <button
        className="app-component__button govuk-button govuk-button--component"
        onClick={onSave}
        aria-describedby={headingId}
      >
        <span className="govuk-visually-hidden">{componentButtonLabel}</span>
        <ComponentIcon />
      </button>
      {showMoveActions && (
        <div className="app-component__actions">
          <button
            className="app-component__action govuk-button govuk-button--secondary"
            onClick={() => move(index, index - 1)}
            title={componentMoveUpTitle}
            aria-label={componentMoveUpLabel}
            aria-describedby={headingId}
          >
            ▲
          </button>
          <button
            className="app-component__action govuk-button govuk-button--secondary"
            onClick={() => move(index, index + 1)}
            title={componentMoveDownTitle}
            aria-label={componentMoveDownLabel}
            aria-describedby={headingId}
          >
            ▼
          </button>
        </div>
      )}
      {showEditor && (
        <RenderInPortal>
          <Flyout
            id="component-edit"
            title={componentFlyoutTitle}
            onHide={onSave}
          >
            <ComponentContextProvider selectedComponent={selectedComponent}>
              <ComponentEdit page={page} onSave={onSave} />
            </ComponentContextProvider>
          </Flyout>
        </RenderInPortal>
      )}
    </div>
  )
}
