import {memoizedFindFactory, memoizedFilterFactory, createSelector, createLocalizeSelector, createStandardAllSelectors} from './../../../selectorUtilities';
import reducer from './../generatedWorldsReducer';
import GeneratedWorld from './../generatedWorld';
import PendingGeneratedWorld from './../pendingGeneratedWorld';
import ErroredGeneratedWorld from './../erroredGeneratedWorld';
import WorldSitesAndPops from './../worldSitesAndPops';

const selectLocalState = createLocalizeSelector(reducer);

const {
	selectGeneratedWorlds,
	selectGeneratedWorldsRaw,
	selectPendingGeneratedWorlds,
	selectPendingGeneratedWorldsRaw,
	selectErroredGeneratedWorlds,
	selectErroredGeneratedWorldsRaw,
	selectWorldSitesAndPops,
	selectWorldSitesAndPopsRaw
} = createStandardAllSelectors(selectLocalState,
	['generatedWorlds', GeneratedWorld],
	['pendingGeneratedWorlds', PendingGeneratedWorld],
	['erroredGeneratedWorlds', ErroredGeneratedWorld],
	['worldSitesAndPops', WorldSitesAndPops]
);

export {
	selectGeneratedWorlds,
	selectGeneratedWorldsRaw,
	selectPendingGeneratedWorlds,
	selectPendingGeneratedWorldsRaw,
	selectErroredGeneratedWorlds,
	selectErroredGeneratedWorldsRaw,
	selectWorldSitesAndPops,
	selectWorldSitesAndPopsRaw
};


export const selectGeneratedWorldById = createSelector([selectGeneratedWorlds], memoizedFindFactory('id'));
export const selectGeneratedWorldsByInstallId = createSelector([selectGeneratedWorlds], memoizedFilterFactory('dwarfFortressInstallId'));
export const selectWorldSitesAndPopById = createSelector([selectWorldSitesAndPops], memoizedFindFactory('id'));
