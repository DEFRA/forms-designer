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
import { SelectConditions } from '~/src/conditions/SelectConditions.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { addLink } from '~/src/data/page/addLink.js'
import { addPage } from '~/src/data/page/addPage.js'
import { findPage } from '~/src/data/page/findPage.js'
import { hasNext } from '~/src/data/page/hasNext.js'
import { findSection } from '~/src/data/section/findSection.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { SectionEdit } from '~/src/section/SectionEdit.jsx'
import {
  validateCustom,
  validateRequired,
  hasValidationErrors
} from '~/src/validations.js'

interface Props {
  onSave: () => void
}

interface State extends Partial<Form> {
  controller?: Page['controller']
  section?: Section
  linkFrom?: string
  selectedCondition?: string
  isEditingSection: boolean
  isNewSection: boolean
  pages: Page[]
  errors: Partial<ErrorList<'path' | 'title'>>
}

interface Form {
  path: string
  title: string
}

export class PageCreate extends Component<Props, State> {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  constructor(props: Props, context: typeof DataContext) {
    super(props, context)

    const { data } = this.context

    // Sort pages for select menus
    const pages = structuredClone(data.pages).sort(
      ({ title: titleA }, { title: titleB }) => titleA.localeCompare(titleB)
    )

    this.state = {
      isEditingSection: false,
      isNewSection: false,
      pages,
      errors: {}
    }
  }

  onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const { onSave } = this.props
    const { data, save } = this.context
    const { path, controller, title, section, linkFrom, selectedCondition } =
      this.state

    // Remove trailing spaces and hyphens
    const payload = {
      path: `/${slugify(path)}`,
      title: title?.trim()
    }

    // Check for valid form payload
    if (!this.validate(payload)) {
      return
    }

    const pageNew: Page = {
      path: payload.path,
      title: payload.title,
      controller,
      components: [],
      section: section?.name,
      next: []
    }

    let definition = addPage(data, pageNew)

    if (linkFrom) {
      const pageFrom = findPage(definition, linkFrom)

      // Add link from the selected page
      definition = addLink(definition, pageFrom, pageNew, {
        condition: selectedCondition
      })
    }

    try {
      await save(definition)
      onSave()
    } catch (error) {
      logger.error(error, 'PageCreate')
    }
  }

  validate = (payload: Partial<Form>): payload is Form => {
    const { data } = this.context
    const { title, path } = payload

    const errors: State['errors'] = {}

    errors.title = validateRequired('page-title', title, {
      label: i18n('page.title')
    })

    errors.path = validateCustom(
      'page-path',
      [path, ...data.pages.map((p) => p.path)],
      {
        message: 'errors.duplicate',
        label: `Path '${path}'`,
        schema: Joi.array().unique()
      }
    )

    this.setState({ errors })
    return !hasValidationErrors(errors)
  }

  onChangeSection = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: sectionName } = e.target
    const { data } = this.context

    this.setState({
      section: sectionName ? findSection(data, sectionName) : undefined
    })
  }

  onChangeLinkFrom = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: linkFrom } = e.target

    this.setState({
      linkFrom: linkFrom || undefined
    })
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

  conditionSelected = (selectedCondition?: string) => {
    this.setState({
      selectedCondition
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

  render() {
    const { data } = this.context
    const {
      controller,
      linkFrom,
      title,
      section,
      path,
      isEditingSection,
      isNewSection,
      pages,
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
              {i18n('addPage.controllerOption.title')}
            </label>
            <div className="govuk-hint" id="controller-hint">
              {i18n('addPage.controllerOption.helpText')}
            </div>
            <select
              className="govuk-select"
              id="controller"
              aria-describedby="controller-hint"
              name="controller"
              value={controller}
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
              children: [i18n('addPage.pageTitleField.title')]
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
              children: [i18n('addPage.pathField.title')]
            }}
            hint={{
              children: [i18n('addPage.pathField.helpText')]
            }}
            value={path}
            onChange={this.onChangePath}
            errorMessage={errors.path}
          />

          {!sections.length && (
            <>
              <h4 className="govuk-heading-s govuk-!-margin-bottom-1">
                {i18n('addPage.sectionOption.title')}
              </h4>
              <p className="govuk-hint govuk-!-margin-top-0">
                {i18n('addPage.sectionOption.helpText')}
              </p>
            </>
          )}

          <div className="govuk-form-group">
            {sections.length > 0 && (
              <>
                <label
                  className="govuk-label govuk-label--s"
                  htmlFor="page-section"
                >
                  {i18n('addPage.sectionOption.title')}
                </label>
                <div className="govuk-hint" id="page-section-hint">
                  {i18n('addPage.sectionOption.helpText')}
                </div>
                <select
                  className="govuk-select"
                  id="page-section"
                  aria-describedby="page-section-hint"
                  name="section"
                  value={section?.name ?? ''}
                  onChange={this.onChangeSection}
                >
                  <option value="">
                    {i18n('addPage.sectionOption.option')}
                  </option>
                  {sections.map((section) => (
                    <option key={section.name} value={section.name}>
                      {section.title}
                    </option>
                  ))}
                </select>
              </>
            )}
            <p className="govuk-body govuk-!-margin-top-2">
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
                {i18n('section.add')}
              </a>
            </p>
          </div>

          <div className="govuk-form-group">
            <label className="govuk-label govuk-label--s" htmlFor="link-from">
              {i18n('addPage.linkFromOption.title')}
            </label>
            <div className="govuk-hint" id="link-from-hint">
              {i18n('addPage.linkFromOption.helpText')}
            </div>
            <select
              className="govuk-select"
              id="link-from"
              aria-describedby="link-from-hint"
              name="from"
              value={linkFrom ?? ''}
              onChange={this.onChangeLinkFrom}
            >
              <option value="">{i18n('addPage.linkFromOption.option')}</option>
              {pages.filter(hasNext).map((page) => (
                <option key={page.path} value={page.path}>
                  {page.title}
                </option>
              ))}
            </select>
          </div>

          {linkFrom && (
            <SelectConditions
              path={linkFrom}
              conditionsChange={this.conditionSelected}
              noFieldsHintText={i18n('conditions.noFieldsAvailable')}
            />
          )}

          <div className="govuk-button-group">
            <button type="submit" className="govuk-button">
              {i18n('save')}
            </button>
          </div>
        </form>
        {isEditingSection && (
          <RenderInPortal>
            <Flyout
              title={
                !isNewSection && !!section
                  ? i18n('section.editTitle', { title: section.title })
                  : i18n('section.add')
              }
              onHide={this.closeFlyout}
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
