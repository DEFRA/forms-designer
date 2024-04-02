import React, {
  useEffect,
  useContext,
  useState,
  useLayoutEffect,
  FormEvent
} from 'react'
import { ComponentDef, Page } from '@defra/forms-model'

import { i18n } from '~/src/i18n/index.js'
import { ErrorSummary } from '~/src/error-summary.jsx'
import { hasValidationErrors } from '~/src/validations.js'
import ComponentTypeEdit from '~/src/ComponentTypeEdit.jsx'
import { ComponentCreateList } from '~/src/components/ComponentCreate/ComponentCreateList.jsx'
import { BackLink } from '~/src/components/BackLink/index.js'

import { Actions } from '~/src/reducers/component/types.js'
import { DataContext } from '~/src/context/index.js'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'

import './ComponentCreate.scss'
import { addComponent } from '~/src/data/index.js'
import logger from '~/src/plugins/logger.js'

function useComponentCreate(props) {
  const [renderTypeEdit, setRenderTypeEdit] = useState<boolean>(false)
  const { data, save } = useContext(DataContext)
  const { state, dispatch } = useContext(ComponentContext)
  const { selectedComponent, errors = {}, hasValidated } = state
  const { page, toggleAddComponent = () => {} } = props

  const [isSaving, setIsSaving] = useState(false)
  const hasErrors = hasValidationErrors(errors)

  useEffect(() => {
    // render in the next re-paint to allow the DOM to reflow without the list
    // thus resetting the Flyout wrapper scrolling position
    // This is a quick work around the bug in small screens
    // where once user scrolls down the components list and selects one of the bottom components
    // then the component edit screen renders already scrolled to the bottom
    let isMounted = true

    if (selectedComponent?.type) {
      window.requestAnimationFrame(() => {
        if (isMounted) setRenderTypeEdit(true)
      })
    } else {
      setRenderTypeEdit(false)
    }

    return () => {
      isMounted = false
    }
  }, [selectedComponent?.type])

  useEffect(() => {
    dispatch({ type: Actions.SET_PAGE, payload: page.path })
  }, [page.path])

  useLayoutEffect(() => {
    if (hasValidated && !hasErrors) {
      handleSubmit()
        .then()
        .catch((err) => {
          logger.error('ComponentCreate', err)
        })
    }
  }, [hasValidated, hasErrors])

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault()

    if (!hasValidated) {
      dispatch({ type: Actions.VALIDATE })
      return
    }

    if (hasErrors) {
      return
    }

    setIsSaving(true)
    const { selectedComponent } = state
    const updatedData = addComponent(
      data,
      (page as Page).path,
      selectedComponent
    )

    await save(updatedData)
    toggleAddComponent()
  }

  const handleTypeChange = (component: ComponentDef) => {
    dispatch({
      type: Actions.EDIT_TYPE,
      payload: {
        type: component.type
      }
    })
  }

  const reset = (e) => {
    e.preventDefault()
    dispatch({ type: Actions.SET_COMPONENT })
  }

  return {
    handleSubmit,
    handleTypeChange,
    hasErrors,
    errors: Object.values(errors),
    component: selectedComponent,
    isSaving,
    reset,
    renderTypeEdit
  }
}

export function ComponentCreate(props) {
  const {
    handleSubmit,
    handleTypeChange,
    reset,
    hasErrors,
    errors,
    component,
    isSaving,
    renderTypeEdit
  } = useComponentCreate(props)

  const type = component?.type

  return (
    <div className="component-create" data-testid={'component-create'}>
      {!type && <h4 className="govuk-heading-m">{i18n('component.create')}</h4>}
      {type && (
        <>
          <BackLink onClick={reset}>
            {i18n('Back to create component list')}
          </BackLink>
          <h4 className="govuk-heading-m">
            {i18n(`fieldTypeToName.${component?.type}`)}{' '}
            {i18n('component.component')}
          </h4>
        </>
      )}
      {hasErrors && <ErrorSummary errorList={errors} />}
      {!type && <ComponentCreateList onSelectComponent={handleTypeChange} />}
      {type && renderTypeEdit && (
        <form onSubmit={handleSubmit}>
          {type && <ComponentTypeEdit />}
          <button type="submit" className="govuk-button" disabled={isSaving}>
            Save
          </button>
        </form>
      )}
    </div>
  )
}

export default ComponentCreate
