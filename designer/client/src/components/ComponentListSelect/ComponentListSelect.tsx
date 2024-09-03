import { hasListField } from '@defra/forms-model'
import classNames from 'classnames'
import React, {
  useContext,
  useEffect,
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
  const { state: listState, dispatch: listDispatch } = useContext(ListContext)
  const { dispatch: listsEditorDispatch } = useContext(ListsEditorContext)

  const { selectedComponent, errors } = state
  const { selectedList } = listState

  if (!hasListField(selectedComponent)) {
    throw new Error('Component must support lists')
  }

  useEffect(() => {
    if (
      !selectedList?.name ||
      selectedList.name === selectedComponent.list ||
      selectedList.isNew
    ) {
      return
    }

    dispatch({
      name: Fields.EDIT_LIST,
      payload: selectedList.name,
      as: selectedComponent
    })
  }, [
    selectedComponent,
    selectedComponent.list,
    selectedList?.name,
    selectedList?.isNew,
    dispatch
  ])

  const handleChangeList = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: listName } = e.target

    listDispatch({
      name: ListActions.SET_SELECTED_LIST,
      payload: listName ? findList(data, listName) : undefined
    })

    dispatch({
      name: Fields.EDIT_LIST,
      payload: listName,
      as: selectedComponent
    })
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
        value={selectedList?.name ?? ''}
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
        {selectedList?.title && (
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
