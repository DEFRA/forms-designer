import {
  ComponentSubType,
  ComponentType,
  getComponentDefaults,
  hasEditor
} from '@defra/forms-model'
import React, { useContext, type FunctionComponent } from 'react'

import { FieldEdit } from '~/src/FieldEdit.jsx'
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
  [ComponentType.DatePartsField]: DateFieldEdit
}

export interface Props {
  context?: typeof ComponentContext
}

export const ComponentTypeEdit: FunctionComponent<Props> = (props) => {
  const { children, context = ComponentContext } = props
  const { state } = useContext(context)
  const { selectedComponent } = state

  if (!selectedComponent) {
    return null
  }

  const TagName = hasEditor(selectedComponent)
    ? componentTypeEditors[selectedComponent.type]
    : undefined

  const defaults = getComponentDefaults(selectedComponent)
  const { type, subType } = defaults ?? {}

  return (
    <>
      {(type === ComponentType.List ||
        subType !== ComponentSubType.Content) && (
        <FieldEdit isContentField={subType === ComponentSubType.Content} />
      )}
      {TagName && <TagName>{children}</TagName>}
    </>
  )
}
