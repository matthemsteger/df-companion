import React from 'react';
import Styler from './Styler';
import {constants as routes, createRouteToAction} from './../redux/modules/routing';
import NavLink from './NavLink';

const {ROUTE_HOME} = routes;

const style = {
	display: 'flex'
};

export default function Header() {
	return (
		<Styler style={style}>
			{({className}) => (
				<nav className={className}>
					<NavLink to={createRouteToAction(ROUTE_HOME)}>Home</NavLink>
					<NavLink to={null}>Customize</NavLink>
					<NavLink to={null}>Create</NavLink>
					<NavLink to={null}>Play</NavLink>
				</nav>
			)}
		</Styler>
	);
}
