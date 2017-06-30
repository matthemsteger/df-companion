import {createRenderer} from 'fela';
import prefixer from 'fela-plugin-prefixer';
import fallbackValue from 'fela-plugin-fallback-value';
import unit from 'fela-plugin-unit';
import lvha from 'fela-plugin-lvha';
import validator from 'fela-plugin-validator';
import logger from 'fela-plugin-logger';
import perf from 'fela-perf';
import beautifier from 'fela-beautifier';

export default function styleRenderer() {
	const renderer = createRenderer({
		plugins: [
			prefixer(),
			fallbackValue(),
			unit(),
			lvha(),
			validator(),
			logger()
		],
		enhancers: [perf(), beautifier()]
	});

	return renderer;
}
