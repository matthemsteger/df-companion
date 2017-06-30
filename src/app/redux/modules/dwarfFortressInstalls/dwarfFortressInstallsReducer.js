import R from 'ramda';
import {handleStandardAdd, handleStandardRemove, handleStandardReceive, createReducer} from './../../utils';
import constants from './dwarfFortressInstallsConstants';

const initialState = {
	installsById: {},
	installs: [],
	activeInstallId: undefined
};

const resourceName = 'installs';

export default createReducer(initialState, [
	[constants.ADD_INSTALL, handleStandardAdd({
		resourceName,
		payloadSelector: R.prop('install')
	})],
	[constants.REMOVE_INSTALL, handleStandardRemove({
		resourceName,
		payloadSelector: R.prop('installId')
	})],
	[constants.RECEIVE_INSTALLS, handleStandardReceive({
		resourceName,
		payloadSelector: R.prop('installs')
	})],
	[constants.SET_ACTIVE_INSTALL, R.curry((payload, state) =>
		R.when(
			R.always(R.has('installId', payload)),
			R.evolve({
				activeInstallId: R.always(R.prop('installId', payload))
			})
		)(state)
	)]
]);
