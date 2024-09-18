import { hasComponents, type Page } from '@defra/forms-model'
import {
  useCallback,
  useContext,
  useEffect,
  useState,
  type FormEvent,
  type MouseEvent
} from 'react'

import { ComponentTypeEdit } from '~/src/ComponentTypeEdit.jsx'
import { ErrorSummary } from '~/src/ErrorSummary.jsx'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { DataContext } from '~/src/context/DataContext.js'
import { findComponent } from '~/src/data/component/findComponent.js'
import { updateComponent } from '~/src/data/component/updateComponent.js'
import { findPage } from '~/src/data/page/findPage.js'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Meta } from '~/src/reducers/component/types.js'
import { hasValidationErrors } from '~/src/validations.js'

interface Props {
  page: Page
  onSave: () => void
}

export function ComponentEdit(props: Readonly<Props>) {
  const { data, save } = useContext(DataContext)
  const { state, dispatch } = useContext(ComponentContext)

  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { page, onSave } = props
  const { initialName, selectedComponent, errors, hasValidated = false } = state

  const hasErrors = hasValidationErrors(errors)
  const onHandleSave = useCallback(handleSave, [handleSave])

  useEffect(() => {
    if (!hasValidated || hasErrors || isSaving || isDeleting) {
      return
    }

    onHandleSave().catch((error: unknown) => {
      logger.error(error, 'ComponentEdit')
    })
  }, [hasValidated, hasErrors, isSaving, isDeleting, onHandleSave])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()

    dispatch({ name: Meta.VALIDATE })
  }

  async function handleSave() {
    if (!selectedComponent) {
      return
    }

    setIsSaving(true)

    const definition = updateComponent(
      data,
      page,
      initialName,
      selectedComponent
    )

    await save(definition)
    onSave()
  }

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const definition = structuredClone(data)
    const pageEdit = findPage(definition, page.path)

    if (!hasComponents(pageEdit)) {
      return
    }

    const { components } = pageEdit
    const component = findComponent(pageEdit, selectedComponent?.name)
    const index = components.indexOf(component)

    setIsDeleting(true)

    components.splice(index, 1)

    await save(definition)
    onSave()
  }

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
