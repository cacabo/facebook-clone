// Action Creators

// import * as types from './types';

// Dispatch a login action
export function login(username) {
  return {
    type: "LOGIN",
    username,
  };
}

export function logout() {
  return {
    type: "LOGOUT",
  };
}
