import classNames from 'classnames'
import React, {
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
  type MouseEvent
} from 'react'

import { logger } from '~/src/common/helpers/logging/logger.js'
import { DataContext } from '~/src/context/DataContext.js'
import { findList } from '~/src/data/list/findList.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Meta } from '~/src/reducers/component/types.js'
import {
  ListsEditorContext,
  ListsEditorStateActions
} from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListActions } from '~/src/reducers/listActions.jsx'
import { ListContext } from '~/src/reducers/listReducer.jsx'

export function ComponentListSelect() {
  const { data } = useContext(DataContext)
  const { state: listsEditorState, dispatch: listsEditorDispatch } =
    useContext(ListsEditorContext)

  const { state, dispatch } = useContext(ComponentContext)
  const { selectedComponent = {}, errors = {} } = state
  const list = 'list' in selectedComponent ? selectedComponent.list : ''

  const { state: listState, dispatch: listDispatch } = useContext(ListContext)
  const { selectedList } = listState

  const [selectedListTitle, setSelectedListTitle] = useState(
    selectedList?.title
  )

  const [isAddingNew, setIsAddingNew] = useState(false)

  useEffect(() => {
    if (selectedList?.isNew ?? !list) {
      return
    }
    try {
      const [foundList] = findList(data, list)
      listDispatch({
        type: ListActions.SET_SELECTED_LIST,
        payload: foundList
      })
    } catch (error) {
      logger.error(error, 'ComponentListSelect')
    }
  }, [data.lists, list])

  useEffect(() => {
    setSelectedListTitle(selectedList?.title ?? selectedList?.name)
  }, [selectedList])

  useEffect(() => {
    if (!listsEditorState.isEditingList && isAddingNew) {
      dispatch({
        type: Meta.SET_SELECTED_LIST,
        payload: selectedList?.name
      })
      setIsAddingNew(false)
    }
  }, [listsEditorState.isEditingList, selectedList?.name, isAddingNew])

  function editList(e: ChangeEvent<HTMLSelectElement>) {
    dispatch({
      type: Meta.SET_SELECTED_LIST,
      payload: e.target.value
    })
  }

  function handleEditListClick(e: MouseEvent) {
    e.preventDefault()
    listsEditorDispatch([ListsEditorStateActions.IS_EDITING_LIST, true])
  }

  function handleAddListClick(e: MouseEvent) {
    e.preventDefault()
    setIsAddingNew(true)
    listDispatch({ type: ListActions.ADD_NEW_LIST })
    listsEditorDispatch([ListsEditorStateActions.IS_EDITING_LIST, true])
  }

  return (
    <>
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
          value={list}
          onChange={editList}
        >
          <option value="">{i18n('list.select.option')}</option>
          {data.lists.map((list, index) => {
            return (
              <option key={`${list.name}-${index}`} value={list.name}>
                {list.title}
              </option>
            )
          })}
        </select>
        <p className="govuk-body govuk-!-margin-top-2">
          {selectedListTitle && (
            <a
              className="govuk-link govuk-!-display-block govuk-!-margin-bottom-1"
              onClick={handleEditListClick}
              href="#"
            >
              {i18n('list.edit', { title: selectedListTitle })}
            </a>
          )}
          <a
            className="govuk-link govuk-!-display-block govuk-!-margin-bottom-1"
            data-testid="add-list"
            onClick={handleAddListClick}
            href="#"
          >
            {i18n('list.addNew')}
          </a>
        </p>
      </div>
    </>
  )
}
