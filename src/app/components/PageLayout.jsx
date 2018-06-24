import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import {createComponent} from 'react-fela';
import Styler from './Styler';
import NavHeader from './Header';
import media from './../style/media';

const GRID_HEADER = 'header';
const GRID_NAV = 'nav';
const GRID_CONTENT = 'main';

const Header = createComponent(R.always({
	gridArea: GRID_HEADER
}), 'header');

const SideNavigation = createComponent(R.always({
	gridArea: GRID_NAV
}));

const Content = createComponent(R.always({
	gridArea: GRID_CONTENT
}), 'article');

const rule = ({hasSideNavigation}) => ({
	display: 'grid',
	gridTemplateAreas: `"${GRID_HEADER}" "${GRID_NAV}" "${GRID_CONTENT}"`,
	[media.MEDIUM]: {
		gridTemplateAreas: `"${GRID_HEADER} ${GRID_HEADER}" "${hasSideNavigation ? GRID_NAV : GRID_CONTENT} ${GRID_CONTENT}"`
	}
});

export default function PageLayout({sideNavigation, header, children}) {
	return (
		<Styler rule={rule} hasSideNavigation={!!sideNavigation}>
			{({className}) => (
				<div className={className}>
					<Header>
						{header}
					</Header>
					{
						sideNavigation ? <SideNavigation>{sideNavigation}</SideNavigation> : null
					}
					<Content>
						{children}
					</Content>
				</div>
			)}
		</Styler>
	);
}

PageLayout.propTypes = {
	sideNavigation: PropTypes.node,
	header: PropTypes.node,
	children: PropTypes.node.isRequired
};

PageLayout.defaultProps = {
	header: (<NavHeader />),
	sideNavigation: null
};
