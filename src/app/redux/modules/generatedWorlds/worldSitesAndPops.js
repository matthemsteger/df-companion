
export default class WorldSitesAndPops {
	constructor({state, id, civilizedWorldPopulation, sites, outdoorAnimalPopulations, undergroundAnimalPopulations} = {}) {
		this.state = state;
		this.id = id;
		this.civilizedWorldPopulation = civilizedWorldPopulation;
		this.sites = sites;
		this.outdoorAnimalPopulations = outdoorAnimalPopulations;
		this.undergroundAnimalPopulations = undergroundAnimalPopulations;
	}
}
