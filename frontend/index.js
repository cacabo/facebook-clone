import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import logger from 'redux-logger';

import './assets/stylesheets/base.scss';

const store = createStore(
  rootReducer,
  applyMiddleware(logger),
);

// Listen for changes
console.log("Store configured");

// Dispatch example events
store.dispatch({ type: "LOGIN", username: "cameron" });
store.dispatch({ type: "LOGOUT" });

render(
  <Root store={store} />,
  document.getElementById('root')
);
