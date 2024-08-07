import { ComponentType, hasListField } from '@defra/forms-model'
import React, {
  useContext,
  type FunctionComponent,
  type JSXElementConstructor,
  type ReactNode
} from 'react'

import { FieldEdit } from '~/src/FieldEdit.jsx'
import { MultilineTextFieldEdit } from '~/src/MultilineTextFieldEdit.jsx'
import { ConditionEdit } from '~/src/components/FieldEditors/ConditionEdit.jsx'
import { ContentEdit } from '~/src/components/FieldEditors/ContentEdit.jsx'
import { DateFieldEdit } from '~/src/components/FieldEditors/DateFieldEdit.jsx'
import { ListContentEdit } from '~/src/components/FieldEditors/ListContentEdit.jsx'
import { ListFieldEdit } from '~/src/components/FieldEditors/ListFieldEdit.jsx'
import { NumberFieldEdit } from '~/src/components/FieldEditors/NumberFieldEdit.jsx'
import { SelectFieldEdit } from '~/src/components/FieldEditors/SelectFieldEdit.jsx'
import { TextFieldEdit } from '~/src/components/FieldEditors/TextFieldEdit.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'

const componentTypeEditors = {
  [ComponentType.TextField]: TextFieldEdit,
  [ComponentType.EmailAddressField]: TextFieldEdit,
  [ComponentType.TelephoneNumberField]: TextFieldEdit,
  [ComponentType.MultilineTextField]: MultilineTextFieldEdit,
  [ComponentType.NumberField]: NumberFieldEdit,
  [ComponentType.SelectField]: SelectFieldEdit,
  [ComponentType.List]: ListContentEdit,
  [ComponentType.DatePartsField]: DateFieldEdit
} as Partial<
  Record<
    ComponentType,
    JSXElementConstructor<{
      children?: ReactNode
      context?: typeof ComponentContext
    }>
  >
>

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

  const CustomEdit =
    componentTypeEditors[selectedComponent.type] ?? (() => null)

  return (
    <>
      <FieldEdit />
      <ContentEdit />
      <ConditionEdit />

      {hasListField(selectedComponent) && (
        <ListFieldEdit>
          <CustomEdit>{children}</CustomEdit>
        </ListFieldEdit>
      )}

      {!hasListField(selectedComponent) && <CustomEdit>{children}</CustomEdit>}
    </>
  )
}
