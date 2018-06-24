import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import Link from 'redux-first-router-link';
import {addGeneratedWorlds} from './../../redux/modules/generatedWorlds';
import {selectActiveInstallId} from './../../redux/modules/dwarfFortressInstalls';
import {bindSelectors} from './../../redux/selectorUtilities';
import Input from './../forms/TextLikeInput';

class GenerateNewWorld extends Component {
	static propTypes = {
		addGeneratedWorlds: PropTypes.func.isRequired,
		activeInstallId: PropTypes.number.isRequired,
		onGenerate: PropTypes.func
	}

	static defaultProps = {
		onGenerate: _.noop
	};

	constructor(props, context) {
		super(props, context);

		this.state = {
			config: '',
			numWorlds: 1
		};
	}

	handleFieldChange = ({name, value}) => {
		this.setState({[name]: value});
	}

	generate = (e) => {
		e.preventDefault();
		const {config, numWorlds} = this.state;
		const {activeInstallId: installId} = this.props;
		this.props.addGeneratedWorlds({installId, config, numWorlds});
		this.props.onGenerate({installId, config, numWorlds});
	}

	render() {
		return (
			<form onSubmit={this.generate}>
				<Input
					type="text"
					name="config"
					label="World Generation Configuration"
					placeholder="The world generation configuration name to use"
					onChange={this.handleFieldChange}
				/>
				<Input
					type="number"
					name="numWorlds"
					label="How Many"
					defaultValue={this.state.numWorlds}
					onChange={this.handleFieldChange}
				/>
				<div className="field is-grouped">
					<p className="control">
						<button className="button is-primary">Generate</button>
					</p>
					<p className="control">
						<Link to="/worldgen">Cancel</Link>
					</p>
				</div>
			</form>
		);
	}
}

const mapStateToProps = (state) => bindSelectors({activeInstallId: selectActiveInstallId}, state);
const mapDispatchToProps = (dispatch) => bindActionCreators({addGeneratedWorlds}, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(GenerateNewWorld);
