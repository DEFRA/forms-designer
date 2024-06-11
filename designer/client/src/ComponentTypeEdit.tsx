import {
  ComponentSubType,
  ComponentType,
  ComponentTypes,
  hasEditor,
  type Page,
  type RepeatingFieldPage
} from '@defra/forms-model'
import React, { useContext, type FunctionComponent } from 'react'

import { FieldEdit } from '~/src/FieldEdit.jsx'
import { FileUploadFieldEdit } from '~/src/FileUploadFieldEdit.jsx'
import { MultilineTextFieldEdit } from '~/src/MultilineTextFieldEdit.jsx'
import { DateFieldEdit } from '~/src/components/FieldEditors/DateFieldEdit.jsx'
import { DetailsEdit } from '~/src/components/FieldEditors/DetailsEdit.jsx'
import { ListFieldEdit } from '~/src/components/FieldEditors/ListFieldEdit.jsx'
import { NumberFieldEdit } from '~/src/components/FieldEditors/NumberFieldEdit.jsx'
import { ParaEdit } from '~/src/components/FieldEditors/ParaEdit.jsx'
import { SelectFieldEdit } from '~/src/components/FieldEditors/SelectFieldEdit.jsx'
import { TextFieldEdit } from '~/src/components/FieldEditors/TextFieldEdit.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'

const componentTypeEditors = {
  [ComponentType.TextField]: TextFieldEdit,
  [ComponentType.EmailAddressField]: TextFieldEdit,
  [ComponentType.TelephoneNumberField]: TextFieldEdit,
  [ComponentType.MultilineTextField]: MultilineTextFieldEdit,
  [ComponentType.NumberField]: NumberFieldEdit,
  [ComponentType.AutocompleteField]: ListFieldEdit,
  [ComponentType.SelectField]: SelectFieldEdit,
  [ComponentType.RadiosField]: ListFieldEdit,
  [ComponentType.CheckboxesField]: ListFieldEdit,
  [ComponentType.List]: ListFieldEdit,
  [ComponentType.Details]: DetailsEdit,
  [ComponentType.Html]: ParaEdit,
  [ComponentType.InsetText]: ParaEdit,
  [ComponentType.FileUploadField]: FileUploadFieldEdit,
  [ComponentType.DatePartsField]: DateFieldEdit
}

export interface Props {
  context?: typeof ComponentContext
  page: Page | RepeatingFieldPage
}

export const ComponentTypeEdit: FunctionComponent<Props> = (props) => {
  const { context = ComponentContext, page } = props
  const { state } = useContext(context)
  const { selectedComponent } = state

  const component = ComponentTypes.find((componentType) => {
    return componentType.type === selectedComponent?.type
  })

  const needsFieldInputs =
    component?.type === ComponentType.List ||
    component?.subType !== ComponentSubType.Content

  const TagName = hasEditor(component)
    ? componentTypeEditors[component.type]
    : undefined

  return (
    <>
      {needsFieldInputs && (
        <FieldEdit
          isContentField={component?.subType === ComponentSubType.Content}
          isListField={component?.subType === ComponentSubType.ListField}
        />
      )}
      {TagName && <TagName page={page} />}
    </>
  )
}
