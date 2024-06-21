import React, { useContext, useState } from 'react'

import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { InlineConditions } from '~/src/conditions/InlineConditions.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { allInputs } from '~/src/data/component/inputs.js'
import { i18n } from '~/src/i18n/i18n.jsx'

function useConditionsEditor() {
  const [editingCondition, setEditingCondition] = useState(null)
  const [showAddCondition, setShowAddCondition] = useState(false)

  function onClickCondition(e, condition) {
    e.preventDefault()
    setEditingCondition(condition)
  }
  function onClickAddCondition(e) {
    e.preventDefault()
    setShowAddCondition(true)
  }
  function editFinished(e) {
    e?.preventDefault()
    setEditingCondition(null)
    setShowAddCondition(false)
  }
  function cancelInlineCondition(e) {
    e?.preventDefault?.()
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

interface Props {}

export function ConditionsEdit({ path }: Props) {
  const {
    editingCondition,
    showAddCondition,
    onClickCondition,
    onClickAddCondition,
    editFinished,
    cancelInlineCondition
  } = useConditionsEditor()
  const { data } = useContext(DataContext)
  const { conditions } = data
  const inputs = allInputs(data)
  return (
    <>
      <div className="govuk-hint">{i18n('conditions.hint')}</div>

      {!editingCondition && (
        <>
          {showAddCondition && (
            <RenderInPortal>
              <Flyout
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

          <ul
            className="govuk-list govuk-list--bullet"
            data-testid="conditions-list"
          >
            {conditions.map((condition) => (
              <li key={condition.name} data-testid="conditions-list-item">
                <a
                  className="govuk-link"
                  href="#"
                  onClick={(e) => onClickCondition(e, condition)}
                >
                  {condition.displayName}
                </a>{' '}
                <small>{condition.name}</small>
                {'   ('}
                <small>{condition.expression}</small>
                {')'}
              </li>
            ))}
          </ul>
          <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
          {inputs.length > 0 && (
            <button
              id="add-condition-link"
              className="govuk-button"
              type="button"
              data-testid={'add-condition-link'}
              onClick={onClickAddCondition}
            >
              {i18n('conditions.add')}
            </button>
          )}
          {inputs.length <= 0 && (
            <div className="govuk-hint">
              {i18n('conditions.noFieldsAvailable')}
            </div>
          )}
        </>
      )}
      {editingCondition && (
        <RenderInPortal>
          <Flyout title={i18n('conditions.addOrEdit')} onHide={editFinished}>
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
