import {node, parallel} from 'fluture';
import {
	compose,
	fromPairs,
	chain,
	when,
	is,
	last,
	head,
	of as arrayOf,
	toPairs,
	unapply
} from 'ramda';

export function futurify(fn) {
	return function futurified(...args) {
		return node((callback) => {
			fn(...args, callback);
		});
	};
}

export const futurifyAll = compose(
	fromPairs,
	chain(
		compose(
			when(
				compose(
					is(Function),
					last,
					head
				),
				compose(
					([key, value]) => [
						[key, value],
						[`${key}Future`, futurify(value)]
					],
					head
				)
			),
			arrayOf
		)
	),
	toPairs
);

export const unlimitedParallel = parallel(Number.POSITIVE_INFINITY);
export const parallelConverge = unapply(unlimitedParallel);
