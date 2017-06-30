import {createSelector} from './../../../selectorUtilities';
import selectLocalState from './selectLocalState';

export default createSelector([selectLocalState], (state) => state.activeInstallId);
