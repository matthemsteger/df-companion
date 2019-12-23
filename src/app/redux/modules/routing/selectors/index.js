import {prop} from 'ramda';
import {createSelector} from '@matthemsteger/redux-utils-fn-selectors';
import selectLocalState from './selectLocalState';

export {selectLocalState};
export const selectRouteType = createSelector(selectLocalState, prop('type'));
