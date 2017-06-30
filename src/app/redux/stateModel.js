const privates = {};

export default class StateModel {
	constructor(state) {
		this.state = state;
	}

	getPrivate(name) {
		if (!privates[name]) {
			privates[name] = new WeakMap();
		}

		return privates[name].get(this);
	}

	setPrivate(name, value) {
		if (!privates[name]) {
			privates[name] = new WeakMap();
		}

		return privates[name].set(this, value);
	}
}
