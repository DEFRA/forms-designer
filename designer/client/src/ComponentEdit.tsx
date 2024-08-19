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
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Meta } from '~/src/reducers/component/types.js'
import { hasValidationErrors } from '~/src/validations.js'

export function ComponentEdit(props) {
  const { data, save } = useContext(DataContext)
  const { state, dispatch } = useContext(ComponentContext)
  const { initialName, selectedComponent, errors = {}, hasValidated } = state
  const { page, toggleShowEditor } = props
  const hasErrors = hasValidationErrors(errors)

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault()

    if (!hasValidated) {
      dispatch({ type: Meta.VALIDATE })
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
      {hasErrors && (
        <ErrorSummary errorList={Object.values(errors).filter(Boolean)} />
      )}

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
