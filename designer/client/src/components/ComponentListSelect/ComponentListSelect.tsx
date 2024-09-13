import { hasListField } from '@defra/forms-model'
import classNames from 'classnames'
import React, {
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
  type MouseEvent
} from 'react'

import { DataContext } from '~/src/context/DataContext.js'
import { findList } from '~/src/data/list/findList.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Fields, Meta } from '~/src/reducers/component/types.js'
import {
  ListsEditorContext,
  ListsEditorStateActions
} from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListActions } from '~/src/reducers/listActions.jsx'
import { ListContext } from '~/src/reducers/listReducer.jsx'

export function ComponentListSelect() {
  const { data } = useContext(DataContext)
  const { state, dispatch } = useContext(ComponentContext)
  const { dispatch: listDispatch } = useContext(ListContext)
  const { dispatch: listsEditorDispatch } = useContext(ListsEditorContext)

  const { lists } = data
  const { selectedComponent, errors } = state

  if (!hasListField(selectedComponent)) {
    throw new Error('Component must support lists')
  }

  const [listName, setListName] = useState(selectedComponent.list)

  /**
   * Set initial list name
   */
  useEffect(() => {
    if (listName || !selectedComponent.list) {
      return
    }

    setListName(selectedComponent.list)
  }, [selectedComponent.list, listName])

  /**
   * Update state when list changes
   * (e.g. Selecting list from select menu)
   */
  useEffect(() => {
    if (!listName || listName === selectedComponent.list) {
      return
    }

    // Set list for editing
    listDispatch({
      name: ListActions.SET_SELECTED_LIST,
      payload: findList({ lists }, listName)
    })

    // Set component list
    dispatch({
      name: Fields.EDIT_LIST,
      payload: listName,
      as: selectedComponent
    })
  }, [
    listName,
    lists,
    selectedComponent,
    selectedComponent.list,
    dispatch,
    listDispatch
  ])

  const handleChangeList = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: listName } = e.target
    setListName(listName)
  }

  const handleEditList = (e: MouseEvent) => {
    e.preventDefault()

    dispatch({
      name: Meta.EDIT,
      payload: true
    })

    listsEditorDispatch({
      name: ListsEditorStateActions.IS_EDITING_LIST,
      payload: true
    })
  }

  const handleAddList = (e: MouseEvent) => {
    e.preventDefault()

    dispatch({
      name: Meta.EDIT,
      payload: true
    })

    listDispatch({
      name: ListActions.ADD_NEW_LIST
    })

    listsEditorDispatch({
      name: ListsEditorStateActions.IS_EDITING_LIST,
      payload: true
    })
  }

  return (
    <div
      className={classNames({
        'govuk-form-group': true,
        'govuk-form-group--error': errors.list
      })}
    >
      <label
        className="govuk-label govuk-label--s"
        htmlFor="field-options-list"
      >
        {i18n('list.select.title')}
      </label>
      <div className="govuk-hint" id="field-options-list-hint">
        {i18n('list.select.helpText')}
      </div>
      <select
        className="govuk-select govuk-input--width-10"
        id="field-options-list"
        aria-describedby="field-options-list-hint"
        name="options.list"
        value={listName}
        onChange={handleChangeList}
      >
        <option value="">{i18n('list.select.option')}</option>
        {data.lists.map((list) => (
          <option key={list.name} value={list.name}>
            {list.title}
          </option>
        ))}
      </select>
      <p className="govuk-body govuk-!-margin-top-2">
        {listName && (
          <a
            className="govuk-link govuk-!-display-block govuk-!-margin-bottom-1"
            onClick={handleEditList}
            href="#"
          >
            {i18n('list.edit')}
          </a>
        )}
        <a
          className="govuk-link govuk-!-display-block govuk-!-margin-bottom-1"
          onClick={handleAddList}
          href="#"
        >
          {i18n('list.add')}
        </a>
      </p>
    </div>
  )
}
