import R from 'ramda';
import {handleStandardAdd, handleStandardRemove, handleStandardReceive, handleStandardError, createReducer} from './../../utils';
import constants from './constants';

const initialState = {
	installsById: {},
	installs: [],
	installsError: null,
	timesInstallsFetched: 0,
	activeInstallId: null,
	activeInstallError: null,
	checkedPathsById: {},
	checkedPaths: [],
	createInstallPending: false
};

const resourceName = 'installs';
const checkedPathsResourceName = 'checkedPaths';

export default createReducer(initialState, [
	[constants.CREATE_INSTALL, R.curry((action, state) =>
		R.evolve({
			createInstallPending: true
		})(state)
	)],
	[constants.CREATE_INSTALL_DONE, [
		handleStandardAdd({
			resourceName
		}),
		handleStandardError({
			resourceName
		})
	]],
	[constants.REMOVE_INSTALL_DONE, [
		handleStandardRemove({
			resourceName,
			payloadSelector: R.identity
		}),
		handleStandardError({
			resourceName
		})
	]],
	[constants.LIST_INSTALL_DONE, [
		handleStandardReceive({
			resourceName
		}),
		handleStandardError({
			resourceName
		}),
		R.curry((action, state) =>
			R.evolve({
				timesInstallsFetched: R.inc
			})(state)
		)
	]],
	[constants.SET_ACTIVE_INSTALL_DONE, R.curry(({payload}, state) =>
		R.when(
			R.always(R.not(R.isNil(payload))),
			R.evolve({
				activeInstallId: R.always(payload)
			})
		)(state)
	)],
	[constants.CHECK_PATH_DONE, [
		handleStandardAdd({
			resourceName: checkedPathsResourceName,
			idSelector: R.prop('path')
		})
	]],
	[constants.READ_ACTIVE_INSTALL_DONE, [
		R.curry((action, state) => {
			const activeInstallId = R.path(['payload', 'installId'], action);
			return R.evolve({
				activeInstallId: R.always(activeInstallId)
			})(state);
		}),
		handleStandardError({
			resourceName: 'activeInstall'
		})
	]]
]);
