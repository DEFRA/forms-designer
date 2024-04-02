import React from 'react'
import ReactDOM from 'react-dom'
import {
  LandingChoice,
  NewConfig,
  ChooseExisting
} from '~/src/pages/LandingPage/index.js'
import { initI18n } from '~/src/i18n/index.js'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Designer from '~/src/designer.jsx'
import { SaveError } from '~/src/pages/ErrorPages/index.js'

initI18n()

function NoMatch() {
  return <div>404 Not found</div>
}

export class App extends React.Component {
  render() {
    return (
      <Router basename="/forms-designer/app">
        <div id="app">
          <Switch>
            <Route path="/designer/:id" component={Designer} />
            <Route path="/" exact>
              <LandingChoice />
            </Route>
            <Route path="/new" exact>
              <NewConfig />
            </Route>
            <Route path="/choose-existing" exact>
              <ChooseExisting />
            </Route>
            <Route path="/save-error" exact>
              <SaveError />
            </Route>
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
