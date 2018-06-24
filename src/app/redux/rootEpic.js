import {combineEpics} from 'redux-most';
import R from 'ramda';
import backgroundWorkerEpic from './backgroundWorkerEpic';
import {epics as dwarfFortressInstallsEpics} from './modules/dwarfFortressInstalls';
import {epics as rawsEpics} from './modules/raws';
import {epics as rawFileEpics} from './modules/rawFiles';

const epics = R.compose(
	R.append(backgroundWorkerEpic),
	R.flatten,
	R.map(R.values)
)([
	dwarfFortressInstallsEpics,
	rawsEpics,
	rawFileEpics
]);

export default combineEpics(epics);
