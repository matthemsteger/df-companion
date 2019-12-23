import {prop, propEq, compose, filter, or, and} from 'ramda';
import {
	memoizedFindFactory,
	createSelector
} from '@matthemsteger/redux-utils-fn-selectors';
import selectLocalState from './selectLocalState';

export {selectLocalState};

export const selectCreatureRawStatuses = createSelector(
	selectLocalState,
	prop('creaturesStatusByInstallId')
);

export const selectCreaturesRawStatusByInstallId = createSelector(
	selectCreatureRawStatuses,
	memoizedFindFactory('id')
);

export const selectLoadedOrPendingCreatureRawInstallIds = createSelector(
	selectCreatureRawStatuses,
	compose(
		prop('installId'),
		filter(or(propEq('loaded', true), propEq('pending', true)))
	)
);

export const selectUnloadedCreatureRawInstalls = createSelector(
	selectCreatureRawStatuses,
	filter(and(propEq('loaded', false), propEq('pending', false)))
);

// whether raws are loaded is a combination of if the calculated saved raws
// hash matches the composite hash of all raws of a file type
// will get raws hash by md5 hash
