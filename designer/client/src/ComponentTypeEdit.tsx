import {
  ComponentSubType,
  ComponentType,
  ComponentTypes
} from '@defra/forms-model'
import React, { useContext } from 'react'

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
  TextField: TextFieldEdit,
  EmailAddressField: TextFieldEdit,
  TelephoneNumberField: TextFieldEdit,
  MultilineTextField: MultilineTextFieldEdit,
  NumberField: NumberFieldEdit,
  AutocompleteField: ListFieldEdit,
  SelectField: SelectFieldEdit,
  RadiosField: ListFieldEdit,
  CheckboxesField: ListFieldEdit,
  List: ListFieldEdit,
  Details: DetailsEdit,
  Html: ParaEdit,
  InsetText: ParaEdit,
  WarningText: ParaEdit,
  FileUploadField: FileUploadFieldEdit,
  DatePartsField: DateFieldEdit,
  DateTimeField: DateFieldEdit,
  DateTimePartsField: DateFieldEdit,
  DateField: DateFieldEdit
}

export function ComponentTypeEdit(props) {
  const { context = ComponentContext, page } = props
  const { state } = useContext(context)
  const { selectedComponent } = state
  const type = ComponentTypes.find(
    (t) => t.name === selectedComponent?.type ?? ''
  )

  const needsFieldInputs =
    type?.subType !== ComponentSubType.Content ||
    type.name === ComponentType.List.toString()

  const TagName = componentTypeEditors[type?.name ?? '']
  return (
    <>
      {needsFieldInputs && (
        <FieldEdit
          isContentField={type?.subType === ComponentSubType.Content}
          isListField={type?.subType === ComponentSubType.ListField}
        />
      )}
      {TagName && <TagName page={page} />}
    </>
  )
}
