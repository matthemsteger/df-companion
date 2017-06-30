import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import GeneratedWorldTileRow from './generatedWorldTileRow';

export default function WorldGenList(props) {
	const generatedWorldType = 'generatedWorld';
	const pendingType = 'pending';
	const erroredType = 'errored';

	const mapType = R.curry((type, world) => ({type, world}));
	const sortAndChunk = R.compose(
		R.splitEvery(props.maxTilesPerRow),
		R.sortBy(R.prop('createdAt'))
	);

	const sortedAndChunked = sortAndChunk(
		R.reduce(
			R.concat,
			[],
			[
				R.map(mapType(generatedWorldType), props.generatedWorlds),
				R.map(mapType(pendingType), props.pendingGeneratedWorlds),
				R.map(mapType(erroredType), props.erroredGeneratedWorlds)
			]
		)
	);

	return (
		<div>
			{sortedAndChunked.map((chunk) => {
				const chunkKey = R.compose(R.join(''), R.map(R.path(['world', 'id'])))(chunk);
				return (
					<GeneratedWorldTileRow key={chunkKey} row={chunk} />
				);
			})}
		</div>
	);
}

WorldGenList.propTypes = {
	generatedWorlds: PropTypes.array,
	pendingGeneratedWorlds: PropTypes.array,
	erroredGeneratedWorlds: PropTypes.array,
	maxTilesPerRow: PropTypes.number
};

WorldGenList.defaultProps = {
	generatedWorlds: [],
	pendingGeneratedWorlds: [],
	erroredGeneratedWorlds: [],
	maxTilesPerRow: 4
};
