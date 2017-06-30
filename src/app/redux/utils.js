import _ from 'lodash';
import R from 'ramda';

export const makeErrorSerializable = R.pick(['message', 'name', 'stack', 'code', 'signal']);

export function createConstant(...constants) {
	const flattened = _.flatten(constants);
	return _.reduce(flattened, (obj, key) =>
		_.defaults(obj, {[key]: key})
	, {});
}

export function createPlainAction(actionType, payload) {
	return {
		type: actionType,
		payload
	};
}

// export function handleStandardAdd({state, id, resource, resourceName}) {
// 	const byIdProp = `${resourceName}ById`;
// 	return _.assign({}, state, {
// 		[byIdProp]: _.assign({}, state[byIdProp], {[id]: resource}),
// 		[resourceName]: _.uniq(state[resourceName].concat(id))
// 	});
// }

export const handleStandardAdd = R.curry(({resourceName, idSelector = R.prop('id'), payloadSelector}, payload, state) => {
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

export const handleStandardRemove = R.curry(({resourceName, payloadSelector = R.prop('id')}, payload, state) => {
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

export const handleStandardReceive = R.curry(({resourceName, idSelector = R.prop('id'), payloadSelector}, payload, state) => {
	const resources = payloadSelector(payload);
	if (!_.isArray(resources)) return state;

	return R.evolve({
		[`${resourceName}ById`]: R.flip(R.merge)(R.indexBy(idSelector, resources)),
		[resourceName]: R.union(R.map(idSelector, resources))
	})(state);
});

const fnReducer = R.curry((payload, memo, fn) => fn(payload)(memo));
const createPayloadReducer = R.curry((fn, action, state) => {
	const {payload} = action;
	const fns = R.unless(_.isArray, R.of)(fn);
	return R.reduce(fnReducer(payload), state, fns);
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
