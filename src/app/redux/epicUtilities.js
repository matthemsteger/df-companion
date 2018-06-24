import R from 'ramda';
import {fromPromise, throwError, just as streamOf, concat as _concatStream, never, continueWith as _continueWith, empty, drain, filter as _filter} from 'most';
import {fold, promise as toPromise, fork, value as futureValue, isFuture, parallel} from 'fluture';
import {create as createStream} from '@most/create';
import Result from 'folktale/result';
import Maybe from 'folktale/maybe';
import Promise from 'bluebird';

const concatStream = R.curry(_concatStream);
const continueWith = R.curry(_continueWith);
const filterStream = R.curry(_filter);

export const extractDatabase = R.compose(R.prop('database'), R.invoker(0, 'getApi'), R.prop('meta'));

export const chainWithProp = R.curry((propSelectors, chainFn, object) => {
	const props = R.juxt(propSelectors)(object);
	return chainFn(...props);
});

export const chainAction = chainWithProp([extractDatabase, R.prop('payload')]);
export const futureToResult = fold(Result.Error, Result.Ok);
export const futureToMaybe = fold(Maybe.Nothing, Maybe.Just);
export const safeFutureToStream = R.compose(
	fromPromise,
	toPromise,
	futureToResult
);

export const safeDatabaseExec = R.curry((chainFn, object) =>
	R.compose(
		safeFutureToStream,
		chainAction(chainFn)
	)(object)
);

export const filterUnerroredActions = filterStream(R.complement(R.propEq('error', true)));

// want an empty stream
// then when stream is ended, cancel
// maybe just return a stream, then observe it
// if the promise ends, then cancel the future and end the stream
// if the promise fufills, then concat the stream to a promise stream?
// export const futureToStream = (future) => {
// 	let resultStream = empty();
// 	const foldedFuture = fold(throwError, streamOf)(future);
// 	const cancel = futureValue((stream) => {
// 		resultStream = concatStream(resultStream, stream);
// 	})(foldedFuture);

// 	return continueWith(() => {
// 		cancel();
// 		return empty();
// 	}, resultStream);
// };

export function futureToStream(future) {
	return createStream((add, end, error) => {
		const addAndEnd = R.compose(end, add);
		const cancel = fork(error, addAndEnd, future);

		return R.compose(end, cancel);
	});
}

export function futureToStream1(future) {
	return fromPromise(future.promise());
}

export const foldResult = R.invoker(2, 'fold');
export const foldMaybe = R.invoker(2, 'fold');
export const getOrElseMaybe = R.invoker(1, 'getOrElse');
export const orElseMaybe = R.invoker(1, 'orElse');

export const arrayToMaybe = R.ifElse(
	R.compose(R.lt(0), R.length),
	Maybe.Just,
	Maybe.Nothing
);

export const createEpicContext = R.curry((action) => {
	const {getState, sendToWorker} = action.meta;
	const state = getState();
	const database = extractDatabase(action);

	return {
		state,
		action,
		getState,
		database,
		db: database,
		payload: action.payload,
		sendToWorker
	};
});

export const valueIntoContext = R.curry((prop, valueFunc, context) => R.assoc(prop, valueFunc(context), context));

export const withContext = R.curry((mainFn, innerFn) => mainFn(R.compose(innerFn, createEpicContext)));
export const chainWithContext = withContext(R.chain);
export const mapWithContext = withContext(R.map);

function mapFutureWithKey(future, key) {
	return R.map((result) => [key, result], future);
}

export const extractFuturesFromObjectWithKey = R.compose(
	R.values,
	R.mapObjIndexed(mapFutureWithKey),
	R.pickBy(isFuture)
);

export const mapObjectWithFutures = R.curry((parallelism, mapFunc, obj) => {
	const futures = extractFuturesFromObjectWithKey(obj);

	return R.compose(
		R.map(R.compose(
			mapFunc,
			R.merge(obj),
			R.fromPairs
		)),
		parallel(parallelism)
	)(futures);
});

export const fromState = (fn) => R.compose(fn, R.prop('state'));
export const fromDatabase = (fn) => R.compose(fn, R.prop('database'));
