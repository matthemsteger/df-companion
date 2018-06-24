import R from 'ramda';
import {createSelector} from './../../../selectorUtilities';
import selectLocalState from './selectLocalState';

export {selectLocalState};
export const selectRouteType = createSelector(selectLocalState, R.prop('type'));
