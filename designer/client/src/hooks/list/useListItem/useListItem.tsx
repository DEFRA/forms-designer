import { type FormDefinition } from '@defra/forms-model'
import Joi from 'joi'

import { addList } from '~/src/data/list/addList.js'
import { type ListItemHook } from '~/src/hooks/list/useListItem/types.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ListActions } from '~/src/reducers/listActions.jsx'
import {
  type FormItem,
  type ListContextType,
  type ListState
} from '~/src/reducers/listReducer.jsx'
import {
  hasValidationErrors,
  validateCustom,
  validateRequired
} from '~/src/validations.js'

export function useListItem(
  state: ListState,
  dispatch: ListContextType['dispatch']
): ListItemHook {
  const {
    initialName,
    initialItem,
    selectedList,
    selectedItem,
    selectedItemIndex
  } = state

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

    const titles =
      selectedList?.items
        .filter(({ text }) => text !== initialItem)
        .map(({ text }) => text) ?? []

    const errors: ListState['listItemErrors'] = {}

    errors.title = validateRequired('title', text, {
      label: i18n('list.item.title')
    })

    errors.title ??= validateCustom('title', [...titles, text], {
      message: 'errors.duplicate',
      label: `Item text '${text}'`,
      schema: Joi.array().unique()
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
    if (!selectedList || !selectedItem) {
      return data
    }

    let definition = structuredClone(data)
    const item = structuredClone(selectedItem)
    const list = structuredClone(selectedList)

    const { lists } = definition
    const listIndex = lists.findIndex(({ name }) => name === initialName)

    if (item.isNew) {
      delete item.isNew
      list.items.push(item)
    } else if (typeof selectedItemIndex === 'number') {
      list.items[selectedItemIndex] = item
    }

    if (list.isNew) {
      delete list.isNew
      definition = addList(definition, list)
    } else if (listIndex > -1) {
      definition.lists[listIndex] = list
    }

    dispatch({
      name: ListActions.SET_SELECTED_LIST,
      payload: list
    })

    return definition
  }

  function prepareForDelete(data: FormDefinition, index?: number) {
    if (!selectedList || (!selectedItem && typeof index === 'undefined')) {
      return data
    }

    // If user clicks delete button in list items list, then index is defined and we use it
    // If user clicks delete button inside item edit screen, then selectedItemIndex is defined and index is undefined
    const deleteItemIndex = index ?? selectedItemIndex
    if (typeof deleteItemIndex === 'undefined') {
      return data
    }

    const definition = structuredClone(data)
    const list = structuredClone(selectedList)

    const { lists } = definition
    const listIndex = lists.findIndex(({ name }) => name === initialName)

    list.items.splice(deleteItemIndex, 1)
    definition.lists[listIndex] = list

    dispatch({
      name: ListActions.SET_SELECTED_LIST,
      payload: list
    })

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
    value: selectedItem?.value,
    condition: selectedItem?.condition,
    title: selectedItem?.text ?? '',
    hint: selectedItem?.description ?? ''
  }
}
