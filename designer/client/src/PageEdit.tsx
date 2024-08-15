import { clone, slugify, type Page, type Section } from '@defra/forms-model'
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
import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { findPage } from '~/src/data/page/findPage.js'
import { updateLinksTo } from '~/src/data/page/updateLinksTo.js'
import { findSection } from '~/src/data/section/findSection.js'
import { controllerNameFromPath } from '~/src/helpers.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { SectionEdit } from '~/src/section/SectionEdit.jsx'
import { validateTitle, hasValidationErrors } from '~/src/validations.js'

interface Props {
  page: Page
  onSave: () => void
}

interface State {
  path: string
  controller?: string
  title: string
  section?: Section
  isEditingSection: boolean
  isNewSection: boolean
  errors: Partial<ErrorList<'path' | 'title'>>
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
      section: findSection(data, page.section),
      isEditingSection: false,
      isNewSection: false,
      errors: {}
    }
  }

  onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { save, data } = this.context
    const { title, path, section, controller } = this.state
    const { page, onSave } = this.props

    // Remove trailing spaces and hyphens
    const pathTrim = `/${slugify(path)}`
    const titleTrim = title.trim()

    const validationErrors = this.validate(titleTrim, pathTrim)
    if (hasValidationErrors(validationErrors)) return

    let copy = { ...data }
    const [copyPage, copyIndex] = findPage(data, page.path)

    if (pathTrim !== page.path) {
      copy = updateLinksTo(data, page.path, pathTrim)
      copyPage.path = pathTrim
    }

    copyPage.title = titleTrim
    copyPage.controller = controller
    copyPage.section = section?.name

    copy.pages[copyIndex] = copyPage

    try {
      await save(copy)
      onSave()
    } catch (error) {
      logger.error(error, 'PageEdit')
    }
  }

  validate = (title: string, path: string) => {
    const { page } = this.props
    const { data } = this.context

    const titleErrors = validateTitle(
      'title',
      'page-title',
      i18n('page.title'),
      title
    )

    const errors: Partial<ErrorList<'path' | 'title'>> = {
      ...titleErrors
    }

    // Check for duplicate path
    function isDuplicate(input: string) {
      return data.pages.some((p) => p.path !== page.path && p.path === input)
    }

    if (isDuplicate(path)) {
      errors.path = {
        href: '#page-path',
        children: `Path '${path}' already exists`
      }
    }

    this.setState({ errors })

    return errors
  }

  onClickDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const { save, data } = this.context
    const { page, onSave } = this.props

    const copy = clone(data)
    const copyPageIdx = copy.pages.findIndex((p) => p.path === page.path)

    // Remove all links to the page
    copy.pages.forEach((p, index) => {
      if (index !== copyPageIdx && Array.isArray(p.next)) {
        for (let i = p.next.length - 1; i >= 0; i--) {
          const next = p.next[i]
          if (next.path === page.path) {
            p.next.splice(i, 1)
          }
        }
      }
    })

    copy.pages.splice(copyPageIdx, 1)

    try {
      await save(copy)
      onSave()
    } catch (error) {
      logger.error(error, 'PageEdit')
    }
  }

  onChangeController = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: controller } = e.target

    this.setState({
      controller
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
    const { page } = this.props
    const { data } = this.context
    const { section } = this.state

    this.setState({
      isEditingSection: false,
      isNewSection: false,
      section: findSection(data, sectionName ?? section?.name ?? page.section)
    })
  }

  onChangeSection = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value: sectionName } = e.target
    const { data } = this.context

    this.setState({
      section: findSection(data, sectionName)
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
      <div data-testid="page-edit">
        {hasErrors && (
          <ErrorSummary errorList={Object.values(errors).filter(Boolean)} />
        )}

        <form onSubmit={this.onSubmit} autoComplete="off">
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
      </div>
    )
  }
}
