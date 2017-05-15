import _ from 'lodash';

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

export function handleStandardAdd({state, id, resource, resourceName}) {
	const byIdProp = `${resourceName}ById`;
	return _.assign({}, state, {
		[byIdProp]: _.assign({}, state[byIdProp], {[id]: resource}),
		[resourceName]: _.uniq(state[resourceName].concat(id))
	});
}

export function handleStandardRemove({state, id, resourceName}) {
	const byIdProp = `${resourceName}ById`;
	return _.assign({}, state, {
		[byIdProp]: _.omit(state[byIdProp], {id}),
		[resourceName]: _.without(state[resourceName], id)
	});
}

export function handleStandardReceive({state, idProp, resources, resourceName}) {
	const byIdProp = `${resourceName}ById`;
	return _.assign({}, state, {
		[byIdProp]: _.assign({}, state[byIdProp], _.keyBy(resources, idProp)),
		[resourceName]: _.union(state[resourceName], _.map(resources, idProp))
	});
}
