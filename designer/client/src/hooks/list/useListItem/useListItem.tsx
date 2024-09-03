import { type Item } from '@defra/forms-model'
import Joi from 'joi'

import { findListItem } from '~/src/data/list/findList.js'
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
    initialItemText,
    initialItemValue,
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
        .filter(({ text }) => text !== initialItemText)
        .map(({ text }) => text) ?? []

    const values =
      selectedList?.items
        .filter(({ value }) => value !== initialItemValue)
        .map(({ value }) => value) ?? []

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

    errors.value ??= validateCustom('value', [...values, value], {
      message: 'errors.duplicate',
      label: `Item value '${value}'`,
      schema: Joi.array().unique()
    })

    dispatch({
      name: ListActions.LIST_ITEM_VALIDATION_ERRORS,
      payload: errors
    })

    return !hasValidationErrors(errors)
  }

  function prepareForSubmit() {
    if (!selectedList || !selectedItem) {
      return
    }

    const item = structuredClone(selectedItem)
    const list = structuredClone(selectedList)

    if (item.isNew) {
      delete item.isNew
      list.items.push(item)
    } else if (typeof selectedItemIndex === 'number') {
      list.items[selectedItemIndex] = item
    }

    dispatch({
      name: ListActions.SET_SELECTED_LIST,
      payload: list
    })
  }

  function prepareForDelete(item: Item) {
    if (!selectedList) {
      return
    }

    const list = structuredClone(selectedList)

    const itemRemove = findListItem(list, item.text)
    const itemIndex = list.items.indexOf(itemRemove)

    list.items.splice(itemIndex, 1)

    dispatch({
      name: ListActions.SET_SELECTED_LIST,
      payload: list
    })
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
    text: selectedItem?.text,
    description: selectedItem?.description
  }
}
