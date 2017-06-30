import StateModel from './../../stateModel';
import {selectGeneratedWorldsByInstallId} from './../generatedWorlds';
import selectActiveInstallId from './selectors/selectActiveInstallId';

const privates = {
	generatedWorlds: new WeakMap(),
	isActive: new WeakMap()
};

export default class DwarFortressInstall extends StateModel {
	constructor({state, id, name, path, version, createdAt, modifiedAt}) {
		super(state);

		this.id = id;
		this.name = name;
		this.path = path;
		this.version = version;
		this.createdAt = createdAt;
		this.modifiedAt = modifiedAt;
	}

	get isActive() {
		if (!privates.isActive.get(this)) {
			privates.isActive.set(this, selectActiveInstallId(this.state));
		}

		return privates.isActive.get(this) === this.id;
	}

	get generatedWorlds() {
		if (!privates.generatedWorlds.get(this)) {
			privates.generatedWorlds.set(this, selectGeneratedWorldsByInstallId(this.state)(this.id));
		}

		return privates.generatedWorlds.get(this);
	}
}
