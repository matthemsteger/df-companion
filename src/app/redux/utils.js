import {pick, curry, compose, props, join, toString} from 'ramda';
import fnv1a from '@sindresorhus/fnv1a';

export const makeErrorSerializable = pick([
	'message',
	'name',
	'stack',
	'code',
	'signal'
]);

export function sendActionToWorker(action) {
	const {type, ...actionProps} = action;
	if (type.startsWith('WORKER_')) return action;

	return {
		type: `WORKER_${type}`,
		...actionProps
	};
}

export const createCompositeIdSelector = curry((keys, obj) =>
	compose(
		toString,
		fnv1a,
		join(''),
		props(keys)
	)(obj)
);
