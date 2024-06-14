import { type FormDefinition } from '@defra/forms-model'
import React, { Component } from 'react'

import { Menu } from '~/src/components/Menu/Menu.jsx'
import { Visualisation } from '~/src/components/Visualisation/Visualisation.jsx'
import { DataContext } from '~/src/context/DataContext.js'
import { FlyoutContext } from '~/src/context/FlyoutContext.js'
import * as form from '~/src/lib/form.js'

interface Props {
  id: string
  slug: string
  previewUrl: string
}

interface State {
  flyoutCount?: number
  loading?: boolean
  data?: FormDefinition
}

export class Designer extends Component<Props, State> {
  state: State = { loading: true, flyoutCount: 0 }

  get id() {
    return this.props.id
  }

  get slug() {
    return this.props.slug
  }

  get previewUrl() {
    return this.props.previewUrl
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
    const definition = await form.get(this.id)

    this.setState({
      data: definition
    })

    return definition
  }

  save = async (definition: FormDefinition) => {
    await form.save(this.id, definition)
    return this.get()
  }

  async componentDidMount() {
    await this.get()

    this.setState({
      loading: false
    })
  }

  render() {
    const { flyoutCount, data, loading } = this.state
    if (loading) {
      return <p className="govuk-body">Loading ...</p>
    }

    const flyoutContextProviderValue = {
      count: flyoutCount,
      increment: this.incrementFlyoutCounter,
      decrement: this.decrementFlyoutCounter
    }
    const dataContextProviderValue = { data, save: this.save }
    return (
      <DataContext.Provider value={dataContextProviderValue}>
        <FlyoutContext.Provider value={flyoutContextProviderValue}>
          <div id="designer">
            <Menu id={this.id} />
            <Visualisation
              id={this.id}
              slug={this.slug}
              previewUrl={this.previewUrl}
            />
          </div>
        </FlyoutContext.Provider>
      </DataContext.Provider>
    )
  }
}
