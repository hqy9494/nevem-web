import { cancel, take, select, put, takeLatest } from "redux-saga/effects";
import { LOCATION_CHANGE } from "react-router-redux";
import { CLIENT_TOKEN } from "./actions";
import { authSuccess, authFailure } from "../Auth/actions";
import { fetchUserState } from "../global/actions";
import axios from "axios";
import config from "../../config";

const getme = token => {
  return axios({
    method: "get",
    url: `${config.apiUrl}${config.apiBasePath}/accounts/me`,
    params: {
      access_token: token
    }
  })
    .then(res => {
    localStorage.me =   JSON.stringify(res.data);
      return res.data;

    })
    .catch(err => {
      return null;
    });
};

const getMenu = token => {
  return axios({
    method: "get",
    url: `${config.apiUrl}${config.apiBasePath}/roleMenus`,
    params: {
      access_token: token
    }
  })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return null;
    });
};

/**
 * Github repos request/response handler
 */
export function* clientToken(action) {
  try {
    if (action.token && !action.token.error) {
      localStorage.token = action.token;
      yield put(fetchUserState("fetching"));
      const user = yield getme(action.token);
      const menu = yield getMenu(action.token);
      if (user && menu) {
        user.menu = menu;
      }
      yield put(authSuccess(user));
      yield put(fetchUserState("fetched"));
    } else {
      localStorage.token = null;
      yield put(authSuccess(null));
      yield put(fetchUserState("fetched"));
    }
  } catch (err) {
    yield put(fetchUserState("fetchFailured"));
    yield put(authFailure(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* initToken() {
  const watcher = yield takeLatest(CLIENT_TOKEN, clientToken);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [initToken];
