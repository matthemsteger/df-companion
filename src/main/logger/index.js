import log from 'electron-log';
import util from 'util';
import _ from 'lodash';

function formatMessage(message, ...args) {
	let index = 0;
	const copiedArgs = args;
	const parsedMessage = message.replace(/%([a-zA-Z%])/g, (match, format) => {
		if (match === '%%') return match;
		index += 1;
		const val = args[index];
		let formattedMatch = match;
		let customFormat = false;
		switch (format) {
			case 'o':
				customFormat = true;
				formattedMatch = util.inspect(val).replace(/\s*\n\s*/g, ' ');
				break;
			case 'O':
				customFormat = true;
				formattedMatch = util.inspect(val);
				break;
			default:
		}

		if (customFormat === true) {
			copiedArgs.splice(index, 1);
			index -= 1;
		}

		return formattedMatch;
	});

	return util.format(parsedMessage, copiedArgs);
}

const logLevels = ['error', 'warn', 'info', 'verbose', 'debug', 'silly'];

const logger = _.reduce(logLevels, (accumulator, level) =>
	_.assign(accumulator, {[level]: (message, ...args) => {
		const formattedMessage = formatMessage(message, ...args);
		log[level](formattedMessage);
	}}), {});

export default logger;
