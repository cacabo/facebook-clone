import { createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import { rootReducer } from './reducers/index';
import logger from 'redux-logger';

export default function configureStore() {
  // Use the desired middlewares
  const store = createStore(
    rootReducer,
    applyMiddleware(logger),
  );

  // Create a persistor for persistent state
  const persistor = persistStore(
    store,
    null,
    () => store.getState()
  );

  // Return the persistor and store
  return { persistor, store };
}
