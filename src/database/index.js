import PouchDB from 'pouchdb';
import levelDBPlugin from 'pouchdb-adapter-leveldb';
import pouchDBFindPlugin from 'pouchdb-find';
import R from 'ramda';
import * as models from './model';

PouchDB.plugin(pouchDBFindPlugin);
PouchDB.plugin(levelDBPlugin);

export default function createDatabase({path}) {
	const database = new PouchDB(path, {adapter: 'leveldb'});

	const databaseModels = R.map((model) => model(database), models);

	return {
		db: database,
		...databaseModels
	};
}
