import React from 'react';
import PropTypes from 'prop-types';
import Styler from './Styler';
import NavHeader from './Header';
import media from './../style/media';

const GRID_HEADER = 'header';
const GRID_NAV = 'nav';
const GRID_CONTENT = 'main';

const layout = ({hasSideNavigation}) => ({
	display: 'grid',
	gridTemplateAreas: `"${GRID_HEADER}" "${GRID_NAV}" "${GRID_CONTENT}"`,
	[media.MEDIUM]: {
		gridTemplateAreas: `"${GRID_HEADER} ${GRID_HEADER}" "${
			hasSideNavigation ? GRID_NAV : GRID_CONTENT
		} ${GRID_CONTENT}"`
	}
});

const styles = {
	layout,
	header: {gridArea: GRID_HEADER},
	sideNavigation: {gridArea: GRID_NAV},
	content: {gridArea: GRID_CONTENT}
};

export default function PageLayout({sideNavigation, header, children}) {
	return (
		<Styler styles={styles} hasSideNavigation={!!sideNavigation}>
			{({classNames}) => (
				<div className={classNames.layout}>
					<header className={classNames.header}>{header}</header>
					{sideNavigation ? (
						<div className={classNames.sideNavigation}>
							{sideNavigation}
						</div>
					) : null}
					<article className={classNames.content}>{children}</article>
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
	header: <NavHeader />,
	sideNavigation: null
};
