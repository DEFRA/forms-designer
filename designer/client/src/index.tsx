import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Designer from '~/src/designer.jsx'
import { initI18n } from '~/src/i18n/index.js'
import { SaveError } from '~/src/pages/ErrorPages/index.js'

initI18n()

export class App extends React.Component {
  render() {
    return (
      <Router basename="/forms-designer/app">
        <div id="app">
          <Switch>
            <Route path="/:id/editor" component={Designer} />
            <Route path="/save-error" exact>
              <SaveError />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
