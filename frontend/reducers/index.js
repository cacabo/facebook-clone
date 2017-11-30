// Default values for the program state
const defaults = {
  username: "",
  isLoggedIn: false,
};

// Construct the root reducer function
function rootReducer(prevState = defaults, action) {
  // Switch statement on the type of actions
  switch (action.type) {
    case "LOGIN":
      const loginState = {
        ...prevState,
        username: action.username,
        isLoggedIn: true,
      };
      return loginState;
    case "LOGOUT":
      return defaults;
    default:
      return prevState;
  }
}

export default rootReducer;
