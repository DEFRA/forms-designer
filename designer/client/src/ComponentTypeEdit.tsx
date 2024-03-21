import { ComponentTypes } from '@defra/forms-model'
import React, { useContext } from 'react'

import { DateFieldEdit } from './components/FieldEditors/date-field-edit'
import DetailsEdit from './components/FieldEditors/details-edit'
import ListFieldEdit from './components/FieldEditors/list-field-edit'
import { NumberFieldEdit } from './components/FieldEditors/number-field-edit'
import { ParaEdit } from './components/FieldEditors/para-edit'
import SelectFieldEdit from './components/FieldEditors/select-field-edit'
import { TextFieldEdit } from './components/FieldEditors/text-field-edit'
import FieldEdit from './field-edit'
import { FileUploadFieldEdit } from './file-upload-field-edit'
import { MultilineTextFieldEdit } from './multiline-text-field-edit'
import { ComponentContext } from './reducers/component/componentReducer'

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
  FlashCard: ListFieldEdit,
  List: ListFieldEdit,
  Details: DetailsEdit,
  Para: ParaEdit,
  Html: ParaEdit,
  InsetText: ParaEdit,
  WarningText: ParaEdit,
  FileUploadField: FileUploadFieldEdit,
  DatePartsField: DateFieldEdit,
  DateTimeField: DateFieldEdit,
  DateTimePartsField: DateFieldEdit,
  DateField: DateFieldEdit
}

function ComponentTypeEdit(props) {
  const { context = ComponentContext, page } = props
  const { state } = useContext(context)
  const { selectedComponent } = state
  const type = ComponentTypes.find(
    (t) => t.name === selectedComponent?.type ?? ''
  )

  const needsFieldInputs =
    type?.subType !== 'content' || ['FlashCard', 'List'].includes(type?.name)

  const TagName = componentTypeEditors[type?.name ?? '']
  return (
    <div>
      {needsFieldInputs && (
        <FieldEdit
          isContentField={type?.subType === 'content'}
          isListField={type?.subType === 'listField'}
        />
      )}
      {TagName && <TagName page={page} />}
    </div>
  )
}

export default ComponentTypeEdit
