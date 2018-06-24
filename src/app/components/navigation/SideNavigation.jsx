import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Styler from './../Styler';

const style = {
	display: 'grid'
};

export default function SideNavigation({children, className}) {
	return (
		<Styler style={style}>
			{({className: navClassName}) => (
				<nav className={classNames(className, navClassName)}>
					{children}
				</nav>
			)}
		</Styler>
	);
}

SideNavigation.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string
};

SideNavigation.defaultProps = {
	children: null,
	className: ''
};
