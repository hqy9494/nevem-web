import {cancel, put, take, select, takeLatest} from "redux-saga/effects";
import {LOCATION_CHANGE} from "react-router-redux";
import {AUTH_REQUEST, authFailure, AUTH_LOGOUT, authLogoutFailure} from "./actions";
import {authClient} from "../global/actions";
import axios from 'axios';
import config from "../../config"

const loginRts = (data) => {
  return axios({
    method: 'post',
    url: `${config.apiUrl}${config.apiBasePath}/accounts/login`,
    data: data
  })
    .then(res => {
      return res.data
    })
    .catch(err => {
      let error = err.response.data.error;
      return {error: error.msg || error.message || '系统出错'}
    })
}

const loginRtsCode = (data) => {
  return axios({
    method: 'post',
    url: `${config.apiUrl}${config.apiBasePath}/Logins/mobile/code`,
    data: data
  })
    .then(res => {
      return res.data
    })
    .catch(err => {
      let error = err.response.data.error;
      return {error: error.msg || error.message || '系统出错'}
    })
}

/**
 * Github repos request/response handler
 */

export function* authenticate(action) {
  try {

    const result = yield loginRtsCode(action.creds);
    // const result = yield loginRts(action.creds);

    yield put(authClient(result.id || result));
  } catch (err) {
    yield put(authFailure(err));
  }
}

export function* unAuthenticate(action) {
  try {
    localStorage.token = null;
    yield put(authClient());
  } catch (err) {
    yield put(authLogoutFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* login() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  const watcher = yield takeLatest(AUTH_REQUEST, authenticate);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export function* logout() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  const watcher = yield takeLatest(AUTH_LOGOUT, unAuthenticate);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  login, logout
];
