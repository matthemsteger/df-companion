
export async function up(knex) {
	return knex.schema.createTable('generated_worlds', (table) => {
		table.increments();
		table.text('region').notNullable().unique();
		table.text('world_name');
		table.text('friendly_world_name');
		table.text('detailed_map_path');
		table.text('world_history_path');
		table.text('world_map_path');
		table.text('world_sites_and_pops_path');
		table.text('world_gen_params_path');
		table.integer('dwarf_fortress_install_id').references('dwarf_fortress_installs.id');
	});
}

export async function down(knex) {
	return knex.schema.dropTable('generated_worlds');
}
