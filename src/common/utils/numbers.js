import R from 'ramda';

export const randomInt = R.curry((min, max) => {
	const validMin = Math.ceil(min);
	const validMax = Math.floor(max);

	return Math.floor(Math.random() * (validMax - validMin)) + validMin;
});
