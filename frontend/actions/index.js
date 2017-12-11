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

// Dispatch a logout action
export function logout() {
  return {
    type: "LOGOUT",
  };
}

// Dispatch an update action
export function update(profilePicture) {
  return {
    type: "UPDATE",
    profilePicture,
  };
}
