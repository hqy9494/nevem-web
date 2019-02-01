import {createSelector} from "reselect";

const selectGlobal = (state) => state.get('global');

const makeSelectClient = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('client')
);

const makeUserFetchState = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('userFetchState')
);


export {
  selectGlobal,
  makeSelectClient,
  makeUserFetchState
};
