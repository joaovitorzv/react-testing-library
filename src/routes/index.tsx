import React from 'react'
import {
  Switch,
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import NotFound from './NotFound'
import Search from './Search'

const Routes: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Search} />
        <Route path='*' component={NotFound} />
      </Switch>
    </Router>
  )
}

export default Routes;