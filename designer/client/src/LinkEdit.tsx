import {
  hasNext,
  type FormDefinition,
  type Link,
  type Page
} from '@defra/forms-model'
import classNames from 'classnames'
import Joi from 'joi'
import React, {
  Component,
  type ChangeEvent,
  type ContextType,
  type FormEvent,
  type MouseEvent
} from 'react'

import { ErrorSummary, type ErrorList } from '~/src/ErrorSummary.jsx'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { ErrorMessage } from '~/src/components/ErrorMessage/ErrorMessage.jsx'
import { type Edge } from '~/src/components/Visualisation/getLayout.js'
import { SelectConditions } from '~/src/conditions/SelectConditions.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { addLink } from '~/src/data/page/addLink.js'
import { deleteLink } from '~/src/data/page/deleteLink.js'
import { findLink, findLinkIndex } from '~/src/data/page/findLink.js'
import { findPage } from '~/src/data/page/findPage.js'
import { updateLink } from '~/src/data/page/updateLink.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import {
  validateRequired,
  hasValidationErrors,
  validateCustom
} from '~/src/validations.js'

interface Props {
  edge?: Edge
  onSave: () => void
}

interface State extends Partial<Form> {
  pages: Page[]
  isEditingLink: boolean
  edgeFrom?: Page
  edgeTo?: Page
  errors: Partial<ErrorList<'from' | 'to' | 'selectedCondition'>>
}

interface Form {
  pageFrom: Page
  pageTo: Page
  selectedCondition?: string
}

export class LinkEdit extends Component<Props, State> {
  declare context: ContextType<typeof DataContext>
  static readonly contextType = DataContext

  constructor(props: Readonly<Props>, context: typeof DataContext) {
    super(props, context)

    const { edge } = this.props
    const { data } = this.context

    // Sort pages for select menus
    const pages = structuredClone(data.pages).sort(
      ({ title: titleA }, { title: titleB }) => titleA.localeCompare(titleB)
    )

    this.state = {
      isEditingLink: false,
      pages,
      errors: {}
    }

    if (!edge) {
      return
    }

    // Find initial pages from edge
    const pageFrom = findPage(data, edge.source)
    const pageTo = findPage(data, edge.target)

    // Find initial link from edge
    const link = findLink(pageFrom, pageTo)

    // Update state
    this.state = {
      ...this.state,

      // Initial page link (editing only)
      isEditingLink: true,
      edgeFrom: pageFrom,
      edgeTo: pageTo,

      // Pre-populate form values
      pageFrom,
      pageTo,
      selectedCondition: link.condition
    }
  }

  onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const { onSave } = this.props
    const { data, save } = this.context
    const { isEditingLink, edgeFrom, edgeTo } = this.state

    const payload = {
      pageFrom: this.state.pageFrom,
      pageTo: this.state.pageTo,
      selectedCondition: this.state.selectedCondition
    }

    // Check for valid form payload
    if (!this.validate(payload)) {
      return
    }

    let definition: FormDefinition | undefined
    const { pageFrom, pageTo, selectedCondition } = payload

    const options: Link = {
      path: pageTo.path,
      condition: selectedCondition
    }

    // Check for new or existing link
    const isNewLink = pageFrom.path !== edgeFrom?.path

    // 1. Edit existing link (optional)
    if (isEditingLink && edgeFrom && edgeTo) {
      definition = isNewLink
        ? deleteLink(data, edgeFrom, edgeTo)
        : updateLink(data, edgeFrom, edgeTo, options)
    }

    // 2. Add new link (or recreate)
    if (isNewLink) {
      definition = addLink(definition ?? data, pageFrom, pageTo, options)
    }

    // 3. Save changes
    if (definition) {
      await save(definition)
    }

