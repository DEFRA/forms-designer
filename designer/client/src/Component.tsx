import {
  ComponentType,
  type ComponentDef,
  type FormDefinition,
  type Page
} from '@defra/forms-model'
import React, { useState, type FunctionComponent } from 'react'

import { ComponentEdit } from '~/src/ComponentEdit.jsx'
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { SearchIcon } from '~/src/components/Icons/SearchIcon.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
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

export const TimeField: FunctionComponent = () => {
  return (
    <ComponentField>
      <div className="box">
        <span className="govuk-body govuk-!-font-size-14">hh:mm</span>
      </div>
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

export const componentTypes = {
  [ComponentType.TextField]: TextField,
  [ComponentType.TelephoneNumberField]: TelephoneNumberField,
  [ComponentType.NumberField]: NumberField,
  [ComponentType.EmailAddressField]: EmailAddressField,
  [ComponentType.TimeField]: TimeField,
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
  [ComponentType.List]: List
}

export interface Props {
  data: FormDefinition
  page: Page
  selectedComponent: ComponentDef
}

export const Component: FunctionComponent<Props> = (props) => {
  const { page, selectedComponent } = props

  const [showEditor, setShowEditor] = useState<boolean>(false)
  const toggleShowEditor = () => setShowEditor(!showEditor)

  const { title, type } = selectedComponent
  const ComponentIcon = componentTypes[type]

  const editFlyoutTitle = i18n('component.edit', {
    name: `$t(fieldTypeToName.${type})`
  })

  return (
    <>
      <button
        className="component govuk-link"
        onClick={toggleShowEditor}
        aria-label={`${editFlyoutTitle}: ${title}`}
      >
        <ComponentIcon />
      </button>
      {showEditor && (
        <RenderInPortal>
          <Flyout title={editFlyoutTitle} onHide={toggleShowEditor}>
            <ComponentContextProvider
              pagePath={page.path}
              selectedComponent={selectedComponent}
            >
              <ComponentEdit page={page} toggleShowEditor={toggleShowEditor} />
            </ComponentContextProvider>
          </Flyout>
        </RenderInPortal>
      )}
    </>
  )
}
