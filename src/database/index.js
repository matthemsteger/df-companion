import knexFactory from 'knex';
import {Model} from 'objection';
import path from 'path';
import * as model from './model';

export default class Database {
	constructor({client = 'sqlite3', connection} = {}) {
		this.client = client;

		if (!connection) {
			throw new Error('Cannot create database without connection');
		}

		this.connection = connection;

		this.knex = knexFactory({
			client,
			connection,
			useNullAsDefault: true
		});

		this.model = model;

		Model.knex(this.knex);
	}

	async migrate() {
		return this.knex.migrate.latest({
			directory: path.resolve(__dirname, './migrations')
		});
	}

	async getMigrationVersion() {
		return this.knex.migrate.currentVersion({
			directory: path.resolve(__dirname, './migrations')
		});
	}
}
