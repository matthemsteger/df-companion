import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

function InstallPicker(props) {
	return (
		<div>
			<p className="panel-heading">Installs</p>
			{props.installs.map((install) => {
				const {id, path, version, name} = install;
				const onInstallClick = _.partial(props.onInstallClick, install);
				const label = !_.isEmpty(_.trim(name)) ? name : path;
				return (
					<a key={install.id} className={`panel-block ${install.isActive ? 'is-active' : ''}`} href={`#install${id}`} onClick={onInstallClick}>
						{label} ({version})
					</a>
				);
			})}
		</div>
	);
}

InstallPicker.defaultProps = {
	installs: [],
	onInstallClick: _.noop
};

InstallPicker.propTypes = {
	installs: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
	onInstallClick: PropTypes.func
};

export default InstallPicker;
