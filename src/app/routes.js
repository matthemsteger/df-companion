import {ROUTE_HOME, ROUTE_FIRST_RUN, ROUTE_WORLDS} from './redux/modules/routing';

// NOT USED!
export default {
	[ROUTE_HOME]: '/',
	[ROUTE_FIRST_RUN]: '/first-run',
	[ROUTE_WORLDS]: '/worlds/:id'
};

/*
export function buildRoutes() {
	return [
		{
			path: '/',
			exact: true,
			sidebar: SideNavigation,
			main: HomePage
		},
		{
			path: '/first-run',
			main: FirstRunPage
		},
		{
			path: '/worldgen',
			exact: true,
			sidebar: SideNavigation,
			main: WorldGenHome
		},
		{
			path: '/worldgen/gen-new-world',
			exact: true,
			sidebar: SideNavigation,
			main: GenNewWorldPage
		}
	];
}
*/
