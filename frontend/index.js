import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import logger from 'redux-logger';
import { persistStore } from 'redux-persist';
import Root from './containers/Root';


import './assets/stylesheets/base.scss';

// Create the redux store
const store = createStore(
  rootReducer,
  applyMiddleware(logger),
);

// Persist store allows redux state to not reset when page refresh
const persistor = persistStore(
  store,
  null,
  () => store.getState()
);

render(
  <Root store={store} persistor={persistor} />,
  document.getElementById('root')
);
