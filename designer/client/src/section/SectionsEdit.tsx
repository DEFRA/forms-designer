import { Component, type ContextType, type MouseEvent } from 'react'

import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { findSection } from '~/src/data/section/findSection.js'
import { i18n } from '~/src/i18n/i18n.jsx'
import { SectionEdit } from '~/src/section/SectionEdit.jsx'

type Props = Record<string, never>

interface State {
  selectedSection?: string
  isEditingSection?: boolean
}

export class SectionsEdit extends Component<Props, State> {
  declare context: ContextType<typeof DataContext>
  static readonly contextType = DataContext

  state: State = {}

  onClickSection = (e: MouseEvent, selectedSection?: string) => {
    e.preventDefault()

    this.setState({
      selectedSection,
      isEditingSection: true
    })
  }

  closeFlyout = (sectionName?: string) => {
    this.setState({
      selectedSection: sectionName,
      isEditingSection: false
    })
  }

  render() {
    const { data } = this.context
    const { selectedSection, isEditingSection } = this.state

    const { sections } = data

    // Find section by name
    const section =
      isEditingSection && selectedSection
        ? findSection(data, selectedSection)
        : undefined

    return (
      <>
        <ul className="govuk-list govuk-list--bullet">
          {sections.map((section) => (
            <li key={section.name}>
              <a
                className="govuk-link"
                href="#section-edit"
                onClick={(e) => this.onClickSection(e, section.name)}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
        <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
        <div className="govuk-button-group">
          <button
            className="govuk-button"
            type="button"
            onClick={(e) => this.onClickSection(e)}
          >
            {i18n('section.add')}
          </button>
        </div>

        {isEditingSection && (
          <RenderInPortal>
            <Flyout
              id="section-edit"
              title={
                section
                  ? i18n('section.editTitle', { title: section.title })
                  : i18n('section.add')
              }
              onHide={this.closeFlyout}
            >
              <SectionEdit section={section} onSave={this.closeFlyout} />
            </Flyout>
          </RenderInPortal>
        )}
      </>
    )
  }
}
