import {compose, values, prop} from 'ramda';
import {
	memoizedFindFactory,
	createSelector
} from '@matthemsteger/redux-utils-fn-selectors';
import selectLocalState from './selectLocalState';

export {selectLocalState};

export const selectRawFiles = createSelector(
	selectLocalState,
	compose(
		values,
		prop('rawFilesById')
	)
);
export const selectRawFilesByInstallId = createSelector(
	selectRawFiles,
	memoizedFindFactory('installId')
);
export const selectCombinedHashesByInstallId = createSelector(
	selectLocalState,
	prop('combinedHashesByInstallId')
);
