import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Designer from '~/src/designer.jsx'
import { initI18n } from '~/src/i18n/index.js'

initI18n()

function NoMatch() {
  return (
    <>
      <h1 className="govuk-heading-l">Page not found</h1>
      <p className="govuk-body">
        If you typed the web address, check it is correct.
      </p>
      <p className="govuk-body">
        If you pasted the web address, check you copied the entire address.
      </p>
    </>
  )
}

const container = document.querySelector('.app-editor')

export class App extends React.Component {
  render() {
    if (
      !(container instanceof HTMLElement) ||
      !container.dataset.id ||
      !container.dataset.slug ||
      !container.dataset.previewUrl
    ) {
      return <NoMatch />
    }

    // Extract from HTML data-* attributes
    const { id, slug, previewUrl } = container.dataset

    return (
      <Router basename={`/library/${slug}`}>
        <Switch>
          <Route
            path="/editor"
            render={() => (
              <Designer id={id} slug={slug} previewUrl={previewUrl} />
            )}
          />
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </Router>
    )
  }
}

ReactDOM.render(<App />, container)
