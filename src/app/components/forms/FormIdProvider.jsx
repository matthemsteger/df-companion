import React, {Component, Fragment} from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

export default class FormIdProvider extends Component {
	static propTypes = {
		children: PropTypes.func.isRequired
	};

	state = {
		uniqueId: _.uniqueId('form')
	};

	render() {
		const {children} = this.props;
		const {uniqueId} = this.state;

		return (
			<Fragment>
				{children({uniqueId})}
			</Fragment>
		);
	}
}
