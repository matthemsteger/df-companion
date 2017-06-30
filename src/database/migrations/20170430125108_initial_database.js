import Promise from 'bluebird';

export function up(knex) {
	return knex.schema.createTable('dwarf_fortress_installs', (table) => {
		table.increments();
		table.text('name');
		table.timestamps();
		table.text('path').notNullable().unique();
		table.text('version');
	})
	.then(() =>
		knex.schema.raw(`
			CREATE TABLE dwarf_fortress_active_installs (
				id INTEGER PRIMARY KEY CHECK (id = 0),
				created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
				dwarf_fortress_install_id INTEGER REFERENCES dwarf_fortress_installs(id) NOT NULL
			)
		`)
	);
}

export function down(knex) {
	return Promise.mapSeries(['dwarf_fortress_active_installs', 'dwarf_fortress_installs'], (tableName) =>
		knex.schema.dropTable(tableName)
	);
}
