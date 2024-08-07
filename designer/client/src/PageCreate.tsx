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
import { SelectConditions } from '~/src/conditions/SelectConditions.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { addLink } from '~/src/data/page/addLink.js'
import { addPage } from '~/src/data/page/addPage.js'
import { toUrl } from '~/src/helpers.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import randomId from '~/src/randomId.js'
import { SectionEdit } from '~/src/section/SectionEdit.jsx'
import { validateTitle, hasValidationErrors } from '~/src/validations.js'

export class PageCreate extends Component {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  constructor(props, context) {
    super(props, context)

    const { page } = this.props

    this.state = {
      path: '/',
      controller: page?.controller ?? '',
      title: page?.title,
      section: page?.section ?? {},
      isEditingSection: false,
      errors: {}
    }
  }

  onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { data, save } = this.context

    const title = this.state.title?.trim()
    const linkFrom = this.state.linkFrom?.trim()
    const section = this.state.section?.name?.trim()
    const pageType = this.state.pageType?.trim()
    const selectedCondition = this.state.selectedCondition?.trim()
    const path = this.state.path

    const validationErrors = this.validate(title, path)
    if (hasValidationErrors(validationErrors)) return

    const value = {
      path,
      title,
      components: [],
      next: []
    }
    if (section) {
      value.section = section
    }
    if (pageType) {
      value.controller = pageType
    }

    let copy = addPage({ ...data }, value)

    if (linkFrom) {
      copy = addLink(copy, linkFrom, path, selectedCondition)
    }
    try {
      await save(copy)
      this.props.onCreate({ value })
    } catch (error) {
      logger.error(error, 'PageCreate')
    }
  }

  validate = (title, path): ErrorList => {
    const { data } = this.context

    const titleErrors = validateTitle(
      'title',
      'page-title',
      '$t(page.title)',
      title,
      i18n
    )

    const errors: Partial<ErrorList<'path' | 'title'>> = {
      ...titleErrors
    }

    const alreadyExists = data.pages.find((page) => page.path === path)
    if (alreadyExists) {
      errors.path = {
        href: '#page-path',
        children: `Path '${path}' already exists`
      }
    }

    this.setState({ errors })

    return errors
  }

  generatePath(title, data) {
    let path = toUrl(title)
    if (
      title.length > 0 &&
      data.pages.find((page) => page.path.startsWith(path))
    ) {
      path = `${path}-${randomId()}`
    }

    return path
  }

  findSectionWithName(name) {
    const { data } = this.context
    const { sections } = data
    return sections.find((section) => section.name === name)
  }

  onChangeSection = (e: ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      section: this.findSectionWithName(e.target.value)
    })
  }

  onChangeLinkFrom = (e: ChangeEvent<HTMLSelectElement>) => {
    const input = e.target
    this.setState({
      linkFrom: input.value
    })
  }

  onChangePageType = (e: ChangeEvent<HTMLSelectElement>) => {
    const input = e.target
    this.setState({
      pageType: input.value
    })
  }

  onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const { data } = this.context
    const input = e.target
    const title = input.value
    this.setState({
      title,
      path: this.generatePath(title, data)
    })
  }

  onChangePath = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target
    const path = input.value.startsWith('/') ? input.value : `/${input.value}`
    const sanitisedPath = path.replace(/\s/g, '-')
    this.setState({
      path: sanitisedPath
    })
  }

  conditionSelected = (selectedCondition) => {
    this.setState({
      selectedCondition
    })
  }

  editSection = (e: MouseEvent<HTMLAnchorElement>, section) => {
    e.preventDefault()
    this.setState({
      section,
      isEditingSection: true
    })
  }

  closeFlyout = (sectionName) => {
    const propSection = this.state.section ?? {}
    this.setState({
      isEditingSection: false,
      section: sectionName ? this.findSectionWithName(sectionName) : propSection
    })
  }

  render() {
    const { data } = this.context
    const { sections, pages } = data
    const {
      pageType,
      linkFrom,
      title,
      section,
      path,
      isEditingSection,
      errors
    } = this.state

    return (
      <>
        {hasValidationErrors(errors) && (
          <ErrorSummary errorList={Object.values(errors)} />
        )}
        <form onSubmit={this.onSubmit} autoComplete="off">
          <div className="govuk-form-group">
            <label className="govuk-label govuk-label--s" htmlFor="page-type">
              {i18n('addPage.pageTypeOption.title')}
            </label>
            <div className="govuk-hint" id="page-type-hint">
              {i18n('addPage.pageTypeOption.helpText')}
            </div>
            <select
              className="govuk-select"
              id="page-type"
              aria-describedby="page-type-hint"
              name="page-type"
              value={pageType}
              onChange={this.onChangePageType}
            >
              <option value="">Question Page</option>
              <option value="./pages/start.js">Start Page</option>
              <option value="./pages/summary.js">Summary Page</option>
            </select>
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
              value={linkFrom}
              onChange={this.onChangeLinkFrom}
            >
              <option value="" />
              {pages.map((page) => (
                <option key={page.path} value={page.path}>
                  {page.path}
                </option>
              ))}
            </select>
          </div>

          {linkFrom && linkFrom.trim() !== '' && (
            <SelectConditions
              path={linkFrom}
              conditionsChange={this.conditionSelected}
              noFieldsHintText={i18n('conditions.noFieldsAvailable')}
            />
          )}

          <Input
            id="page-title"
            name="title"
            label={{
              className: 'govuk-label--s',
              children: [i18n('addPage.pageTitleField.title')]
            }}
            value={title || ''}
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
          {sections.length > 0 && (
            <div className="govuk-form-group">
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
                value={section?.name}
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
            {section?.name && (
              <a
                href="#"
                className="govuk-link govuk-!-display-block"
                onClick={this.editSection}
              >
                Edit section
              </a>
            )}
            <a
              href="#"
              className="govuk-link govuk-!-display-block"
              onClick={this.editSection}
            >
              Create section
            </a>
          </p>

          <div className="govuk-button-group">
            <button type="submit" className="govuk-button">
              Save
            </button>
          </div>
        </form>
        {isEditingSection && (
          <RenderInPortal>
            <Flyout
              title={
                section?.name ? `Editing ${section.name}` : 'Add a new section'
              }
              onHide={this.closeFlyout}
            >
              <SectionEdit section={section} onEdit={this.closeFlyout} />
            </Flyout>
          </RenderInPortal>
        )}
      </>
    )
  }
}
