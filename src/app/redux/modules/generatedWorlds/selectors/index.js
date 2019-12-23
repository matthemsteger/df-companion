import {map} from 'ramda';
import {
	memoizedFindFactory,
	memoizedFilterFactory,
	createSelector,
	createStandardAllSelector,
	createLocalizedSelector
} from '@matthemsteger/redux-utils-fn-selectors';
import reducer from './../reducer';

const selectLocalState = createLocalizedSelector(reducer);

const [
	selectGeneratedWorlds,
	selectPendingGeneratedWorlds,
	selectErroredGeneratedWorlds,
	selectWorldSitesAndPops
] = map(createStandardAllSelector(selectLocalState), [
	'generatedWorlds',
	'pendingGeneratedWorlds',
	'erroredGeneratedWorlds',
	'worldSitesAndPops'
]);

export {
	selectGeneratedWorlds,
	selectPendingGeneratedWorlds,
	selectErroredGeneratedWorlds,
	selectWorldSitesAndPops
};

export const selectGeneratedWorldById = createSelector(
	selectGeneratedWorlds,
	memoizedFindFactory('id')
);
export const selectGeneratedWorldsByInstallId = createSelector(
	selectGeneratedWorlds,
	memoizedFilterFactory('dwarfFortressInstallId')
);
export const selectWorldSitesAndPopById = createSelector(
	selectWorldSitesAndPops,
	memoizedFindFactory('id')
);
