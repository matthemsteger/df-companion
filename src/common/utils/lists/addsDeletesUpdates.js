import R from 'ramda';

const unbox = R.prop('item');
const box = R.compose(R.assoc('__isBoxed', true), R.objOf('item'));
const boxAsType = (type) => R.compose(R.assoc('type', type), box);

const comparer = R.curry((updatedPredicate, key, older, newer) => {
	const isUpdated = updatedPredicate(older, newer);
	return isUpdated ? boxAsType('update')([older, newer]) : boxAsType('unchanged')(newer);
});

const grouper = R.curry((keySelector, older, newer, item) => {
	if (R.propEq('type', 'unchanged', item)) return 'unchanged';
	if (R.propEq('type', 'update', item)) return 'updates';

	const key = R.compose(keySelector, unbox)(item);
	if (R.has(key, older)) return 'deletes';
	if (R.has(key, newer)) return 'adds';

	return 'unknown';
});

const ensureBoxed = R.map(R.unless(R.propEq('__isBoxed', true), box));

export default R.curry((keySelector, updatedPredicate, older, newer) => {
	const indexedOlder = R.indexBy(keySelector, older);
	const indexedNewer = R.indexBy(keySelector, newer);

	// consolidate into an object where key is id, array represents an update from old -> new
	// and null represents an unchanged

	return R.compose(
		R.map(R.map(unbox)),
		R.groupBy(grouper(keySelector, indexedOlder, indexedNewer)),
		ensureBoxed,
		R.values,
		R.mergeWithKey(comparer(updatedPredicate))
	)(indexedOlder, indexedNewer);
});
