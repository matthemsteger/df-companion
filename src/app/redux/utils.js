import _ from 'lodash';
import R from 'ramda';

export const makeErrorSerializable = R.pick(['message', 'name', 'stack', 'code', 'signal']);

export function createConstant(...constants) {
	const flattened = R.flatten(constants);
	return _.reduce(
		flattened, (obj, key) =>
			_.defaults(obj, {[key]: key})
		, {}
	);
}

export function createLifecycleConstants(constant) {
	return R.compose(
		R.map(R.toUpper),
		R.append(constant),
		R.map((lifecycle) => `${constant}_${lifecycle}`)
	)([
		'PENDING',
		'DONE',
		'PROGRESS'
	]);
}

export function crudConstants(resource) {
	const upperResource = R.toUpper(resource);
	return [
		`CREATE_${upperResource}`,
		`READ_${upperResource}`,
		`DELETE_${upperResource}`,
		`UPDATE_${upperResource}`,
		`LIST_${upperResource}`
	];
}

export function createPlainAction(actionType, payload) {
	return {
		type: actionType,
		payload
	};
}

export function createActionCreator(actionType) {
	return function actionCreator(payload, isError) {
		return {
			type: actionType,
			payload,
			error: !!isError
		};
	};
}

export const errorToAction = R.curry((actionCreator, error) =>
	actionCreator(error, true));

export const actionIsErrored = R.propEq('error', true);

export function sendActionToWorker(action) {
	const {type, ...actionProps} = action;
	if (type.startsWith('WORKER_')) return action;

	return {
		type: `WORKER_${type}`,
		...actionProps
	};
}

export const addResourceToMap = R.curry(({mapKey, idSelector = R.prop('id'), payloadSelector = R.identity}, action, state) => {
	const {payload} = action;
	const resource = payloadSelector(payload);
	if (!resource) return state;

	const id = idSelector(resource);
	return R.evolve({
		[mapKey]: R.merge(R.__, R.objOf(id, resource))
	})(state);
});

// export function handleStandardAdd({state, id, resource, resourceName}) {
// 	const byIdProp = `${resourceName}ById`;
// 	return _.assign({}, state, {
// 		[byIdProp]: _.assign({}, state[byIdProp], {[id]: resource}),
// 		[resourceName]: _.uniq(state[resourceName].concat(id))
// 	});
// }

export const handleStandardError = R.curry(({resourceName, payloadSelector = R.identity, clearOnSuccess = true}, action, state) => {
	const {payload, error} = action;
	if (!error) {
		if (!clearOnSuccess) return state;

		return R.evolve({
			[`${resourceName}Error`]: null
		})(state);
	}

	return R.evolve({
		[`${resourceName}Error`]: makeErrorSerializable(payloadSelector(payload))
	})(state);
});

export const handleStandardAdd = R.curry(({resourceName, idSelector = R.prop('id'), payloadSelector = R.identity}, action, state) => {
	const {payload, error} = action;
	if (error) return state;

	const resource = payloadSelector(payload);
	if (!resource) return state;

	const id = idSelector(resource);
	return R.evolve({
		[`${resourceName}ById`]: R.flip(R.merge)({[id]: resource}),
		[resourceName]: R.compose(R.uniq, R.append(id))
	})(state);
});

// export function handleStandardRemove({state, id, resourceName}) {
// 	const byIdProp = `${resourceName}ById`;
// 	return _.assign({}, state, {
// 		[byIdProp]: _.omit(state[byIdProp], {id}),
// 		[resourceName]: _.without(state[resourceName], id)
// 	});
// }

export const handleStandardRemove = R.curry(({resourceName, payloadSelector = R.prop('id')}, action, state) => {
	const {payload, error} = action;
	if (error) return state;

	const id = payloadSelector(payload);
	return R.evolve({
		[`${resourceName}ById`]: R.omit([id]),
		[resourceName]: R.without([id])
	})(state);
});

// export function handleStandardReceiveOld({state, idProp, resources, resourceName}) {
// 	const byIdProp = `${resourceName}ById`;
// 	return _.assign({}, state, {
// 		[byIdProp]: _.assign({}, state[byIdProp], _.keyBy(resources, idProp)),
// 		[resourceName]: _.union(state[resourceName], _.map(resources, idProp))
// 	});
// }

export const handleStandardReceive = R.curry(({resourceName, idSelector = R.prop('id'), payloadSelector = R.identity}, action, state) => {
	const {payload, error} = action;
	if (error) return state;

	const resources = payloadSelector(payload);
	if (!_.isArray(resources)) return state;

	return R.evolve({
		[`${resourceName}ById`]: R.flip(R.merge)(R.indexBy(idSelector, resources)),
		[resourceName]: R.union(R.map(idSelector, resources))
	})(state);
});

const reducerFuncWhenErrorIs = R.curry((errorPred, fn, action, state) => {
	const {error} = action;
	if (!errorPred(error)) return state;

	return fn(action, state);
});

export const reducerFuncWhenError = reducerFuncWhenErrorIs(R.equals(true));
export const reducerFuncWhenNoError = reducerFuncWhenErrorIs(R.not);

const fnReducer = R.curry((action, state, fn) => fn(action)(state));
const createPayloadReducer = R.curry((fn, action, state) => {
	const fns = R.unless(_.isArray, R.of)(fn);
	return R.reduce(fnReducer(action), state, fns);
});

export const createReducer = R.curry((initialState, spec, state, action = {}) => {
	const stateToPass = R.when(R.isNil, R.always(initialState))(state);
	return R.compose(
		R.cond,
		R.append([R.T, R.always(R.identity)]),
		R.map(R.compose(
			R.adjust(R.unless(_.isFunction, R.propEq('type')), 0),
			R.adjust(createPayloadReducer, 1)
		))
	)(spec)(action)(stateToPass);
});

export const createCompositeIdSelector = R.curry((props, obj) => R.compose(R.join('_'), R.sort(R.ascend(R.identity)), R.values, R.pick(props))(obj));
