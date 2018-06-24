import selectLocalState from './selectLocalState';
import {memoizedFindFactory, createSelector, createStandardAllSelector} from './../../../selectorUtilities';

export const selectCheckedPaths = createStandardAllSelector('checkedPaths', selectLocalState);
export const selectCheckedPathByPath = createSelector(selectCheckedPaths, memoizedFindFactory('path'));
