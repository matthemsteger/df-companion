import R from 'ramda';
import {createSelector} from './../../selectorUtilities';
import {selectGeneratedWorlds, selectPendingGeneratedWorlds, selectErroredGeneratedWorlds} from './../generatedWorlds';
import {selectActiveInstallId} from './../dwarfFortressInstalls';

const activeInstallFilter = (activeInstallId, worlds) => R.filter(R.propEq('dwarfFortressInstallId', activeInstallId), worlds);

export const selectInstallGeneratedWorlds = createSelector(
	selectActiveInstallId,
	selectGeneratedWorlds,
	activeInstallFilter
);

export const selectInstallPendingGeneratedWorlds = createSelector(
	selectActiveInstallId,
	selectPendingGeneratedWorlds,
	activeInstallFilter
);

export const selectInstallErroredGeneratedWorlds = createSelector(
	selectActiveInstallId,
	selectErroredGeneratedWorlds,
	activeInstallFilter
);
