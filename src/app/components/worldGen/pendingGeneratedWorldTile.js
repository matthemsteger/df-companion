import React from 'react';
import PropTypes from 'prop-types';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

export default function PendingGeneratedWorldTile(props) {
	const {createdAt} = props.world;
	const createAtDescription = distanceInWordsToNow(createdAt);

	return (
		<article className="tile is-child box">
			<p className="title">Pending</p>
			<p className="subtitle">{`Started ${createAtDescription} ago`}</p>
		</article>
	);
}

PendingGeneratedWorldTile.propTypes = {
	world: PropTypes.object.isRequired
};
