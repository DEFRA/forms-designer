import { Input } from '@xgovformbuilder/govuk-react-jsx'
import React, { createRef, Component, type ContextType } from 'react'

import { type ErrorList, ErrorSummary } from '~/src/ErrorSummary.jsx'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { DataContext } from '~/src/context/DataContext.js'
import { addSection } from '~/src/data/section/addSection.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import randomId from '~/src/randomId.js'
import {
  validateName,
  validateTitle,
  hasValidationErrors
} from '~/src/validations.js'

export class SectionEdit extends Component {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  constructor(props, context) {
    super(props, context)

    this.closeFlyout = props.closeFlyout
    const { section } = props
    this.isNewSection = !section?.name
    this.nameRef = createRef()
    this.state = {
      name: section?.name ?? randomId(),
      title: section?.title ?? '',
      hideTitle: section?.hideTitle ?? false,
      errors: {}
    }
  }

  async onSubmit(e) {
    e.preventDefault()
    const validationErrors = this.validate()

    if (hasValidationErrors(validationErrors)) return

    const { data, save } = this.context
    const { section } = this.props
    const { name, title, hideTitle } = this.state
    let updated = { ...data }

    if (this.isNewSection) {
      updated = addSection(data, { name, title: title.trim(), hideTitle })
    } else {
      const previousName = section?.name
      const nameChanged = previousName !== name
      const copySection = updated.sections.find(
        (section) => section.name === previousName
      )

      if (nameChanged) {
        copySection.name = name
        /**
         * @code removing any references to the section
         */
        copy.pages.forEach((p) => {
          if (p.section === previousName) {
            p.section = name
          }
        })
      }
      copySection.title = title
      copySection.hideTitle = hideTitle
    }

    try {
      await save(updated)
      this.closeFlyout(name)
    } catch (error) {
      logger.error(error, 'SectionEdit')
    }
  }

  validate = (): ErrorList => {
    const { name, title } = this.state
    const titleErrors = validateTitle(
      'title',
      'section-title',
      '$t(titleField.title)',
      title,
      i18n
    )

    const nameErrors = validateName(
      'name',
      'section-name',
      '$t(nameField.title)',
      name,
      i18n
    )

    const errors = {
      ...titleErrors,
      ...nameErrors
    }

    this.setState({ errors })
    return errors
  }

  onClickDelete = async (e) => {
    e.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const { data, save } = this.context
    const { section } = this.props

    const copy = { ...data }
    const previousName = section?.name

    copy.sections.splice(copy.sections.indexOf(section), 1)

    // Update any references to the section
    copy.pages.forEach((p) => {
      if (p.section === previousName) {
        delete p.section
      }
    })

    try {
      await save(copy)
      this.closeFlyout('')
    } catch (error) {
      logger.error(error, 'SectionEdit')
    }
  }

  render() {
    const { title, name, hideTitle, errors } = this.state

    return (
      <>
        {Object.keys(errors).length > 0 && (
          <ErrorSummary errorList={Object.values(errors)} />
        )}
        <form onSubmit={(e) => this.onSubmit(e)} autoComplete="off">
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
            onChange={(e) => this.setState({ title: e.target.value })}
            errorMessage={
              errors.title ? { children: errors.title.children } : undefined
            }
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
            onChange={(e) => this.setState({ name: e.target.value })}
            errorMessage={
              errors.name ? { children: errors.name.children } : undefined
            }
          />
          <div className="govuk-checkboxes govuk-form-group">
            <div className="govuk-checkboxes__item">
              <input
                className="govuk-checkboxes__input"
                id="section-hideTitle"
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
              <div className="govuk-hint govuk-checkboxes__hint">
                {i18n('sectionEdit.hideTitleField.helpText')}
              </div>
            </div>
          </div>
          <div className="govuk-button-group">
            <button className="govuk-button" type="submit">
              Save
            </button>
            {!this.isNewSection && (
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
