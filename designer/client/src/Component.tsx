import {
  ComponentType,
  hasComponents,
  hasTitle,
  slugify,
  type ComponentDef,
  type Page
} from '@defra/forms-model'
import React, { useContext, useState, type ReactNode } from 'react'

import { ComponentEdit } from '~/src/ComponentEdit.jsx'
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { FileUploadIcon } from '~/src/components/Icons/FileUploadIcon.jsx'
import { SearchIcon } from '~/src/components/Icons/SearchIcon.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { findPage } from '~/src/data/page/findPage.js'
import { arrayMove } from '~/src/helpers.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContextProvider } from '~/src/reducers/component/componentReducer.jsx'

interface ComponentFieldProps {
  children?: ReactNode
}

export function ComponentField(props: Readonly<ComponentFieldProps>) {
  return <>{props.children}</>
}

export function TextField() {
  return (
    <ComponentField>
      <div className="box" />
    </ComponentField>
  )
}

export function TelephoneNumberField() {
  return (
    <ComponentField>
      <div className="box tel" />
    </ComponentField>
  )
}

export function EmailAddressField() {
  return (
    <ComponentField>
      <div className="box email" />
    </ComponentField>
  )
}

export function UkAddressField() {
  return (
    <ComponentField>
      <span className="box" />
      <span className="button search">
        <SearchIcon width={20} height={20} />
      </span>
    </ComponentField>
  )
}

export function MultilineTextField() {
  return (
    <ComponentField>
      <span className="box tall" />
    </ComponentField>
  )
}

export function NumberField() {
  return (
    <ComponentField>
      <div className="box number" />
    </ComponentField>
  )
}

export function MonthYearField() {
  return (
    <ComponentField>
      <span className="box small govuk-!-margin-left-1 govuk-!-margin-right-1" />
      <span className="box medium" />
    </ComponentField>
  )
}

export function DatePartsField() {
  return (
    <ComponentField>
      <span className="box small" />
      <span className="box small govuk-!-margin-left-1 govuk-!-margin-right-1" />
      <span className="box medium" />
    </ComponentField>
  )
}

export function RadiosField() {
  return (
    <ComponentField>
      <div className="govuk-!-margin-bottom-1">
        <span className="circle" />
        <span className="line short" />
      </div>
      <div className="govuk-!-margin-bottom-1">
        <span className="circle" />
        <span className="line short" />
      </div>
      <span className="circle" />
      <span className="line short" />
    </ComponentField>
  )
}

export function CheckboxesField() {
  return (
    <ComponentField>
      <div className="govuk-!-margin-bottom-1">
        <span className="check" />
        <span className="line short" />
      </div>
      <div className="govuk-!-margin-bottom-1">
        <span className="check" />
        <span className="line short" />
      </div>
      <span className="check" />
      <span className="line short" />
    </ComponentField>
  )
}

export function SelectField() {
  return (
    <ComponentField>
      <div className="box dropdown" />
    </ComponentField>
  )
}

export function YesNoField() {
  return (
    <ComponentField>
      <div className="govuk-!-margin-bottom-1">
        <span className="circle" />
        <span className="line short" />
      </div>
      <span className="circle" />
      <span className="line short" />
    </ComponentField>
  )
}

export function Details() {
  return (
    <ComponentField>
      {'▶ '}
      <span className="line short" />
    </ComponentField>
  )
}

export function InsetText() {
  return (
    <ComponentField>
      <div className="inset govuk-!-padding-left-2">
        <div className="line" />
        <div className="line short govuk-!-margin-bottom-2 govuk-!-margin-top-2" />
        <div className="line" />
      </div>
    </ComponentField>
  )
}

export function List() {
  return (
    <ComponentField>
      <div className="line short govuk-!-margin-bottom-2 govuk-!-margin-top-2" />
      <div className="line short govuk-!-margin-bottom-2 govuk-!-margin-top-2" />
      <div className="line short govuk-!-margin-bottom-2 govuk-!-margin-top-2" />
    </ComponentField>
  )
}

export function Html() {
  return (
    <ComponentField>
      <div className="html">
        <span className="line xshort govuk-!-margin-bottom-1 govuk-!-margin-top-1" />
      </div>
    </ComponentField>
  )
}

export function FileUploadField() {
  return (
    <ComponentField>
      <div className="box">
        <div className="file-upload">
          <FileUploadIcon
            className="file-upload__icon"
            width={15}
            height={15}
          />
        </div>
      </div>
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
  [ComponentType.AutocompleteField]: SelectField,
  [ComponentType.SelectField]: SelectField,
  [ComponentType.YesNoField]: YesNoField,
  [ComponentType.UkAddressField]: UkAddressField,
  [ComponentType.Details]: Details,
  [ComponentType.Html]: Html,
  [ComponentType.InsetText]: InsetText,
  [ComponentType.List]: List,
  [ComponentType.FileUploadField]: FileUploadField
}

interface ComponentProps {
  page: Page
  selectedComponent: ComponentDef
  index: number
}

export function Component(props: Readonly<ComponentProps>) {
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
    <>
      <button
        className="component govuk-link"
        onClick={onSave}
        aria-label={componentButtonLabel}
        aria-describedby={headingId}
      >
        <ComponentIcon />
      </button>
      {showMoveActions && (
        <div className="govuk-button-group">
          <button
            className="component-move govuk-button govuk-button--secondary govuk-!-margin-right-0"
            onClick={() => move(index, index - 1)}
            title={componentMoveUpTitle}
            aria-label={componentMoveUpLabel}
            aria-describedby={headingId}
          >
            ▲
          </button>
          <button
            className="component-move govuk-button govuk-button--secondary"
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
    </>
  )
}
