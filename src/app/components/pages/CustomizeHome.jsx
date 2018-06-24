import React from 'react';
import PageLayout from './../PageLayout';
import CustomizeSideNavigation from './../navigation/CustomizeSideNavigation';

export default function CustomizeHome() {
	const sideNavigation = (<CustomizeSideNavigation />);

	return (
		<PageLayout sideNavigation={sideNavigation}>
			<h1>Customize Home</h1>
		</PageLayout>
	);
}
