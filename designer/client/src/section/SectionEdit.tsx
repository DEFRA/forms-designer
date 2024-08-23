import { type Section } from '@defra/forms-model'
// @ts-expect-error -- No types available
import { Input } from '@xgovformbuilder/govuk-react-jsx'
import React, {
  Component,
  type ChangeEvent,
  type ContextType,
  type FormEvent,
  type MouseEvent
} from 'react'

import { type ErrorList, ErrorSummary } from '~/src/ErrorSummary.jsx'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { DataContext } from '~/src/context/DataContext.js'
import { addSection } from '~/src/data/section/addSection.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import randomId from '~/src/randomId.js'
import {
  validateName,
  validateRequired,
  hasValidationErrors
} from '~/src/validations.js'

interface Props {
  section?: Section
  onSave: (sectionName?: string) => void
}

interface State {
  name: string
  title: string
  hideTitle: boolean
  isNewSection: boolean
  errors: Partial<ErrorList<'title' | 'name'>>
}

export class SectionEdit extends Component<Props, State> {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  constructor(props: Props, context: typeof DataContext) {
    super(props, context)

    const { section } = props

    this.state = {
      name: section?.name ?? randomId(),
      title: section?.title ?? '',
      hideTitle: section?.hideTitle ?? false,
      isNewSection: !section?.name,
      errors: {}
    }
  }

  onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { data, save } = this.context
    const { onSave, section } = this.props
    const { name, title, hideTitle, isNewSection } = this.state

    const validationErrors = this.validate(name, title)
    if (hasValidationErrors(validationErrors)) return

    let updated = { ...data }

    if (isNewSection) {
      updated = addSection(data, { name, title: title.trim(), hideTitle })
    } else {
      const previousName = section?.name
      const nameChanged = previousName !== name
      const copySection = updated.sections.find(
        (section) => section.name === previousName
      )

      if (copySection) {
        copySection.title = title
        copySection.hideTitle = hideTitle

        if (nameChanged) {
          copySection.name = name

          // Update any references to the section
          updated.pages.forEach((p) => {
            if (p.section === previousName) {
              p.section = name
            }
          })
        }
      }
    }

    try {
      await save(updated)
      onSave(name)
    } catch (error) {
      logger.error(error, 'SectionEdit')
    }
  }

  validate = (name?: string, title?: string): State['errors'] => {
    const errors: State['errors'] = {}

    errors.title = validateRequired(
      'title',
      'section-title',
      i18n('sectionEdit.titleField.title'),
      title
    ).title

    errors.name = validateName(
      'name',
      'section-name',
      i18n('sectionEdit.nameField.title'),
      name
    ).name

    this.setState({ errors })
    return errors
  }

  onClickDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const { data, save } = this.context
    const { onSave, section } = this.props

    if (!section) {
      return
    }

    const copy = { ...data }
    const previousName = section.name

    copy.sections.splice(copy.sections.indexOf(section), 1)

    // Update any references to the section
    copy.pages.forEach((p) => {
      if (p.section === previousName) {
        delete p.section
      }
    })

    try {
      await save(copy)
      onSave()
    } catch (error) {
      logger.error(error, 'SectionEdit')
    }
  }

  render() {
    const { title, name, hideTitle, errors, isNewSection } = this.state
    const hasErrors = hasValidationErrors(errors)

    return (
      <>
        {hasErrors && (
          <ErrorSummary errorList={Object.values(errors).filter(Boolean)} />
        )}

        <form onSubmit={this.onSubmit} autoComplete="off">
          <Input
            id="section-title"
            name="title"
            hint={{
              children: [i18n('sectionEdit.titleField.helpText')]
            }}
            label={{
              className: 'govuk-label--s',
              children: [i18n('sectionEdit.titleField.title')]
            }}
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              this.setState({ title: e.target.value })
            }
            errorMessage={errors.name}
          />
          <Input
            id="section-name"
            name="name"
            className="govuk-input--width-20"
            label={{
              className: 'govuk-label--s',
              children: [i18n('sectionEdit.nameField.title')]
            }}
            hint={{
              children: [i18n('sectionEdit.nameField.helpText')]
            }}
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              this.setState({ name: e.target.value })
            }
            errorMessage={errors.name}
          />
          <div className="govuk-checkboxes govuk-form-group">
            <div className="govuk-checkboxes__item">
              <input
                className="govuk-checkboxes__input"
                id="section-hideTitle"
                aria-describedby="section-hideTitle-hint"
                name="hideTitle"
                type="checkbox"
                checked={hideTitle}
                onChange={(e) => this.setState({ hideTitle: e.target.checked })}
              />
              <label
                className="govuk-label govuk-checkboxes__label"
                htmlFor="section-hideTitle"
              >
                {i18n('sectionEdit.hideTitleField.title')}
              </label>
              <div
                className="govuk-hint govuk-checkboxes__hint"
                id="section-hideTitle-hint"
              >
                {i18n('sectionEdit.hideTitleField.helpText')}
              </div>
            </div>
          </div>
          <div className="govuk-button-group">
            <button className="govuk-button" type="submit">
              Save
            </button>
            {!isNewSection && (
              <button
                className="govuk-button govuk-button--warning"
                type="button"
                onClick={this.onClickDelete}
              >
                {i18n('delete')}
              </button>
            )}
          </div>
        </form>
      </>
    )
  }
}
