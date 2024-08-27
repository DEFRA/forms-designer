import { type FormDefinition } from '@defra/forms-model'

import { addList } from '~/src/data/list/addList.js'
import { findList } from '~/src/data/list/findList.js'
import { type ListItemHook } from '~/src/hooks/list/useListItem/types.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ListActions } from '~/src/reducers/listActions.jsx'
import {
  type FormItem,
  type ListContextType,
  type ListState
} from '~/src/reducers/listReducer.jsx'
import { validateRequired, hasValidationErrors } from '~/src/validations.js'

export function useListItem(
  state: ListState,
  dispatch: ListContextType['dispatch']
): ListItemHook {
  const { selectedItem = {} } = state
  const { value = '', condition } = selectedItem

  const handleTitleChange: ListItemHook['handleTitleChange'] = (e) => {
    dispatch({
      name: ListActions.EDIT_LIST_ITEM_TEXT,
      payload: e.target.value
    })
  }

  const handleConditionChange: ListItemHook['handleConditionChange'] = (e) => {
    dispatch({
      name: ListActions.EDIT_LIST_ITEM_CONDITION,
      payload: e.target.value
    })
  }

  const handleValueChange: ListItemHook['handleValueChange'] = (e) => {
    dispatch({
      name: ListActions.EDIT_LIST_ITEM_VALUE,
      payload: e.target.value
    })
  }

  const handleHintChange: ListItemHook['handleHintChange'] = (e) => {
    dispatch({
      name: ListActions.EDIT_LIST_ITEM_DESCRIPTION,
      payload: e.target.value
    })
  }

  function validate(payload: Partial<FormItem>): payload is FormItem {
    const { text, value } = payload.selectedItem ?? {}

    const errors: ListState['listItemErrors'] = {}

    errors.title = validateRequired('title', text, {
      label: i18n('list.item.title')
    })

    errors.value = validateRequired('value', value?.toString(), {
      label: i18n('list.item.value')
    })

    dispatch({
      name: ListActions.LIST_ITEM_VALIDATION_ERRORS,
      payload: errors
    })

    return !hasValidationErrors(errors)
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

  function prepareForDelete(data: FormDefinition, index?: number) {
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
