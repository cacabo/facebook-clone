// Action Creators

// import * as types from './types';

// Dispatch a login action
export function login(username, profilePicture) {
  return {
    type: "LOGIN",
    username,
    profilePicture,
  };
}

export function logout() {
  return {
    type: "LOGOUT",
  };
}
