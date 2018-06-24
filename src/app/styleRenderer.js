import {createRenderer} from 'fela';
import prefixer from 'fela-plugin-prefixer';
import fallbackValue from 'fela-plugin-fallback-value';
import unit from 'fela-plugin-unit';
import lvha from 'fela-plugin-lvha';
import validator from 'fela-plugin-validator';
import logger from 'fela-plugin-logger';
import perf from 'fela-perf';
import beautifier from 'fela-beautifier';
import namedKeys from 'fela-plugin-named-keys';
import fontWoff2 from './style/PxPlus_IBM_VGA9.woff2';
import {namedKeys as sizes} from './style/media';

export default function styleRenderer() {
	const renderer = createRenderer({
		plugins: [
			prefixer(),
			fallbackValue(),
			unit(),
			lvha(),
			namedKeys(sizes),
			validator(),
			logger()
		],
		enhancers: [perf(), beautifier()]
	});

	renderer.renderFont('PxPlus_IBM_VGA9', [
		fontWoff2
	], {fontWeight: 'normal', fontStyle: 'normal'});

	return renderer;
}
