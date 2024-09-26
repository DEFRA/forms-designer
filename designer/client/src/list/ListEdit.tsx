import { hasListField, type ListTypeContent } from '@defra/forms-model'
// @ts-expect-error -- No types available
import { Input } from '@xgovformbuilder/govuk-react-jsx'
import { type Root } from 'joi'
import {
  useContext,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent
} from 'react'

import { ErrorSummary } from '~/src/ErrorSummary.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { addList } from '~/src/data/list/addList.js'
import { findList } from '~/src/data/list/findList.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ListItems } from '~/src/list/ListItems.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import {
  ListsEditorContext,
  ListsEditorStateActions
} from '~/src/reducers/list/listsEditorReducer.jsx'
import { ListActions } from '~/src/reducers/listActions.jsx'
import {
  ListContext,
  type FormList,
  type ListState
} from '~/src/reducers/listReducer.jsx'
import {
  hasValidationErrors,
  validateCustom,
  validateRequired
} from '~/src/validations.js'

function useListEdit() {
  const { dispatch: listsEditorDispatch } = useContext(ListsEditorContext)

  const { data, save } = useContext(DataContext)
  const { state: listState, dispatch: listDispatch } = useContext(ListContext)

  const { initialTitle, selectedList } = listState

  function handleAddItem(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    listDispatch({
      name: ListActions.ADD_LIST_ITEM
    })

    listsEditorDispatch({
      name: ListsEditorStateActions.IS_EDITING_LIST_ITEM,
      payload: true
    })
  }

  async function handleDelete(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const definition = structuredClone(data)

    const listRemove = findList(definition, selectedList?.name)
    const listIndex = definition.lists.indexOf(listRemove)

    definition.lists.splice(listIndex, 1)

    await save(definition)

    listDispatch({
      name: ListActions.SET_SELECTED_LIST,
      payload: undefined
    })

    listsEditorDispatch({
      name: ListsEditorStateActions.IS_EDITING_LIST,
      payload: false
    })
  }

  function validate(
    payload: Partial<FormList>,
    schema: Root
  ): payload is FormList {
    const { selectedList } = payload

    const errors: ListState['errors'] = {}

    const titles = data.lists
      .filter(({ title }) => title !== initialTitle)
      .map(({ title }) => title)

    errors.title = validateRequired('list-title', selectedList?.title, {
      label: i18n('list.title'),
      schema
    })

    errors.title ??= validateCustom(
      'list-title',
      [...titles, selectedList?.title],
      {
        message: 'errors.duplicate',
        label: i18n('list.title'),
        schema: schema.array().unique()
      }
    )

    errors.listItems = validateCustom('list-items', selectedList?.items, {
      message: 'list.errors.empty',
      schema: schema.array().min(1)
    })

    listDispatch({
      name: ListActions.LIST_VALIDATION_ERRORS,
      payload: errors
    })

    return !hasValidationErrors(errors)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()

    const payload = {
      selectedList
    }

    const { default: schema } = await import('joi')

    // Check for valid form payload
    if (!validate(payload, schema)) {
      return
    }

    let definition = structuredClone(data)

    const list = structuredClone(payload.selectedList)

    if (list.isNew) {
      delete list.isNew
      definition = addList(definition, list)
    } else {
      const listEdit = findList(definition, payload.selectedList.name)
      const listIndex = definition.lists.indexOf(listEdit)

      if (listIndex > -1) {
        definition.lists[listIndex] = list
      }
    }

    await save(definition)

    listDispatch({
      name: ListActions.SET_SELECTED_LIST,
      payload: list
    })

    listsEditorDispatch({
      name: ListsEditorStateActions.IS_EDITING_LIST,
      payload: false
    })
  }

  return {
    handleAddItem,
    handleDelete,
    handleSubmit
  }
}

export function ListEdit() {
  const { state } = useContext(ComponentContext)
  const { state: listState, dispatch: listDispatch } = useContext(ListContext)

  const { selectedComponent } = state
  const { selectedList, errors } = listState
  const hasErrors = hasValidationErrors(errors)

  if (selectedComponent && !hasListField(selectedComponent)) {
    throw new Error('Component must support lists')
  }

  const { handleAddItem, handleDelete, handleSubmit } = useListEdit()

  if (!selectedList) {
    return null
  }

  const listTypeRadioItems = [
    {
      value: 'string',
      labelText: i18n('list.typeString'),
      hintText: i18n('list.typeHintString')
    },
    {
      value: 'number',
      labelText: i18n('list.typeNumber'),
      hintText: i18n('list.typeHintNumber')
    }
  ]

  return (
    <>
      {hasErrors && (
        <ErrorSummary errorList={Object.values(errors).filter(Boolean)} />
      )}

      <form onSubmit={handleSubmit} autoComplete="off" noValidate>
        <Input
          id="list-title"
          name="title"
          hint={{ children: i18n('list.titleHint') }}
          label={{
            className: 'govuk-label--s',
            children: [i18n('list.title')]
          }}
          value={selectedList.title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            listDispatch({
              name: ListActions.EDIT_TITLE,
              payload: e.target.value
            })
          }
          errorMessage={errors.title}
        />

        {selectedList.items.length ? (
          <div className="govuk-form-group">
            <span className="govuk-label govuk-label--s">
              {i18n('list.type')}
            </span>
            <p className="govuk-body">
              {`${
                listTypeRadioItems.find(
                  (item) => item.value === selectedList.type
                )?.labelText
              } values only`}
            </p>
          </div>
        ) : (
          <div className="govuk-form-group">
            <fieldset className="govuk-fieldset">
              <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                {i18n('list.type')}
              </legend>
              <div
                id="list-type"
                className="govuk-radios govuk-radios--small"
                data-module="govuk-radios"
              >
                {listTypeRadioItems.map((item) => {
                  const name = 'type'
                  const id = `${name}-${item.value}`

                  return (
                    <div className="govuk-radios__item" key={item.value}>
                      <input
                        className="govuk-radios__input"
                        id={id}
                        name={name}
                        type="radio"
                        value={item.value}
                        checked={selectedList.type === item.value}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          listDispatch({
                            name: ListActions.EDIT_TYPE,
                            payload: e.target.value as ListTypeContent
                          })
                        }}
                      />
                      <label
                        className="govuk-label govuk-radios__label"
                        htmlFor={id}
                      >
                        {item.labelText}
                      </label>
                      <div
                        id={`${id}-hint`}
                        className="govuk-hint govuk-radios__hint"
                      >
                        {item.hintText}
                      </div>
                    </div>
                  )
                })}
              </div>
            </fieldset>
          </div>
        )}

        <div className="panel__results">
          <ListItems />

          <div className="govuk-button-group">
            <button
              id="list-items"
              className="govuk-button govuk-button--secondary-quiet"
              type="button"
              onClick={handleAddItem}
            >
              {i18n('list.item.add')}
            </button>
          </div>
        </div>

        <div className="govuk-button-group govuk-!-margin-top-5">
          <button className="govuk-button" type="submit">
            {i18n('save')}
          </button>

          {!selectedList.isNew && (
            <button
              className="govuk-button govuk-button--warning"
              type="button"
              onClick={handleDelete}
            >
              {i18n('delete')}
            </button>
          )}
        </div>
      </form>
    </>
  )
}
