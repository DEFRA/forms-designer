import {
  updateStartPage,
  type FormDefinition,
  type FormMetadata
} from '@defra/forms-model'
import React, { Component } from 'react'

import { Menu } from '~/src/components/Menu/Menu.jsx'
import { Visualisation } from '~/src/components/Visualisation/Visualisation.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { FlyoutContext } from '~/src/context/FlyoutContext.js'
import * as form from '~/src/lib/form.js'

interface Props {
  metadata: FormMetadata
  definition: FormDefinition
  previewUrl: string
}

interface State {
  flyoutCount?: number
  data?: FormDefinition
}

export class Designer extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { definition } = this.props

    this.state = {
      data: definition,
      flyoutCount: 0
    }
  }

  incrementFlyoutCounter = () => {
    let currentCount = this.state.flyoutCount
    this.setState({ flyoutCount: ++currentCount })
  }

  decrementFlyoutCounter = () => {
    let currentCount = this.state.flyoutCount
    this.setState({ flyoutCount: --currentCount })
  }

  get = async () => {
    const { metadata } = this.props
    const definition = await form.get(metadata.id)

    this.setState({
      data: definition
    })

    return definition
  }

  save = async (definition: FormDefinition) => {
    const { metadata } = this.props

    // Fix incorrect start page
    const updated = updateStartPage(definition)

    // Save and return form definition
    await form.save(metadata.id, updated)
    return this.get()
  }

  render() {
    const { metadata, previewUrl } = this.props
    const { data, flyoutCount } = this.state

    const flyoutContextProviderValue = {
      count: flyoutCount,
      increment: this.incrementFlyoutCounter,
      decrement: this.decrementFlyoutCounter
    }
    const dataContextProviderValue = { data, save: this.save }
    return (
      <DataContext.Provider value={dataContextProviderValue}>
        <FlyoutContext.Provider value={flyoutContextProviderValue}>
          <div className="govuk-width-container">
            <Menu slug={metadata.slug} />
          </div>
          <Visualisation slug={metadata.slug} previewUrl={previewUrl} />
        </FlyoutContext.Provider>
      </DataContext.Provider>
    )
  }
}
