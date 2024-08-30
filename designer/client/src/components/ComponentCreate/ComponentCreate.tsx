import {
  type ComponentDef,
  type ComponentTypes,
  type Page
} from '@defra/forms-model'
import React, {
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
import { BackLink } from '~/src/components/BackLink/BackLink.jsx'
import { ComponentCreateList } from '~/src/components/ComponentCreate/ComponentCreateList.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { addComponent } from '~/src/data/component/addComponent.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import randomId from '~/src/randomId.js'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Meta } from '~/src/reducers/component/types.js'
import { hasValidationErrors } from '~/src/validations.js'

interface Props {
  page: Page
  onSave: () => void
}

function useComponentCreate(props: Props) {
  const { data, save } = useContext(DataContext)
  const { state, dispatch } = useContext(ComponentContext)

  const [renderTypeEdit, setRenderTypeEdit] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const { page, onSave } = props
  const { selectedComponent, errors, hasValidated = false } = state

  const hasErrors = hasValidationErrors(errors)
  const onHandleSave = useCallback(handleSave, [handleSave])

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
    if (!hasValidated || hasErrors || isSaving) {
      return
    }

    onHandleSave().catch((error: unknown) => {
      logger.error(error, 'ComponentCreate')
    })
  }, [hasValidated, hasErrors, isSaving, onHandleSave])

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

    const definition = addComponent(data, page, selectedComponent)

    await save(definition)
    onSave()
  }

  /**
   * Create new component using {@link ComponentTypes}
   * but replace default name with random ID
   */
  function handleCreate(component: ComponentDef) {
    dispatch({
      name: Meta.NEW_COMPONENT,
      payload: {
        ...component,
        name: randomId()
      }
    })
  }

  function handleReset(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    dispatch({ name: Meta.SET_COMPONENT })
  }

  return {
    handleSubmit,
    handleCreate,
    handleReset,
    hasErrors,
    errors,
    selectedComponent,
    renderTypeEdit
  }
}

export function ComponentCreate(props: Props) {
  const {
    handleSubmit,
    handleCreate,
    handleReset,
    hasErrors,
    errors,
    selectedComponent,
    renderTypeEdit
  } = useComponentCreate(props)

  const type = selectedComponent?.type

  return (
    <>
      {!type && <h4 className="govuk-heading-m">{i18n('component.create')}</h4>}
      {type && (
        <>
          <BackLink onClick={handleReset} href="#">
            {i18n('Back to create component list')}
          </BackLink>
          <h4 className="govuk-heading-m">
            {i18n(`fieldTypeToName.${selectedComponent.type}`)}{' '}
            {i18n('component.component')}
          </h4>
        </>
      )}
      {hasErrors && (
        <ErrorSummary errorList={Object.values(errors).filter(Boolean)} />
      )}
      {!type && (
        <ComponentCreateList
          page={props.page}
          onSelectComponent={handleCreate}
        />
      )}
      {type && renderTypeEdit && (
        <form onSubmit={handleSubmit} autoComplete="off" noValidate>
          <ComponentTypeEdit />
          <button type="submit" className="govuk-button">
            Save
          </button>
        </form>
      )}
    </>
  )
}
