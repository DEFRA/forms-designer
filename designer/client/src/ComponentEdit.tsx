import { ComponentTypeEnum as Types } from '@defra/forms-model'
import React, { memo, useContext, useLayoutEffect } from 'react'

import ComponentTypeEdit from '~/src/ComponentTypeEdit.jsx'
import ErrorSummary from '~/src/ErrorSummary.jsx'
import { DataContext } from '~/src/context/index.js'
import { updateComponent } from '~/src/data/index.js'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Actions } from '~/src/reducers/component/types.js'
import { hasValidationErrors } from '~/src/validations.js'

const LIST_TYPES = [
  Types.AutocompleteField,
  Types.List,
  Types.RadiosField,
  Types.SelectField,
  Types.YesNoField
]

export function ComponentEdit(props) {
  const { data, save } = useContext(DataContext)
  const { state, dispatch } = useContext(ComponentContext)
  const {
    selectedComponent,
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
      dispatch({ type: Actions.VALIDATE })
      return
    }

    if (hasErrors) {
      return
    }

    if (LIST_TYPES.includes(selectedComponent.type)) {
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
    const copy = { ...data }
    const indexOfPage = copy.pages.findIndex((p) => p.path === page.path)
    const indexOfComponent = copy.pages[indexOfPage]?.components.findIndex(
      (component) => component.name === selectedComponent.name
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
        <ComponentTypeEdit page={page} />
        <button className="govuk-button" type="submit">
          Save
        </button>{' '}
        <a href="#" onClick={handleDelete} className="govuk-link">
          Delete
        </a>
      </form>
    </>
  )
}

export default memo(ComponentEdit)
