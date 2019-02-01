import {initClient, authClient} from "../services/global/actions";
import config from "../config";
import sagas from "services/global/sagas";

export default function () {
  this.injectSagas(sagas);
  this.store.dispatch(initClient(config.apiUrl + config.apiBasePath));
  const token = localStorage.token || '';
  if (token) {
    this.store.dispatch(authClient(token));
  } else {
    this.store.dispatch(authClient(null));
  }
}
