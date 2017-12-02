// Frameworks necessary for state persistance
import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

// Import reducers from other files
import userReducer from './userReducer';

// Configuration necessary for state persistance
const config = {
  key: 'primary',
  storage
};

// Root reducer combines all separate reducers and calls the appropriate one
const rootReducer = persistCombineReducers(config, {
  userState: userReducer,
});

export default rootReducer;
