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

  const persistor = persistStore(
    store,
    null,
    () => store.getState()
  );

  return { persistor, store };
}

// return new Promise((resolve, reject) => {
//   try {
//     const store = createStore(
//       rootReducer,
//       undefined,
//       compose(
//         applyMiddleware(...middlewares),
//       ),
//     );
//
//     persistStore(
//       store,
//       null,
//       () => store.getState()
//     );
//   } catch (e) {
//     reject(e);
//   }
// });
