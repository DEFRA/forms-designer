import { hasListField } from '@defra/forms-model'
import React, { useContext, useLayoutEffect } from 'react'

import { ComponentTypeEdit } from '~/src/ComponentTypeEdit.jsx'
import { ErrorSummary } from '~/src/ErrorSummary.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { updateComponent } from '~/src/data/component/updateComponent.js'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Meta } from '~/src/reducers/component/types.js'
import { hasValidationErrors } from '~/src/validations.js'

export function ComponentEdit(props) {
  const { data, save } = useContext(DataContext)
  const { state, dispatch } = useContext(ComponentContext)
  const {
    selectedComponent = {},
    initialName,
    errors = {},
    hasValidated,
    selectedListName
  } = state
  const { page, toggleShowEditor } = props
  const hasErrors = hasValidationErrors(errors)
  const componentToSubmit = { ...selectedComponent }

  const handleSubmit = async (e) => {
    e?.preventDefault()

    if (!hasValidated) {
      dispatch({ type: Meta.VALIDATE })
      return
    }

    if (hasErrors) {
      return
    }

    if (hasListField(selectedComponent)) {
      if (selectedListName !== 'static') {
        componentToSubmit.values = {
          type: 'listRef',
          list: selectedListName
        }
        delete componentToSubmit.items
      } else {
        componentToSubmit.values.valueType = 'static'
      }
    }

    const updatedData = updateComponent(
      data,
      page.path,
      initialName,
      componentToSubmit
    )
    await save(updatedData)
    toggleShowEditor()
  }

  const handleDelete = async (e) => {
    e.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const copy = { ...data }
    const indexOfPage = copy.pages.findIndex((p) => p.path === page.path)
    const indexOfComponent = copy.pages[indexOfPage]?.components?.findIndex(
      (component) => component.type === selectedComponent.type
    )
    copy.pages[indexOfPage].components.splice(indexOfComponent, 1)
    await save(copy)
    toggleShowEditor()
  }

  useLayoutEffect(() => {
    if (hasValidated && !hasErrors) {
      handleSubmit()
    }
  }, [hasValidated])

  return (
    <>
      {hasErrors && <ErrorSummary errorList={Object.values(errors)} />}
      <form autoComplete="off" onSubmit={handleSubmit}>
        <ComponentTypeEdit />

        <div className="govuk-button-group">
          <button className="govuk-button" type="submit">
            Save
          </button>
          <button
            className="govuk-button govuk-button--warning"
            type="button"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </form>
    </>
  )
}
