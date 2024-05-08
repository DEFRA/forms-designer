import { type FormDefinition } from '@defra/forms-model'
import React, { Component } from 'react'
import { Prompt } from 'react-router-dom'

import { DesignerApi } from '~/src/api/designerApi.js'
import Menu from '~/src/components/Menu/Menu.jsx'
import { Visualisation } from '~/src/components/Visualisation/index.js'
import { FlyoutContext, DataContext } from '~/src/context/index.js'
import { i18n } from '~/src/i18n/index.js'

interface Props {
  id: string
  slug: string
  previewUrl: string
}

interface State {
  flyoutCount?: number
  loading?: boolean
  newConfig?: boolean // TODO - is this required?
  data?: FormDefinition
  page?: any
}

export default class Designer extends Component<Props, State> {
  state: State = { loading: true, flyoutCount: 0 }

  designerApi = new DesignerApi()

  get id() {
    return this.props.id
  }

  get slug() {
    return this.props.slug
  }

  get previewUrl() {
    return this.props.previewUrl
  }

  incrementFlyoutCounter = (callback = () => {}) => {
    let currentCount = this.state.flyoutCount
    this.setState({ flyoutCount: ++currentCount }, callback())
  }

  decrementFlyoutCounter = (callback = () => {}) => {
    let currentCount = this.state.flyoutCount
    this.setState({ flyoutCount: --currentCount }, callback())
  }

  save = async (toUpdate, callback = () => {}) => {
    await this.designerApi.save(this.id, toUpdate)
    this.setState(
      { data: toUpdate }, // optimistic save
      callback()
    )
    return toUpdate
  }

  updatePageContext = (page) => {
    this.setState({ page })
  }

  componentDidMount() {
    this.designerApi.fetchData(this.id).then((data) => {
      this.setState({ loading: false, data })
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
            <Prompt message={i18n('leaveDesigner')} />
            <Menu id={this.id} updatePersona={this.updatePersona} />
            <Visualisation
              id={this.id}
              slug={this.slug}
              previewUrl={this.previewUrl}
              persona={this.state.persona}
            />
          </div>
        </FlyoutContext.Provider>
      </DataContext.Provider>
    )
  }
}
