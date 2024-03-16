import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('users', (table) => {
		table.uuid('id').primary().defaultTo(knex.fn.uuid()),
			table.uuid('session_id'),
			table.string('name').notNullable(),
			table.string('email').notNullable().unique()
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('users')
}
