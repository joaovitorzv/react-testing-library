import React from 'react'
import {
  Switch,
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import SearchAddress from './SearchAddress'

const Routes: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' component={SearchAddress} />
      </Switch>
    </Router>
  )
}

export default Routes;