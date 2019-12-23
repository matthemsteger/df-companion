import * as yup from 'yup';
import baseModel from './baseModel';

const schema = yup.object().shape({
	filePath: yup.string().required(), // relative to install root
	hash: yup.string(),
	fileType: yup.string().required(),
	installId: yup.string().required(),
	parsedCachePath: yup.string()
});

export default baseModel('file', schema);
