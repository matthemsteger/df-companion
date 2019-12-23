import {
	memoizedFindFactory,
	createSelector,
	createStandardAllSelector
} from '@matthemsteger/redux-utils-fn-selectors';
import selectLocalState from './selectLocalState';

export const selectCheckedPaths = createStandardAllSelector(
	selectLocalState,
	'checkedPaths'
);
export const selectCheckedPathByPath = createSelector(
	selectCheckedPaths,
	memoizedFindFactory('path')
);
