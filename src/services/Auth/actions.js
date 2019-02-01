export const AUTH_REQUEST = 'auth:request';
export const AUTH_SUCCESS = 'auth:success';
export const AUTH_FAILURE = 'auth:failure';
export const AUTH_LOGOUT = 'auth:logout';
export const AUTH_LOGOUT_FAILURE = 'auth:logout:failure';

export function authRequest(creds) {
  return {
    type: AUTH_REQUEST,
    creds
  };
}

export function authSuccess(user) {
  return {
    type: AUTH_SUCCESS,
    user
  };
}

export function authLogout() {
  return {
    type: AUTH_LOGOUT
  };
}

export function authLogoutFailure(error) {
  return {
    type: AUTH_LOGOUT_FAILURE,
    error
  };
}

export function authFailure(error) {
  return {
    type: AUTH_FAILURE,
    error
  };
}
