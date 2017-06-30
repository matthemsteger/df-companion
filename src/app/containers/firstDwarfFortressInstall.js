import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import dfTools from 'df-tools';
import FilePickerField from './../components/filePickerField';
import {Input} from './../components/fields';
import {addInstall, setActiveInstall} from './../redux/modules/dwarfFortressInstalls';

class FirstDwarfFortressInstall extends Component {
	static propTypes = {
		addInstall: PropTypes.func.isRequired,
		setActiveInstall: PropTypes.func.isRequired,
		onSave: PropTypes.func
	}

	static defaultProps = {
		onSave: _.noop
	}

	constructor(props, context) {
		super(props, context);

		this.state = {
			name: '',
			path: '',
			version: '',
			uniqueId: _.uniqueId('fdfi')
		};
	}

	handleFieldChange = ({name, value}) => {
		this.setState({[name]: value}, () => {
			if (name === 'path') {
				dfTools.install.discoverInstall({dfRootPath: value}).then((install) => {
					this.setState({version: install.version});
				});
			}
		});
	}

	save = () => {
		const {path, version, name} = this.state;
		if (!_.isEmpty(path) && !_.isEmpty(version)) {
			this.props.addInstall({path, version, name})
				.then((addedInstall) => this.props.setActiveInstall(addedInstall.id).then(() => addedInstall.id))
				.then((addedInstallId) => this.props.onSave(addedInstallId));
		}
	}

	render() {
		const {uniqueId} = this.state;
		const pickerOptions = {
			title: 'Choose a directory',
			properties: ['openDirectory']
		};

		return (
			<div>
				<h3 className="title">Add your first Dwarf Fortress installation</h3>
				<Input
					type="text"
					name="name"
					label="Name"
					placeholder="Name your install (optional)"
					onChange={this.handleFieldChange}
				/>
				<label htmlFor={`${uniqueId}path`}>Install Path</label>
				<FilePickerField
					id={`${uniqueId}path`}
					name="path"
					placeholder="Install Path"
					pickerText="Choose Directory"
					onChange={this.handleFieldChange}
					initialValue={this.state.path}
					helpText="The directory that you have installed Dwarf Fortress"
					pickerOptions={pickerOptions}
				/>
				<br />
				<button className="button is-primary" type="button" onClick={this.save}>Save</button>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({addInstall, setActiveInstall}, dispatch);
export default connect(null, mapDispatchToProps)(FirstDwarfFortressInstall);
