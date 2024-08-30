import {
  ComponentType,
  hasTitle,
  slugify,
  type ComponentDef,
  type FormDefinition,
  type Page
} from '@defra/forms-model'
import React, { useContext, useState, type FunctionComponent } from 'react'

import { ComponentEdit } from '~/src/ComponentEdit.jsx'
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { FileUploadIcon } from '~/src/components/Icons/FileUploadIcon.jsx'
import { SearchIcon } from '~/src/components/Icons/SearchIcon.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { hasComponents } from '~/src/data/definition/hasComponents.js'
import { findPage } from '~/src/data/page/findPage.js'
import { arrayMove } from '~/src/helpers.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContextProvider } from '~/src/reducers/component/componentReducer.jsx'

export const Base: FunctionComponent = (props) => {
  return <>{props.children}</>
}

export const ComponentField: FunctionComponent = (props) => {
  return <Base>{props.children}</Base>
}

export const TextField: FunctionComponent = () => {
  return (
    <ComponentField>
      <div className="box" />
    </ComponentField>
  )
}

export const TelephoneNumberField: FunctionComponent = () => {
  return (
    <ComponentField>
      <div className="box tel" />
    </ComponentField>
  )
}

export const EmailAddressField: FunctionComponent = () => {
  return (
    <ComponentField>
      <div className="box email" />
    </ComponentField>
  )
}

export const UkAddressField: FunctionComponent = () => {
  return (
    <ComponentField>
      <span className="box" />
      <span className="button search">
        <SearchIcon width={20} height={20} />
      </span>
    </ComponentField>
  )
}

export const MultilineTextField: FunctionComponent = () => {
  return (
    <ComponentField>
      <span className="box tall" />
    </ComponentField>
  )
}

export const NumberField: FunctionComponent = () => {
  return (
    <ComponentField>
      <div className="box number" />
    </ComponentField>
  )
}

export const MonthYearField: FunctionComponent = () => {
  return (
    <ComponentField>
      <span className="box small govuk-!-margin-left-1 govuk-!-margin-right-1" />
      <span className="box medium" />
    </ComponentField>
  )
}

export const DatePartsField: FunctionComponent = () => {
  return (
    <ComponentField>
      <span className="box small" />
      <span className="box small govuk-!-margin-left-1 govuk-!-margin-right-1" />
      <span className="box medium" />
    </ComponentField>
  )
}

export const RadiosField: FunctionComponent = () => {
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

export const CheckboxesField: FunctionComponent = () => {
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

export const SelectField: FunctionComponent = () => {
  return (
    <ComponentField>
      <div className="box dropdown" />
    </ComponentField>
  )
}

export const YesNoField: FunctionComponent = () => {
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

export const Details: FunctionComponent = () => {
  return (
    <Base>
      {'▶ '}
      <span className="line short" />
    </Base>
  )
}

export const InsetText: FunctionComponent = () => {
  return (
    <Base>
      <div className="inset govuk-!-padding-left-2">
        <div className="line" />
        <div className="line short govuk-!-margin-bottom-2 govuk-!-margin-top-2" />
        <div className="line" />
      </div>
    </Base>
  )
}

export const List: FunctionComponent = () => {
  return (
    <Base>
      <div className="line short govuk-!-margin-bottom-2 govuk-!-margin-top-2" />
      <div className="line short govuk-!-margin-bottom-2 govuk-!-margin-top-2" />
      <div className="line short govuk-!-margin-bottom-2 govuk-!-margin-top-2" />
    </Base>
  )
}

export const Html: FunctionComponent = () => {
  return (
    <Base>
      <div className="html">
        <span className="line xshort govuk-!-margin-bottom-1 govuk-!-margin-top-1" />
      </div>
    </Base>
  )
}

export const FileUploadField: FunctionComponent = () => {
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

export interface Props {
  data: FormDefinition
  page: Page
  selectedComponent: ComponentDef
  index: number
}

export const Component: FunctionComponent<Props> = (props) => {
  const { page, selectedComponent, index } = props

  const { data, save } = useContext(DataContext)
  const [showEditor, setShowEditor] = useState<boolean>(false)
  const toggleShowEditor = () => setShowEditor(!showEditor)

  const { title, type } = selectedComponent
  const ComponentIcon = componentTypes[type]

  const pageId = slugify(page.path)
  const headingId = `${pageId}-heading`
  const name = i18n(`fieldTypeToName.${type}`)
  const suffix = hasTitle(selectedComponent) ? `: ${title}` : undefined

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

  const showMoveActions = hasComponents(page) && !!page.components.length

  return (
    <>
      <button
        className="component govuk-link"
        onClick={toggleShowEditor}
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
          <Flyout title={componentFlyoutTitle} onHide={toggleShowEditor}>
            <ComponentContextProvider selectedComponent={selectedComponent}>
              <ComponentEdit page={page} toggleShowEditor={toggleShowEditor} />
            </ComponentContextProvider>
          </Flyout>
        </RenderInPortal>
      )}
    </>
  )
}
