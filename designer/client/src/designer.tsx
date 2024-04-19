import { type FormDefinition } from '@defra/forms-model'
import React, { Component } from 'react'
import { Prompt } from 'react-router-dom'

import { DesignerApi } from '~/src/api/designerApi.js'
import Menu from '~/src/components/Menu/Menu.jsx'
import { Visualisation } from '~/src/components/Visualisation/index.js'
import { FeatureFlagProvider } from '~/src/context/FeatureFlagContext.jsx'
import { FlyoutContext, DataContext } from '~/src/context/index.js'
import { i18n } from '~/src/i18n/index.js'

interface Props {
  match?: any
  location?: any
  history?: any
}

interface State {
  id?: any
  flyoutCount?: number
  loading?: boolean
  error?: string // not using as of now
  newConfig?: boolean // TODO - is this required?
  data?: FormDefinition
  page?: any
}

export default class Designer extends Component<Props, State> {
  state = { loading: true, flyoutCount: 0 }

  designerApi = new DesignerApi()

  get id() {
    return this.props.match?.params?.id
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
    try {
      // TODO update once forms manager support this functionality, for now leave it client-side
      // await this.designerApi.save(this.id, toUpdate)
      this.setState(
        {
          data: toUpdate, // optimistic save
          error: undefined
        },
        callback()
      )
      return toUpdate
    } catch (e) {
      this.setState({ error: e.message })
      this.props.history.push({
        pathname: '/save-error',
        state: { id: this.id }
      })
    }
  }

  updatePageContext = (page) => {
    this.setState({ page })
  }

  componentDidMount() {
    const id = this.props.match?.params?.id
    this.setState({ id })
    this.designerApi.fetchData(id).then((data) => {
      this.setState({ loading: false, data })
    })
  }

  render() {
    const { flyoutCount, data, loading, error } = this.state
    const { previewUrl } = window
    if (loading) {
      return <p>Loading ...</p>
    }

    const flyoutContextProviderValue = {
      count: flyoutCount,
      increment: this.incrementFlyoutCounter,
      decrement: this.decrementFlyoutCounter
    }
    const dataContextProviderValue = { data, save: this.save }
    return (
      <FeatureFlagProvider>
        <DataContext.Provider value={dataContextProviderValue}>
          <FlyoutContext.Provider value={flyoutContextProviderValue}>
            <div id="designer">
              <Prompt when={!error} message={i18n('leaveDesigner')} />
              <Menu id={this.id} updatePersona={this.updatePersona} />
              <Visualisation
                persona={this.state.persona}
                id={this.id}
                previewUrl={previewUrl}
              />
            </div>
          </FlyoutContext.Provider>
        </DataContext.Provider>
      </FeatureFlagProvider>
    ) //
  }
}
