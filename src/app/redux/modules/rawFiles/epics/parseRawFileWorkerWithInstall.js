import {curry} from 'ramda';
import {parseRawFileWorker} from './../actionCreators';

export default curry((install, rawFile) =>
	parseRawFileWorker({install, rawFile})
);
