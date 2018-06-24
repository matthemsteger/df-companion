import React from 'react';
import PropTypes from 'prop-types';
import Styler from './../../Styler';

const style = {
	fontWeight: 'bold'
};

export default function SideNavigationSectionHeader({children}) {
	return (
		<Styler style={style}>
			{({className}) => (
				<h1 className={className}>{children}</h1>
			)}
		</Styler>
	);
}

SideNavigationSectionHeader.propTypes = {
	children: PropTypes.node.isRequired
};
