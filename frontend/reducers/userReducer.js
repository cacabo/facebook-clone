// Default values for the program state
const defaults = {
  username: "",
  profilePicture: "",
  name: "",
  isLoggedIn: false,
};

// Construct the root reducer function
const userReducer = (state = defaults, action) => {
  // Switch statement on the type of actions
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        username: action.username,
        profilePicture: action.profilePicture,
        name: action.name,
        isLoggedIn: true,
      };
    case "LOGOUT":
      return defaults;
    case "UPDATE":
      return {
        ...state,
        name: action.name,
        profilePicture: action.profilePicture,
      };
    default:
      return state;
  }
};

export default userReducer;
