import React from 'react';
import PropTypes from 'prop-types';
import {connect as connectStyle} from 'react-fela';
import {createStyleToProps} from './../../utils';

const styles = createStyleToProps({
	tileInfo: {backgroundColor: 'rgba(0,0,0,.8)', padding: '.2rem'},
	worldTile: {minHeight: '10rem'}
});

function GeneratedWorldTile(props) {
	const {worldName, friendlyWorldName, worldMapPath} = props.world;
	const inlineStyle = {
		backgroundImage: `url(${worldMapPath})`
	};

	return (
		<article className={`tile is-child box ${props.styles.worldTile}`} style={inlineStyle}>
			<div className={props.styles.tileInfo}>
				<p className="title">{worldName}</p>
				<p className="subtitle">{friendlyWorldName}</p>
			</div>
		</article>
	);
}

GeneratedWorldTile.propTypes = {
	world: PropTypes.object.isRequired,
	styles: PropTypes.object.isRequired
};

export default connectStyle(styles)(GeneratedWorldTile);
