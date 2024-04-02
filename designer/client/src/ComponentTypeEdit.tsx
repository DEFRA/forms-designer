import React, { useContext } from 'react'
import { ComponentTypes } from '@defra/forms-model'
import { ComponentContext } from '~/src/reducers/component/componentReducer'
import FieldEdit from '~/src/field-edit'
import ListFieldEdit from '~/src/components/FieldEditors/list-field-edit'
import SelectFieldEdit from '~/src/components/FieldEditors/select-field-edit'
import { TextFieldEdit } from '~/src/components/FieldEditors/text-field-edit'
import { MultilineTextFieldEdit } from '~/src/multiline-text-field-edit'
import { FileUploadFieldEdit } from '~/src/file-upload-field-edit'
import { NumberFieldEdit } from '~/src/components/FieldEditors/number-field-edit'
import { DateFieldEdit } from '~/src/components/FieldEditors/date-field-edit'
import { ParaEdit } from '~/src/components/FieldEditors/para-edit'
import DetailsEdit from '~/src/components/FieldEditors/details-edit'

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
