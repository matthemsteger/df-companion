import _ from 'lodash';

export const levels = ['trace', 'debug', 'verbose', 'info', 'warn', 'error', 'fatal'];

const logger = {};
levels.forEach((level) => {
	_.assign(logger, {[level]: function log(output, ...args) {
		console.log(output, ...args); // eslint-disable-line no-console
	}});
});

export {logger};
export default logger;
