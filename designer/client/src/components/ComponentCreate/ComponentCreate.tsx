import { type ComponentDef, type Page } from '@defra/forms-model'
import React, {
  useEffect,
  useContext,
  useState,
  useLayoutEffect,
  type FormEvent
} from 'react'

import { ComponentTypeEdit } from '~/src/ComponentTypeEdit.jsx'
import { ErrorSummary } from '~/src/ErrorSummary.jsx'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { BackLink } from '~/src/components/BackLink/BackLink.jsx'
import { ComponentCreateList } from '~/src/components/ComponentCreate/ComponentCreateList.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { addComponent } from '~/src/data/component/addComponent.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Fields, Meta } from '~/src/reducers/component/types.js'
import { hasValidationErrors } from '~/src/validations.js'

function useComponentCreate(props) {
  const [renderTypeEdit, setRenderTypeEdit] = useState<boolean>(false)
  const { data, save } = useContext(DataContext)
  const { state, dispatch } = useContext(ComponentContext)
  const { selectedComponent = {}, errors = {}, hasValidated } = state
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

    if (selectedComponent.type) {
      window.requestAnimationFrame(() => {
        if (isMounted) setRenderTypeEdit(true)
      })
    } else {
      setRenderTypeEdit(false)
    }

    return () => {
      isMounted = false
    }
  }, [selectedComponent.type])

  useEffect(() => {
    dispatch({ type: Meta.SET_PAGE, payload: page.path })
  }, [page.path])

  useLayoutEffect(() => {
    if (hasValidated && !hasErrors) {
      handleSubmit()
        .then()
        .catch((error: unknown) => {
          logger.error(error, 'ComponentCreate')
        })
    }
  }, [hasValidated, hasErrors])

  const handleSubmit = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault()

    if (!hasValidated) {
      dispatch({ type: Meta.VALIDATE })
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
      type: Fields.EDIT_TYPE,
      payload: {
        type: component.type
      }
    })
  }

  const reset = (e) => {
    e.preventDefault()
    dispatch({ type: Meta.SET_COMPONENT })
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

  const type = component.type

  return (
    <div className="component-create" data-testid={'component-create'}>
      {!type && <h4 className="govuk-heading-m">{i18n('component.create')}</h4>}
      {type && (
        <>
          <BackLink onClick={reset} href="#">
            {i18n('Back to create component list')}
          </BackLink>
          <h4 className="govuk-heading-m">
            {i18n(`fieldTypeToName.${component.type}`)}{' '}
            {i18n('component.component')}
          </h4>
        </>
      )}
      {hasErrors && <ErrorSummary errorList={errors} />}
      {!type && <ComponentCreateList onSelectComponent={handleTypeChange} />}
      {type && renderTypeEdit && (
        <form onSubmit={handleSubmit}>
          <ComponentTypeEdit />
          <button type="submit" className="govuk-button" disabled={isSaving}>
            Save
          </button>
        </form>
      )}
    </div>
  )
}
