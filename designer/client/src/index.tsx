import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Designer from '~/src/designer.jsx'
import { initI18n } from '~/src/i18n/index.js'
import { SaveError } from '~/src/pages/ErrorPages/index.js'

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

export class App extends React.Component {
  render() {
    return (
      <Router basename="/editor">
        <Switch>
          <Route path="/:id" component={Designer} />
          <Route path="/save-error" exact>
            <SaveError />
          </Route>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.querySelector('.app-editor'))
