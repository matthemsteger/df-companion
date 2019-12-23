import R from 'ramda';
import {createSelector} from '@matthemsteger/redux-utils-fn-selectors';
import selectLocalState from './selectLocalState';

export default createSelector(selectLocalState, R.prop('activeInstallId'));
