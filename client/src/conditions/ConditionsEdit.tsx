import {
  ConditionsModel,
  isConditionWrapper,
  type ConditionWrapper
} from '@defra/forms-model'
import { useContext, useState, type MouseEvent } from 'react'

import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { InlineConditions } from '~/src/conditions/InlineConditions.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { getFields } from '~/src/data/component/fields.js'
import { i18n } from '~/src/i18n/i18n.jsx'

function useConditionsEditor() {
  const [editingCondition, setEditingCondition] =
    useState<ConditionWrapper | null>(null)

  const [showAddCondition, setShowAddCondition] = useState<boolean>(false)

  function onClickCondition(
    e: MouseEvent<HTMLAnchorElement>,
    condition: ConditionWrapper
  ) {
    e.preventDefault()
    setEditingCondition(condition)
  }

  function onClickAddCondition(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setShowAddCondition(true)
  }

  function editFinished() {
    setEditingCondition(null)
    setShowAddCondition(false)
  }

  function cancelInlineCondition() {
    setEditingCondition(null)
    setShowAddCondition(false)
  }

  return {
    editingCondition,
    showAddCondition,
    onClickCondition,
    onClickAddCondition,
    editFinished,
    cancelInlineCondition
  }
}

interface Props {
  path?: string
}

export function ConditionsEdit({ path }: Readonly<Props>) {
  const {
    editingCondition,
    showAddCondition,
    onClickCondition,
    onClickAddCondition,
    editFinished,
    cancelInlineCondition
  } = useConditionsEditor()
  const { data } = useContext(DataContext)
  const conditions = data.conditions.filter(isConditionWrapper)
  const fieldInputs = getFields(data)

  return (
    <>
      <div className="govuk-hint">{i18n('conditions.hint')}</div>

      {!editingCondition && (
        <>
          {showAddCondition && (
            <RenderInPortal>
              <Flyout
                id="inline-conditions-add"
                title={i18n('conditions.add')}
                onHide={cancelInlineCondition}
              >
                <InlineConditions
                  conditionsChange={cancelInlineCondition}
                  cancelCallback={cancelInlineCondition}
                  path={path}
                />
              </Flyout>
            </RenderInPortal>
          )}

          <ul className="govuk-list govuk-list--bullet govuk-list--spaced">
            {conditions.map((condition) => {
              const model = ConditionsModel.from(condition.value)

              return (
                <li key={condition.name}>
                  <a
                    className="govuk-link"
                    href="#inline-conditions-edit"
                    onClick={(e) => onClickCondition(e, condition)}
                  >
                    {condition.displayName}
                  </a>
                  <br />
                  {model.toPresentationString()}
                </li>
              )
            })}
          </ul>
          <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
          {fieldInputs.length > 0 && (
            <button
              className="govuk-button"
              type="button"
              onClick={onClickAddCondition}
            >
              {i18n('conditions.add')}
            </button>
          )}
          {fieldInputs.length <= 0 && (
            <div className="govuk-hint">
              {i18n('conditions.noFieldsAvailable')}
            </div>
          )}
        </>
      )}
      {editingCondition && (
        <RenderInPortal>
          <Flyout
            id="inline-conditions-edit"
            title={i18n('conditions.addOrEdit')}
            onHide={editFinished}
          >
            <InlineConditions
              path={path}
              condition={editingCondition}
              conditionsChange={editFinished}
              cancelCallback={editFinished}
            />
          </Flyout>
        </RenderInPortal>
      )}
    </>
  )
}
