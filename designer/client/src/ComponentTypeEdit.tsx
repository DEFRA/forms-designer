import { ComponentTypes } from '@defra/forms-model'
import React, { useContext } from 'react'

import { DateFieldEdit } from '~/src/components/FieldEditors/date-field-edit.jsx'
import DetailsEdit from '~/src/components/FieldEditors/details-edit.jsx'
import ListFieldEdit from '~/src/components/FieldEditors/list-field-edit.jsx'
import { NumberFieldEdit } from '~/src/components/FieldEditors/number-field-edit.jsx'
import { ParaEdit } from '~/src/components/FieldEditors/para-edit.jsx'
import SelectFieldEdit from '~/src/components/FieldEditors/select-field-edit.jsx'
import { TextFieldEdit } from '~/src/components/FieldEditors/text-field-edit.jsx'
import FieldEdit from '~/src/field-edit.jsx'
import { FileUploadFieldEdit } from '~/src/file-upload-field-edit.jsx'
import { MultilineTextFieldEdit } from '~/src/multiline-text-field-edit.js'
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

function ComponentTypeEdit(props) {
  const { context = ComponentContext, page } = props
  const { state } = useContext(context)
  const { selectedComponent } = state
  const type = ComponentTypes.find(
    (t) => t.name === selectedComponent?.type ?? ''
  )

  const needsFieldInputs = type?.subType !== 'content' || type.name === 'List'

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
