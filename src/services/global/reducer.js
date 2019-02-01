import {fromJS} from "immutable";
import {CLIENT_INIT, CLIENT_TOKEN, USER_FETCH_STATE} from "./actions";

const initialState = fromJS({});

function globalProviderReducer(state = initialState, action) {
  switch (action.type) {
    case CLIENT_INIT:
      return state
        .set('client', action.client);
    case CLIENT_TOKEN:
      if(action.token && action.token.error) {
        let result = []
        result.push(action.token.error)
        return state
          .set('error', result)
      } else {
        let client = state.get('client');
        return state
          .set('client', client).set('error', []);
      }
    case USER_FETCH_STATE:
      return state
        .set('userFetchState', action.state);
    default:
      return state;
  }
}

export default globalProviderReducer;
