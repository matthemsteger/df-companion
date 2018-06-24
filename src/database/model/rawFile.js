import R from 'ramda';
import * as yup from 'yup';
import dfTools from 'df-tools';
import baseModel from './baseModel';

const acceptableFileTypes = R.values(dfTools.raws.rawFileTypes);

const schema = yup.object().shape({
	filePath: yup.string().required(), // relative to install root
	hash: yup.string(),
	rawFileType: yup
		.string()
		.oneOf(acceptableFileTypes)
		.required(),
	installId: yup.string().required(),
	parsedCachePath: yup.string()
});

export default baseModel('rawFile', schema);

// need global and local ids, local for only these, global for everything
