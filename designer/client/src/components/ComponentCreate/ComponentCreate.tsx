import {
  randomId,
  type ComponentDef,
  type ComponentTypes,
  type Page
} from '@defra/forms-model'
import {
  useCallback,
  useContext,
  useEffect,
  useState,
  type FormEvent
} from 'react'

import { ComponentTypeEdit } from '~/src/ComponentTypeEdit.jsx'
import { ErrorSummary } from '~/src/ErrorSummary.jsx'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { ComponentCreateList } from '~/src/components/ComponentCreate/ComponentCreateList.jsx'
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { addComponent } from '~/src/data/component/addComponent.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { ComponentContext } from '~/src/reducers/component/componentReducer.jsx'
import { Meta } from '~/src/reducers/component/types.js'
import { hasValidationErrors } from '~/src/validations.js'

interface Props {
  page: Page
  onSave: () => void
}

function useComponentCreate(props: Readonly<Props>) {
  const { data, save } = useContext(DataContext)
  const { state, dispatch } = useContext(ComponentContext)

  const [isSaving, setIsSaving] = useState(false)

  const { page, onSave } = props
  const { selectedComponent, errors, hasValidated = false } = state

  const hasErrors = hasValidationErrors(errors)
  const onHandleSave = useCallback(handleSave, [handleSave])

  useEffect(() => {
    if (!hasValidated || hasErrors || isSaving) {
      return
    }

    onHandleSave().catch((error: unknown) => {
      logger.error(error, 'ComponentCreate')
    })
  }, [hasValidated, hasErrors, isSaving, onHandleSave])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()

    const { default: schema } = await import('joi')

    dispatch({
      name: Meta.VALIDATE,
      payload: schema
    })
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

  function handleReset() {
    dispatch({ name: Meta.SET_COMPONENT })
  }

  return {
    handleSubmit,
    handleCreate,
    handleReset,
    hasErrors,
    errors,
    selectedComponent,
    onSave
  }
}

export function ComponentCreate(props: Readonly<Props>) {
  const {
    handleSubmit,
    handleCreate,
    handleReset,
    hasErrors,
    errors,
    selectedComponent,
    onSave
  } = useComponentCreate(props)

  const componentName = selectedComponent?.type
    ? String(i18n(`fieldTypeToName.${selectedComponent.type}`))
    : ''

  return (
    <>
      <RenderInPortal>
        <Flyout
          id="component-create-list"
          title={i18n('component.create')}
          onHide={onSave}
        >
          <ComponentCreateList
            page={props.page}
            onSelectComponent={handleCreate}
          />
        </Flyout>
      </RenderInPortal>

      {selectedComponent?.type && (
        <RenderInPortal>
          <Flyout
            id="component-type-edit"
            title={`${componentName} ${i18n('component.component')}`}
            onHide={handleReset}
          >
            {hasErrors && (
              <ErrorSummary errorList={Object.values(errors).filter(Boolean)} />
            )}

            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
              <ComponentTypeEdit />

              <button type="submit" className="govuk-button">
                Save
              </button>
            </form>
          </Flyout>
        </RenderInPortal>
      )}
    </>
  )
}
