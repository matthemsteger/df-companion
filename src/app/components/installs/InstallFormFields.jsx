import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import FormIdProvider from './../forms/FormIdProvider';
import FormField from './../forms/FormField';
import TextLikeInput from './../forms/TextLikeInput';
import FilePickerInput from './../forms/FilePickerInput';

export default function InstallFormFields({errors, values, onChange, pathInitialValue}) {
	return (
		<FormIdProvider>
			{({uniqueId}) => {
				const nameId = `${uniqueId}name`;
				const pathId = `${uniqueId}path`;
				const versionId = `${uniqueId}version`;
				const pickerOptions = {
					title: 'Choose a directory',
					properties: ['openDirectory']
				};

				return (
					<Fragment>
						<FormField
							id={nameId}
							label="Name"
							error={errors.name}
							helpText="A nickname for your install"
						>
							<TextLikeInput
								id={nameId}
								name="name"
								type="text"
								placeholder="Name"
								onChange={onChange}
								value={values.name}
								required
								error={errors.name}
							/>
						</FormField>
						<FormField
							id={pathId}
							label="Install path"
							error={errors.path}
							helpText="The directory that you have installed Dwarf Fortress"
						>
							<FilePickerInput
								id={pathId}
								name="path"
								placeholder="Install path"
								pickerText="Choose directory"
								pickerOptions={pickerOptions}
								onChange={onChange}
								initialValue={pathInitialValue}
								error={errors.path}
							/>
						</FormField>
						<FormField
							id={versionId}
							label="Version"
							error={errors.version}
							helpText="The Dwarf Fortress version of the install"
						>
							<TextLikeInput
								id={versionId}
								name="version"
								type="text"
								placeholder="Version"
								onChange={onChange}
								value={values.version}
								required
								error={errors.version}
							/>
						</FormField>
					</Fragment>
				);
			}}
		</FormIdProvider>
	);
}

InstallFormFields.propTypes = {
	errors: PropTypes.object.isRequired,
	values: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	pathInitialValue: PropTypes.string
};

InstallFormFields.defaultProps = {
	pathInitialValue: ''
};
