import {prop} from 'ramda';
import {
	memoizedFindFactory,
	createSelector,
	createStandardAllSelector
} from '@matthemsteger/redux-utils-fn-selectors';
import selectLocalState from './selectLocalState';

export {selectLocalState};
export {default as selectActiveInstallId} from './selectActiveInstallId';
const selectInstalls = createStandardAllSelector(selectLocalState, 'installs');
export {selectInstalls};
export const selectInstallById = createSelector(
	selectInstalls,
	memoizedFindFactory('id')
);
export const selectCreateInstallPending = createSelector(
	selectLocalState,
	prop('createInstallPending')
);
export const selectTimesInstallsFetched = createSelector(
	selectLocalState,
	prop('timesInstallsFetched')
);
export * from './checkedPaths';
