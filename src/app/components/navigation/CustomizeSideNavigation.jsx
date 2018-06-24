import React from 'react';
import PropTypes from 'prop-types';
import SideNavigation from './SideNavigation';
import SideNavigationSection from './SideNavigationSection';

export default function CustomizeSideNavigation() {
	return (
		<SideNavigation>
			<SideNavigationSection headerText="Settings">
				<a href="#">Something</a>
			</SideNavigationSection>
		</SideNavigation>
	);
}
