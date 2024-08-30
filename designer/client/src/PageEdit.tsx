import { slugify, type Page, type Section } from '@defra/forms-model'
// @ts-expect-error -- No types available
import { Input } from '@xgovformbuilder/govuk-react-jsx'
import Joi from 'joi'
import React, {
  Component,
  type ChangeEvent,
  type ContextType,
  type FormEvent,
  type MouseEvent
} from 'react'

import { type ErrorList, ErrorSummary } from '~/src/ErrorSummary.jsx'
import { logger } from '~/src/common/helpers/logging/logger.js'
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { deleteLink } from '~/src/data/page/deleteLink.js'
import { findPage } from '~/src/data/page/findPage.js'
import { hasNext } from '~/src/data/page/hasNext.js'
import { updateLinksTo } from '~/src/data/page/updateLinksTo.js'
import { findSection } from '~/src/data/section/findSection.js'
import { controllerNameFromPath } from '~/src/helpers.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { SectionEdit } from '~/src/section/SectionEdit.jsx'
import {
  validateCustom,
  validateRequired,
  hasValidationErrors
} from '~/src/validations.js'

interface Props {
  page: Page
  onSave: () => void
}

interface State extends Partial<Form> {
  controller?: Page['controller']
  section?: Section
  isEditingSection: boolean
  isNewSection: boolean
  errors: Partial<ErrorList<'path' | 'title'>>
}

interface Form {
  path: string
  title: string
}

export class PageEdit extends Component<Props, State> {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  constructor(props: Props, context: typeof DataContext) {
    super(props, context)

    const { page } = this.props
    const { data } = this.context

    this.state = {
      path: page.path,
      controller: page.controller,
      title: page.title,
      section: page.section ? findSection(data, page.section) : undefined,
      isEditingSection: false,
      isNewSection: false,
      errors: {}
    }
  }

  onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const { save, data } = this.context
    const { title, path, section, controller } = this.state
    const { page, onSave } = this.props

    // Remove trailing spaces and hyphens
    const payload = {
      path: `/${slugify(path)}`,
      title: title?.trim()
    }

    // Check for valid form payload
    if (!this.validate(payload)) {
      return
    }

    let definition = structuredClone(data)
    const pageEdit = findPage(definition, page.path)

    pageEdit.title = payload.title
    pageEdit.controller = controller
    pageEdit.section = section?.name

    if (payload.path !== page.path) {
      definition = updateLinksTo(definition, pageEdit, {
        path: payload.path
      })
    }

