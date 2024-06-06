import { type ListComponentsDef } from '@defra/forms-model'
import { Label } from '@xgovformbuilder/govuk-react-jsx'
import classNames from 'classnames'
import React, {
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
  type MouseEvent,
  type ReactNode
} from 'react'

import { DataContext } from '~/src/context/DataContext.js'
import { findList } from '~/src/data/list/findList.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import logger from '~/src/plugins/logger.js'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Actions as ComponentActions } from '~/src/reducers/component/types.js'
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
  const { selectedComponent, errors = {} } = state
  const { list } = selectedComponent as ListComponentsDef

  const { state: listState, dispatch: listDispatch } = useContext(ListContext)
  const { selectedList } = listState

  const [selectedListTitle, setSelectedListTitle] = useState(
    selectedList?.title
  )

  const [isAddingNew, setIsAddingNew] = useState(false)

  useEffect(() => {
    if (selectedList?.isNew) {
      return
    }
    try {
      const [foundList] = findList(data, list)
      listDispatch({
        type: ListActions.SET_SELECTED_LIST,
        payload: foundList
      })
    } catch (e) {
      logger.error('ComponentListSelect', e)
    }
  }, [data.lists, list])

  useEffect(() => {
    setSelectedListTitle(selectedList?.title ?? selectedList?.name)
  }, [selectedList])

  useEffect(() => {
    if (!listsEditorState.isEditingList && isAddingNew) {
      dispatch({
        type: ComponentActions.SET_SELECTED_LIST,
        payload: selectedList.name
      })
      setIsAddingNew(false)
    }
  }, [listsEditorState.isEditingList, selectedList?.name, isAddingNew])

  const editList = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: ComponentActions.SET_SELECTED_LIST,
      payload: e.target.value
    })
  }

  const handleEditListClick = (e: MouseEvent) => {
    e.preventDefault()
    listsEditorDispatch([ListsEditorStateActions.IS_EDITING_LIST, true])
  }

  const handleAddListClick = (e: MouseEvent) => {
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
          'govuk-form-group--error': errors?.list
        })}
      >
        <Label htmlFor="field-options-list" className="govuk-label--s">
          {i18n('list.select.title')}
        </Label>
        <div className="govuk-hint">{i18n('list.select.helpText')}</div>
        <select
          className="govuk-select govuk-input--width-10"
          id="field-options-list"
          name="options.list"
          value={list}
          onChange={editList}
        >
          <option value="-1">{i18n('list.select.option')}</option>
          {data.lists.map(
            (
              list: {
                name: string | number | readonly string[] | undefined
                title: ReactNode
              },
              index: number
            ) => {
              return (
                <option key={`${list.name}-${index}`} value={list.name}>
                  {list.title}
                </option>
              )
            }
          )}
        </select>
      </div>
      <p className="govuk-body">
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
    </>
  )
}

export default ComponentListSelect
