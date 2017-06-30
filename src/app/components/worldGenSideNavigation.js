import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

export default function WorldGenSideNavigation(props) {
	return (
		<div>
			<p className="panel-heading">World Generation</p>
			<Link className="panel-block" to="/worldgen/settings">Settings</Link>
			<Link className="panel-block" to="/worldgen">
				Worlds
				<span className="tag">{props.generatedWorlds.length}</span>
				{
					props.pendingGeneratedWorlds.length > 0 ?
						<span className="tag is-warning">{props.pendingGeneratedWorlds.length}</span>
						: null
				}
				{
					props.erroredGeneratedWorlds.length > 0 ?
						<span className="tag is-danger">{props.erroredGeneratedWorlds.length}</span>
						: null
				}
			</Link>
		</div>
	);
}

WorldGenSideNavigation.defaultProps = {
	generatedWorlds: [],
	pendingGeneratedWorlds: [],
	erroredGeneratedWorlds: []
};

WorldGenSideNavigation.propTypes = {
	generatedWorlds: PropTypes.array,
	pendingGeneratedWorlds: PropTypes.array,
	erroredGeneratedWorlds: PropTypes.array
};
