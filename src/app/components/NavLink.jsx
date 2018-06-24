import React from 'react';
import PropTypes from 'prop-types';
import {NavLink as RouterNavLink} from 'redux-first-router-link';
import Styler from './Styler';

const currentLinkStyle = {
	fontWeight: 'bold'
};

export default function NavLink({to, children}) {
	return (
		<Styler style={currentLinkStyle}>
			{({className}) => (
				<RouterNavLink to={to} activeClassName={className}>
					{children}
				</RouterNavLink>
			)}
		</Styler>
	);
}

NavLink.propTypes = {
	to: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.array,
		PropTypes.object
	]).isRequired,
	children: PropTypes.node.isRequired
};
