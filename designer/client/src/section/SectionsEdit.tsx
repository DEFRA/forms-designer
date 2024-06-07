import React, { Component } from 'react'

import { Flyout } from '~/src/components/Flyout/Flyout.jsx'
import { RenderInPortal } from '~/src/components/RenderInPortal/RenderInPortal.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { SectionEdit } from '~/src/section/SectionEdit.jsx'

export class SectionsEdit extends Component {
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
        <ul className="govuk-list">
          {sections.map((section) => (
            <li key={section.name}>
              <a href="#" onClick={(e) => this.onClickSection(e, section)}>
                {section.title}
              </a>
            </li>
          ))}
          <li>
            <hr />
            <a href="#" onClick={(e) => this.onClickSection(e)}>
              Add section
            </a>
          </li>
        </ul>

        {isEditingSection && (
          <RenderInPortal>
            <Flyout
              title={
                section?.name ? `Editing ${section.name}` : 'Add a new section'
              }
              show={isEditingSection}
              onHide={this.closeFlyout}
            >
              <SectionEdit
                section={section}
                data={data}
                closeFlyout={this.closeFlyout}
              />
            </Flyout>
          </RenderInPortal>
        )}
      </>
    )
  }
}
