import {memoizedFindFactory, createSelector, createStandardAllSelectors} from './../../../selectorUtilities';
import DwarfFortressInstall from './../dwarfFortressInstall';
import selectLocalState from './selectLocalState';

export {selectLocalState};
export {default as selectActiveInstallId} from './selectActiveInstallId';
const {selectInstalls, selectInstallsRaw} = createStandardAllSelectors(selectLocalState, ['installs', DwarfFortressInstall]);
export {selectInstalls, selectInstallsRaw};
export const selectInstallById = createSelector(selectInstalls, memoizedFindFactory('id'));
