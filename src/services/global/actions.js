export const CLIENT_INIT = "client:init";
export const CLIENT_TOKEN = "client:token";
export const USER_FETCH_STATE = "user:fetch";

export function initClient(host) {
  let client = "";
  return {
    type: CLIENT_INIT,
    client
  };
}

export function authClient(token) {
  return {
    type: CLIENT_TOKEN,
    token
  };
}

export function fetchUserState(state) {
  return {
    type: USER_FETCH_STATE,
    state
  };
}
