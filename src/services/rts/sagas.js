import { cancel, put, take, takeEvery } from "redux-saga/effects";
import { LOCATION_CHANGE } from "react-router-redux";
import { RTS_REQUEST, rtsResult, rtsError, rtsRequest } from "./actions";

import axios from "axios";
import config from "../../config";
axios.defaults.baseURL = `${config.apiUrl}${config.apiBasePath}`;

const search = filter => {
	let xAgentId;
	if(localStorage.xAgentData){
		xAgentId = JSON.parse(localStorage.xAgentData).id;
	}
  let request = Object.assign({}, filter, xAgentId?{
    headers: { 'Authorization': localStorage.token,'x-agent-id':xAgentId }
  }:{
    headers: { 'Authorization': localStorage.token }
  });
  return axios(request)
    .then(res => {
      return res.data;
    })
    .catch(err => {
      let error = err.response.data.error;
      if(filter.error && typeof filter.error === "function"){
        filter.error(error);
      }
      return { error: error.msg || error.message || "系统出错" };
    });
};

const cbFilterMarker = (filter, data) => {
  if (filter && typeof filter === "function") {
    return filter(data);
  } else {
    return filter;
  }
};

/**
 * Github repos request/response handler
 */
export function* rtsSaga(action) {
  try {
    let { filter, dataUUID, field, cb, noSpin } = action;
    const result = yield search(filter);
    yield put(rtsResult(result, dataUUID, field));
    if (result && !result.error && cb && typeof cb === "object") {
      yield put(
        rtsRequest(
          cbFilterMarker(cb.filter, result),
          cb.uuid,
          cb.field,
          cb["cb"],
          noSpin
        )
      );
    } else if (result && !result.error && cb && typeof cb === "function") {
      yield cb(result);
    }
  } catch (err) {
    yield put(rtsError(err, action.dataUUID));
  }
}

export function* rts() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  const watcher = yield takeEvery(RTS_REQUEST, rtsSaga);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [rts];
