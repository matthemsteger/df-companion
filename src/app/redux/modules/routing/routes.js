import constants from './constants';

const {ROUTE_HOME, ROUTE_FIRST_RUN, ROUTE_WORLDS, ROUTE_WORLD} = constants;

export default {
	[ROUTE_HOME]: '/',
	[ROUTE_FIRST_RUN]: '/first-run',
	[ROUTE_WORLDS]: '/worlds',
	[ROUTE_WORLD]: '/worlds/:id'
};
