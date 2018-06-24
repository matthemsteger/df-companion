import R from 'ramda';
import {mergeArray} from 'most';
import {workerEpics as rawsWorkerEpics} from './modules/raws';
import {workerEpics as rawFilesWorkerEpics} from './modules/rawFiles';

const workerEpics = R.compose(
	R.flatten,
	R.map(R.values)
)([
	rawsWorkerEpics,
	rawFilesWorkerEpics
]);

export default function rootWorkerEpics($actions) {
	const callWorkerEpic = (workerEpic) => {
		const out = workerEpic($actions);
		if (!out || !out.source) {
			const epicIdentifier = workerEpic.name || 'unknown';
			throw new TypeError(`All worker epics must return a stream. Check the return value of ${epicIdentifier}`);
		}

		return out;
	};

	return mergeArray(R.map(callWorkerEpic, workerEpics));
}
