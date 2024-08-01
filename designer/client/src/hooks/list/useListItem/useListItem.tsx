import { type FormDefinition } from '@defra/forms-model'
import { type Dispatch } from 'react'

import { addList } from '~/src/data/list/addList.js'
import { findList } from '~/src/data/list/findList.js'
import { type ListItemHook } from '~/src/hooks/list/useListItem/types.js'
import { type i18n } from '~/src/i18n/i18n.jsx'
import { ListActions } from '~/src/reducers/listActions.jsx'
import { type ListState } from '~/src/reducers/listReducer.jsx'
import {
  hasValidationErrors,
  validateNotEmpty,
  validateTitle
} from '~/src/validations.js'

export function useListItem(
  state: ListState,
  dispatch: Dispatch<{
    type: ListActions
    payload?: unknown
  }>
): ListItemHook {
  const { initialName, selectedItem, selectedList, selectedItemIndex } = state

  const handleTitleChange: ListItemHook['handleTitleChange'] = (e) => {
    dispatch({
      type: ListActions.EDIT_LIST_ITEM_TEXT,
      payload: e.target.value
    })
  }

  const handleConditionChange: ListItemHook['handleConditionChange'] = (e) => {
    dispatch({
      type: ListActions.EDIT_LIST_ITEM_CONDITION,
      payload: e.target.value
    })
  }

  const handleValueChange: ListItemHook['handleValueChange'] = (e) => {
    dispatch({
      type: ListActions.EDIT_LIST_ITEM_VALUE,
      payload: e.target.value
    })
  }

  const handleHintChange: ListItemHook['handleHintChange'] = (e) => {
    dispatch({
      type: ListActions.EDIT_LIST_ITEM_DESCRIPTION,
      payload: e.target.value
    })
  }

  function validate(i18nProp?: typeof i18n) {
    const errors = {
      ...validateTitle(
        'title',
        'title',
        '$t(list.item.title)',
        selectedItem?.text,
        i18nProp
      ),

      ...validateNotEmpty(
        'value',
        'value',
        '$t(list.item.value)',
        selectedItem?.value.toString(),
        i18nProp
      )
    }

    const valErrors = hasValidationErrors(errors)

    if (valErrors) {
      dispatch({
        type: ListActions.LIST_ITEM_VALIDATION_ERRORS,
        payload: errors
      })
    }

    return valErrors
  }

  function prepareForSubmit(data: FormDefinition) {
    if (
      !selectedItem ||
      !selectedList ||
      typeof selectedItemIndex !== 'number'
    ) {
      return data
    }

    let copy: FormDefinition = { ...data }

    let { items } = selectedList
    if (!selectedItem.isNew) {
      items = items.splice(selectedItemIndex, 1, selectedItem)
    } else {
      delete selectedItem.isNew
      items.push(selectedItem)
    }

    if (selectedList.isNew) {
      delete selectedList.isNew
      copy = addList(data, selectedList)
    } else {
      const [list, indexOfList] = findList(copy, selectedList.name)
      copy.lists[indexOfList] = { ...list, items: selectedList.items }
    }
    return copy
  }

  function prepareForDelete(data: FormDefinition, index: number | undefined) {
    if (
      !selectedItem ||
      !selectedList ||
      typeof selectedItemIndex !== 'number'
    ) {
      return data
    }

    const definition = structuredClone(data)

    // If user clicks delete button in list items list, then index is defined and we use it
    // If user clicks delete button inside item edit screen, then selectedItemIndex is defined and index is undefined
    const itemToDelete = index ?? selectedItemIndex
    selectedList.items.splice(itemToDelete, 1)

    const selectedListIndex = definition.lists.findIndex(
      (list) => list.name === initialName
    )

    definition.lists[selectedListIndex] = selectedList

    return definition
  }

  return {
    handleTitleChange,
    handleConditionChange,
    handleValueChange,
    handleHintChange,
    prepareForSubmit,
    prepareForDelete,
    validate,
    value: selectedItem?.value ?? '',
    condition: selectedItem?.condition,
    title: selectedItem?.text ?? '',
    hint: selectedItem?.description
  }
}
