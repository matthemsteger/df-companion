import {combineReducers} from 'redux';
import globalErrors from './modules/globalErrors';
import dwarfFortressInstalls from './modules/dwarfFortressInstalls';

export default combineReducers({
	globalErrors,
	dwarfFortressInstalls
});
