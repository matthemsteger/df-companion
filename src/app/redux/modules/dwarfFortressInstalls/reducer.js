import {
	evolve,
	identity,
	curry,
	when,
	always,
	not,
	isNil,
	prop,
	path,
	inc
} from 'ramda';
import {
	handleStandardAdd,
	handleStandardRemove,
	handleStandardReceive,
	handleStandardError,
	createReducer
} from '@matthemsteger/redux-utils-fn-reducers';
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
	[
		constants.CREATE_INSTALL,
		curry((action, state) =>
			evolve({
				createInstallPending: true
			})(state)
		)
	],
	[
		constants.CREATE_INSTALL_DONE,
		[
			handleStandardAdd({
				resourceName
			}),
			handleStandardError({
				resourceName
			})
		]
	],
	[
		constants.REMOVE_INSTALL_DONE,
		[
			handleStandardRemove({
				resourceName,
				payloadSelector: identity
			}),
			handleStandardError({
				resourceName
			})
		]
	],
	[
		constants.LIST_INSTALL_DONE,
		[
			handleStandardReceive({
				resourceName
			}),
			handleStandardError({
				resourceName
			}),
			curry((action, state) =>
				evolve({
					timesInstallsFetched: inc
				})(state)
			)
		]
	],
	[
		constants.SET_ACTIVE_INSTALL_DONE,
		curry(({payload}, state) =>
			when(
				always(not(isNil(payload))),
				evolve({
					activeInstallId: always(payload)
				})
			)(state)
		)
	],
	[
		constants.CHECK_PATH_DONE,
		[
			handleStandardAdd({
				resourceName: checkedPathsResourceName,
				idSelector: prop('path')
			})
		]
	],
	[
		constants.READ_ACTIVE_INSTALL_DONE,
		[
			curry((action, state) => {
				const activeInstallId = path(['payload', 'installId'], action);
				return evolve({
					activeInstallId: always(activeInstallId)
				})(state);
			}),
			handleStandardError({
				resourceName: 'activeInstall'
			})
		]
	]
]);
