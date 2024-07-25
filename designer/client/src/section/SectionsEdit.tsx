import { type Section } from '@defra/forms-model'
import React, { Component, type ContextType, type MouseEvent } from 'react'

import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { SectionEdit } from '~/src/section/SectionEdit.jsx'

type Props = Record<string, never>

interface State {
  isEditingSection?: boolean
  section?: Section
}

export class SectionsEdit extends Component<Props, State> {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  state: State = {}

  onClickSection = (e: MouseEvent, section?: Section) => {
    e.preventDefault()

    this.setState({
      section,
      isEditingSection: true
    })
  }

  closeFlyout = (sectionName?: string) => {
    const { section } = this.state

    this.setState({
      isEditingSection: false,
      section: sectionName ? this.findSectionWithName(sectionName) : section
    })
  }

  findSectionWithName(name?: string) {
    const { data } = this.context
    const { sections } = data
    return sections.find((section) => section.name === name)
  }

  render() {
    const { data } = this.context
    const { sections } = data
    const { section, isEditingSection } = this.state

    return (
      <>
        <ul className="govuk-list govuk-list--bullet">
          {sections.map((section) => (
            <li key={section.name}>
              <a
                className="govuk-link"
                href="#"
                onClick={(e) => this.onClickSection(e, section)}
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
            Add section
          </button>
        </div>

        {isEditingSection && (
          <RenderInPortal>
            <Flyout
              title={
                section?.name ? `Editing ${section.name}` : 'Add a new section'
              }
              show={isEditingSection}
              onHide={() => this.closeFlyout()}
            >
              <SectionEdit section={section} onEdit={this.closeFlyout} />
            </Flyout>
          </RenderInPortal>
        )}
      </>
    )
  }
}
