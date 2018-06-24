import R from 'ramda';
import {memoizedFindFactory, createSelector, createStandardAllSelectors} from './../../../selectorUtilities';
import DwarfFortressInstall from './../dwarfFortressInstall';
import selectLocalState from './selectLocalState';

export {selectLocalState};
export {default as selectActiveInstallId} from './selectActiveInstallId';
const {selectInstallsRaw: selectInstalls} = createStandardAllSelectors(selectLocalState, ['installs', DwarfFortressInstall]);
export {selectInstalls};
export const selectInstallById = createSelector(selectInstalls, memoizedFindFactory('id'));
export const selectCreateInstallPending = createSelector(selectLocalState, R.prop('createInstallPending'));
export const selectTimesInstallsFetched = createSelector(selectLocalState, R.prop('timesInstallsFetched'));
export * from './checkedPaths';
