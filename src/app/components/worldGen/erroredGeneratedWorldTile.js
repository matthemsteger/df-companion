import React from 'react';
import PropTypes from 'prop-types';

export default function ErroredGeneratedWorldTile(props) {
	const {error: {message}} = props.world;

	return (
		<article className="tile is-child box">
			<p className="title">Errored</p>
			<div className="content">
				<p>
					{message}
				</p>
			</div>
		</article>
	);
}

ErroredGeneratedWorldTile.propTypes = {
	world: PropTypes.object.isRequired
};
