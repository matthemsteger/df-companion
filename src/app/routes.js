import HomePage from './pages/home';
import FirstRunPage from './pages/firstRun';
import SideNavigation from './containers/sideNavigation';
import WorldGenHome, {GenNewWorldPage} from './pages/worldgen';

export default function buildRoutes() {
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
