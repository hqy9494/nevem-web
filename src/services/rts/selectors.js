import { createSelector } from 'reselect';

const selectSearchResult = (state) => state.get('rts');

const makeResultSelector = () => createSelector(
  selectSearchResult
);

export {
  selectSearchResult
};
