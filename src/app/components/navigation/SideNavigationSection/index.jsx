import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Styler from './../../Styler';
import SideNavigationSectionHeader from './SideNavigationSectionHeader';

const style = {
	marginTop: '.5rem'
};

export default function SideNavigationSection({headerText, children}) {
	return (
		<Fragment>
			<SideNavigationSectionHeader>{headerText}</SideNavigationSectionHeader>
			<Styler style={style}>
				{({className}) => (
					<ul className={className}>
						{React.children.map(children, (child) => (
							<li>{child}</li>
						))}
					</ul>
				)}
			</Styler>
		</Fragment>
	);
}

SideNavigationSection.propTypes = {
	headerText: PropTypes.string.isRequired,
	children: PropTypes.node
};

SideNavigationSection.defaultProps = {
	children: null
};
