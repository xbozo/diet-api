import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('meals', (table) => {
		table.uuid('id').primary().defaultTo(knex.fn.uuid()),
			table.text('title').notNullable(),
			table.text('description').notNullable(),
			table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
		table.boolean('is_on_diet').notNullable()

		table.uuid('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
		table
			.uuid('user_session_id')
			.unsigned()
			.references('session_id')
			.inTable('users')
			.onDelete('CASCADE')
	})
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('meals')
}
