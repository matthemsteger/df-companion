import React from 'react';
import PropTypes from 'prop-types';
import GeneratedWorldTile from './generatedWorldTile';
import PendingGeneratedWorldTile from './pendingGeneratedWorldTile';
import ErroredGeneratedWorldTile from './erroredGeneratedWorldTile';

function renderWorld(type, world) {
	switch (type) {
		case 'generatedWorld':
			return (
				<GeneratedWorldTile world={world} />
			);
		case 'pending':
			return (
				<PendingGeneratedWorldTile world={world} />
			);
		case 'errored':
			return (
				<ErroredGeneratedWorldTile world={world} />
			);
		default:
			return (
				<div key="dummy" />
			);
	}
}

export default function GeneratedWorldTileRow(props) {
	return (
		<div className="tile is-ancestor">
			{props.row.map((worldDef) => {
				const {type, world} = worldDef;
				return (
					<div key={world.id} className="tile is-parent is-3">
						{renderWorld(type, world)}
					</div>
				);
			})}
		</div>
	);
}

GeneratedWorldTileRow.propTypes = {
	row: PropTypes.array
};

GeneratedWorldTileRow.defaultProps = {
	row: []
};
