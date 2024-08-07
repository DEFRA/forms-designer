import { type FormDefinition } from '@defra/forms-model'

import { addList } from '~/src/data/list/addList.js'
import { findList } from '~/src/data/list/findList.js'
import { type ListItemHook } from '~/src/hooks/list/useListItem/types.js'
import { ListActions } from '~/src/reducers/listActions.jsx'
import {
  hasValidationErrors,
  validateNotEmpty,
  validateTitle
} from '~/src/validations.js'

export function useListItem(state, dispatch): ListItemHook {
  const { selectedItem = {} } = state
  const { value = '', condition } = selectedItem

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

  function validate(i18nProp) {
    const title = state.selectedItem.text || ''

    const errors = {
      ...validateTitle(
        'title',
        'title',
        '$t(list.item.title)',
        title,
        i18nProp
      ),

      ...validateNotEmpty(
        'value',
        'value',
        '$t(list.item.value)',
        value,
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
    let copy: FormDefinition = { ...data }
    const { selectedList, selectedItemIndex } = state
    let { items } = selectedList
    if (!selectedItem.isNew) {
      items = items.splice(selectedItemIndex, 1, selectedItem)
    } else {
      const { isNew, errors, ...selectedItem } = state.selectedItem
      items.push(selectedItem)
    }

    if (selectedList.isNew) {
      delete selectedList.isNew
      copy = addList(data, selectedList)
    } else {
      const [list, indexOfList] = findList(copy, selectedList.name)
      copy.lists[indexOfList] = { ...list, items }
    }
    return copy
  }

  function prepareForDelete(data: any, index: number | undefined) {
    const copy = { ...data }
    const { initialName, selectedList, selectedItemIndex } = state

    // If user clicks delete button in list items list, then index is defined and we use it
    // If user clicks delete button inside item edit screen, then selectedItemIndex is defined and index is undefined
    const itemToDelete = index ?? selectedItemIndex
    selectedList.items.splice(itemToDelete, 1)

    const selectedListIndex = copy.lists.findIndex(
      (list) => list.name === initialName
    )
    copy.lists[selectedListIndex] = selectedList

    return copy
  }

  return {
    handleTitleChange,
    handleConditionChange,
    handleValueChange,
    handleHintChange,
    prepareForSubmit,
    prepareForDelete,
    validate,
    value,
    condition,
    title: selectedItem.text || '',
    hint: selectedItem.description || ''
  }
}