    try {
      await save(definition)
      onSave()
    } catch (error) {
      logger.error(error, 'PageEdit')
    }
  }

  validate = (payload: Partial<Form>): payload is Form => {
    const { page } = this.props
    const { data } = this.context
    const { title, path } = payload

    const errors: State['errors'] = {}

    errors.title = validateRequired('page-title', title, {
      label: i18n('page.title')
    })

    errors.path = validateCustom(
      'page-path',
      [path, ...data.pages.map((p) => p.path).filter((p) => p !== page.path)],
      {
        message: 'errors.duplicate',
        label: `Path '${path}'`,
        schema: Joi.array().unique()
      }
    )

    this.setState({ errors })
    return !hasValidationErrors(errors)
  }

  onClickDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const { save, data } = this.context
    const { page, onSave } = this.props

    let definition = structuredClone(data)

    const pageRemove = findPage(definition, page.path)
    const pageIndex = definition.pages.indexOf(pageRemove)

    // Remove all links to the page
    for (const pageFrom of definition.pages.filter(hasNext)) {
      const { next } = pageFrom

      // Remove link
      if (next.some(({ path }) => path === pageRemove.path)) {
        definition = deleteLink(definition, pageFrom, pageRemove)
      }
    }

    // Remove page
    definition.pages.splice(pageIndex, 1)

    try {
      await save(definition)
      onSave()
    } catch (error) {
      logger.error(error, 'PageEdit')
    }
  }

  onChangeController = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: controller } = e.target

    this.setState({
      controller: controller ? (controller as Page['controller']) : undefined
    })
  }

  onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: title } = e.target

    this.onChangePath(e)
    this.setState({ title })
  }

  onChangePath = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: path } = e.target

    this.setState({
      path: `/${slugify(path, { trim: false })}`
    })
  }

  editSection = (e: MouseEvent<HTMLAnchorElement>, isNewSection = false) => {
    e.preventDefault()

    this.setState({
      isEditingSection: true,
      isNewSection
    })
  }

  closeFlyout = (sectionName?: string) => {
    const { data } = this.context
    const { section } = this.state

    this.setState({
      isEditingSection: false,
      isNewSection: false,
      section: sectionName ? findSection(data, sectionName) : section
    })
  }

  onChangeSection = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: sectionName } = e.target
    const { data } = this.context

    this.setState({
      section: sectionName ? findSection(data, sectionName) : undefined
    })
  }

  render() {
    const { data } = this.context
    const {
      title,
      path,
      controller,
      section,
      isEditingSection,
      isNewSection,
      errors
    } = this.state

    const { sections } = data
    const hasErrors = hasValidationErrors(errors)

    return (
      <>
        {hasErrors && (
          <ErrorSummary errorList={Object.values(errors).filter(Boolean)} />
        )}

        <form onSubmit={this.onSubmit} autoComplete="off" noValidate>
          <div className="govuk-form-group">
            <label className="govuk-label govuk-label--s" htmlFor="controller">
              {i18n('page.controller')}
            </label>
            <div className="govuk-hint" id="controller-hint">
              {i18n('page.controllerHint')}
            </div>
            <select
              className="govuk-select"
              id="controller"
              aria-describedby="controller-hint"
              name="controller"
              value={controllerNameFromPath(controller)}
              onChange={this.onChangeController}
            >
              <option value="">{i18n('page.controllers.question')}</option>
              <option value="StartPageController">
                {i18n('page.controllers.start')}
              </option>
              <option value="FileUploadPageController">
                {i18n('page.controllers.fileUpload')}
              </option>
              <option value="SummaryPageController">
                {i18n('page.controllers.summary')}
              </option>
            </select>
          </div>

          <Input
            id="page-title"
            name="title"
            label={{
              className: 'govuk-label--s',
              children: [i18n('page.title')]
            }}
            value={title}
            onChange={this.onChangeTitle}
            errorMessage={errors.title}
          />

          <Input
            id="page-path"
            name="path"
            label={{
              className: 'govuk-label--s',
              children: [i18n('page.path')]
            }}
            hint={{
              children: [i18n('page.pathHint')]
            }}
            value={path}
            onChange={this.onChangePath}
            errorMessage={errors.path}
          />

          {!sections.length && (
            <>
              <h4 className="govuk-heading-s govuk-!-margin-bottom-1">
                {i18n('page.section')}
              </h4>
              <p className="govuk-hint govuk-!-margin-top-0">
                {i18n('page.sectionHint')}
              </p>
            </>
          )}

          {sections.length > 0 && (
            <div className="govuk-form-group">
              <label
                className="govuk-label govuk-label--s"
                htmlFor="page-section"
              >
                {i18n('page.section')}
              </label>
              <div className="govuk-hint" id="page-section-hint">
                {i18n('page.sectionHint')}
              </div>
              <select
                className="govuk-select"
                id="page-section"
                aria-describedby="page-section-hint"
                name="section"
                value={section?.name ?? ''}
                onChange={this.onChangeSection}
              >
                <option value="" />
                {sections.map((section) => (
                  <option key={section.name} value={section.name}>
                    {section.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <p className="govuk-body">
            {section && (
              <a
                href="#"
                className="govuk-link govuk-!-display-block"
                onClick={this.editSection}
              >
                {i18n('section.edit')}
              </a>
            )}
            <a
              href="#"
              className="govuk-link govuk-!-display-block"
              onClick={(e) => this.editSection(e, true)}
            >
              {i18n('section.create')}
            </a>
          </p>

          <div className="govuk-button-group">
            <button className="govuk-button" type="submit">
              {i18n('save')}
            </button>
            <button
              className="govuk-button govuk-button--warning"
              type="button"
              onClick={this.onClickDelete}
            >
              {i18n('delete')}
            </button>
          </div>
        </form>

        {isEditingSection && (
          <RenderInPortal>
            <Flyout
              title={
                !isNewSection && !!section
                  ? i18n('section.editingTitle', { title: section.title })
                  : i18n('section.newTitle')
              }
              onHide={this.closeFlyout}
              show={isEditingSection}
            >
              <SectionEdit
                section={!isNewSection ? section : undefined}
                onSave={this.closeFlyout}
              />
            </Flyout>
          </RenderInPortal>
        )}
      </>
    )
  }
}
