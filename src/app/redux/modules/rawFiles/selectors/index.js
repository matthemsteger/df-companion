import R from 'ramda';
import {createSelector, memoizedFindFactory} from './../../../selectorUtilities';
import selectLocalState from './selectLocalState';

export {selectLocalState};

export const selectRawFiles = createSelector(selectLocalState, R.compose(R.values, R.prop('rawFilesById')));
export const selectRawFilesByInstallId = createSelector(selectRawFiles, memoizedFindFactory('installId'));
export const selectCombinedHashesByInstallId = createSelector(selectLocalState, R.prop('combinedHashesByInstallId'));
