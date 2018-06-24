import R from 'ramda';
import {createSelector} from './../../../selectorUtilities';
import selectLocalState from './selectLocalState';

export default createSelector(selectLocalState, R.prop('activeInstallId'));
