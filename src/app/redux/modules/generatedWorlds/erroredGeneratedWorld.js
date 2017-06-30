import StateModel from './../../stateModel';
import {selectInstallById} from './../dwarfFortressInstalls';

const privates = {
	dwarfFortressInstall: new WeakMap()
};

export default class ErroredGeneratedWorld extends StateModel {
	constructor({state, id, dwarfFortressInstallId, error, createdAt, modifiedAt}) {
		super(state);

		this.id = id;
		this.error = error;
		this.createdAt = createdAt;
		this.modifiedAt = modifiedAt;
		this.dwarfFortressInstallId = dwarfFortressInstallId;
	}

	get dwarfFortressInstall() {
		if (!privates.dwarfFortressInstall.get(this)) {
			privates.dwarfFortressInstall.set(this, selectInstallById(this.state)(this.dwarfFortressInstallId));
		}

		return privates.dwarfFortressInstall.get(this);
	}
}
