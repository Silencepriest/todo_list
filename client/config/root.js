/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom'

import Home from '../components/home'
import DummyView from '../components/dummy-view'
import NotFound from '../components/404'
import ShowCategory from '../components/show-category'
import CategoryList from '../components/categoryList'
import store from '../redux'

import Startup from './startup'

const OnlyAnonymousRoute = ({ component: Component, ...rest }) => {
  const func = (props) =>
    !!rest.user && !!rest.user.name && !!rest.token ? (
      <Redirect to={{ pathname: '/' }} />
    ) : (
      <Component {...props} />
    )
  return <Route {...rest} render={func} />
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  const func = (props) =>
    !!rest.user && !!rest.user.name && !!rest.token ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/login'
        }}
      />
    )
  return <Route {...rest} render={func} />
}

const types = {
  component: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string
  }),
  token: PropTypes.string
}

const defaults = {
  location: {
    pathname: ''
  },
  user: null,
  token: ''
}

OnlyAnonymousRoute.propTypes = types
PrivateRoute.propTypes = types

PrivateRoute.defaultProps = defaults
OnlyAnonymousRoute.defaultProps = defaults

const RootComponent = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Startup>
          <Switch>
            <Route exact path="/" component={() => <CategoryList />} />
            <Route exact path="/dashboard" component={() => <Home />} />
            <Route exact path="/:categoryName">
              <ShowCategory />
            </Route>
            <Route exact path="/:categoryName/:timeToDisplay">
              <ShowCategory />
            </Route>
            <PrivateRoute exact path="/hidden-route" component={() => <DummyView />} />
            <Route component={() => <NotFound />} />
          </Switch>
        </Startup>
      </BrowserRouter>
    </Provider>
  )
}

export default RootComponent
