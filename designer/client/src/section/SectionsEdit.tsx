import React, { Component, type ContextType } from 'react'

import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { SectionEdit } from '~/src/section/SectionEdit.jsx'

export class SectionsEdit extends Component {
  declare context: ContextType<typeof DataContext>
  static contextType = DataContext

  state = {}

  onClickSection = (e, section) => {
    e.preventDefault()
    this.setState({
      section,
      isEditingSection: true
    })
  }

  // TODO:- This is borrowed from PageEdit.jsx. Needs refactor. (hooks hooks hooks)
  closeFlyout = (sectionName) => {
    const propSection = this.state.section ?? this.props.page?.section ?? {}

    this.setState({
      isEditingSection: false,
      section: sectionName ? this.findSectionWithName(sectionName) : propSection
    })
  }

  findSectionWithName(name) {
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
              onHide={this.closeFlyout}
            >
              <SectionEdit section={section} closeFlyout={this.closeFlyout} />
            </Flyout>
          </RenderInPortal>
        )}
      </>
    )
  }
}
