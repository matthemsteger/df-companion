import {select} from 'redux-most';
import {compose} from 'ramda';
import {mapWithContext} from './../../../epicUtilities';
import constants from './../constants';
import {selectInstallById} from './../../dwarfFortressInstalls';
import parseRawFileWorkerWithInstall from './parseRawFileWorkerWithInstall';

export default compose(
	mapWithContext(({payload: rawFile, state}) => {
		const {installId} = rawFile;
		const install = selectInstallById(state)(installId);
		return parseRawFileWorkerWithInstall(install, rawFile);
	}),
	select(constants.CREATE_RAW_FILE_DONE)
);
