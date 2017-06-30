import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {remote} from 'electron';

export default class FilePickerField extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		placeholder: PropTypes.string,
		pickerText: PropTypes.string.isRequired,
		pickerOptions: PropTypes.object, // eslint-disable-line react/forbid-prop-types
		onChange: PropTypes.func.isRequired,
		initialValue: PropTypes.string,
		isValid: PropTypes.bool,
		helpText: PropTypes.string,
		validationMessages: PropTypes.arrayOf(PropTypes.string)
	}

	static defaultProps = {
		onChange: _.noop,
		isValid: true,
		validationMessages: [],
		placeholder: '',
		pickerOptions: {title: 'Choose a file', properties: ['openFile']},
		initialValue: '',
		helpText: null
	}

	constructor(props) {
		super(props);

		this.state = {
			path: this.props.initialValue
		};
	}

	componentWillMount() {
		this.handlePicker = this.handlePicker.bind(this);
	}

	handlePicker(e) {
		const options = _.defaults({}, this.props.pickerOptions, {
			title: 'Choose a file',
			properties: ['openFile']
		});

		const paths = remote.dialog.showOpenDialog(remote.getCurrentWindow(), options);
		const path = _.head(paths);

		if (path) {
			this.setState({path}, () => {
				this.props.onChange({value: path, name: this.props.name}, path, e);
			});
		}
	}

	render() {
		return (
			<div>
				<div className="field has-addons">
					<p className="control is-expanded">
						<input
							id={this.props.id}
							className="input"
							name={this.props.name}
							type="text"
							placeholder={this.props.placeholder}
							value={this.state.path}
							readOnly
						/>
					</p>
					<p className="control">
						<button className="button" type="button" onClick={this.handlePicker}>{this.props.pickerText}</button>
					</p>
				</div>
				<div>
					{
						!this.props.isValid && this.props.validationMessages.length > 0
							? <p className="help is-danger">{this.props.validationMessages}</p>
							: null
					}
					{
						this.props.helpText
							? <p className="help">{this.props.helpText}</p>
							: null
					}
				</div>
			</div>
		);
	}
}
