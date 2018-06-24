import R from 'ramda';
import {createSelector, memoizedFindFactory} from './../../../selectorUtilities';
import selectLocalState from './selectLocalState';

export {selectLocalState};

export const selectCreatureRawStatuses = createSelector(selectLocalState, R.prop('creaturesStatusByInstallId'));

export const selectCreaturesRawStatusByInstallId = createSelector(selectCreatureRawStatuses, memoizedFindFactory('id'));
export const selectLoadedOrPendingCreatureRawInstallIds = createSelector(selectCreatureRawStatuses, R.compose(R.prop('installId'), R.filter(R.or(R.propEq('loaded', true), R.propEq('pending', true)))));
export const selectUnloadedCreatureRawInstalls = createSelector(selectCreatureRawStatuses, R.filter(R.and(R.propEq('loaded', false), R.propEq('pending', false))));

// whether raws are loaded is a combination of if the calculated saved raws
// hash matches the composite hash of all raws of a file type
// will get raws hash by md5 hash
