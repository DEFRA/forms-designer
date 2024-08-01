import { type Page } from '@defra/forms-model'
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

interface Props {
  page: Page
  toggleShowEditor: () => void
}

export function ComponentEdit(props: Props) {
  const { data, save } = useContext(DataContext)
  const { state, dispatch } = useContext(ComponentContext)
  const { initialName, selectedComponent, errors, hasValidated } = state
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

    const definition = updateComponent(
      data,
      page.path,
      initialName,
      selectedComponent
    )

    await save(definition)
    toggleShowEditor()
  }

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!window.confirm('Confirm delete') || !selectedComponent) {
      return
    }

    const definition = structuredClone(data)
    const componentPage = definition.pages.find((p) => p.path === page.path)

    const indexOfComponent =
      componentPage?.components?.findIndex(
        (component) => component.type === selectedComponent.type
      ) ?? -1

    if (indexOfComponent >= 0) {
      componentPage?.components?.splice(indexOfComponent, 1)
      await save(definition)
    }

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
