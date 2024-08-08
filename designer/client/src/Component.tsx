import {
  ComponentType,
  type ComponentDef,
  type FormDefinition,
  type Page
} from '@defra/forms-model'
import React, { useContext, useState, type FunctionComponent } from 'react'

import { ComponentEdit } from '~/src/ComponentEdit.jsx'
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { SearchIcon } from '~/src/components/Icons/SearchIcon.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { DataContext } from '~/src/context/DataContext.js'
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
        <div className="fileUploadIconContainer" aria-hidden="true">
          <svg
            width="15"
            height="15"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fileUploadIcon"
          >
            <path
              d="M10 14.8636C9.64583 14.8636 9.34917 14.7403 9.11 14.4937C8.87 14.248 8.75 13.9433 8.75 13.5795V4.39807L6.40625 6.80578C6.15625 7.0626 5.86458 7.19101 5.53125 7.19101C5.19792 7.19101 4.89583 7.0519 4.625 6.77368C4.375 6.51685 4.25542 6.21166 4.26625 5.85811C4.27625 5.5054 4.39583 5.21134 4.625 4.97592L9.125 0.35313C9.25 0.224719 9.38542 0.133547 9.53125 0.0796145C9.67708 0.026538 9.83333 0 10 0C10.1667 0 10.3229 0.026538 10.4688 0.0796145C10.6146 0.133547 10.75 0.224719 10.875 0.35313L15.375 4.97592C15.625 5.23274 15.7446 5.53751 15.7337 5.89021C15.7237 6.24377 15.6042 6.53826 15.375 6.77368C15.125 7.0305 14.8283 7.16404 14.485 7.17432C14.1408 7.18545 13.8438 7.0626 13.5938 6.80578L11.25 4.39807V13.5795C11.25 13.9433 11.1304 14.248 10.8913 14.4937C10.6513 14.7403 10.3542 14.8636 10 14.8636ZM2.5 20C1.8125 20 1.22417 19.7487 0.735 19.2462C0.245 18.7429 0 18.138 0 17.4318V14.8636C0 14.4997 0.119584 14.1945 0.35875 13.948C0.59875 13.7023 0.895833 13.5795 1.25 13.5795C1.60417 13.5795 1.90125 13.7023 2.14125 13.948C2.38042 14.1945 2.5 14.4997 2.5 14.8636V17.4318H17.5V14.8636C17.5 14.4997 17.62 14.1945 17.86 13.948C18.0992 13.7023 18.3958 13.5795 18.75 13.5795C19.1042 13.5795 19.4008 13.7023 19.64 13.948C19.88 14.1945 20 14.4997 20 14.8636V17.4318C20 18.138 19.7554 18.7429 19.2663 19.2462C18.7763 19.7487 18.1875 20 17.5 20H2.5Z"
              fill="black"
            ></path>
          </svg>
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

  const editFlyoutTitle = i18n('component.edit', {
    name: `$t(fieldTypeToName.${type})`
  })

  const move = async (oldIndex: number, newIndex: number) => {
    const copy = { ...data }
    const [copyPage, index] = findPage(data, page.path)

    if (!copyPage.components?.length) {
      return false
    }

    const length = copyPage.components.length

    if (newIndex === -1) {
      newIndex = length - 1
    } else if (newIndex === length) {
      newIndex = 0
    }

    copyPage.components = arrayMove(copyPage.components, oldIndex, newIndex)

    copy.pages[index] = copyPage

    await save(copy)
  }

  const showMoveActions =
    Array.isArray(page.components) && page.components.length > 1

  return (
    <>
      <button
        className="component govuk-link"
        onClick={toggleShowEditor}
        aria-label={`${editFlyoutTitle}: ${title}`}
      >
        <ComponentIcon />
      </button>
      {showMoveActions && (
        <div className="govuk-button-group">
          <button
            className="component-move govuk-button govuk-button--secondary govuk-!-margin-right-0"
            onClick={() => move(index, index - 1)}
            title={i18n('component.move_up')}
            aria-label={i18n('component.move_up')}
          >
            ▲
          </button>
          <button
            className="component-move govuk-button govuk-button--secondary"
            onClick={() => move(index, index + 1)}
            title={i18n('component.move_down')}
            aria-label={i18n('component.move_down')}
          >
            ▼
          </button>
        </div>
      )}
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
