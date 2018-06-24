import _ from 'lodash';
import R from 'ramda';

export function createStandardAllSelectorOld(resourceName, reducer, Model) {
	return function standardAllSelector(state) {
		const {reducerToModelMap} = state;
		const {path} = reducerToModelMap.get(reducer);

		return _.map(_.get(state, `${path}.${resourceName}ById`), (resource) => new Model({state, ...resource}));
	};
}

const localizeMemoizeCacheCreator = (reducer, {reducerToModelMap}) =>
	R.compose(
		R.prop('path'),
		reducerToModelMap.get
	)(reducer);

export const localize = R.curry(R.memoizeWith(localizeMemoizeCacheCreator, (reducer, state) => {
	const {reducerToModelMap} = state;
	const {path} = reducerToModelMap.get(reducer);

	return R.path(R.split('.', path), state);
}));

const funcsOrArray = (funcs) => (Array.isArray(funcs[0]) ? funcs[0] : funcs.slice(0, -1));

export function createSelector(...funcs) {
	return (state, props) => {
		const preFuncs = funcsOrArray(funcs).map((func) => (stateAndProps) => func(...stateAndProps));
		if (R.any((func) => !_.isFunction(func))(preFuncs) || preFuncs.length < 1) {
			return () => {
				throw new Error('input slectors must be functions and there must be more than 1');
			};
		}

		const lastFunc = R.memoize(funcs[funcs.length - 1]);
		return R.pipe(R.of, R.ap(preFuncs), R.apply(lastFunc))([state, props]);
	};
}

export function createLocalizeSelector(reducer) {
	return function localizedSelector(state) {
		const {reducerToModelMap} = state;
		const {path} = reducerToModelMap.get(reducer);

		return R.path(R.split('.', path), state);
	};
}

export const createStandardAllSelector = R.curry((resourceName, localizedSelector) =>
	createSelector(
		localizedSelector,
		(localizedState) => R.values(R.prop(`${resourceName}ById`, localizedState))
	)
);

export function createStandardAllRawSelector(resourceName, localizedSelector) {
	return createSelector(
		localizedSelector,
		(localState) => R.values(R.prop(`${resourceName}ById`, localState))
	);
}

function reduceSelectorDefinitionsToObject(allSelectors, def) {
	const resourceName = _.upperFirst(def[0]);
	return R.ifElse(
		R.compose(R.equals(4), R.length),
		R.compose(
			R.merge(allSelectors),
			R.zipObj([`select${resourceName}`, `select${resourceName}Raw`]),
			R.takeLast(2)
		),
		R.compose(
			R.merge(allSelectors),
			R.zipObj([`select${resourceName}Raw`]),
			R.last
		)
	)(def);
}

export function createStandardAllSelectors(localizedSelector, ...selectorDefinitions) {
	return R.compose(
		R.reduce(reduceSelectorDefinitionsToObject, {}),
		R.map(R.ifElse(
			R.compose(R.equals(2), R.length),
			(def) => R.concat(def, [createStandardAllSelector(...def, localizedSelector), createStandardAllRawSelector(def[0], localizedSelector)]),
			(def) => R.append(createStandardAllRawSelector(...def, localizedSelector), def)
		)),
		R.reject(R.compose(R.gt(2), R.length)),
		R.uniqBy(R.prop(0)),
		R.sortWith([R.descend(R.length)]),
		R.map(R.when((def) => !Array.isArray(def), R.of))
	)(selectorDefinitions);
}

export const memoizedFindFactory = R.curry((prop, collection) => R.memoize((i) => R.find(R.propEq(prop, i), collection)));
export const memoizedFilterFactory = R.curry((prop, collection) => R.memoize((i) => R.filter(R.propEq(prop, i), collection)));

export const bindSelectors = R.curry((selectorsMap, state) => {
	if (!_.isObjectLike(selectorsMap)) throw new Error('bindSelectors must take an object as first parameter');
	if (!R.all(_.isFunction, R.values(selectorsMap))) throw new Error('bindSelectors must take an object with values of selector functions');

	return R.compose(
		R.fromPairs,
		R.map(R.over(R.lensIndex(1), R.applyTo(state))),
		R.toPairs
	)(selectorsMap);
});
