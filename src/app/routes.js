import HomePage from './pages/home';
import FirstRunPage from './pages/firstRun';

export default function buildRoutes() {
	return [
		{
			path: '/',
			exact: true,
			main: HomePage
		},
		{
			path: '/first-run',
			main: FirstRunPage
		}
	];
}
