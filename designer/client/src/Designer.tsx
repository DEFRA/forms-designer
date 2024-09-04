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
  data: FormDefinition
  meta: FormMetadata
  previewUrl: string
}

interface State {
  flyoutCount: number
  data: FormDefinition
  meta: FormMetadata
}

export class Designer extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { data, meta } = this.props

    this.state = {
      data,
      meta,
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
    const { meta } = this.props
    const definition = await form.get(meta.id)

    this.setState({
      data: definition
    })

    return definition
  }

  save = async (definition: FormDefinition) => {
    const { meta } = this.props

    // Fix incorrect start page
    const updated = updateStartPage(definition)

    // Save and return form definition
    await form.save(meta.id, updated)
    return this.get()
  }

  render() {
    const { previewUrl } = this.props
    const { data, meta, flyoutCount } = this.state

    const flyoutContextProviderValue = {
      count: flyoutCount,
      increment: this.incrementFlyoutCounter,
      decrement: this.decrementFlyoutCounter
    }

    const dataContextProviderValue = {
      data,
      meta,
      previewUrl,
      save: this.save
    }

    return (
      <DataContext.Provider value={dataContextProviderValue}>
        <FlyoutContext.Provider value={flyoutContextProviderValue}>
          <div className="govuk-width-container">
            <Menu />
          </div>
          <Visualisation />
        </FlyoutContext.Provider>
      </DataContext.Provider>
    )
  }
}