    onSave()
  }

  onClickDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const { pageFrom, pageTo } = this.state

    if (!window.confirm('Confirm delete') || !pageFrom || !pageTo) {
      return
    }

    const { onSave } = this.props
    const { data, save } = this.context

    try {
      const definition = deleteLink(data, pageFrom, pageTo)
      await save(definition)
      onSave()
    } catch (error) {
      logger.error(error, 'LinkEdit')
    }
  }

  conditionSelected = (selectedCondition?: string) => {
    this.setState({
      selectedCondition
    })
  }

  onChangeFrom = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: pathFrom } = e.target
    const { data } = this.context

    this.setState({
      pageFrom: pathFrom ? findPage(data, pathFrom) : undefined
    })
  }

  onChangeTo = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: pathTo } = e.target
    const { data } = this.context

    this.setState({
      pageTo: pathTo ? findPage(data, pathTo) : undefined
    })
  }

  validate = (payload: Partial<Form>): payload is Form => {
    const { isEditingLink, edgeFrom } = this.state
    const { pageFrom, pageTo } = payload

    const errors: State['errors'] = {}

    errors.from = validateRequired('link-from', pageFrom?.path, {
      label: i18n('addLink.linkFrom.title')
    })

    errors.to = validateRequired('link-to', pageTo?.path, {
      label: i18n('addLink.linkTo.title')
    })

    errors.to ??= validateCustom('link-to', [pageFrom?.path, pageTo?.path], {
      message: 'errors.unique',
      label: 'Linked pages',
      schema: Joi.array().unique()
    })

    if (pageFrom && pageTo) {
      const isNewLink = pageFrom.path !== edgeFrom?.path

      if ((isEditingLink && isNewLink) || isNewLink) {
        const index = findLinkIndex(pageFrom, pageTo)

        // Check for duplicate links
        errors.to ??= validateCustom('link-to', index, {
          message: 'errors.duplicate',
          label: 'Link between pages',
          schema: Joi.number().max(-1)
        })
      }
    }

    this.setState({ errors })
    return !hasValidationErrors(errors)
  }

  render() {
    const {
      isEditingLink,
      pages,
      pageFrom,
      pageTo,
      selectedCondition,
      errors
    } = this.state

    const hasErrors = hasValidationErrors(errors)

    return (
      <>
        {hasErrors && (
          <ErrorSummary errorList={Object.values(errors).filter(Boolean)} />
        )}

        <div className="govuk-hint">{i18n('addLink.header.hint')}</div>
        <form onSubmit={this.onSubmit} autoComplete="off" noValidate>
          <div
            className={classNames({
              'govuk-form-group': true,
              'govuk-form-group--error': errors.from
            })}
          >
            <label className="govuk-label govuk-label--s" htmlFor="link-from">
              {i18n('addLink.linkFrom.title')}
            </label>
            {errors.from && (
              <ErrorMessage id="link-from-error">
                {errors.from.children}
              </ErrorMessage>
            )}
            <select
              className={classNames({
                'govuk-select': true,
                'govuk-input--error': errors.from
              })}
              id="link-from"
              aria-describedby={errors.to && 'link-from-error'}
              name="path"
              value={pageFrom?.path}
              onChange={this.onChangeFrom}
            >
              <option value="">{i18n('addLink.linkFrom.option')}</option>
              {pages.filter(hasNext).map((page) => (
                <option key={page.path} value={page.path}>
                  {page.title}
                </option>
              ))}
            </select>
          </div>

          <div
            className={classNames({
              'govuk-form-group': true,
              'govuk-form-group--error': errors.to
            })}
          >
            <label className="govuk-label govuk-label--s" htmlFor="link-to">
              {i18n('addLink.linkTo.title')}
            </label>
            {errors.to && (
              <ErrorMessage id="link-to-error">
                {errors.to.children}
              </ErrorMessage>
            )}
            <select
              className={classNames({
                'govuk-select': true,
                'govuk-input--error': errors.to
              })}
              id="link-to"
              aria-describedby={errors.to && 'link-to-error'}
              name="page"
              value={pageTo?.path}
              onChange={this.onChangeTo}
            >
              <option value="">{i18n('addLink.linkTo.option')}</option>
              {pages.map((page) => (
                <option key={page.path} value={page.path}>
                  {page.title}
                </option>
              ))}
            </select>
          </div>

          {(!!pageFrom || isEditingLink) && (
            <SelectConditions
              path={pageFrom?.path}
              selectedCondition={selectedCondition}
              conditionsChange={this.conditionSelected}
              noFieldsHintText={i18n('addLink.noFieldsAvailable')}
            />
          )}

          <div className="govuk-button-group">
            <button className="govuk-button" type="submit">
              Save
            </button>
            {isEditingLink && (
              <button
                className="govuk-button govuk-button--warning"
                type="button"
                onClick={this.onClickDelete}
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </>
    )
  }
}
