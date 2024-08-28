import React, {
  useContext,
  useLayoutEffect,
  type FormEvent,
  type MouseEvent
} from 'react'

import { ComponentTypeEdit } from '~/src/ComponentTypeEdit.jsx'
import { ErrorSummary } from '~/src/ErrorSummary.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { updateComponent } from '~/src/data/component/updateComponent.js'
import { findPage } from '~/src/data/page/findPage.js'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Meta } from '~/src/reducers/component/types.js'
import { hasValidationErrors } from '~/src/validations.js'

export function ComponentEdit(props) {
  const { data, save } = useContext(DataContext)
  const { state, dispatch } = useContext(ComponentContext)
  const { initialName, selectedComponent, errors, hasValidated } = state
  const { page, toggleShowEditor } = props
  const hasErrors = hasValidationErrors(errors)

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault()

    if (!hasValidated) {
      dispatch({ name: Meta.VALIDATE })
      return
    }

    if (hasErrors || !selectedComponent?.name) {
      return
    }

    const updatedData = updateComponent(
      data,
      page.path,
      initialName,
      selectedComponent
    )
    await save(updatedData)
    toggleShowEditor()
  }

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!window.confirm('Confirm delete') || !selectedComponent) {
      return
    }

    const copy = structuredClone(data)
    const pageEdit = findPage(copy, page.path)

    const { components = [] } = pageEdit
    const componentIndex = components.findIndex(
      ({ name }) => name === selectedComponent.name
    )

    if (componentIndex < 0) {
      return
    }

    components.splice(componentIndex, 1)

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
      {hasErrors && (
        <ErrorSummary errorList={Object.values(errors).filter(Boolean)} />
      )}

      <form onSubmit={handleSubmit} autoComplete="off" noValidate>
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
