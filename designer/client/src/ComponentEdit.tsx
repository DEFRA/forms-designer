import React, {
  useContext,
  useLayoutEffect,
  type FormEvent,
  type MouseEvent
} from 'react'

import { ComponentTypeEdit } from '~/src/ComponentTypeEdit.jsx'
import { ErrorSummary } from '~/src/ErrorSummary.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { findComponent } from '~/src/data/component/findComponent.js'
import { updateComponent } from '~/src/data/component/updateComponent.js'
import { hasComponents } from '~/src/data/definition/hasComponents.js'
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

    const definition = updateComponent(
      data,
      page,
      initialName,
      selectedComponent
    )
    await save(definition)
    toggleShowEditor()
  }

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const copy = structuredClone(data)
    const pageEdit = findPage(copy, page.path)

    if (!hasComponents(pageEdit)) {
      return
    }

    const { components } = pageEdit
    const component = findComponent(pageEdit, selectedComponent?.name)
    const index = components.indexOf(component)

    components.splice(index, 1)

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
