import StateModel from './../../stateModel';
import {selectInstallById} from './../dwarfFortressInstalls';

const privates = {
	dwarfFortressInstall: new WeakMap(),
	worldSitesAndPops: new WeakMap()
};


export default class GeneratedWorld extends StateModel {
	constructor({
		state,
		id,
		region,
		worldName,
		friendlyWorldName,
		dwarfFortressInstallId,
		createdAt,
		modifiedAt,
		worldMapPath,
		worldSitesAndPopsPath,
		worldSitesAndPops
	}) {
		super(state);

		this.id = id;
		this.region = region;
		this.createdAt = createdAt;
		this.modifiedAt = modifiedAt;
		this.worldName = worldName;
		this.friendlyWorldName = friendlyWorldName;
		this.dwarfFortressInstallId = dwarfFortressInstallId;
		this.worldMapPath = worldMapPath;
		this.worldSitesAndPopsPath = worldSitesAndPopsPath;
		this.worldSitesAndPops = worldSitesAndPops;
	}

	get dwarfFortressInstall() {
		if (!privates.dwarfFortressInstall.get(this)) {
			privates.dwarfFortressInstall.set(this, selectInstallById(this.state)(this.dwarfFortressInstallId));
		}

		return privates.dwarfFortressInstall.get(this);
	}
}
