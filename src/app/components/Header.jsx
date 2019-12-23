import React from 'react';
import Styler from './Styler';
import {
	constants as routes,
	createRouteToAction
} from './../redux/modules/routing';
import NavLink from './NavLink';

const {ROUTE_HOME} = routes;
const homeLink = createRouteToAction(ROUTE_HOME);

const style = ({headingFontFamily}) => ({
	display: 'flex',
	fontFamily: headingFontFamily,
	justifyContent: 'space-evenly'
});

export default function Header() {
	return (
		<Styler style={style}>
			{({className}) => (
				<nav className={className}>
					<NavLink to={homeLink}>Home</NavLink>
					<NavLink to={homeLink}>Customize</NavLink>
					<NavLink to={homeLink}>Create</NavLink>
					<NavLink to={homeLink}>Play</NavLink>
				</nav>
			)}
		</Styler>
	);
}
