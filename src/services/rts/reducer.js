import { fromJS, Map } from "immutable";
import { RTS_REQUEST, RTS_RESULT, RTS_ERROR } from "./actions";

const initialState = fromJS({});

function rtsReducer(state = initialState, action) {
  switch (action.type) {
    case RTS_REQUEST:
      if (action.noSpin) {
        return state;
      } else {
        return state.set("spin", true);
      }
    case RTS_RESULT:
      if (action.data && action.data.error) {
        let result = state.get("error") || [];
        result.push(action.data.error);
        let mObj = {};
        mObj["error"] = result;
        mObj["spin"] = false;
        mObj["errLen"] = result.length;
        return state.merge(Map(mObj));
      } else {
        let result = state.get(action.field) || {};
        result[action.dataUUID] = action.data;
        let mObj = {};
        mObj[action.field] = result;
        mObj["uuid"] = new Date().getTime();
        mObj["spin"] = false;
        return state.merge(Map(mObj));
      }
    case RTS_ERROR:
      return state.set("error", action.error);
    default:
      return state;
  }
}

export default rtsReducer;
